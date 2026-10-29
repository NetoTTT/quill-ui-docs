import { C, Callout, CodeBlock, DocLink, DocTable, Example, H2, P, UL } from "@/components/prose";
import { layoutEngine } from "./layout-engine";
import type { DocPage } from "../types";

function CoreConcepts() {
  return (
    <>
      <P>
        Quill UI groups responsibilities into packages so a screen only has to know about the parts it uses.
        These are the terms used throughout the documentation.
      </P>

      <H2>Vocabulary</H2>
      <DocTable
        head={["Term", "What it is"]}
        rows={[
          ["Widget", <>Anything that draws and receives input. In practice, a Minecraft <C>AbstractWidget</C> such as <C>QuillButton</C>.</>],
          ["Screen", <>The Minecraft screen that hosts the widgets: <C>QuillScreen</C>.</>],
          ["Render helper", <>A non-interactive drawing object such as <C>QuillCard</C>. It has no input and is rendered by your screen.</>],
          ["Panel", <>A layout helper (<C>QuillPanel</C>) that composes controls inside a <C>QuillCard</C>.</>],
          ["Layout primitive", <>A small class that returns rectangles: <C>QuillColumn</C>, <C>QuillRow</C>, <C>QuillGrid</C>.</>],
          ["Theme", <>An immutable <C>QuillThemeData</C> palette plus static token groups (spacing, typography, radii, elevation).</>],
          ["Action", <>A string emitted through <C>QuillActionSink</C>. Screens never write authoritative state.</>],
        ]}
      />

      <H2>The screen lifecycle</H2>
      <UL>
        <li>
          <C>init()</C> computes <C>panelX</C> / <C>panelY</C> from the window size and calls your{" "}
          <C>buildContent()</C>.
        </li>
        <li>
          Your <C>buildContent()</C> derives rectangles and registers widgets with <C>addRenderableWidget(...)</C>.
        </li>
        <li>
          <C>extractBackground</C> draws the panel; <C>extractRenderState</C> draws the header, content and
          optional footer.
        </li>
        <li>
          Widgets receive input from vanilla once registered. Quill UI does not replace Minecraft&apos;s screen
          loop.
        </li>
      </UL>

      <H2>Dependency direction</H2>
      <P>
        The public packages follow a one-way dependency graph. Keeping it intact is what makes a future
        NeoForge port possible without rewriting the widgets.
      </P>
      <CodeBlock
        lang="text"
        status="none"
        code={`
api
theme  -> (no Quill dependencies)
layout -> (no Quill dependencies)
render -> theme, layout
widget -> theme, render, layout, action
screen -> theme, render, widget, layout, action
action -> Minecraft/Fabric only`}
      />
      <Callout kind="note">
        <P>
          Public packages must not depend on internals, and <C>theme</C> / <C>layout</C> must stay usable
          without a live Minecraft screen. Widgets never contain commands or gameplay state.
        </P>
      </Callout>

      <H2>Continue</H2>
      <UL>
        <li>
          <DocLink to="fundamentals/theme">Theme and tokens</DocLink>
        </li>
        <li>
          <DocLink to="fundamentals/layout">Layout primitives</DocLink>
        </li>
        <li>
          <DocLink to="fundamentals/screen">Screens</DocLink>
        </li>
      </UL>
    </>
  );
}

