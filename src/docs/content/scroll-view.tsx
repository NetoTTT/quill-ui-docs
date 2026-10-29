import { C, Callout, CodeBlock, DocLink, DocTable, Example, H2, P, UL } from "@/components/prose";
import { McList } from "@/components/mc";
import type { DocPage } from "../types";

function ScrollView() {
  return (
    <>
      <P>
        <C>QuillScrollView</C> is a scrollable viewport for custom-drawn content. It clips with a scissor,
        translates the content by the current offset, owns the wheel and scrollbar drag, and reports clicks
        in content coordinates. The renderer receives absolute screen coordinates with scrolling already
        applied, so rows use the same <C>x</C>/<C>y</C> as a normal widget.
      </P>
      <Example preview={<McList className="w-48" items={["General", "Controls", "Audio", "Video"]} />}>
        <CodeBlock
          code={`
QuillScrollView view = new QuillScrollView(
        x, y, width, height,
        () -> rowCount * rowHeight,
        (graphics, vx, vy, vw, contentHeight, offset, mouseX, mouseY, delta) -> {
            for (int i = 0; i < rowCount; i++) {
                int rowY = vy + i * rowHeight;
                // draw row at vx, rowY
            }
        },
        (contentX, contentY) -> {
            int index = (int) ((contentY - y) / rowHeight);
            return select(index);
        },
        theme
);
addRenderableWidget(view);`}
        />
      </Example>

      <H2>Construction</H2>
      <CodeBlock
        code={`
QuillScrollView(int x, int y, int width, int height,
        IntSupplier contentHeight,
        ContentRenderer renderer,
        ClickHandler clickHandler,
        QuillThemeData theme)`}
      />
      <DocTable
        head={["Argument", "Meaning"]}
        rows={[
          ["contentHeight", "Total content height in pixels. Null falls back to the viewport height."],
          ["renderer", "Draws content in content coordinates; may be null."],
          ["clickHandler", "Receives content X/Y; return true when the click was handled."],
          ["theme", "Required; null falls back to QuillThemeData.DEFAULT."],
        ]}
      />
      <P>
        <C>ContentRenderer</C> receives <C>(graphics, x, y, width, contentHeight, scrollOffset, contentMouseX,
        contentMouseY, delta)</C>. <C>ClickHandler</C> receives <C>(contentX, contentY)</C> with the scroll
        offset already added to Y.
      </P>

      <H2>State and helpers</H2>
      <DocTable
        head={["Member", "Effect"]}
        rows={[
          [<C key="1">contentHeight()</C>, "Reads the supplier and clamps it to zero or more."],
          [<C key="2">viewportWidth()</C>, "Visible width; excludes the 4 px bar and 6 px gap when content overflows."],
          [<C key="3">maxScroll()</C>, "Content height minus viewport height, clamped to zero."],
          [<C key="4">scrollOffset()</C>, "Current offset as an integer."],
          [<C key="5">scrollTo(value)</C>, "Clamps and sets the offset."],
          [<C key="6">contentScreenY(contentY)</C>, "Maps a content Y to screen Y."],
          [<C key="7">isContentVisible(rect)</C>, "True when a content rectangle intersects the viewport."],
        ]}
      />

      <H2>Rendering and input</H2>
      <P>
        The viewport enables a scissor, pushes a translation of <C>-scrollOffset</C>, calls the renderer
        and restores both. When content overflows it paints a 4 px track with a themed thumb; hover uses{" "}
        <C>ACCENT_HOVER</C>, otherwise <C>ACCENT</C>. The wheel moves 24 px per notch. A click on the thumb
        starts a drag; a click on empty track space jumps the thumb to that position.
      </P>
      <P>
        Clicks inside the viewport are forwarded to <C>ClickHandler</C> after the scrollbar area and
        viewport bounds are excluded. There is no keyboard navigation or row-level widget registration;
        focus stays on the scroll view.
      </P>
      <Callout kind="note">
        <P>
          Use <C>isContentVisible(rect)</C> to skip off-screen rows and <C>contentScreenY(y)</C> when a
          screen-level widget must follow scrolled content. Both are optional for small lists.
        </P>
      </Callout>

      <H2>Clip view</H2>
      <P>
        <C>QuillClipView</C> is the widget host equivalent: it owns child widgets, clips them to a viewport
        and maps mouse input through the scroll offset. Children keep content coordinates, so partially
        visible widgets are clipped instead of hidden entirely. Add children through the host; do not
        register them on the screen separately.
      </P>
      <CodeBlock
        code={`
private int scrollOffset;

QuillClipView clip = new QuillClipView(
        viewport,
        () -> Math.max(0, contentHeight - viewport.height()),
        () -> scrollOffset,
        offset -> scrollOffset = offset,
        theme
);

clip.add(saveButton);
clip.add(cancelButton);
addRenderableWidget(clip);`}
      />
      <UL>
        <li>
          Two constructors: the shorter one takes viewport, max scroll, offset, scroll callback and theme;
          the longer one also accepts a <C>ContentRenderer</C> for custom drawing under the children.
        </li>
        <li>
          <C>add(widget)</C> returns the widget for chaining. <C>children()</C> returns an immutable copy.
        </li>
        <li>
          The host forwards clicks to children in reverse order and keeps a single focused child. Clicking
          empty viewport space clears that focus.
        </li>
        <li>
          The right 6 px are excluded from <C>isMouseOver</C>, leaving room for a{" "}
          <C>QuillScrollBar</C>.
        </li>
        <li>
          Key presses, typed characters and <C>capturesInput()</C> are forwarded to the focused child, so
          text fields keep working inside the host.
        </li>
        <li>
          A plain wheel scrolls the host. With Ctrl or Shift held, the event is offered to children first,
          which lets a nested <C>QuillMap</C> handle zoom.
        </li>
      </UL>

      <H2>Clip context</H2>
      <P>
        Children keep content coordinates while the host renders with a translation. <C>QuillClipView</C>{" "}
        pushes that offset into <C>QuillRenderContext</C>, which lets nested widgets convert back to screen
        coordinates. Tooltips anchor to the real cursor, <C>QuillDropdown</C> opens its popup at the screen
        position, and <C>QuillMap</C> translates its internal scissor.
      </P>
      <CodeBlock
        code={`
// Inside an outer clip host, let the host own the scissor.
map.setScissorEnabled(false);
clip.add(map);`}
      />
      <Callout kind="note">
        <P>
          <C>QuillRenderContext.pushClipOffset(...)</C> / <C>popClipOffset()</C> are public for custom hosts.
          Most screens never call them directly. See{" "}
          <DocLink to="fundamentals/drawing">Drawing Helpers</DocLink> and{" "}
          <DocLink to="components/map">Map</DocLink>.
        </P>
      </Callout>

      <H2>Scroll bar</H2>
      <P>
        <C>QuillScrollBar</C> paints a 4 px track and draggable thumb for a measured viewport. The owner
        supplies the maximum scroll, the current offset and a callback that re-arranges the content. The bar
        itself never changes layout.
      </P>
      <CodeBlock
        code={`
private int scrollOffset;

QuillScrollBar bar = new QuillScrollBar(
        viewport,
        () -> Math.max(0, contentHeight - viewport.height()),
        () -> scrollOffset,
        offset -> {
            scrollOffset = offset;
            content.arrange(contentBounds());
        },
        theme
).visibleWhenNeeded();

addRenderableWidget(bar);`}
      />
      <P>
        <C>visibleWhenNeeded()</C> sets <C>visible</C> and <C>active</C> from <C>maxScroll &gt; 0</C> at
        the time of the call, so call it after the layout has produced a size. Clicking the track jumps the
        thumb; dragging the thumb calls <C>onScroll</C>. The thumb is at least 16 px tall and uses{" "}
        <C>BUTTON_DISABLED</C> for the track and <C>ACCENT</C> / <C>ACCENT_HOVER</C> for the thumb.
      </P>

      <H2>Edge hints</H2>
      <P>
        <C>QuillScrollHints.render(...)</C> draws a small top or bottom fade with a chevron when content is
        hidden. It is independent of the scroll widgets, so call it in the same render pass with the real
        viewport rectangle. See <DocLink to="fundamentals/drawing">Drawing Helpers</DocLink>.
      </P>

      <H2>Related APIs</H2>
      <UL>
        <li>
          <C>QuillScrollList&lt;T&gt;</C> remains the fixed-row list with built-in painting, selection and
          a draggable scrollbar. Use it when rows are simple text.
        </li>
        <li>
          <C>QuillScrollBox</C> measures unbounded content in the layout engine. It does not render or clip.
        </li>
        <li>
          <C>QuillWidgetBox.clipTo(rect)</C> hides a widget outside the clip rectangle; use{" "}
          <C>QuillClipView</C> when partially visible widgets must be scissored.
        </li>
      </UL>
      <Callout kind="tip">
        <P>
          For the measurement side, see <DocLink to="fundamentals/layout-engine">Layout Engine</DocLink>.
          For a complete form, derive the viewport from{" "}
          <DocLink to="fundamentals/screen">contentBounds()</DocLink> so it reflows with the panel.
        </P>
      </Callout>
    </>
  );
}

export const scrollViewComponents: DocPage[] = [
  {
    slug: "scroll-view",
    title: "Scroll Views",
    description: "Clipped custom content, widget hosts, scrollbars and edge hints.",
    component: ScrollView,
  },
];
