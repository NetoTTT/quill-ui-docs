import { C, Callout, CodeBlock, DocLink, DocTable, H2, P, UL } from "@/components/prose";
import type { DocPage } from "../types";

function LayoutEngine() {
  return (
    <>
      <P>
        The layout engine is the measured tree behind responsive screens. It is separate from the
        immediate rectangle helpers: children choose a size from the constraints the parent gives them,
        then the parent assigns a final rectangle. Nothing is wired into <C>QuillScreen</C> automatically
        yet, so screens can migrate one region at a time.
      </P>
      <Callout kind="tip" title="The protocol">
        <P>
          Constraints go down. Sizes go up. The parent sets position.
        </P>
      </Callout>
      <CodeBlock
        code={`
public interface QuillLayoutNode {
    QuillSize measure(QuillBoxConstraints constraints);
    void arrange(QuillRect bounds);
    QuillRect bounds();
}`}
      />

      <H2>QuillSize</H2>
      <P>
        <C>QuillSize(width, height)</C> is an immutable record with <C>ZERO</C>, <C>of(width, height)</C>,{" "}
        <C>isEmpty()</C> and <C>plus(insets)</C>. The compact constructor rejects negative dimensions.
      </P>

      <H2>QuillBoxConstraints</H2>
      <P>
        A constraint has <C>minWidth</C>, <C>minHeight</C>, <C>maxWidth</C> and <C>maxHeight</C>.{" "}
        <C>QuillBoxConstraints.UNBOUNDED</C> is <C>Integer.MAX_VALUE</C>; <C>LOOSE</C> has zero minimums
        and unbounded maximums. Layout sums saturate at <C>UNBOUNDED</C> instead of overflowing into a
        negative size.
      </P>
      <DocTable
        head={["Factory or method", "Effect"]}
        rows={[
          [<C key="1">tight(size) / tightFor(width, height)</C>, "Exact width and height."],
          [<C key="2">loose(size) / loose(maxWidth, maxHeight)</C>, "Zero minimum, bounded maximum."],
          [<C key="3">unbounded()</C>, "Zero minimum, no maximum."],
          [<C key="4">constrain(size)</C>, "Clamps a chosen size into the range."],
          [<C key="5">deflate(insets)</C>, "Removes padding before measuring a child."],
          [<C key="6">enforce(parent)</C>, "Clamps these constraints into a parent range."],
          [<C key="7">withMinWidth / withMinHeight / withMaxWidth / withMaxHeight</C>, "Derives a constraint with one bound changed."],
          [<C key="8">hasBoundedWidth / hasBoundedHeight / hasTightWidth / hasTightHeight / isTight</C>, "State checks."],
        ]}
      />

      <H2>Nodes and containers</H2>
      <P>
        <C>QuillNode</C> stores the final <C>bounds()</C> assigned during arrangement. Concrete
        containers implement <C>measure</C>, <C>arrange</C> and <C>children()</C>.
      </P>
      <DocTable
        head={["Node", "Behaviour"]}
        rows={[
          [<C key="1">QuillSizedBox</C>, "Fixed or preferred width/height around an optional child."],
          [<C key="2">QuillPaddingBox</C>, "Deflates child constraints and adds insets to the result."],
          [<C key="3">QuillMarginBox</C>, "Adds outer spacing around a child."],
          [<C key="4">QuillConstrainedBox</C>, "Applies additional minimum and maximum constraints."],
          [<C key="5">QuillFlexBox</C>, "Row or column with content-sized and weighted children."],
          [<C key="5b">QuillFlexible</C>, "Marks a child and weight for QuillFlexBox.add(...), which unwraps it."],
          [<C key="6">QuillWrapBox</C>, "Content-sized children wrapped into rows."],
          [<C key="7">QuillStackBox</C>, "Overlays children with horizontal and vertical alignment."],
          [<C key="8">QuillScrollBox</C>, "Measures unbounded content and exposes a scroll offset."],
          [<C key="9">QuillWidgetBox</C>, "Adapts an AbstractWidget to the tree; see the scroll view page."],
          [<C key="10">QuillTextNode</C>, "Measures and draws a text leaf with QuillTextMeasurer; wraps at constraints and maxWidth."],
          [<C key="11">QuillCardBox</C>, "Card surface with an optional heading and a padded child tree; implements QuillPaintable."],
        ]}
      />

      <P>
        Composite nodes expose <C>childSizes()</C> after measurement. <C>QuillSizedBox</C>,{" "}
        <C>QuillPaddingBox</C>, <C>QuillMarginBox</C> and <C>QuillConstrainedBox</C> also expose{" "}
        <C>childSize()</C>; padding and margin boxes expose their insets.
      </P>

      <H2>Static builders</H2>
      <P>
        <C>QuillNodes</C> builds measured trees without chained calls. <C>row(gap, children...)</C> and{" "}
        <C>column(gap, children...)</C> create flex boxes; <C>flexible(node[, weight])</C> marks a child
        for <C>QuillFlexBox</C>, which unwraps <C>QuillFlexible</C> automatically.
      </P>
      <CodeBlock
        code={`
QuillLayoutNode row = QuillNodes.row(8,
        QuillNodes.widget(saveButton, 120, 20),
        QuillNodes.flexible(QuillNodes.widget(nameField), 1),
        QuillNodes.spacer(8)
);

QuillLayoutNode card = QuillNodes.sized(260, 120,
        QuillNodes.fixedHeight(20, titleNode));`}
      />
      <P>
        Other helpers: <C>spacer([width])</C>, <C>sized(width, height, child)</C>,{" "}
        <C>fixedWidth(width, child)</C>, <C>fixedHeight(height, child)</C> and <C>widget(...)</C>.
      </P>
      <P>
        <C>tabs(gap, labels, selected, onChange)</C> builds an equal-width tab row. The selected tab uses
        the primary variant and the rest use ghost; selection stays with the caller, usually followed by{" "}
        <C>refreshContent()</C>.
      </P>
      <CodeBlock
        code={`
root.add(QuillNodes.tabs(
        QuillSpacing.SPACE_1,
        List.of(Component.literal("Work"), Component.literal("Config")),
        tab.ordinal(),
        index -> switchTab(Tab.values()[index])
));`}
      />

      <H2>Measured text</H2>
      <P>
        <C>QuillTextMeasurer.of(font)</C> exposes <C>lineHeight()</C>, <C>width(text)</C> and{" "}
        <C>lineWidths(text, maxWidth)</C>. Implement the interface directly in headless tests so text
        layout does not need a live <C>Font</C>.
      </P>
      <P>
        <C>QuillTextNode</C> is the measured leaf: it wraps at the tightest of{" "}
        <C>QuillTextStyle.maxWidth()</C> and the incoming constraint, honours <C>maxLines</C>, and exposes{" "}
        <C>lineCount()</C>, <C>measured()</C>, <C>text()</C> and <C>style()</C>. Call <C>render(graphics,
        font)</C> after arranging it.
      </P>
      <CodeBlock
        code={`
QuillTextMeasurer measurer = QuillTextMeasurer.of(font);
QuillTextNode label = new QuillTextNode(
        Component.literal("A longer description"),
        QuillTextStyle.DEFAULT,
        measurer
);

QuillSize size = label.measure(QuillBoxConstraints.loose(120, 200));
label.arrange(new QuillRect(x, y, size.width(), size.height()));
label.render(graphics, font);`}
      />
      <P>
        <C>QuillLabel</C> is the widget form: non-interactive, never focused, and{" "}
        <C>measure(font, maxWidth)</C> returns its preferred size. Use <C>label(component)</C> from a
        screen and chain <C>muted()</C>, <C>title()</C>, <C>accent()</C>, <C>color(role)</C> or{" "}
        <C>style(...)</C> for fluent styles. <C>QuillWidgetBox</C> detects{" "}
        <C>QuillMeasuredWidget</C>, so labels and other measured widgets size themselves inside a tree.
      </P>

      <H2>Measured cards and paintables</H2>
      <P>
        <C>QuillCardBox.card(title, child)</C> reserves the heading and theme card padding, measures the
        child, and implements <C>QuillPaintable</C>. Paintables draw behind the widget layer, including
        inside the scroll host, so card surfaces stay behind their controls.
      </P>
      <CodeBlock
        code={`
QuillFlexBox form = QuillFlexBox.column(QuillSpacing.SPACE_2);
form.add(new QuillWidgetBox(QuillTextField.of(font, hint)));

QuillCardBox card = QuillCardBox.card(Component.literal("Profile"), form);
QuillRect body = card.content();`}
      />
      <P>
        Any node can implement <C>QuillPaintable.paint(graphics, font)</C>. <C>QuillScreen.setContent</C>{" "}
        collects paintables from the tree and paints them before the widget layer. See{" "}
        <DocLink to="fundamentals/screen">Screens</DocLink>.
      </P>

      <H2>Flex and cross-axis alignment</H2>
      <P>
        <C>QuillFlexBox.row(gap)</C> and <C>column(gap)</C> accept content-sized nodes with{" "}
        <C>add(...)</C> and weighted nodes with <C>addFlexible(node, flex)</C>. Flex children are
        measured with a tight main axis after the free space is distributed.
      </P>
      <CodeBlock
        code={`
QuillFlexBox row = QuillFlexBox.row(12)
        .add(new QuillSizedBox(120, 24))
        .addFlexible(new QuillPaddingBox(
                QuillInsets.all(8),
                new QuillSizedBox(null, 32, label)
        ), 1);

QuillFlexBox centered = QuillFlexBox.row(8)
        .crossAxisAlignment(QuillCrossAxisAlignment.CENTER)
        .add(avatar)
        .addFlexible(name, 1);`}
      />
      <P>
        <C>crossAxisAlignment</C> supports <C>START</C>, <C>CENTER</C>, <C>END</C> and <C>STRETCH</C>.
        Stretch measures children with a tight cross axis and arranges them to the container cross size.
      </P>

      <H2>Wrap, stack and scroll</H2>
      <UL>
        <li>
          <C>QuillWrapBox(gap)</C> measures children at their natural size and starts a new row when the
          next child does not fit.
        </li>
        <li>
          <C>QuillStackBox.add(node)</C> aligns at the start;{" "}
          <C>add(node, horizontal, vertical)</C> takes two <C>QuillAlign</C> values.
        </li>
        <li>
          <C>QuillScrollBox.vertical(child)</C> and <C>horizontal(child)</C> measure the child with an
          unbounded main axis. <C>maxScroll()</C>, <C>scrollTo(offset)</C> and <C>scrollBy(delta)</C> clamp
          the offset, but rendering and clipping stay in the widget layer.
        </li>
      </UL>

      <H2>Measure and arrange</H2>
      <CodeBlock
        code={`
QuillFlexBox row = QuillFlexBox.row(12)
        .add(new QuillSizedBox(120, 24))
        .addFlexible(new QuillSizedBox(null, 24, content), 1);

QuillSize size = row.measure(QuillBoxConstraints.loose(400, 200));
row.arrange(new QuillRect(20, 20, size.width(), size.height()));

// Composite nodes keep the measured child sizes.
List<QuillSize> children = row.childSizes();
QuillRect first = row.children().get(0).bounds();`}
      />
      <P>
        Call <C>measure</C> once with the available space, then <C>arrange</C> with the final rectangle.
        Re-measure after a resize, a font change or a content change.
      </P>

      <H2>Widget adapter</H2>
      <P>
        <C>QuillWidgetBox</C> reads the widget&apos;s current size during measure and applies{" "}
        <C>setX</C>, <C>setY</C>, <C>setWidth</C> and <C>setHeight</C> during arrange. Widgets implementing{" "}
        <C>QuillMeasuredWidget</C> (such as <C>QuillLabel</C>) report their own preferred size, so text
        wraps at the incoming width. A widget with a zero size falls back to the constraint minimums.{" "}
        <C>clipTo(rect)</C> hides a widget that falls outside the clip rectangle; it does not scissor
        partially visible widgets. <C>widget()</C> returns the adapted widget.
      </P>
      <Callout kind="note">
        <P>
          For clipped custom content and input mapping, use{" "}
          <DocLink to="components/scroll-view">Scroll Views</DocLink>. <C>QuillScrollBox</C> is the
          measurement side; <C>QuillScrollView</C> and <C>QuillClipView</C> are the rendering side.
        </P>
      </Callout>

      <H2>Validation</H2>
      <P>
        <C>QuillLayoutValidator.validate(root)</C> returns a list of human-readable issues for negative
        sizes, children outside their parent and null children. Scroll content is intentionally allowed
        to overflow its viewport.
      </P>
      <CodeBlock
        code={`
List<String> issues = QuillLayoutValidator.validate(root);
for (String issue : issues) {
    LOGGER.warn("Quill layout: {}", issue);
}`}
      />

      <H2>Current limits</H2>
      <UL>
        <li>
          <C>QuillScreen.setContent(root)</C> wires a measured tree into a screen, but absolute screens are
          still supported through <C>contentBounds()</C> and <C>add(widget, rect)</C>.
        </li>
        <li>
          <C>QuillWidgetBox.clipTo</C> hides widgets outside the rectangle but does not scissor partially
          visible widgets. <C>QuillClipView</C> owns real clipping.
        </li>
        <li>
          Text measurement is available through <C>QuillTextMeasurer</C> and <C>QuillTextNode</C>; custom
          node types must supply their own measurer.
        </li>
        <li>
          The older <C>QuillFlex</C>, <C>QuillWrap</C> and <C>QuillStack</C> classes remain immediate
          rectangle helpers for existing screens.
        </li>
      </UL>

      <H2>Tests</H2>
      <P>
        Headless tests cover constraints, padding, sizing, constrained boxes, flex rows and columns,
        cross-axis alignment, wrapping, stacking, margins, scroll measurement, nested trees, the widget
        adapter and the validator.
      </P>
      <CodeBlock lang="bash" status="none" code={`gradlew.bat test --console=plain`} />
      <Callout kind="tip">
        <P>
          Start with the immediate helpers in <DocLink to="fundamentals/layout">Layout</DocLink> for simple
          forms. Reach for the engine when content must size itself, such as wrapped labels, nested rows or
          scrollable settings pages.
        </P>
      </Callout>
    </>
  );
}

export const layoutEngine: DocPage[] = [
  {
    slug: "layout-engine",
    title: "Layout Engine",
    description: "Constraints, measured nodes and container layout for responsive screens.",
    component: LayoutEngine,
  },
];