function Theme() {
  return (
    <>
      <P>
        Visual constants live in <C>com.quillui.theme</C>. New code should pass a <C>QuillThemeData</C>{" "}
        instance to widgets and screens; <C>QuillTheme</C> remains as a static compatibility facade that
        resolves to the default palette.
      </P>

      <H2>QuillThemeData</H2>
      <P>
        An immutable palette keyed by <C>ColorRole</C>. Derive a variant with <C>with(...)</C>, or build a
        custom palette with the builder. Every widget constructor accepts an optional theme.
      </P>
      <CodeBlock
        code={`
QuillThemeData accent = QuillThemeData.DEFAULT
        .with(QuillThemeData.ColorRole.ACCENT, QuillColors.fromHex("#8CC8F0"))
        .with(QuillThemeData.ColorRole.ACCENT_HOVER, QuillColors.fromHex("#A9D9F7"));

QuillButton button = new QuillButton(
        x, y, width, 20,
        Component.literal("Apply"),
        QuillButton.Variant.PRIMARY,
        this::apply,
        accent
);`}
      />
      <P>The builder starts from the default palette, so you only override what changes:</P>
      <CodeBlock
        code={`
QuillThemeData light = QuillThemeData.builder()
        .set(QuillThemeData.ColorRole.SCREEN_BG, QuillColors.fromHex("#66000000")) // optional dim backdrop
        .set(QuillThemeData.ColorRole.PANEL_BG, QuillColors.fromHex("#F0FFFFFF"))
        .set(QuillThemeData.ColorRole.TEXT, QuillColors.fromHex("#253746"))
        .set(QuillThemeData.ColorRole.SURFACE, QuillColors.fromHex("#F0FFFFFF"))
        .set(QuillThemeData.ColorRole.SURFACE_ALT, QuillColors.fromHex("#66EAF6FF"))
        .set(QuillThemeData.ColorRole.SURFACE_BORDER, QuillColors.fromHex("#BBD9EE"))
        .set(QuillThemeData.ColorRole.SURFACE_HEADER, QuillColors.fromHex("#EAF6FF"))
        .set(QuillThemeData.ColorRole.PRIMARY_BG, QuillColors.fromHex("#23699A"))
        .set(QuillThemeData.ColorRole.PRIMARY_BG_HOVER, QuillColors.fromHex("#3B95D0"))
        .set(QuillThemeData.ColorRole.ON_ACCENT, QuillColors.fromHex("#FFFFFF"))
        .set(QuillThemeData.ColorRole.DANGER_BG, QuillColors.fromHex("#FDECEC"))
        .set(QuillThemeData.ColorRole.ON_DANGER, QuillColors.fromHex("#9C3F3F"))
        .set(QuillThemeData.ColorRole.GHOST_TEXT, QuillColors.fromHex("#4B657A"))
        .set(QuillThemeData.ColorRole.FOCUS_RING, QuillColors.fromHex("#23699A"))
        .build();`}
      />
      <Callout kind="tip">
        <P>
          The full role list and default values are on <DocLink to="reference/colors">Colour reference</DocLink>.
        </P>
      </Callout>

      <H2>Static facade</H2>
      <P>
        <C>QuillTheme</C> exposes <C>SPACE_1</C>…<C>SPACE_6</C> and every colour role as a static constant.
        It is kept for source compatibility; prefer <C>QuillSpacing</C> and <C>QuillThemeData</C> in new
        code. <C>QuillScreen</C> and every widget accept a <C>QuillThemeData</C> instance.
      </P>

      <H2>Spacing</H2>
      <DocTable
        head={["Token", "Pixels"]}
        rows={[
          [<C key="0">QuillSpacing.NONE</C>, "0"],
          [<C key="1">SPACE_1</C>, "4"],
          [<C key="2">SPACE_2</C>, "8"],
          [<C key="3">SPACE_3</C>, "12"],
          [<C key="4">SPACE_4</C>, "16"],
          [<C key="5">SPACE_5</C>, "20"],
          [<C key="6">SPACE_6</C>, "24"],
        ]}
      />

      <H2>Typography</H2>
      <DocTable
        head={["Token", "Value", "Use"]}
        rows={[
          [<C key="a">TEXT_HEIGHT</C>, "8", "Rendered glyph height."],
          [<C key="b">LINE_HEIGHT</C>, "9", "Glyph height plus one pixel of leading."],
          [<C key="c">SMALL_LINE_HEIGHT</C>, "8", "Compact rows."],
          [<C key="d">TITLE_SCALE</C>, "1.0", "Title multiplier."],
          [<C key="e">BODY_SCALE</C>, "1.0", "Body multiplier."],
          [<C key="f">SMALL_SCALE</C>, "0.8", "Small text multiplier."],
        ]}
      />
      <P>
        Helpers: <C>QuillTypography.centeredTextY(height)</C> and{" "}
        <C>scaledLineHeight(scale)</C>.
      </P>

      <H2>Radii and elevation</H2>
      <DocTable
        head={["Token group", "Values"]}
        rows={[
          [<C key="r">QuillRadii</C>, "NONE 0, SM 2, MD 4, LG 6, PILL 999"],
          [<C key="e">QuillElevation</C>, "NONE 0, SM 2, MD 4, LG 6, PANEL_OFFSET 4"],
        ]}
      />
      <Callout kind="note">
        <P>
          Rounded rendering is not implemented yet; the radius tokens exist so widgets can adopt it later
          without renaming anything.
        </P>
      </Callout>

      <H2>Colour helpers</H2>
      <P>
        Minecraft packs colours as <C>0xAARRGGBB</C>. <C>QuillColors</C> converts and inspects them:
      </P>
      <CodeBlock
        code={`
int accent = QuillColors.rgb(224, 169, 59);       // opaque amber
int soft   = QuillColors.withAlpha(accent, 0.5F); // half opacity
int parsed = QuillColors.fromHex("#8CC8F0");      // #RRGGBB -> opaque
String hex = QuillColors.toHex(accent);           // "#FFE0A93B"`}
      />

      <H2>Contrast</H2>
      <P>
        <C>QuillContrast</C> measures WCAG-style contrast for opaque colours. Alpha is ignored, so pass
        the colours widgets actually draw on.
      </P>
      <DocTable
        head={["Method", "Meaning"]}
        rows={[
          [<C key="1">textRatio(fg, bg)</C>, "Contrast ratio for normal text (1.0 to 21.0)."],
          [<C key="2">uiRatio(fg, bg)</C>, "Same ratio, intended for borders, focus rings and large UI elements."],
          [<C key="3">meetsText(fg, bg)</C>, "True when the ratio is at least 4.5:1."],
          [<C key="4">meetsUi(fg, bg)</C>, "True when the ratio is at least 3.0:1."],
          [<C key="5">readableText(bg)</C>, "Returns #111827 or #FFFFFF, whichever reads better on the background."],
          [<C key="6">describe(fg, bg)</C>, "A label such as \"7.42:1\"."],
        ]}
      />
      <P>
        <C>QuillThemeData.contrastWarnings()</C> checks the pairs the built-in widgets rely on:{" "}
        <C>TEXT</C> on <C>PANEL_BG</C> and <C>SURFACE</C>, <C>ON_ACCENT</C> on <C>PRIMARY_BG</C>,{" "}
        <C>ON_DANGER</C> on <C>DANGER_BG</C>, and <C>GHOST_TEXT</C> on <C>PANEL_BG</C>.
      </P>
      <CodeBlock
        code={`
for (String warning : theme.contrastWarnings()) {
    LOGGER.warn("Quill theme: {}", warning);
}

boolean readable = QuillContrast.meetsText(
        theme.color(QuillThemeData.ColorRole.TEXT),
        theme.color(QuillThemeData.ColorRole.PANEL_BG)
);

String label = QuillContrast.describe(
        theme.color(QuillThemeData.ColorRole.ON_ACCENT),
        theme.color(QuillThemeData.ColorRole.PRIMARY_BG)
); // "7.42:1"`}
      />
    </>
  );
}

