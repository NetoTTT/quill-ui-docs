import { C, Callout, CodeBlock, DocLink, DocTable, Example, H2, P } from "@/components/prose";
import { McButton, McCheckbox, McRadio, McSlider, McTextField } from "@/components/mc";
import type { DocPage } from "../types";

function TextField() {
  return (
    <>
      <P>
        <C>QuillTextField</C> is a themed single-line field built on vanilla <C>EditBox</C>. It keeps
        vanilla cursor, selection and IME behaviour; Quill owns the surface, focus ring, placeholder and
        validation border.
      </P>
      <P>
        In 0.3, <C>QuillTextField.of(font, hint)</C> creates a field at <C>0,0</C> using{" "}
        <C>QuillThemeMetrics.fieldWidth</C> and <C>controlHeight</C>, inheriting the screen theme through{" "}
        <C>QuillThemeScope</C>. The absolute constructor remains available.
      </P>
      <Example
        preview={
          <div className="w-full max-w-xs space-y-3">
            <McTextField label="Display name" placeholder="Steve" />
            <McButton primary className="w-full">Save</McButton>
          </div>
        }
      >
        <CodeBlock
          code={`
QuillTextField name = new QuillTextField(
        font, x, y, width, 20,
        Component.translatable("mymod.profile.hint"),
        theme
);

name.setValidator(value -> !value.isBlank());
name.setResponder(value -> currentName = value);
name.onSubmit(this::save);
addRenderableWidget(name);`}
        />
      </Example>

      <H2>Construction</H2>
      <CodeBlock
        code={`
QuillTextField(Font font, int x, int y, int width, int height,
        Component hint, QuillThemeData theme)`}
      />
      <P>
        The theme is required; a null theme falls back to <C>QuillThemeData.DEFAULT</C>. The field is
        unbordered, has no text shadow and uses the theme text colours. The height also determines the
        vertical centring.
      </P>

      <H2>Methods</H2>
      <DocTable
        head={["Method", "Effect"]}
        rows={[
          [<C key="1">setPlaceholder(Component)</C>, "Alias for setHint(...)."],
          [<C key="2">setHint(Component)</C>, "Hint shown only while the field is empty and unfocused."],
          [<C key="3">onSubmit(Runnable)</C>, "Runs on Enter or numpad Enter, then removes focus."],
          [<C key="4">setValidator(Predicate&lt;String&gt;)</C>, "Marks the current value invalid/valid; returns this."],
          [<C key="5">isValid()</C>, "Last validation result."],
          [<C key="6">setResponder(Consumer&lt;String&gt;)</C>, "Revalidates on every change and forwards the value."],
        ]}
      />
      <P>
        Validation also runs during rendering, so the border reflects the current value even if the
        responder is not changed. An invalid field uses the <C>DANGER</C> border; focus uses{" "}
        <C>FOCUS_RING</C>; disabled fields use the disabled button palette.
      </P>
      <Callout kind="note">
        <P>
          While a text input is focused, <C>QuillScreen</C> skips registered shortcuts so typing is not
          intercepted. Use <DocLink to="fundamentals/screen">Screens</DocLink> for focus and shortcut
          details.
        </P>
      </Callout>
      <Callout kind="warning">
        <P>
          Validator state is client-side feedback only. Always validate the submitted value on the
          server before applying it.
        </P>
      </Callout>
    </>
  );
}

