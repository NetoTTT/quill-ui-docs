import { C, Callout, CodeBlock, DocLink, DocTable, Example, H2, P, UL } from "@/components/prose";
import { McButton, McCard, McList, McMap, McTabs, McTipButton, McToggle, McTooltip } from "@/components/mc";
import { inputComponents } from "./inputs";
import { dropdownComponents } from "./dropdown";
import { overlayComponents } from "./overlays";
import { scrollViewComponents } from "./scroll-view";
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
        Quill UI ships a deliberately small widget set. Everything below is a real class in the widget,
        HUD, render, input, overlay or layout packages.
      </P>
      {PREVIEW_NOTE}
      <H2>Component list</H2>
      <DocTable
        head={["Component", "Class", "Kind", "Page"]}
        rows={[
          ["Button", <C key="b">QuillButton</C>, "Widget", <DocLink key="bl" to="components/button">Buttons</DocLink>],
          ["Card", <C key="c">QuillCard</C>, "Render helper", <DocLink key="cl" to="components/card">Cards</DocLink>],
          ["Panel", <C key="n">QuillPanel</C>, "Layout helper", <DocLink key="nl" to="components/panels">Panels</DocLink>],
          ["Text field", <C key="tf">QuillTextField</C>, "Widget", <DocLink key="tfl" to="components/text-field">Text fields</DocLink>],
          ["Slider", <C key="sl2">QuillSlider</C>, "Widget", <DocLink key="sl2l" to="components/slider">Sliders</DocLink>],
          ["Checkbox", <C key="cb">QuillCheckbox</C>, "Widget", <DocLink key="cbl" to="components/checkbox-radio">Checkboxes and Radios</DocLink>],
          ["Radio", <C key="rd">QuillRadio</C>, "Widget", <DocLink key="rdl" to="components/checkbox-radio">Checkboxes and Radios</DocLink>],
          ["Radio group", <C key="rg">QuillRadioGroup</C>, "Controller", <DocLink key="rgl" to="components/checkbox-radio">Checkboxes and Radios</DocLink>],
          ["Dropdown", <C key="dd">QuillDropdown</C>, "Widget", <DocLink key="ddl" to="components/dropdown">Dropdowns</DocLink>],
          ["Selection style", <C key="ss">QuillSelectionStyle</C>, "Input style", <DocLink key="ssl" to="components/checkbox-radio">Checkboxes and Radios</DocLink>],
          ["Scroll list", <C key="s">QuillScrollList&lt;T&gt;</C>, "Widget", <DocLink key="sl" to="components/scroll-list">Scroll lists</DocLink>],
          ["Scroll view", <C key="sv">QuillScrollView</C>, "Deprecated", <DocLink key="svl" to="components/scroll-view">Scroll views</DocLink>],
          ["Clip view", <C key="cv">QuillClipView</C>, "Widget host (recommended)", <DocLink key="cvl" to="components/scroll-view">Scroll views</DocLink>],
          ["Scroll bar", <C key="sb">QuillScrollBar</C>, "Widget", <DocLink key="sbl" to="components/scroll-view">Scroll views</DocLink>],
          ["Widget box", <C key="wb">QuillWidgetBox</C>, "Layout adapter", <DocLink key="wbl" to="fundamentals/layout-engine">Layout engine</DocLink>],
          ["Tab bar", <C key="t">QuillTabBar</C>, "Helper", <DocLink key="tl" to="components/tabs">Tabs</DocLink>],
          ["Toggle", <C key="g">QuillToggle</C>, "Widget", <DocLink key="gl" to="components/toggle">Toggles</DocLink>],
          ["Map", <C key="m">QuillMap</C>, "Widget", <DocLink key="ml" to="components/map">Map</DocLink>],
          ["Overlay", <C key="ov">QuillOverlay</C>, "Screen layer", <DocLink key="ovl" to="components/overlays">Overlays</DocLink>],
          ["Popup / Modal / Toast", "QuillPopupMenu, QuillModal, QuillToast", "Overlay", <DocLink key="pml" to="components/overlays">Overlays</DocLink>],
          ["Target indicator", <C key="h">QuillTargetIndicator</C>, "HUD", <DocLink key="hl" to="hud/target-indicator">Target Indicator</DocLink>],
          ["Tooltip", <C key="p">QuillTooltips</C>, "Helper", <DocLink key="pl" to="components/tooltips">Tooltips</DocLink>],
        ]}
      />

      <H2>What is not provided</H2>
      <P>
        There is no color picker, date/time control, tree view or table in the current API. A{" "}
        <C>QuillCard</C> is a drawing helper, not a layout container; use <C>QuillPanel</C> for a card
        with a vertical flow and a two-column action row, or <C>QuillColumn</C> / <C>QuillRow</C> for
        custom layouts. Text fields, sliders, checkboxes, radios, radio groups, dropdowns, overlays, toasts,
        scroll lists and custom scroll views are available in this release.
      </P>

      <H2>Shared conventions</H2>
      <UL>
        <li>
          Most widgets accept an optional <C>QuillThemeData</C>. The input controls (
          <C>QuillTextField</C>, <C>QuillSlider</C>, <C>QuillCheckbox</C>, <C>QuillRadio</C>),{" "}
          <C>QuillDropdown</C>, <C>QuillScrollView</C>, <C>QuillClipView</C>, <C>QuillScrollBar</C> and
          the overlay constructors require a theme argument; null falls back to{" "}
          <C>QuillThemeData.DEFAULT</C>.
        </li>
        <li>Buttons, toggles, checkboxes and radios respond to Enter and Space when focused.</li>
        <li>Widgets draw their own hover, focus, selected and disabled states; no vanilla button texture is used.</li>
        <li>
          Menus, modals and notifications are screen overlays, not child widgets; see{" "}
          <DocLink to="components/overlays">Overlays</DocLink>.
        </li>
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
          [<C key="p">PRIMARY</C>, "ACCENT border with ON_ACCENT text; the main action of a screen."],
          [<C key="s">SECONDARY</C>, "BUTTON_* surface; normal editing actions."],
          [<C key="d">DANGER</C>, "DANGER border with ON_DANGER text; destructive actions."],
          [<C key="g">GHOST</C>, "GHOST_BG / GHOST_BORDER / GHOST_TEXT; navigation and utility actions."],
        ]}
      />
      <H2>Theme roles</H2>
      <P>
        Primary text uses <C>ON_ACCENT</C>, danger text uses <C>ON_DANGER</C>, ghost controls use{" "}
        <C>GHOST_BG</C> / <C>GHOST_BORDER</C> / <C>GHOST_TEXT</C>, and the keyboard focus outline uses{" "}
        <C>FOCUS_RING</C>. Light themes should override these roles together with <C>PRIMARY_BG</C>,{" "}
        <C>DANGER_BG</C> and <C>SURFACE</C>; see <DocLink to="guides/theming">Theming</DocLink>.
      </P>

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
        Disabled buttons ignore both. Focus draws a 1 px <C>FOCUS_RING</C> outline around the button.
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
      <Callout kind="note">
        <P>
          Hover transitions interpolate background, border and text over 0.12 s with <C>EASE_OUT</C>. With{" "}
          <DocLink to="fundamentals/motion">reduced motion</DocLink> enabled, the change is instant.
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
        x, contentTop(), width, 140,
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

