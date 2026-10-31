import { C, Callout, CodeBlock, DocLink, DocTable, Example, H2, P, UL } from "@/components/prose";
import { McButton } from "@/components/mc";
import type { DocPage } from "../types";

function Chip() {
  return (
    <>
      <P>
        <C>QuillChip</C> is a compact read-only pill for header accessories, rows and status values. It
        holds an optional icon, a short label and a theme-coloured surface, and it never takes focus.
      </P>
      <Example
        preview={
          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 items-center gap-1 border-2 border-[#33404e] bg-[#1b242e] px-2 font-mono text-[10px] text-[#c6d0da]">
              <span className="h-2.5 w-2.5 bg-[#e0a93b]" /> 1,240 G
            </span>
            <McButton ghost>Status</McButton>
          </div>
        }
      >
        <CodeBlock
          code={`
@Override
protected QuillLayoutNode headerAccessory() {
    return control(QuillChip.of(Component.literal("1,240 G"))
            .accent()
            .icon(new ItemStack(Items.GOLD_INGOT)));
}`}
        />
      </Example>

      <H2>Construction</H2>
      <CodeBlock
        code={`
QuillChip(Component text, QuillThemeData theme)
QuillChip.of(Component text)                  // uses QuillThemeScope
QuillChip.of(Component text, QuillThemeData theme)`}
      />
      <P>
        The chip is fixed at 18 px high. Width is measured from the text, 7 px padding on both sides and,
        when present, the icon plus a 4 px gap. Use <C>measure(font, maxWidth)</C> or let{" "}
        <C>QuillWidgetBox</C> measure it in a tree.
      </P>

      <H2>Methods</H2>
      <DocTable
        head={["Member", "Effect"]}
        rows={[
          [<C key="1">icon(QuillIcon) / icon(ItemStack)</C>, "Adds or replaces the icon; item stacks use QuillIcons.item."],
          [<C key="2">color(ColorRole) / muted() / title() / accent()</C>, "Changes the text colour role; default is TEXT_SOFT."],
          [<C key="3">style() / icon()</C>, "Reads the current text style and icon."],
          [<C key="4">measure(font, maxWidth) / measure(constraints)</C>, "Preferred measured size; the chip implements QuillMeasuredWidget."],
        ]}
      />

      <H2>Rendering</H2>
      <P>
        The surface uses <C>CHIP_BG</C> and <C>CHIP_BORDER</C>, the label uses the selected text role, and
        the icon is centred and scaled down to fit the 18 px height. A disabled or empty chip still renders;
        it simply never receives input or focus.
      </P>
      <Callout kind="note">
        <P>
          Use chips for short values, not actions. For an interactive tab or filter, use{" "}
          <C>QuillButton</C> or <C>QuillNodes.tabs(...)</C> instead.
        </P>
      </Callout>

      <H2>Icons</H2>
      <P>
        <C>QuillIcon</C> is a small paintable glyph: <C>width()</C>, <C>height()</C> and{" "}
        <C>paint(graphics, x, y)</C>. <C>QuillIcons</C> provides item and texture-region factories:
      </P>
      <CodeBlock
        code={`
QuillIcon item = QuillIcons.item(new ItemStack(Items.EMERALD));
QuillIcon texture = QuillIcons.texture(
        myTexture, 0, 0, 16, 16, 64, 64
);

QuillChip online = QuillChip.of(Component.literal("Online"))
        .title()
        .icon(item);`}
      />
      <UL>
        <li><C>QuillIcons.item(stack)</C> renders at native 16×16.</li>
        <li><C>QuillIcons.texture(...)</C> addresses a pixel region inside the texture dimensions.</li>
        <li>Buttons use the same icons through <C>QuillButton.icon(...)</C>; see <DocLink to="components/button">Buttons</DocLink>.</li>
      </UL>
      <Callout kind="tip">
        <P>
          For a header accessory, return the chip wrapped with <C>control(...)</C> from{" "}
          <C>headerAccessory()</C>. See <DocLink to="fundamentals/screen">Screens</DocLink>.
        </P>
      </Callout>
    </>
  );
}

export const chipComponents: DocPage[] = [
  {
    slug: "chip",
    title: "Chips",
    description: "Compact read-only pills with optional icons and theme colours.",
    component: Chip,
  },
];