function Layout() {
  return (
    <>
      <P>
        Layout primitives replace repeated magic coordinates with rectangles. They are pure Java and do not
        need a live screen, which makes them easy to test. The measured layout engine is covered separately
        in <DocLink to="fundamentals/layout-engine">Layout Engine</DocLink>.
      </P>

      <H2>Screen panel</H2>
      <P>
        <C>QuillScreen</C> treats the width and height passed to its constructor as a preferred size. On
        every <C>init()</C>, including window resizes, the panel is clamped to the viewport minus{" "}
        <C>screenMargin()</C> (16 px by default) and centered. Read <C>panelWidth()</C> and{" "}
        <C>panelHeight()</C> inside <C>buildContent()</C> instead of keeping your own constants, so content
        reflows on small windows.
      </P>
      <CodeBlock
        code={`
QuillRect content = contentBounds(); // header to footer, default inset
QuillRect narrow = contentBounds(16); // custom horizontal inset
QuillRect withActions = contentBounds(24, 64); // reserve space for fixed actions`}
      />
      <P>
        <C>contentTop()</C> starts 18 px below the real header. <C>contentBottom()</C> sits above the
        footer. With no subtitle, the header collapses from 48 px to about 34 px through{" "}
        <C>QuillScreenLayout.titleOnlyHeaderHeight()</C>.
      </P>

      <H2>QuillRect</H2>
      <P>
        <C>QuillRect(x, y, width, height)</C> is an immutable record with <C>right()</C>, <C>bottom()</C>,{" "}
        <C>centerX()</C>, <C>centerY()</C>, <C>contains(mouseX, mouseY)</C>, <C>inset(insets)</C>,{" "}
        <C>offset(dx, dy)</C>, <C>intersects(other)</C> and <C>intersection(other)</C>. Intersection
        returns a zero-sized rectangle when the two do not overlap.
      </P>

      <H2>QuillInsets</H2>
      <P>
        <C>QuillInsets(top, right, bottom, left)</C> with <C>all(value)</C> and{" "}
        <C>symmetric(vertical, horizontal)</C>. Use <C>horizontal()</C> and <C>vertical()</C> to subtract
        padding from a width or height, or <C>contentRect(bounds)</C> to apply the insets and clamp the
        result to the parent rectangle.
      </P>

      <H2>QuillColumn and QuillRow</H2>
      <P>
        Fixed-size slots with a fixed gap. <C>next(size)</C> returns a rectangle and advances the cursor.
        <C>next(size, insets)</C> returns the rectangle already inset.
      </P>
      <CodeBlock
        code={`
QuillColumn column = new QuillColumn(x, y, width, QuillSpacing.SPACE_2);
QuillRect first  = column.next(24);
QuillRect second = column.next(24);

QuillRow row = new QuillRow(x, y, 20, QuillSpacing.SPACE_1);
QuillRect cancel = row.next(96);
QuillRect save   = row.next(96);`}
      />

      <H2>QuillGrid</H2>
      <P>
        A fixed-column grid for forms and dashboard cards. Cell width is derived from the total width and
        the gap; cells are addressed by index, row by row.
      </P>
      <CodeBlock
        code={`
QuillGrid grid = new QuillGrid(x, y, width, 2, QuillSpacing.SPACE_3, 24);
QuillRect a = grid.cell(0); // column 0, row 0
QuillRect b = grid.cell(1); // column 1, row 0
QuillRect c = grid.cell(2); // column 0, row 1`}
      />

      <H2>QuillFlex</H2>
      <P>
        One-dimensional flex layout for a row with a fixed control and a flexible filler. Fixed items keep
        their basis; flexible items share the remaining space by weight. If fixed items overflow, positive
        bases shrink proportionally so the layout stays inside the bounds.
      </P>
      <CodeBlock
        code={`
List<QuillRect> slots = QuillFlex.row(content, QuillSpacing.SPACE_2)
        .add(120)          // fixed width
        .addFlexible(1)    // equal share
        .addFlexible(2)    // twice the share
        .layout();

QuillRect toolbar = QuillFlex.column(content, QuillSpacing.SPACE_1)
        .add(20)
        .addFlexible(1)
        .layout().get(1);`}
      />
      <DocTable
        head={["Member", "Effect"]}
        rows={[
          [<C key="1">row(bounds, gap) / column(bounds, gap)</C>, "Creates the flex container on either axis."],
          [<C key="2">add(basis)</C>, "Fixed main-axis size."],
          [<C key="3">addFlexible(weight)</C>, "Zero basis plus a share of the free space."],
          [<C key="4">add(basis, weight, constraints)</C>, "Fixed preference with a weight and per-item bounds."],
          [<C key="5">layout()</C>, "Returns immutable rectangles in item order."],
        ]}
      />

      <H2>QuillWrap</H2>
      <P>
        Wraps equal-sized items into rows inside fixed bounds. The item width is clamped to the available
        width; columns are derived from the bounds and gap.
      </P>
      <CodeBlock
        code={`
QuillWrap wrap = new QuillWrap(content, 180, 64, QuillSpacing.SPACE_3);
QuillRect first = wrap.cell(0);
int height = wrap.contentHeight(itemCount);`}
      />
      <P>
        <C>columns()</C>, <C>rows(count)</C>, <C>cell(index)</C> and <C>contentHeight(count)</C> are
        available for virtualised or custom-drawn grids.
      </P>

      <H2>QuillStack and QuillAlign</H2>
      <P>
        <C>QuillStack</C> places a child rectangle inside a parent. It clamps the child to the parent and
        uses <C>QuillAlign.START</C>, <C>CENTER</C> or <C>END</C> on each axis.
      </P>
      <CodeBlock
        code={`
QuillRect dialog = new QuillStack(content).center(360, 190);
QuillRect footer = new QuillStack(content).place(
        220, 20, QuillAlign.END, QuillAlign.END
);
QuillRect padded = new QuillStack(content).fill(QuillInsets.all(12));`}
      />

      <H2>QuillConstraints</H2>
      <P>
        Applies minimum and maximum width/height to a rectangle. The constructor rejects negative minimums
        and maximums smaller than the minimums. <C>QuillFlex.add(basis, weight, constraints)</C> accepts the
        same object per item.
      </P>
      <CodeBlock
        code={`
QuillConstraints limits = QuillConstraints.of(160, 40, 420, 120);
int width = limits.clampWidth(candidate.width());
QuillRect clamped = limits.clamp(candidate);

QuillConstraints none = QuillConstraints.none();`}
      />

      <H2>Breakpoints</H2>
      <P>
        <C>QuillBreakpoints</C> names three viewport classes and provides a column helper. The thresholds
        are <C>480</C> for <C>MEDIUM</C> and <C>840</C> for <C>EXPANDED</C>; the column calculation is
        independent of the names.
      </P>
      <CodeBlock
        code={`
QuillBreakpoints.Breakpoint size = QuillBreakpoints.of(viewportWidth);

int columns = QuillBreakpoints.columns(contentWidth, 180, 4, gap);
QuillGrid grid = new QuillGrid(
        x, y, contentWidth, columns, gap, rowHeight
);
if (size == QuillBreakpoints.Breakpoint.COMPACT) {
    // stack controls instead of using columns
}`}
      />
      <Callout kind="note">
        <P>
          These helpers return plain <C>QuillRect</C> values and do not measure content. Use the{" "}
          <DocLink to="fundamentals/layout-engine">layout engine</DocLink> when children must size
          themselves from constraints, such as wrapped text or nested flexible rows.
        </P>
      </Callout>

      <H2>Composition</H2>
      <P>
        Prefer a few named regions per screen. Cards, buttons and lists should all be positioned from the
        same rectangles, not from independent constants.
      </P>
      <CodeBlock
        code={`
QuillRect content = contentBounds(24, 64); // leave room for an action row
QuillGrid fields = new QuillGrid(
        content.x(), content.y(), content.width(),
        2, QuillSpacing.SPACE_3, 22
);
QuillRect actions = new QuillRect(
        content.x(),
        content.bottom() + QuillSpacing.SPACE_3,
        content.width(), 20
);`}
      />
      <Callout kind="tip">
        <P>
          Keep every value on the 4 px grid. Minecraft&apos;s GUI scale is an integer, so non-multiples of 4
          drift at high scales.
        </P>
      </Callout>
    </>
  );
}

