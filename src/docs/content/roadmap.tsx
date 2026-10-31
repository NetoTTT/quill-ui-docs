import { C, Callout, DocLink, DocTable, H2, P, UL } from "@/components/prose";
import type { DocPage } from "../types";

function Roadmap() {
  return (
    <>
      <P>
        <C>0.3.0-alpha.4</C> is the current release and keeps <C>API_LEVEL</C> at <C>3</C>.{" "}
        <C>0.3.0-alpha.1</C> was the breaking base: it removed the static <C>QuillTheme</C> facade, split
        map/HUD into <C>quill-ui-extras</C> and added theme inheritance, component styles, typed actions
        and measured text/layout. The alpha.2-alpha.4 releases are additive.
      </P>
      <Callout kind="warning" title="API 3 is source and binary breaking">
        <P>
          Recompile against the 0.3 artifacts. Code that imports <C>QuillTheme</C>, relies on map/HUD being
          in the core jar, or uses the old non-generic action boundary must migrate before it will run.
        </P>
      </Callout>

      <H2>What changed</H2>
      <DocTable
        head={["Area", "Change", "Action"]}
        rows={[
          ["Themes", "QuillTheme was removed; QuillThemeData and QuillThemeScope replace it.", "Use QuillThemeData.DEFAULT or an explicit instance. Screens scope their theme automatically."],
          ["Theme metrics", "QuillThemeMetrics controls standard control sizes, gaps and content insets.", "Use the concise factories and content helpers; override metrics only when needed."],
          ["Components", "QuillButtonStyle, QuillListView, measured labels/cards and concise input factories.", "Prefer style objects and factories over ad-hoc variant patches."],
          ["Lists", "QuillListView rows are measured trees with real widgets; QuillScrollList also tracks selection and scroll.", "Use item-based selection and restore scrollOffset after a rebuild."],
          ["Tree builders", "QuillNodes tree/tab builders and QuillFlexible weights.", "Build measured content without repeated constructor noise."],
          ["Actions", "QuillActionSink is generic: QuillActionSink<A>.", "Use QuillCommandSink for commands or your own typed payload sink."],
          ["Text", "QuillTextMeasurer and QuillTextNode add real Font-based measurement.", "Use QuillLabel or text(...) inside measured content instead of hardcoded widths."],
          ["Layout", "QuillScreen can mount and scroll a measured tree with setContent(...).", "Use add(widget, rect), contentColumn/contentRow and setContent."],
          ["Modules", "Map and HUD moved to quill-ui-extras.", "Add the extras jar/dependency only when using QuillMap or the HUD indicator."],
          ["Compatibility", "API_LEVEL = 3.", "Recompile and test against the 0.3 line."],
        ]}
      />

      <H2>Additive alpha.2-alpha.4</H2>
      <UL>
        <li><strong>alpha.2:</strong> <C>QuillScreen.constrainPanel()</C> lets legacy absolute screens opt out of panel clamping.</li>
        <li><strong>alpha.3:</strong> button icons through <C>QuillIcon</C>, <C>QuillIcons.item(...)</C> and <C>QuillIcons.texture(...)</C>.</li>
        <li><strong>alpha.4:</strong> <C>QuillScreen.headerAccessory()</C>, <C>QuillChip</C> and <C>QuillMap.setMergeZones(...)</C>.</li>
      </UL>

      <H2>Migration checklist</H2>
      <UL>
        <li>
          Replace every <C>QuillTheme</C> use with <C>QuillThemeData</C>. See{" "}
          <DocLink to="fundamentals/theme">Theme and Tokens</DocLink>.
        </li>
        <li>
          Add <C>quill-ui-extras</C> to consumers that use <C>QuillMap</C>, <C>QuillTargetIndicator</C> or
          the HUD adapter. See <DocLink to="introduction/installation">Installation</DocLink>.
        </li>
        <li>
          Change action sinks to <C>QuillActionSink&lt;A&gt;</C>, or keep <C>QuillCommandSink</C> for
          command-first flows. See <DocLink to="guides/backend-actions">Backend Actions</DocLink>.
        </li>
        <li>
          Move form screens to the concise factories and measured content where it reduces magic numbers.
          See <DocLink to="components/text-field">Inputs</DocLink> and{" "}
          <DocLink to="fundamentals/layout-engine">Layout Engine</DocLink>.
        </li>
        <li>
          Use <C>QuillScreen.add(widget, rect)</C> and <C>contentColumn/contentRow</C> for absolute
          screens; use <C>setContent(root)</C> when content should measure and scroll itself.
        </li>
        <li>
          Re-test custom component styles with <C>QuillButtonStyle</C>, and verify contrast after changing
          theme metrics or roles.
        </li>
      </UL>

      <H2>What comes next</H2>
      <UL>
        <li>Widget/golden tests and a public demo mod.</li>
        <li>Migrate LaborCraft screens only after the 0.3 base is validated.</li>
        <li>
          Further work stays in the existing <C>core</C>/<C>extras</C> split; no new module is planned at
          this point. New optional surfaces should follow the extras pattern rather than bloating core.
        </li>
      </UL>
      <Callout kind="note">
        <P>
          Use <DocLink to="reference/compatibility">Compatibility</DocLink> for the support matrix and{" "}
          <DocLink to="reference/api">API Reference</DocLink> for the current package surface. This page is
          updated when the next compatibility line starts.
        </P>
      </Callout>
    </>
  );
}

export const roadmap: DocPage[] = [
  {
    slug: "roadmap",
    title: "Roadmap and migration",
    description: "What changed in API 3, how to migrate, and what comes next.",
    component: Roadmap,
  },
];