function Slider() {
  return (
    <>
      <P>
        <C>QuillSlider</C> is a horizontal value control in the <C>0..1</C> range. It is intentionally
        value-only: the caller decides whether the value is a percentage, volume, radius or any other
        domain value.
      </P>
      <P>
        <C>QuillSlider.of(label, value, onChange)</C> uses <C>QuillThemeMetrics.sliderWidth</C> and{" "}
        <C>controlHeight</C>; the other controls have matching <C>of(...)</C> factories.
      </P>
      <Example preview={<McSlider label="Volume" value={0.64} className="w-56" />}>
        <CodeBlock
          code={`
QuillSlider volume = new QuillSlider(
        x, y, width, 20,
        Component.translatable("mymod.volume"),
        0.5F,
        value -> QuillCommandSink.get().execute(
                "mymod volume " + Math.round(value * 100)
        ),
        theme
);

volume.step(0.05F); // snap to 5% increments`}
        />
      </Example>

      <H2>Construction and methods</H2>
      <DocTable
        head={["Member", "Effect"]}
        rows={[
          [<C key="1">QuillSlider(x, y, w, h, message, value, onChange, theme)</C>, "Theme required; value is clamped to 0..1."],
          [<C key="2">value()</C>, "Current value."],
          [<C key="3">setValue(float)</C>, "Clamps and snaps the value; does not call onChange."],
          [<C key="4">step(float)</C>, "Snap increment in 0..1; 0 disables snapping."],
        ]}
      />
      <P>
        The slider follows left-button drags and clicks on the track. Left/Right arrows change the value
        by <C>step</C>, or 0.05 when no step is set. The label is drawn above the track while the widget
        is active. There is no animation, sound or server state.
      </P>
    </>
  );
}