function Screen() {
  return (
    <>
      <P>
        <C>QuillScreen</C> is the host screen. It draws a centered panel, a layout-driven header, an optional
        footer and a themed close button, then lets your content do the rest.
      </P>

      <H2>Structure</H2>
      <DocTable
        head={["Member", "Purpose"]}
        rows={[
          [<C key="a">QuillScreen(title, width, height)</C>, "Preferred panel size and window title; uses QuillThemeData.DEFAULT."],
          [<C key="h">QuillScreen(title, width, height, theme)</C>, "Same, with a custom QuillThemeData for the whole shell."],
          [<C key="j">QuillScreen(title, width, height, theme, layout)</C>, "Full constructor: custom theme and a QuillScreenLayout."],
          [<C key="b">buildContent()</C>, "Abstract. Called from init(); register widgets here."],
          [<C key="c">subtitle()</C>, "Optional second header line."],
          [<C key="d">footer()</C>, "Optional centered footer; a divider is drawn automatically when non-blank."],
          [<C key="e">panelX / panelY</C>, "Current panel origin, recomputed on resize."],
          [<C key="f">panelWidth() / panelHeight()</C>, "Current panel size after viewport clamping."],
          [<C key="m">screenMargin()</C>, "Gap kept around the panel; 16 px by default."],
          [<C key="n">contentTop() / contentBottom()</C>, "Content edges derived from the real header and footer."],
          [<C key="q">contentBounds([hInset[, bottomInset]])</C>, "Content rectangle between header and footer."],
          [<C key="r">contentInset() / footerHeight() / hasSubtitle()</C>, "Shell measurements; override contentInset() to change the default 24 px inset."],
          [<C key="i">layout() / headerHeight()</C>, "Override layout() to move the header, title, subtitle or close button."],
          [<C key="k">registerShortcut(...)</C>, "Registers a keyboard shortcut; see below."],
          [<C key="g">closeButton(action)</C>, "Builds the header close button; you register it."],
        ]}
      />
      <P>
        The constructor size is a <strong>preferred</strong> size. On every <C>init()</C> the panel is
        clamped to the viewport minus <C>screenMargin()</C> and centered, so small windows never cut off the
        shell. The header is 48 px with a subtitle and about 34 px without one. The title sits at <C>+22,+14</C>,
        the subtitle at <C>+22,+29</C>, and the close button is 20x20 at 10 px from the right and 8 px from
        the top. The accent bar scales with the collapsed header and stays inside it.
      </P>
      <P>
        Content starts at <C>contentTop()</C>, 18 px below the real header. <C>contentBounds()</C> applies{" "}
        <C>contentInset()</C> horizontally and reserves the footer plus 12 px at the bottom. Use{" "}
        <C>contentBounds(24, 64)</C> when a fixed action row needs its own space.
      </P>

      <H2>Custom layout</H2>
      <P>
        <C>QuillScreenLayout</C> is a record of relative measurements. Override <C>layout()</C>, or pass a
        layout to the full constructor, to change it without reimplementing the screen.
      </P>
      <DocTable
        head={["Field", "Default"]}
        rows={[
          [<C key="1">headerHeight</C>, "48"],
          [<C key="2">titleInsetX</C>, "22"],
          [<C key="3">titleInsetY</C>, "14"],
          [<C key="4">subtitleInsetY</C>, "29"],
          [<C key="5">closeInsetRight</C>, "10"],
          [<C key="6">closeInsetTop</C>, "8"],
          [<C key="7">closeSize</C>, "20"],
        ]}
      />
      <CodeBlock
        code={`
private static final QuillScreenLayout COMPACT =
        new QuillScreenLayout(36, 16, 10, 24, 8, 6, 18);

@Override
protected QuillScreenLayout layout() {
    return COMPACT;
}

@Override
protected int screenMargin() {
    return 8; // keep the panel closer to the edge
}`}
      />
      <P>
        <C>QuillScreenLayout.titleOnlyHeaderHeight()</C> derives the collapsed header from{" "}
        <C>titleInsetY</C> and <C>headerHeight</C>; it is used automatically when <C>subtitle()</C> is
        blank. Override <C>headerHeight()</C> only when the derived value is not what you want.
      </P>

      <H2>Keyboard shortcuts</H2>
      <P>
        Register shortcuts from the screen. A shortcut fires when the key matches and either{" "}
        <C>allowWhenFocused</C> is true or no child widget currently has focus. If the focused widget
        captures text input (for example <C>QuillTextField</C>), shortcuts are skipped entirely so typing
        is not intercepted, even when <C>allowWhenFocused</C> is true.
      </P>
      <DocTable
        head={["Member", "Effect"]}
        rows={[
          [<C key="1">QuillShortcut.of(key, action)</C>, "Shortcut that only fires when no child widget has focus."],
          [<C key="2">QuillShortcut.global(key, action)</C>, "Also fires while a child widget has focus, unless that widget captures text input."],
          [<C key="3">registerShortcut(int, Runnable)</C>, "Registers a non-global shortcut."],
          [<C key="4">registerShortcut(int, Runnable, boolean)</C>, "Registers a shortcut with an explicit allowWhenFocused flag."],
          [<C key="5">registerShortcut(QuillShortcut)</C>, "Registers a pre-built shortcut record."],
        ]}
      />
      <CodeBlock
        code={`
import com.mojang.blaze3d.platform.InputConstants;

registerShortcut(InputConstants.KEY_R, this::reload);

registerShortcut(
        InputConstants.KEY_F1,
        this::toggleHelp,
        true // also fires while a child widget has focus (not text input)
);

// Equivalent to the call above:
registerShortcut(QuillShortcut.global(InputConstants.KEY_F1, this::toggleHelp));`}
      />

      <H2>Mouse forwarding</H2>
      <P>
        <C>QuillScreen</C> forwards drag and release events to the focused widget, or to the child under
        the cursor when nothing is focused. This is how <C>QuillMap</C> pans with the right or middle
        button and how <C>QuillScrollView</C>, <C>QuillScrollBar</C> and <C>QuillScrollList</C> keep
        dragging their thumb after the pointer leaves it. A click that no widget handles clears the
        current focus, which also lets a text field lose focus when you click outside it.
      </P>

      <H2>Overlays and toasts</H2>
      <P>
        Menus, confirmation dialogs and notifications are screen-level overlays rather than child
        widgets. <C>QuillScreen</C> renders them after the footer, routes input from newest to oldest
        and prunes them once they close.
      </P>
      <DocTable
        head={["Member", "Effect"]}
        rows={[
          [<C key="1">openOverlay(QuillOverlay)</C>, "Pushes an overlay and clears widget focus."],
          [<C key="2">closeOverlay(QuillOverlay)</C>, "Calls close() and removes it."],
          [<C key="3">closeOverlays()</C>, "Closes and removes every overlay, including pending modals."],
          [<C key="4">showToast(Component)</C>, "Shows a 3.0 s toast and returns it."],
          [<C key="5">showToast(Component, float)</C>, "Shows a toast with a custom lifetime in seconds."],
        ]}
      />
      <CodeBlock
        code={`
addRenderableWidget(new QuillButton(
        x, y, 96, 20,
        Component.translatable("mymod.delete"),
        QuillButton.Variant.DANGER,
        () -> openOverlay(new QuillModal(
                Component.translatable("mymod.delete.title"),
                Component.translatable("mymod.delete.body"),
                Component.translatable("gui.ok"),
                Component.translatable("gui.cancel"),
                this::deleteSelected,
                () -> { },
                theme
        ))
));

// A toast never captures input.
showToast(Component.translatable("mymod.saved"), 2.5F);`}
      />
      <P>
        A consumed click or key stops the routing chain. A blocking overlay swallows the event without
        handling it, so widgets, shortcuts and text fields below do not react. Passive overlays such as
        toasts consume nothing and let input pass through. While a blocking overlay is open, the screen
        also suppresses widget hover by rendering the widget tree with off-screen mouse coordinates.
      </P>
      <Callout kind="note">
        <P>
          Overlay classes and their dismissal rules are documented in{" "}
          <DocLink to="components/overlays">Overlays</DocLink>. Use a{" "}
          <DocLink to="components/dropdown">Dropdown</DocLink> instead of hand-building a popup for a
          simple select.
        </P>
      </Callout>

      <H2>A complete screen</H2>
      <CodeBlock
        title="SettingsScreen.java"
        code={`
import com.mojang.blaze3d.platform.InputConstants;
import com.quillui.action.QuillCommandSink;
import com.quillui.layout.QuillColumn;
import com.quillui.layout.QuillRect;
import com.quillui.screen.QuillScreen;
import com.quillui.theme.QuillSpacing;
import com.quillui.widget.QuillButton;
import com.quillui.widget.QuillToggle;
import net.minecraft.network.chat.Component;

public final class SettingsScreen extends QuillScreen {
    public SettingsScreen() {
        super(Component.literal("Settings"), 360, 220);
    }

    @Override
    protected void buildContent() {
        QuillRect content = contentBounds();
        QuillColumn column = new QuillColumn(
                content.x(), content.y(), content.width(), QuillSpacing.SPACE_2
        );

        QuillRect toggleSlot = column.next(20);
        addRenderableWidget(new QuillToggle(
                toggleSlot.x(), toggleSlot.y(), toggleSlot.width(), toggleSlot.height(),
                Component.literal("Sound effects"),
                true,
                value -> QuillCommandSink.get().execute("example set sound " + value)
        ));

        QuillRect actionSlot = column.next(20);
        addRenderableWidget(new QuillButton(
                actionSlot.x(), actionSlot.y(), 96, actionSlot.height(),
                Component.literal("Save"),
                QuillButton.Variant.PRIMARY,
                () -> QuillCommandSink.get().execute("example save")
        ));

        addRenderableWidget(closeButton(this::onClose));
        registerShortcut(InputConstants.KEY_R, () ->
                QuillCommandSink.get().execute("example reload"));
    }

    @Override
    protected Component subtitle() {
        return Component.literal("Changes are applied by the server.");
    }

    @Override
    protected Component footer() {
        return Component.literal("Quill UI example");
    }
}`}
      />
      <Callout kind="warning">
        <P>
          <C>QuillScreen</C> does not pause the game (<C>isPauseScreen()</C> returns false). Do not assume
          the world is frozen while your interface is open.
        </P>
      </Callout>
    </>
  );
}

