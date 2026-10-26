import { C, Callout, CodeBlock, DocLink, DocTable, Example, H2, P, UL } from "@/components/prose";
import { McButton, McCard, McList, McTabs, McTipButton, McToggle, McTooltip } from "@/components/mc";
import type { DocPage } from "../types";

const PREVIEW_NOTE = (
  <Callout kind="note" title="About the previews">
    <P>
      Previews are plain HTML/CSS approximations of the Quill UI look. They illustrate appearance and
      interaction, not the runtime; the Java blocks are the real API.
    </P>
  </Callout>
);

function Overview() {
  return (
    <>
      <P>
        Quill UI ships a deliberately small widget set. Everything below is a real class in{" "}
        <C>com.quillui.widget</C> or <C>com.quillui.render</C>.
      </P>
      {PREVIEW_NOTE}
      <H2>Component list</H2>
      <DocTable
        head={["Component", "Class", "Kind", "Page"]}
        rows={[
          ["Button", <C key="b">QuillButton</C>, "Widget", <DocLink key="bl" to="components/button">Buttons</DocLink>],
          ["Card", <C key="c">QuillCard</C>, "Render helper", <DocLink key="cl" to="components/card">Cards</DocLink>],
          ["Panel", <C key="n">QuillPanel</C>, "Layout helper", <DocLink key="nl" to="components/panels">Panels</DocLink>],
          ["Scroll list", <C key="s">QuillScrollList&lt;T&gt;</C>, "Widget", <DocLink key="sl" to="components/scroll-list">Scroll lists</DocLink>],
          ["Tab bar", <C key="t">QuillTabBar</C>, "Helper", <DocLink key="tl" to="components/tabs">Tabs</DocLink>],
          ["Toggle", <C key="g">QuillToggle</C>, "Widget", <DocLink key="gl" to="components/toggle">Toggles</DocLink>],
          ["Tooltip", <C key="p">QuillTooltips</C>, "Helper", <DocLink key="pl" to="components/tooltips">Tooltips</DocLink>],
        ]}
      />

      <H2>What is not provided</H2>
      <P>
        There is no text field, dropdown, menu or slider in the current API. A <C>QuillCard</C> is a drawing
        helper, not a layout container; use <C>QuillPanel</C> for a card with a vertical flow and a
        two-column action row, or <C>QuillColumn</C> / <C>QuillRow</C> for custom layouts. If you need an
        input, use a vanilla widget themed to match or wait for a Quill UI release that adds it.
      </P>

      <H2>Shared conventions</H2>
      <UL>
        <li>
          Every widget accepts an optional <C>QuillThemeData</C> in its constructor; omitting it uses{" "}
          <C>QuillThemeData.DEFAULT</C>.
        </li>
        <li>Buttons and toggles respond to Enter and Space when focused.</li>
        <li>Widgets draw their own hover, focus, selected and disabled states; no vanilla button texture is used.</li>
        <li>Callbacks only emit actions; the server owns state. See <DocLink to="guides/backend-actions">Backend actions</DocLink>.</li>
      </UL>
    </>
  );
}