function MapPage() {
  return (
    <>
      <P>
        <C>QuillMap</C> is an interactive top-down world map. It renders terrain into a cached dynamic
        texture and layers a selection rectangle, zones, markers and optional entity markers on top. It is
        client-only and has no gameplay dependency.
      </P>
      {PREVIEW_NOTE}
      <Example preview={<McMap className="w-full max-w-md" />}>
        <CodeBlock
          code={`
QuillMap map = new QuillMap(
        x, y, width, height,
        player.blockPosition(),     // center
        64,                         // max radius
        32,                         // max selection size
        QuillThemeData.DEFAULT      // theme is required
);

addRenderableWidget(map);`}
        />
      </Example>

      <H2>Construction</H2>
      <P>
        Two constructors are available. The shorter one uses a maximum selection size of 32. The map
        requires a <C>QuillThemeData</C>; there is no default-theme overload.
      </P>
      <CodeBlock
        code={`
QuillMap(x, y, width, height, center, maxRadius, theme)
QuillMap(x, y, width, height, center, maxRadius, maxSelectionSize, theme)`}
      />
      <UL>
        <li>
          <C>center</C> is the initial world position. <C>null</C> is ignored by <C>setCenter</C>; pass a
          real <C>BlockPos</C> at construction.
        </li>
        <li>
          <C>maxRadius</C> is clamped to 1–128 and sets the dashed radius overlay and the initial
          pixels-per-block. It does not clamp panning.
        </li>
        <li>
          <C>maxSelectionSize</C> is clamped to 1–64 and controls <C>selectionFitsLimit()</C>.
        </li>
      </UL>

      <H2>Layers</H2>
      <P>
        <C>Layer.AUTO</C> is the default: the map switches to underground when the player has no sky light
        or is more than two blocks below the surface. <C>SURFACE</C> and <C>UNDERGROUND</C> force a layer.
      </P>
      <CodeBlock
        code={`
map.setLayer(QuillMap.Layer.AUTO);
map.setLayer(QuillMap.Layer.SURFACE);
map.setLayer(QuillMap.Layer.UNDERGROUND);

map.setLayer(map.layer().next()); // cycle AUTO -> SURFACE -> UNDERGROUND
map.setUndergroundScanDepth(48);  // clamp 4..256, default 48`}
      />
      <P>
        Underground rendering scans down from the player&apos;s Y level (or the map center when there is
        no player) to find a floor. Lower scan depths reduce cost. The HUD label is available from{" "}
        <C>map.layerLabel()</C> and uses the <C>quillui.map.layer.*</C> translation keys.
      </P>

      <H2>Theme roles</H2>
      <P>
        Map chrome now follows the theme: <C>MAP_BG</C> fills the background and empty tiles,{" "}
        <C>MAP_GRID</C> draws the chunk grid and <C>MAP_UNKNOWN</C> colours columns with no map colour.
        Marker outlines and labels use <C>TITLE</C>; selection uses <C>SUCCESS</C>/<C>DANGER</C>; the HUD
        uses <C>PANEL_BG</C>/<C>TEXT_SOFT</C>; the centre marker uses <C>ACCENT</C>/<C>TITLE</C>. Use{" "}
        <C>ColorRole</C> plus <C>QuillColors</C> helpers for themed overlays; raw ARGB remains available
        for custom data.
      </P>
      <CodeBlock
        code={`
QuillThemeData mapTheme = QuillThemeData.DEFAULT
        .with(QuillThemeData.ColorRole.MAP_BG, QuillColors.fromHex("#09121A"))
        .with(QuillThemeData.ColorRole.MAP_GRID, QuillColors.fromHex("#551E2936"))
        .with(QuillThemeData.ColorRole.MAP_UNKNOWN, QuillColors.fromHex("#101820"));`}
      />

      <H2>Interaction</H2>
      <P>
        Mouse actions are configured per button with <C>MouseBindings</C>. The default is select with the
        left button and pan with the right and middle buttons.
      </P>
      <CodeBlock
        code={`
map.setMouseBindings(new QuillMap.MouseBindings(
        QuillMap.MouseAction.SELECT, // left
        QuillMap.MouseAction.PAN,    // right
        QuillMap.MouseAction.PAN     // middle
));
// MouseBindings.DEFAULT is the same mapping.

map.setReadOnly(true);             // pan still works; selection is disabled
map.setRadiusLimitVisible(true);   // dashed MAX_RADIUS outline`}
      />
      <P>
        The mouse wheel changes the zoom between 1× and 4× (pixels per block).{" "}
        <C>setMouseBindings(...)</C> is authoritative: it also derives{" "}
        <C>interactionMode()</C> from the left action. <C>setInteractionMode(...)</C> updates that reported
        mode but does not remap the buttons.
      </P>
      <Callout kind="note">
        <P>
          Drag and release events are forwarded by <C>QuillScreen</C> to the focused widget (or the child
          under the cursor). That is what allows the map to pan with right or middle drag while left clicks
          keep their normal routing.
        </P>
      </Callout>

      <H2>Clip hosts</H2>
      <P>
        The map normally clips itself with a scissor. When it is nested in <C>QuillClipView</C> or another
        clipped host, the outer host already clips the viewport, so disable the internal scissor. The map
        still translates its clip rectangle through <C>QuillRenderContext</C>, keeping nested scissoring
        aligned with the host offset.
      </P>
      <CodeBlock
        code={`
map.setScissorEnabled(false); // the outer clip host owns the scissor
clip.add(map);`}
      />
      <P>
        <C>setScissorEnabled(boolean)</C> defaults to <C>true</C>. It changes clipping only; map drawing,
        hit-testing and panning keep using the same content coordinates.
      </P>

      <H2>Selection</H2>
      <P>
        Selection coordinates are world columns. Width and depth are inclusive, so a 1×1 selection reports
        width 1 and depth 1.
      </P>
      <DocTable
        head={["Member", "Effect"]}
        rows={[
          [<C key="1">from() / to()</C>, "Selection corners, or null when there is no selection."],
          [<C key="2">hasSelection()</C>, "True when both corners are set."],
          [<C key="3">selectionWidth() / selectionDepth()</C>, "Inclusive block spans."],
          [<C key="4">selectionArea()</C>, "Width × depth."],
          [<C key="5">selectionFitsLimit()</C>, "True when both spans fit maxSelectionSize."],
          [<C key="6">setSelection(from, to) / clearSelection()</C>, "Programmatic selection; notifies the selection listener."],
        ]}
      />
      <P>
        The built-in selection HUD uses the <C>quillui.map.selection</C> key (
        <C>%sx%s (%s blocks)</C>), so its dimensions are localizable.
      </P>
      <CodeBlock
        code={`
map.setSelectionListener(m -> updateHud(m)); // every change

// Called once when a drag finishes; use it to commit a claim/build/query.
map.setSelectionCommitListener(m -> {
    if (!m.hasSelection()) return;
    int minX = Math.min(m.from().getX(), m.to().getX());
    int minZ = Math.min(m.from().getZ(), m.to().getZ());
    QuillCommandSink.get().execute(
            "example claim " + minX + " " + minZ + " "
                    + m.selectionWidth() + " " + m.selectionDepth()
    );
});`}
      />
      <Callout kind="warning">
        <P>
          <C>setSelection(...)</C> does not fire the commit listener. Only a mouse drag release (or{" "}
          <C>onRelease</C>) does. If a programmatic selection should commit, call your action directly.
        </P>
      </Callout>

      <H2>Zones and markers</H2>
      <DocTable
        head={["Type", "Fields"]}
        rows={[
          [<C key="1">QuillMapZone</C>, "from, to (BlockPos), fillColor, borderColor, dashed"],
          [<C key="2">QuillMapMarker</C>, "position (BlockPos), label (Component), color"],
        ]}
      />
      <P>
        Zones are rectangular world overlays with a fill and either a solid or dashed border. Markers are
        9x9 points with a themed outline and an optional label badge. Use theme roles for the colours; the
        constructors still accept packed ARGB for custom data.
      </P>
      <CodeBlock
        code={`
int success = QuillThemeData.DEFAULT.color(QuillThemeData.ColorRole.SUCCESS);
map.setZones(List.of(new QuillMapZone(
        new BlockPos(-16, 64, -16),
        new BlockPos(32, 64, 32),
        QuillColors.withAlpha(success, 0.2F),
        success,
        true
)));

map.addMarker(new QuillMapMarker(
        new BlockPos(0, 64, 0),
        Component.literal("Spawn"),
        QuillThemeData.DEFAULT.color(QuillThemeData.ColorRole.ACCENT)
));`}
      />
      <P>
        <C>setZones</C> replaces the list and <C>addZone</C> appends; <C>zones()</C> returns an immutable
        copy. Markers follow the same pattern.
      </P>

      <H2>Entity providers</H2>
      <P>
        A provider turns client entities into markers. The filter and marker factory run for each render
        against <C>level.entitiesForRendering()</C>.
      </P>
      <CodeBlock
        code={`
map.setEntityProvider(
        entity -> entity instanceof Player,
        entity -> new QuillMapMarker(
                entity.blockPosition(),
                entity.getName(),
                QuillThemeData.DEFAULT.color(QuillThemeData.ColorRole.INFO)
        )
);

map.setEntityYRange(8, 8); // 8 below / 8 above the player, inclusive
map.setEntityYRangeEnabled(false);
map.clearEntityYRange();`}
      />
      <UL>
        <li>The Y range is relative to the local player and disabled by default.</li>
        <li>Values are clamped to 0–256. Call <C>setEntityYRange</C> to enable it.</li>
        <li>Use <C>clearEntityProvider()</C> to remove entity markers entirely.</li>
      </UL>

      <H2>Coordinates</H2>
      <CodeBlock
        code={`
int screenX = map.blockToScreenX(pos.getX());
int screenZ = map.blockToScreenZ(pos.getZ());

int blockX = map.screenToBlockX(mouseX);
int blockZ = map.screenToBlockZ(mouseY);
BlockPos underCursor = map.blockAt(mouseX, mouseY); // uses the map center Y`}
      />

      <H2>Lifecycle and performance</H2>
      <P>
        <C>QuillMap</C> owns a dynamic texture and implements <C>AutoCloseable</C>. Close it when the
        screen is removed so the texture is released.
      </P>
      <CodeBlock
        code={`
@Override
public void removed() {
    map.close();
    super.removed();
}`}
      />
      <UL>
        <li>Terrain is cached per dimension, chunk, layer and zoom; surface tiles refresh roughly every 100 ticks and underground tiles roughly every 400.</li>
        <li>Full-resolution tiles are generated progressively under a small per-frame budget. Underground is the most expensive layer.</li>
        <li>
          <C>lastUpdateNanos()</C> exposes the last texture update duration for profiling.
        </li>
        <li>
          <C>setCenter(...)</C> and <C>panBy(dx, dz)</C> mark the map dirty.{" "}
          <C>resize(width, height)</C> also recomputes pixels-per-block from <C>maxRadius</C> and marks it
          dirty.
        </li>
      </UL>
    </>
  );
}