function Drawing() {
  return (
    <>
      <P>
        <C>QuillRender</C> contains the static drawing primitives used by the screen and widgets. All
        geometry is in GUI pixels and one-pixel sharp, so it scales cleanly with Minecraft&apos;s GUI scale.
      </P>

      <H2>Primitives</H2>
      <DocTable
        head={["Method", "Draws"]}
        rows={[
          [<C key="p">panel(graphics, x, y, w, h[, theme])</C>, "Drop shadow at +4 px, panel fill and a 1 px border."],
          [<C key="b">border(graphics, x, y, w, h, color)</C>, "A 1 px rectangle outline in an explicit colour."],
          [<C key="l">line(graphics, x0, y0, x1, y1, color)</C>, "A 1 px line using Bresenham stepping."],
          [<C key="ci">circle(graphics, centerX, centerY, radius, color)</C>, "A filled pixel circle."],
          [<C key="x">text(graphics, font, text, x, y, color)</C>, "Text without the drop shadow; the default for Quill widgets."],
          [<C key="c">centeredText(graphics, font, text, centerX, y, color)</C>, "Horizontally centered, shadow-free text."],
          [<C key="g">gradient(graphics, x, y, w, h, gradient)</C>, "Two-colour vertical or horizontal gradient."],
          [<C key="d">divider(graphics, x, y, w[, theme])</C>, "A 1 px horizontal line using DIVIDER."],
          [<C key="h">header(graphics, x, y, w, h[, theme])</C>, "Header band using HEADER_BG plus a bottom divider."],
          [<C key="t">tabStrip(graphics, x, y, w, h[, theme])</C>, "Chip surface with a CHIP_BORDER outline."],
          [<C key="s">section(graphics, x, y, w, h[, theme])</C>, "Card surface, a top highlight and a SURFACE_BORDER outline."],
          [<C key="i">inset(graphics, x, y, w, h[, theme])</C>, "Low-contrast inner row using SURFACE_ALT."],
          [<C key="s2">QuillScrollHints.render(...)</C>, "Top/bottom fade and chevrons for hidden scroll content."],
        ]}
      />
      <P>
        Every overload without a theme uses <C>QuillThemeData.DEFAULT</C>. The screen shell passes its own
        theme, which is why a custom <C>QuillThemeData</C> applies to the panel and header. The text helpers
        deliberately disable Minecraft&apos;s drop shadow so custom palettes can meet contrast targets.
      </P>

      <H2>Scroll hints</H2>
      <P>
        <C>QuillScrollHints.render(graphics, viewport, moreAbove, moreBelow, theme)</C> paints a short
        gradient and a chevron at the top or bottom of a viewport. It draws nothing when both flags are
        false and uses <C>PANEL_BG</C> plus <C>TEXT_SOFT</C>, so it works in both light and dark palettes.
      </P>
      <CodeBlock
        code={`
QuillScrollHints.render(
        graphics,
        viewport,
        scrollOffset() > 0,
        scrollOffset() < maxScroll(),
        theme
);`}
      />

      <H2>Clip offsets</H2>
      <P>
        <C>QuillRenderContext</C> tracks the content-to-screen translation while a clipped host renders.
        <C>pushClipOffset(x, y)</C> and <C>popClipOffset()</C> form a nestable stack;{" "}
        <C>screenX(contentX)</C> and <C>screenY(contentY)</C> convert back to screen coordinates.{" "}
        <C>QuillClipView</C> drives this automatically. Use it only for custom clipped hosts or widgets
        that draw their own scissor or place screen-anchored UI.
      </P>
      <CodeBlock
        code={`
QuillRenderContext.pushClipOffset(0, scrollOffset);
try {
    // A widget inside the clip host needs the real screen position.
    int anchorX = QuillRenderContext.screenX(widget.getX());
    int anchorY = QuillRenderContext.screenY(widget.getY() + widget.getHeight());
    // Use anchorX/anchorY for a screen-level overlay.
}
finally {
    QuillRenderContext.popClipOffset();
}`}
      />
      <Callout kind="note">
        <P>
          <C>QuillDropdown</C> and widget tooltips already use the shared context, so they stay aligned
          inside a <DocLink to="components/scroll-view">scroll host</DocLink> without extra work.{" "}
          <C>QuillMap</C> keeps its nested scissor in content space; disable its internal scissor when an
          outer host clips it.
        </P>
      </Callout>

      <H2>Gradients</H2>
      <P>
        <C>QuillGradient</C> is a record of <C>startColor</C>, <C>endColor</C> and a{" "}
        <C>Direction</C> (<C>VERTICAL</C> or <C>HORIZONTAL</C>). Vertical gradients use Minecraft&apos;s
        fill gradient; horizontal gradients interpolate per column, including alpha.{" "}
        <C>colorAt(progress)</C> returns the interpolated ARGB at any point, and{" "}
        <C>QuillText.drawGradient</C> uses it for per-glyph gradient text.
      </P>
      <CodeBlock
        code={`
QuillGradient fade = QuillGradient.vertical(
        QuillThemeData.DEFAULT.color(QuillThemeData.ColorRole.PANEL_BG),
        QuillThemeData.DEFAULT.color(QuillThemeData.ColorRole.SURFACE_BORDER)
);

int middle = fade.colorAt(0.5F);
QuillRender.gradient(graphics, x, y, width, 64, fade);`}
      />
      <Callout kind="tip">
        <P>
          For wrapping, alignment and gradient text, use <DocLink to="fundamentals/text">Text and Styles</DocLink>.
        </P>
      </Callout>

      <H2>Drawing a section</H2>
      <CodeBlock
        code={`
@Override
public void extractRenderState(
        GuiGraphicsExtractor graphics, int mouseX, int mouseY, float delta
) {
    // A grouped section behind the widgets.
    QuillRender.section(graphics, x, y, width, 72);

    // A divider between two rows.
    QuillRender.divider(graphics, x + 8, y + 36, width - 16);

    // The widgets and header are drawn by the screen.
    super.extractRenderState(graphics, mouseX, mouseY, delta);
}`}
      />
      <Callout kind="tip">
        <P>
          Prefer <C>QuillCard</C> when you need a heading and a content rectangle. Use <C>QuillRender</C>{" "}
          directly only for regions the card does not model, such as a divider inside a form.
        </P>
      </Callout>
    </>
  );
}