function Buttons() {
  return (
    <>
      <P>
        <C>QuillButton</C> is a themed <C>AbstractWidget</C> with four visual variants, a persistent selected
        state and an optional tooltip.
      </P>
      {PREVIEW_NOTE}

      <H2>Variants</H2>
      <Example
        preview={
          <>
            <McButton primary>Primary</McButton>
            <McButton>Secondary</McButton>
            <McButton danger>Danger</McButton>
            <McButton ghost>Ghost</McButton>
            <McButton disabled>Disabled</McButton>
          </>
        }
      >
        <CodeBlock
          code={`
QuillButton primary = new QuillButton(
        x, y, 120, 20,
        Component.literal("Primary"),
        QuillButton.Variant.PRIMARY,
        action
);

QuillButton secondary = new QuillButton(
        x, y, 120, 20,
        Component.literal("Secondary"),
        QuillButton.Variant.SECONDARY,
        action
);`}
        />
      </Example>
      <DocTable
        head={["Variant", "Appearance"]}
        rows={[
          [<C key="p">PRIMARY</C>, "Amber border and text; the main action of a screen."],
          [<C key="s">SECONDARY</C>, "Neutral surface with a visible border; normal editing actions."],
          [<C key="d">DANGER</C>, "Red border and text; destructive actions."],
          [<C key="g">GHOST</C>, "Transparent until hovered; navigation and utility actions."],
        ]}
      />

      <H2>Construction and methods</H2>
      <CodeBlock
        code={`
QuillButton(
        int x, int y, int width, int height,
        Component message,
        QuillButton.Variant variant,
        Runnable action
)

QuillButton(
        int x, int y, int width, int height,
        Component message,
        QuillButton.Variant variant,
        Runnable action,
        QuillThemeData theme
)`}
      />
      <DocTable
        head={["Method", "Effect"]}
        rows={[
          [<C key="1">selected(boolean)</C>, "Keeps the selected background and draws a 2 px accent bar on the left."],
          [<C key="2">tip(Tooltip)</C>, "Shows a tooltip while the cursor is over the button."],
          [<C key="3">clickSound(SoundEvent)</C>, "Overrides the default UI down sound."],
          [<C key="4">setActive(boolean)</C>, "Inherited. Disables input and switches to the disabled palette."],
        ]}
      />

      <H2>Input</H2>
      <P>
        A click or Enter/Space on a focused button plays the click sound and runs the <C>Runnable</C>.
        Disabled buttons ignore both. Focus draws a 1 px accent outline around the button.
      </P>
      <CodeBlock
        code={`
QuillButton save = new QuillButton(
        x, y, 120, 20,
        Component.literal("Save"),
        QuillButton.Variant.PRIMARY,
        () -> QuillCommandSink.get().execute("example save")
);
save.tip(QuillTooltips.of(
        Component.literal("Save settings"),
        Component.literal("Sends the current values to the server."),
        "example save"
));
addRenderableWidget(save);`}
      />
      <Callout kind="tip">
        <P>
          One primary action per screen. Use <C>SECONDARY</C> for Cancel and <C>GHOST</C> for the close
          button, as <C>QuillScreen</C> already does.
        </P>
      </Callout>
    </>
  );
}

function Card() {
  return (
    <>
      <P>
        <C>QuillCard</C> draws a bordered surface with a compact heading and gives you the interior
        rectangle for child controls. It is not a widget: it does not receive input and is not registered on
        the screen.
      </P>
      {PREVIEW_NOTE}
      <Example
        preview={
          <McCard title="Status" className="w-full max-w-xs">
            <div className="mc-label-dim">All systems nominal.</div>
          </McCard>
        }
      >
        <CodeBlock
          code={`
QuillCard card = new QuillCard(
        x, y, 220, 96,
        Component.literal("Status")
);

// In your render pass:
card.render(graphics, font);

// Interior rectangle for child controls:
QuillRect body = card.content();`}
        />
      </Example>

      <H2>Layout</H2>
      <DocTable
        head={["Constant / method", "Value"]}
        rows={[
          ["Heading height", "18 px, reserved when a title is set."],
          ["Default padding", "8 px on every side (QuillSpacing.SPACE_2)."],
          [<C key="b">bounds()</C>, "The full card rectangle."],
          [<C key="c">content()</C>, "Interior below the heading with 8 px padding."],
          [<C key="d">content(insets)</C>, "Interior with caller-provided padding."],
        ]}
      />
      <P>
        A blank or <C>null</C> title removes both the heading and its 18 px reservation.
      </P>
      <Callout kind="warning">
        <P>
          Register the controls you place inside a card yourself. The card only reserves the space; it does
          not clip or forward input.
        </P>
      </Callout>
    </>
  );
}