function ScrollList() {
  return (
    <>
      <P>
        <C>QuillScrollList&lt;T&gt;</C> is a fixed-row list with a thin scrollbar. The caller draws each row
        and handles clicks; the list handles clipping, wheel scrolling and the scrollbar, including thumb
        dragging.
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
    int color = QuillThemeData.DEFAULT.color(hovered
            ? QuillThemeData.ColorRole.TITLE
            : QuillThemeData.ColorRole.TEXT);
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
          The mouse wheel scrolls by one row height per notch and only while the cursor is over the list.
          Clicking the scrollbar track jumps the position, and dragging the thumb keeps scrolling after
          the pointer leaves the track. Scrollbar input never selects a row.
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
        sync. It is a helper that builds buttons for you; you still register them on the screen. A custom
        click sound is applied to every tab.
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

tabs.clickSound(myClickSound); // applies to every tab button
tabs.addTo(this::addRenderableWidget);
tabs.select(0);
// The constructor also accepts an optional QuillThemeData as the last argument.`}
        />
      </Example>

      <H2>Methods</H2>
      <DocTable
        head={["Method", "Effect"]}
        rows={[
          [<C key="0">clickSound(SoundEvent)</C>, "Sets the click sound on every tab button and returns this bar."],
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

toggle.clickSound(myClickSound); // custom sound instead of the vanilla down sound
addRenderableWidget(toggle);`}
        />
      </Example>

      <H2>Methods</H2>
      <DocTable
        head={["Method", "Effect"]}
        rows={[
          [<C key="0">clickSound(SoundEvent)</C>, "Uses a custom sound instead of the vanilla UI down sound; returns this toggle."],
          [<C key="1">value()</C>, "Current local value."],
          [<C key="2">setValue(boolean)</C>, "Updates the visual state without calling the consumer."],
          [<C key="3">setActive(boolean)</C>, "Inherited. Disables input and uses the disabled palette."],
        ]}
      />
      <P>
        Clicking the control or pressing Enter/Space while focused flips the value, plays the click sound
        (custom if set, otherwise the vanilla down sound) and calls the consumer with the new value. The
        caller is responsible for applying the change through an action sink or payload.
      </P>
      <Callout kind="note">
        <P>
          The knob animates over 0.14 s with <C>EASE_OUT</C>; <DocLink to="fundamentals/motion">reduced
          motion</DocLink> makes it jump. <C>setValue</C> updates the value, and the animation starts on
          the next render.
        </P>
      </Callout>
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
  ...inputComponents,
  ...dropdownComponents,
  {
    slug: "scroll-list",
    title: "Scroll Lists",
    description: "Fixed-row lists with scrolling and click handling.",
    component: ScrollList,
  },
  ...scrollViewComponents,
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
    slug: "map",
    title: "Map",
    description: "Interactive surface/underground world map with selection and overlays.",
    component: MapPage,
  },
  ...overlayComponents,
  {
    slug: "tooltips",
    title: "Tooltips",
    description: "Title, body and command hints on hover.",
    component: Tooltips,
  },
];