function Text() {
  return (
    <>
      <P>
        <C>QuillText</C> adds layout and paint settings on top of Minecraft&apos;s bitmap font: colour,
        shadow, alignment, wrapping, line limits and a gradient path. Normal text preserves the styles
        of the source <C>Component</C>.
      </P>
      <Example
        preview={
          <div className="text-center">
            <span className="bg-gradient-to-r from-[#8cc8f0] via-[#c5e5fa] to-[#e0a93b] bg-clip-text text-3xl font-semibold text-transparent">
              Quill UI
            </span>
            <div className="mc-label-dim mt-2">Per-glyph gradient, one line</div>
          </div>
        }
      >
        <CodeBlock
          code={`
QuillTextStyle title = QuillTextStyle.of(theme, QuillThemeData.ColorRole.TITLE)
        .withShadow(false)
        .withAlign(QuillTextStyle.Align.CENTER)
        .withMaxWidth(width)
        .withMaxLines(2);

int height = QuillText.draw(graphics, font, text, x, y, title);`}
        />
      </Example>

      <H2>QuillTextStyle</H2>
      <DocTable
        head={["Field", "Meaning"]}
        rows={[
          [<C key="1">color</C>, "Fallback colour for normal text and the start hint for a gradient."],
          [<C key="2">gradient</C>, "Optional QuillGradient; when set, the gradient path is used."],
          [<C key="3">shadow</C>, "Vanilla drop shadow. Default false in QuillTextStyle.DEFAULT."],
          [<C key="4">align</C>, "LEFT, CENTER or RIGHT within maxWidth."],
          [<C key="5">maxWidth</C>, "Wrap/clip width. 0 means no wrapping."],
          [<C key="6">maxLines</C>, "Line limit. 0 means unlimited."],
          [<C key="7">ellipsis</C>, "Adds \"...\" when the gradient single-line text is clipped."],
        ]}
      />
      <P>
        Factories: <C>of(color)</C>, <C>of(theme, role)</C> and <C>gradient(gradient)</C>. Immutable
        helpers: <C>withColor</C>, <C>withGradient</C>, <C>withShadow</C>, <C>withAlign</C>,{" "}
        <C>withMaxWidth</C>, <C>withMaxLines</C> and <C>withEllipsis</C>.
      </P>

      <H2>Drawing</H2>
      <CodeBlock
        code={`
// Normal text with wrapping and alignment.
QuillText.draw(graphics, font, component, x, y, style);

// Shortcut for a single colour.
QuillText.draw(graphics, font, component, x, y, color);

// Horizontal, per-glyph gradient.
QuillGradient gradient = QuillGradient.horizontal(
        theme.color(QuillThemeData.ColorRole.ACCENT),
        theme.color(QuillThemeData.ColorRole.ACCENT_HOVER)
);
QuillText.drawGradient(graphics, font, component, x, y, gradient, style);`}
      />
      <P>
        <C>draw</C> returns the drawn height (lines × font line height, or one line for gradient text).
        Null or empty text returns 0; a null style falls back to <C>QuillTextStyle.DEFAULT</C>.
      </P>

      <H2>Gradient limitations</H2>
      <UL>
        <li>The gradient path is a single horizontal line, interpolated per glyph.</li>
        <li>It uses the resolved string, so component spans/styles are not preserved on that path.</li>
        <li>Multi-line and vertical gradient text are not approximated in this release.</li>
        <li>
          Ellipsis is applied to the clipped gradient line. Wrapped normal text is limited by{" "}
          <C>maxLines</C> but does not receive an ellipsis in this release.
        </li>
      </UL>
      <Callout kind="tip">
        <P>
          For solid colour and component styles, use <C>QuillRender.text</C> or the normal{" "}
          <C>QuillText.draw</C> path. Use <DocLink to="fundamentals/drawing">Drawing Helpers</DocLink> for
          rectangles and gradients, and <DocLink to="reference/colors">Colour reference</DocLink> for the
          roles.
        </P>
      </Callout>
    </>
  );
}