function Panels() {
  return (
    <>
      <P>
        <C>QuillPanel</C> composes controls inside a <C>QuillCard</C>. It lays children out in a vertical
        column and offers a two-column action row, so screens stop repeating the same card + column + row
        boilerplate.
      </P>
      {PREVIEW_NOTE}
      <Example
        preview={
          <McCard title="Settings" className="w-full max-w-xs">
            <div className="space-y-3">
              <McToggle label="Sound effects" on />
              <div className="flex gap-2">
                <McButton primary className="flex-1">Save</McButton>
                <McButton ghost className="flex-1">Cancel</McButton>
              </div>
            </div>
          </McCard>
        }
      >
        <CodeBlock
          code={`
QuillThemeData theme = QuillThemeData.DEFAULT; // or a custom palette

QuillPanel panel = new QuillPanel(
        x, panelY + 60, width, 140,
        Component.literal("Settings"),
        theme
);

QuillToggle sound = panel.add(new QuillToggle(
        0, 0, 0, 18,
        Component.literal("Sound effects"),
        true,
        this::setSound,
        theme
));

QuillButton save = new QuillButton(
        0, 0, 0, 20,
        Component.literal("Save"),
        QuillButton.Variant.PRIMARY,
        this::save,
        theme
);
QuillButton cancel = new QuillButton(
        0, 0, 0, 20,
        Component.literal("Cancel"),
        QuillButton.Variant.GHOST,
        this::cancel,
        theme
);

panel.addRow(save, cancel);
panel.addTo(this::addRenderableWidget);`}
        />
      </Example>

      <H2>Render the card</H2>
      <P>
        The panel is a layout helper, not an input widget. Draw the card before its widgets in the screen
        render pass:
      </P>
      <CodeBlock
        code={`
@Override
public void extractRenderState(
        GuiGraphicsExtractor graphics, int mouseX, int mouseY, float delta
) {
    panel.render(graphics, font);
    super.extractRenderState(graphics, mouseX, mouseY, delta);
}`}
      />

      <H2>Constructors</H2>
      <CodeBlock
        code={`
QuillPanel(x, y, width, height, title)
QuillPanel(x, y, width, height, title, theme)
QuillPanel(x, y, width, height, title, theme, gap)`}
      />
      <P>
        The first two use <C>QuillSpacing.SPACE_2</C> (8 px) as the gap. The heading is reserved by the
        underlying <C>QuillCard</C>, and children start below it.
      </P>

      <H2>Methods</H2>
      <DocTable
        head={["Method", "Effect"]}
        rows={[
          [<C key="1">add(T widget)</C>, "Places the widget in the next full-width slot and returns it."],
          [<C key="2">addRow(left, right)</C>, "Splits the next slot into two columns separated by the gap."],
          [<C key="3">addTo(Consumer&lt;AbstractWidget&gt;)</C>, "Passes every child to the consumer, usually addRenderableWidget."],
          [<C key="4">render(graphics, font)</C>, "Draws the card surface and heading."],
          [<C key="5">card() / content() / children()</C>, "Access to the card, its interior rect and an unmodifiable child list."],
        ]}
      />
      <Callout kind="note">
        <P>
          <C>add(...)</C> overwrites the widget&apos;s x, y, width and height, so the coordinates passed to
          its constructor are only placeholders. <C>addRow(...)</C> uses the taller of the two heights for
          the slot but keeps each widget&apos;s own height.
        </P>
      </Callout>
    </>
  );
}

