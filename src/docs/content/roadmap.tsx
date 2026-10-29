import { C, Callout, DocLink, DocTable, H2, P, UL } from "@/components/prose";
import type { DocPage } from "../types";

function Roadmap() {
  return (
    <>
      <P>
        <C>0.2.0-alpha.8</C> is the current release. The next line, <C>0.3.0-alpha.1</C>, is a deliberate
        breaking base: it cleans up the public API before the LaborCraft migration starts. Nothing on this
        page is available in alpha.8 yet; treat it as a migration checklist, not as current API.
      </P>
      <Callout kind="warning" title="0.3.0-alpha.1 is not source compatible">
        <P>
          <C>API_LEVEL</C> rises from <C>2</C> to <C>3</C>. Expect removed aliases, changed constructors,
          new style objects and a different module boundary. Pin alpha.8 for existing screens until the
          0.3 line is ready, then recompile against it.
        </P>
      </Callout>

      <H2>Planned for 0.3.0-alpha.1</H2>
      <DocTable
        head={["Area", "Planned change", "What it means for consumers"]}
        rows={[
          ["API ergonomics", "Complete pass over constructors, factories and builder names.", "Expect shorter construction and fewer optional nulls."],
          ["Layout attachment", "Definitive add(widget, rect) for placing widgets.", "Widget attachment becomes explicit instead of ad-hoc setX/setY/setWidth/setHeight."],
          ["Themes", "Theme factories and theme inheritance.", "Derive palettes and variants instead of copying every role."],
          ["Static aliases", "Remove QuillTheme and the static compatibility aliases.", "Migrate now to QuillThemeData and explicit theme arguments."],
          ["Component themes", "Per-component theme/style objects.", "A component can override its own surface without cloning the whole palette."],
          ["Buttons", "Introduce QuillButtonStyle.", "Button variants become style data rather than only enum branches."],
          ["Actions", "Typed actions.", "Callbacks can carry typed payloads instead of command strings or ad-hoc consumers."],
          ["Text", "A text node with Font measurement.", "Wrapping and layout can measure real glyph widths; no adapter-side guesswork."],
          ["Constraints", "Handle UNBOUNDED without overflow.", "Intrinsic and scroll layouts become safe at unbounded sizes."],
          ["Modules", "Split QuillMap and HUD out of the core.", "Core consumers no longer pull map/HUD classes; map and HUD ship separately."],
          ["Compatibility", "API_LEVEL = 3.", "Binary compatibility breaks at 0.3.0-alpha.1 by design."],
        ]}
      />

      <H2>Prepare now</H2>
      <UL>
        <li>
          Replace <C>QuillTheme</C> static access with <C>QuillThemeData.DEFAULT</C> or an explicit theme
          instance. See <DocLink to="fundamentals/theme">Theme and Tokens</DocLink>.
        </li>
        <li>
          Move off the deprecated <C>QuillScrollView</C> now: use <C>QuillClipView</C> with a{" "}
          <C>ContentRenderer</C> and <C>QuillScrollBar</C>. See{" "}
          <DocLink to="components/scroll-view">Scroll Views</DocLink>.
        </li>
        <li>
          Pass a theme to every widget and screen constructor instead of relying on implicit defaults. That
          keeps the migration to factories and inheritance mechanical.
        </li>
        <li>
          Keep visual overrides in one place per screen. Component themes and <C>QuillButtonStyle</C> will
          replace scattered role overrides and variant-specific patches.
        </li>
        <li>
          Keep actions behind <C>QuillActionSink</C>/<C>QuillCommandSink</C> for now. Typed actions will
          replace the payload plumbing, not the screens that emit them.
        </li>
        <li>
          Isolate map and HUD code behind small adapters. The 0.3 split removes them from the core jar, so
          core screens should not import them directly.
        </li>
        <li>
          Avoid layout assumptions that break at <C>UNBOUNDED</C> sizes; measure with constraints and test
          the scroll path. See <DocLink to="fundamentals/layout-engine">Layout Engine</DocLink>.
        </li>
        <li>
          Do not start the LaborCraft migration yet. The agreed order is: finish 0.3.0-alpha.1, validate the
          clean base, then migrate LaborCraft screens.
        </li>
      </UL>

      <H2>What stays</H2>
      <P>
        The direction is unchanged: theme tokens, absolute and measured layout, clipped scroll hosts,
        overlays, typed actions and the backend boundary remain the foundation. The alpha.8 behavior
        documented on this site, including focus traversal, scroll-following focus and the map fixes,
        carries into the 0.3 base unless a specific breaking change says otherwise.
      </P>
      <Callout kind="note">
        <P>
          Use <DocLink to="reference/compatibility">Compatibility</DocLink> for the current API level and
          <DocLink to="reference/api">API Reference</DocLink> for the 0.2 surface. This roadmap is updated
          when the 0.3 branch becomes real.
        </P>
      </Callout>
    </>
  );
}

export const roadmap: DocPage[] = [
  {
    slug: "roadmap",
    title: "Roadmap and 0.3.0",
    description: "Planned breaking changes for the next API line and how to prepare.",
    component: Roadmap,
  },
];