function Motion() {
  return (
    <>
      <P>
        The motion package is deliberately small: a frame-delta ticker, one time-based animation, easing
        curves and transition helpers. Widgets own their animation state; screens pass the frame delta.
      </P>
      <CodeBlock
        code={`
private final QuillTicker ticker = new QuillTicker();
private final QuillAnimation fade = new QuillAnimation(0.18F)
        .setCurve(QuillCurves.EASE_OUT)
        .play(0.0F, 1.0F);

@Override
public void extractRenderState(
        GuiGraphicsExtractor graphics, int mouseX, int mouseY, float delta
) {
    fade.update(ticker.tick());       // once per rendered frame
    float progress = fade.value();

    int color = QuillTransition.withOpacity(
            theme.color(QuillThemeData.ColorRole.ACCENT), progress
    );
    int offsetX = QuillTransition.slideX(progress, 24, true);
    // draw using color/offsetX...
}`}
      />

      <H2>QuillTicker</H2>
      <P>
        Converts wall-clock time between frames into a capped delta in seconds (maximum 0.1 s). Call{" "}
        <C>tick()</C> once per rendered frame; call <C>reset()</C> when the owning screen is reopened.
      </P>

      <H2>QuillAnimation</H2>
      <DocTable
        head={["Member", "Effect"]}
        rows={[
          [<C key="1">new QuillAnimation(durationSeconds)</C>, "Creates a stopped animation."],
          [<C key="2">play(from, to) / playTo(target)</C>, "Starts from an explicit value or the current value."],
          [<C key="3">update(deltaSeconds)</C>, "Advances the animation; non-running animations ignore it."],
          [<C key="4">value() / progress()</C>, "Eased value / linear progress in 0..1."],
          [<C key="5">stop() / jumpTo(value) / reset()</C>, "Stops, snaps, or rewinds to 0 without running."],
          [<C key="6">setDuration / setCurve / loop</C>, "Changes duration, easing or looping."],
          [<C key="7">running() / finished()</C>, "State checks."],
        ]}
      />
      <P>
        The default curve is <C>EASE_IN_OUT</C>. With looping enabled, elapsed time wraps at the duration;
        without it, the animation stops at the target. A zero duration finishes immediately at{" "}
        <C>to</C>.
      </P>

      <H2>Curves</H2>
      <UL>
        <li>
          <C>QuillCurves.LINEAR</C>, <C>EASE_IN</C>, <C>EASE_OUT</C>, <C>EASE_IN_OUT</C> and{" "}
          <C>SMOOTHSTEP</C>.
        </li>
        <li>
          <C>QuillCurves.steps(n)</C> quantises progress into <C>n</C> steps.
        </li>
        <li>
          <C>QuillCurve</C> is a functional interface: <C>transform(progress)</C>.
        </li>
      </UL>

      <H2>Transition helpers</H2>
      <DocTable
        head={["Helper", "Result"]}
        rows={[
          [<C key="1">opacity(progress) / fadeIn / fadeOut</C>, "Clamped opacity values."],
          [<C key="2">withOpacity(color, progress)</C>, "ARGB colour with animated alpha."],
          [<C key="3">slideX(progress, distance, fromRight)</C>, "Horizontal offset for a slide-in."],
          [<C key="4">slideY(progress, distance, fromBottom)</C>, "Vertical offset for a slide-in."],
          [<C key="5">scale(progress, from, to)</C>, "Interpolated scale value."],
        ]}
      />
      <P>
        Pass a value already eased by <C>QuillAnimation</C>; the helpers only clamp and interpolate.
      </P>

      <H2>Reduced motion</H2>
      <P>
        Minecraft does not expose a portable reduced-motion flag, so Quill has an explicit global switch.
        Bind it to your accessibility/config screen:
      </P>
      <CodeBlock
        code={`
QuillMotion.setReducedMotion(true);

float duration = QuillMotion.duration(0.18F);          // 0
float shortForm = QuillMotion.duration(0.18F, 0.05F);  // 0.05

boolean reduced = QuillMotion.reducedMotion();`}
      />
      <P>
        <C>QuillAnimation</C> uses this switch: when reduced motion is on, its effective duration is zero
        and the value jumps to the target. <C>QuillButton</C> and <C>QuillToggle</C> use the motion system
        for their hover and knob animations, so they also become instant.
      </P>
      <Callout kind="note">
        <P>
          This is not a full animation controller: there is no vsync, page/hero transition, physics
          simulation or implicit widget animation API. Use <C>QuillTicker</C> + <C>QuillAnimation</C> in
          the render pass and keep state in the owning screen or widget.
        </P>
      </Callout>
    </>
  );
}

export const fundamentals: DocPage[] = [
  {
    slug: "core-concepts",
    title: "Core Concepts",
    description: "The vocabulary, package model and screen lifecycle.",
    component: CoreConcepts,
  },
  {
    slug: "theme",
    title: "Theme and Tokens",
    description: "Colour roles, spacing, typography, radii and elevation.",
    component: Theme,
  },
  {
    slug: "layout",
    title: "Layout Primitives",
    description: "Rectangles, insets, flex, wrap, stack, breakpoints and screen regions.",
    component: Layout,
  },
  ...layoutEngine,
  {
    slug: "text",
    title: "Text and Styles",
    description: "QuillText, wrapping, alignment and gradient text.",
    component: Text,
  },
  {
    slug: "motion",
    title: "Motion",
    description: "Tickers, animations, curves, transitions and reduced motion.",
    component: Motion,
  },
  {
    slug: "screen",
    title: "Screens",
    description: "The QuillScreen shell, header, footer and close button.",
    component: Screen,
  },
  {
    slug: "drawing",
    title: "Drawing Helpers",
    description: "QuillRender primitives for panels, text, sections and gradients.",
    component: Drawing,
  },
];