function ScrollList() {
  return (
    <>
      <P>
        <C>QuillScrollList&lt;T&gt;</C> is a fixed-row list with a thin passive scrollbar. The caller draws
        each row and handles clicks; the list handles clipping, wheel scrolling and the scrollbar.
      </P>
      {PREVIEW_NOTE}
      <Example
        preview={
          <McList
            className="w-full max-w-xs"
            items={["General", "Controls", "Audio", "Video", "Accessibility"]}
          />
        }
      >
        <CodeBlock
          code={`
QuillScrollList<Entry> list = new QuillScrollList<>(
        x, y, width, height,
        20,                                  // row height
        this::drawRow,                       // RowRenderer<Entry>
        (entry, index) -> select(entry)      // ClickHandler<Entry>
        // optional last argument: QuillThemeData
);

list.replaceItems(entries);
addRenderableWidget(list);`}
        />
      </Example>

      <H2>Renderer and click handler</H2>
      <CodeBlock
        code={`
void drawRow(
        GuiGraphicsExtractor graphics,
        Entry entry, int index,
        int rowX, int rowY, int rowWidth, int rowHeight,
        int mouseX, int mouseY, boolean hovered
) {
    int color = hovered ? 0xFFFFFFFF : 0xFFC6D0DA;
    graphics.text(font, entry.name(), rowX + 4, rowY + 6, color);
}

void select(Entry entry) {
    QuillCommandSink.get().execute("example select " + entry.id());
}`}
      />
      <P>Always draw from the coordinates passed to the renderer; they change with the scroll offset.</P>

      <H2>Methods</H2>
      <DocTable
        head={["Method", "Effect"]}
        rows={[
          [<C key="0">Constructor</C>, "x, y, width, height, row height, RowRenderer<T>, ClickHandler<T>, optional QuillThemeData."],
          [<C key="1">replaceItems(List&lt;T&gt;)</C>, "Replaces the contents and resets the scroll to the top."],
          [<C key="2">size() / isEmpty() / get(int)</C>, "Read access to the backing items."],
          [<C key="3">rowWidth()</C>, "Width available to rows, excluding the scrollbar when shown."],
          [<C key="4">rowTop(int)</C>, "Screen Y of a row at the current scroll offset."],
          [<C key="5">rowAt(mouseX, mouseY)</C>, "Row index under the cursor, or -1 outside the list."],
        ]}
      />
      <Callout kind="note">
        <P>
          The mouse wheel scrolls by one row height per notch and only while the cursor is over the list. A
          click on the scrollbar jumps the scroll position instead of selecting a row.
        </P>
      </Callout>
    </>
  );
}

function Tabs() {
  return (
    <>
      <P>
        <C>QuillTabBar</C> creates a row of equal-width <C>GHOST</C> buttons and keeps the selected visual in
        sync. It is a helper that builds buttons for you; you still register them on the screen.
      </P>
      {PREVIEW_NOTE}
      <Example
        preview={
          <McTabs
            className="w-full max-w-xs"
            items={["General", "Advanced"]}
            active={0}
          />
        }
      >
        <CodeBlock
          code={`
QuillTabBar tabs = new QuillTabBar(
        x, panelY + 54, width, 20, QuillSpacing.SPACE_1,
        List.of(
                Component.literal("General"),
                Component.literal("Advanced")
        ),
        this::switchTab
);

tabs.addTo(this::addRenderableWidget);
tabs.select(0);
// The constructor also accepts an optional QuillThemeData as the last argument.`}
        />
      </Example>

      <H2>Methods</H2>
      <DocTable
        head={["Method", "Effect"]}
        rows={[
          [<C key="1">addTo(Consumer&lt;QuillButton&gt;)</C>, "Registers every tab button, usually with addRenderableWidget."],
          [<C key="2">select(int)</C>, "Marks a tab selected and calls the onChange consumer."],
          [<C key="3">selected()</C>, "Index of the selected tab, or -1 before the first selection."],
          [<C key="4">button(int)</C>, "Returns a tab button for further customization."],
        ]}
      />
      <Callout kind="warning">
        <P>
          <C>select(...)</C> always invokes the change callback, including your initial call. Guard the
          callback if the first selection should not send an action.
        </P>
      </Callout>
    </>
  );
}

