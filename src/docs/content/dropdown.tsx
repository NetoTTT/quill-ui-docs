import { C, Callout, CodeBlock, DocLink, DocTable, Example, H2, P } from "@/components/prose";
import { McDropdown } from "@/components/mc";
import type { DocPage } from "../types";

function Dropdown() {
  return (
    <>
      <P>
        <C>QuillDropdown</C> is a themed select control. The closed control is a normal widget; the
        option list is a <C>QuillPopupMenu</C> opened on the screen overlay stack, so it renders above
        later widgets instead of being clipped by the dropdown bounds.
      </P>
      <Example preview={<McDropdown label="Mode" value="Balanced" className="w-52" />}>
        <CodeBlock
          code={`
QuillDropdown mode = new QuillDropdown(
        x, y, 180, 20,
        Component.translatable("mymod.config.mode"),
        List.of(
                Component.translatable("mymod.config.mode.low"),
                Component.translatable("mymod.config.mode.balanced"),
                Component.translatable("mymod.config.mode.high")
        ),
        1,
        index -> QuillCommandSink.get().execute("mymod mode " + index),
        theme
);

addRenderableWidget(mode);`}
        />
      </Example>

      <H2>Construction</H2>
      <CodeBlock
        code={`
QuillDropdown(int x, int y, int width, int height,
        Component label, List<Component> options,
        int selected, IntConsumer onChange, QuillThemeData theme)`}
      />
      <DocTable
        head={["Argument", "Meaning"]}
        rows={[
          ["label", "Placeholder shown when nothing is selected."],
          ["options", "Popup rows. Null becomes an empty list; an empty list makes the control inert."],
          ["selected", "Initial index; out-of-range becomes -1 (no selection)."],
          ["onChange", "Called with the chosen index after a popup selection."],
          ["theme", "Required; null falls back to QuillThemeData.DEFAULT."],
        ]}
      />

      <H2>Methods</H2>
      <DocTable
        head={["Member", "Effect"]}
        rows={[
          [<C key="1">selectedIndex()</C>, "Current index, or -1 when there is no selection."],
          [<C key="2">setSelectedIndex(int)</C>, "Sets the index, clamping invalid values to -1; returns this and does not call onChange."],
          [<C key="3">setActive(boolean)</C>, "Inherited. Disables the control and its popup."],
        ]}
      />

      <H2>Rendering and interaction</H2>
      <P>
        The control draws a themed surface, border and chevron. Focus uses <C>FOCUS_RING</C>; hover uses{" "}
        <C>BUTTON_HOVER</C>; the selected label and chevron use <C>TEXT</C> and <C>TEXT_SOFT</C>. Clicking
        the control opens the popup directly below it, using the same width and 18 px rows.
      </P>
      <CodeBlock
        code={`
// Keep the selected index in sync with server state.
mode.setSelectedIndex(snapshot.mode());`}
      />
      <Callout kind="warning">
        <P>
          The dropdown opens its popup only when the current screen is a <C>QuillScreen</C>. Embedding it
          in a vanilla <C>Screen</C> keeps the closed control visible but the option list will not open.
        </P>
      </Callout>
      <P>
        The popup is anchored in screen coordinates through <C>QuillRenderContext</C>. Inside a{" "}
        <DocLink to="components/scroll-view">scroll host</DocLink> it still opens under the visible control
        instead of shifting by the content offset.
      </P>
      <Callout kind="note">
        <P>
          The popup is owned by the screen, not the widget. Calling{" "}
          <C>closeOverlays()</C> or clicking outside the menu dismisses it. See{" "}
          <DocLink to="components/overlays">Overlays</DocLink> for the stack rules, and{" "}
          <DocLink to="guides/backend-actions">Backend Actions</DocLink> for sending the selected index
          to the server.
        </P>
      </Callout>
    </>
  );
}

export const dropdownComponents: DocPage[] = [
  {
    slug: "dropdown",
    title: "Dropdowns",
    description: "Themed select control backed by a screen-level popup menu.",
    component: Dropdown,
  },
];