function CheckboxRadio() {
  return (
    <>
      <P>
        <C>QuillCheckbox</C> and <C>QuillRadio</C> are themed selection controls with a label and
        keyboard activation. The indicator is painted by a <C>QuillSelectionStyle</C>, so applications
        can change the square/circle and its mark without subclassing the widget.
      </P>
      <P>
        Use <C>QuillCheckbox.of(message, checked, onChange)</C> or <C>QuillRadio.of(...)</C> for
        metric-sized controls that inherit the screen theme; explicit bounds are still available.
      </P>
      <Example
        preview={
          <div className="space-y-2">
            <McCheckbox label="Sound effects" checked />
            <McCheckbox label="Reduced motion" />
            <McRadio label="Low" selected />
            <McRadio label="High" />
          </div>
        }
      >
        <CodeBlock
          code={`
QuillCheckbox checkbox = new QuillCheckbox(
        x, y, width, 20,
        Component.literal("Enable feature"),
        false,
        value -> QuillCommandSink.get().execute("mymod feature " + value),
        theme,
        QuillSelectionStyles.FILLED
);

QuillRadio low = new QuillRadio(
        x, y, width, 20,
        Component.literal("Low"),
        true,
        () -> select("low"),
        theme
);`}
        />
      </Example>

      <H2>Checkbox</H2>
      <DocTable
        head={["Member", "Effect"]}
        rows={[
          [<C key="1">QuillCheckbox(...)</C>, "Theme required; optional style (CLASSIC by default)."],
          [<C key="2">checked() / setChecked(boolean)</C>, "Reads or updates the value without calling onChange."],
          [<C key="3">setStyle(...)</C>, "Changes only the indicator painting."],
          [<C key="4">setActive(boolean)</C>, "Inherited. Disables input and uses the disabled palette."],
        ]}
      />
      <P>
        A click or Enter/Space toggles the checkbox and calls <C>onChange</C>. Checkboxes do not play a
        click sound.
      </P>

      <H2>Radio</H2>
      <P>
        A radio is an individual control. Use <C>QuillRadioGroup</C> (below) when you want the group to
        own exclusivity and the optional/required policy, or manage selection yourself when the options
        are not a simple list.
      </P>
      <DocTable
        head={["Member", "Effect"]}
        rows={[
          [<C key="1">QuillRadio(..., onSelect, theme)</C>, "Runnable onSelect runs only when the value becomes true."],
          [<C key="2">QuillRadio(..., onChange, theme)</C>, "Consumer&lt;Boolean&gt; receives selection and deselection."],
          [<C key="3">onChange(Consumer&lt;Boolean&gt;)</C>, "Replaces the callback; returns this radio."],
          [<C key="4">deselectable(boolean)</C>, "Allows clicking a selected radio to clear it. Default false."],
          [<C key="5">selected() / setSelected(boolean)</C>, "Reads or updates the value without calling the callback."],
          [<C key="6">setStyle(...)</C>, "Changes only the indicator painting."],
        ]}
      />
      <P>
        A click or Enter/Space selects the radio. If it is already selected and not deselectable, the
        input is ignored. Radios do not play a click sound.
      </P>

      <H2>Radio group</H2>
      <P>
        <C>QuillRadioGroup</C> is a small controller, not a widget. It enforces exclusivity, can require
        a selection and exposes the selected option by index. Adding a radio replaces its{" "}
        <C>onChange</C> callback with the group wiring.
      </P>
      <CodeBlock
        code={`
QuillRadio low = new QuillRadio(
        x, y, width, 20,
        Component.translatable("mymod.mode.low"),
        false,
        () -> { },
        theme
);
QuillRadio high = new QuillRadio(
        x, y + 22, width, 20,
        Component.translatable("mymod.mode.high"),
        false,
        () -> { },
        theme
);

QuillRadioGroup group = new QuillRadioGroup(false)
        .onChange(index -> QuillCommandSink.get().execute("mymod mode " + index))
        .add(low)
        .add(high);

group.select(0);
group.required(true); // a selected option can no longer be cleared`}
      />
      <DocTable
        head={["Member", "Effect"]}
        rows={[
          [<C key="1">new QuillRadioGroup([required])</C>, "Creates an empty group; required defaults to false."],
          [<C key="2">add(QuillRadio)</C>, "Adds a radio once and points its callback at the group."],
          [<C key="3">onChange(IntConsumer)</C>, "Called with the selected index; clear() reports -1."],
          [<C key="4">required(boolean) / required()</C>, "Prevents clearing a selected radio; updates all members."],
          [<C key="5">select(int) / select(QuillRadio)</C>, "Selects one member and clears the others."],
          [<C key="6">selected() / selectedIndex()</C>, "Selected radio and its index, or null / -1."],
          [<C key="7">clear()</C>, "Clears the group; returns false when required."],
          [<C key="8">radios()</C>, "Immutable copy of the members."],
        ]}
      />
      <Callout kind="note">
        <P>
          A required group does not auto-select an option when it is created; it only prevents clearing.
          Non-required groups may start empty. Changing <C>required</C> updates <C>deselectable</C> on
          every member, so a radio cannot be cleared behind the group&apos;s policy.
        </P>
      </Callout>

      <H2>Selection styles</H2>
      <P>
        <C>QuillSelectionStyles</C> ships three built-ins: <C>CLASSIC</C> (square/check and circle/dot),{" "}
        <C>FILLED</C> (stronger selected surface) and <C>MINIMAL</C> (outline only). A custom style
        receives a context with the control type, bounds, state and active theme.
      </P>
      <CodeBlock
        code={`
public final class DiamondStyle implements QuillSelectionStyle {
    @Override
    public void render(GuiGraphicsExtractor graphics, Context context) {
        int color = context.color(context.selected()
                ? QuillThemeData.ColorRole.ACCENT
                : QuillThemeData.ColorRole.BUTTON_BORDER);
        int cx = context.x() + context.size() / 2;
        int cy = context.y() + context.size() / 2;
        int half = context.size() / 2;

        for (int i = 0; i < half; i++) {
            graphics.fill(cx - i, cy - half + i, cx + i + 1, cy - half + i + 1, color);
            graphics.fill(cx - i, cy + half - i - 1, cx + i + 1, cy + half - i, color);
        }
    }
}`}
      />
      <Callout kind="note">
        <P>
          A style paints only the indicator. The widget still owns layout, the label, mouse/keyboard
          input, focus and the selected value. Use <C>QuillRender.line</C>, <C>circle</C> and{" "}
          <C>border</C> for custom styles so they share the same primitives.
        </P>
      </Callout>
    </>
  );
}

export const inputComponents: DocPage[] = [
  {
    slug: "text-field",
    title: "Text Fields",
    description: "Themed single-line input built on vanilla EditBox.",
    component: TextField,
  },
  {
    slug: "slider",
    title: "Sliders",
    description: "Horizontal 0..1 value sliders with drag and keyboard support.",
    component: Slider,
  },
  {
    slug: "checkbox-radio",
    title: "Checkboxes and Radios",
    description: "Selection controls with interchangeable indicator styles.",
    component: CheckboxRadio,
  },
];