function Toggle() {
  return (
    <>
      <P>
        <C>QuillToggle</C> is a labelled on/off control. It flips its local display state and calls a{" "}
        <C>Consumer&lt;Boolean&gt;</C>; it does not send anything by itself.
      </P>
      {PREVIEW_NOTE}
      <Example
        preview={
          <div className="flex w-full max-w-xs flex-col gap-3">
            <McToggle label="Sound effects" on />
            <McToggle label="Reduced motion" />
          </div>
        }
      >
        <CodeBlock
          code={`
QuillToggle toggle = new QuillToggle(
        x, y, 180, 20,
        Component.literal("Sound effects"),
        currentValue,
        value -> QuillCommandSink.get().execute("example set sound " + value)
);

addRenderableWidget(toggle);`}
        />
      </Example>

      <H2>Methods</H2>
      <DocTable
        head={["Method", "Effect"]}
        rows={[
          [<C key="1">value()</C>, "Current local value."],
          [<C key="2">setValue(boolean)</C>, "Updates the visual state without calling the consumer."],
          [<C key="3">setActive(boolean)</C>, "Inherited. Disables input and uses the disabled palette."],
        ]}
      />
      <P>
        Clicking the control or pressing Enter/Space while focused flips the value, plays the down sound and
        calls the consumer with the new value. The caller is responsible for applying the change through an
        action sink or payload.
      </P>
    </>
  );
}

function Tooltips() {
  return (
    <>
      <P>
        <C>QuillTooltips.of(title, body, command)</C> composes a Minecraft <C>Tooltip</C> with a title, a gray
        body and an optional gold command hint. A blank or <C>null</C> command is omitted.
      </P>
      {PREVIEW_NOTE}
      <Example
        preview={
          <div className="flex flex-col items-center gap-6 pt-10 sm:flex-row">
            <McTipButton label="Hover or focus me" lines={["Save settings", "Sends the current values.", "/example save"]} primary />
            <McTooltip lines={["Always visible", "Static example"]} />
          </div>
        }
      >
        <CodeBlock
          code={`
Tooltip tip = QuillTooltips.of(
        Component.literal("Save settings"),
        Component.literal("Sends the current values to the server."),
        "/example save"
);

save.tip(tip);`}
        />
      </Example>

      <H2>How it is built</H2>
      <UL>
        <li>The title keeps its own style.</li>
        <li>The body is appended on a new line in <C>ChatFormatting.GRAY</C>.</li>
        <li>The command is appended on a third line in <C>ChatFormatting.GOLD</C>.</li>
      </UL>
      <P>
        <C>QuillScreen.closeButton(...)</C> uses this helper with the translation keys{" "}
        <C>quillui.close</C> and <C>quillui.close.tip</C>. Provide a tooltip only when it adds information;
        essential text must stay visible on screen.
      </P>
    </>
  );
}

export const components: DocPage[] = [
  {
    slug: "overview",
    title: "Overview",
    description: "Every component shipped by Quill UI.",
    component: Overview,
  },
  {
    slug: "button",
    title: "Buttons",
    description: "Themed buttons with variants, selection and tooltips.",
    component: Buttons,
  },
  {
    slug: "card",
    title: "Cards",
    description: "Bordered content surfaces with an optional heading.",
    component: Card,
  },
  {
    slug: "panels",
    title: "Panels",
    description: "Compose controls inside a card with a vertical flow and action rows.",
    component: Panels,
  },
  {
    slug: "scroll-list",
    title: "Scroll Lists",
    description: "Fixed-row lists with scrolling and click handling.",
    component: ScrollList,
  },
  {
    slug: "tabs",
    title: "Tabs",
    description: "Equal-width tab buttons with a selected state.",
    component: Tabs,
  },
  {
    slug: "toggle",
    title: "Toggles",
    description: "Compact on/off switches.",
    component: Toggle,
  },
  {
    slug: "tooltips",
    title: "Tooltips",
    description: "Title, body and command hints on hover.",
    component: Tooltips,
  },
];
