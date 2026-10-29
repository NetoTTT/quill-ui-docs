import { C, Callout, CodeBlock, DocLink, DocTable, H2, H3, OL, P, UL } from "@/components/prose";
import { roadmap } from "./roadmap";
import type { DocPage } from "../types";

function Overview() {
  return (
    <>
      <P>
        Quill UI is a small, opinionated <strong>client-side UI framework for Fabric</strong> on Minecraft{" "}
        <C>26.3</C> and Java <C>25</C>. It provides the visual and layout foundation for mod screens:
        theme tokens, responsive layout, panels and headers, cards, tabs, buttons, overlays, scrollable
        views and a backend action boundary.
      </P>
      <P>
        It is deliberately independent from gameplay code. A screen reads a state snapshot and emits actions
        through an <DocLink to="guides/backend-actions">action sink</DocLink>; Quill UI never mutates server
        state itself.
      </P>

      <Callout kind="tip" title="New in 0.2.0-alpha.8">
        <P>
          Focus traversal in <C>QuillClipView</C>: Tab and Shift+Tab cycle visible controls, the host focuses
          its first child when it gains focus, and the focused control scrolls into view. The map now fills
          its viewport at the initial zoom and keeps nested scissors in content space. See{" "}
          <DocLink to="components/scroll-view">Scroll Views</DocLink> and{" "}
          <DocLink to="components/map">Map</DocLink>.
        </P>
      </Callout>
      <Callout kind="warning" title="Next: 0.3.0-alpha.1 is a breaking base">
        <P>
          The next line reworks the public API before LaborCraft migration: theme factories, component
          themes, typed actions, a measured text node, API-level 3 and a split of map/HUD from the core.
          Read <DocLink to="introduction/roadmap">Roadmap and 0.3.0</DocLink> before building new
          integrations.
        </P>
      </Callout>

      <H2>What is in the box</H2>
      <DocTable
        head={["Area", "Entry points", "Package"]}
        rows={[
          ["Theme", "QuillThemeData, QuillTheme, QuillContrast, QuillSpacing, QuillTypography, QuillRadii, QuillElevation", <C key="t">com.quillui.theme</C>],
          ["Colours", "QuillColors", <C key="c">com.quillui.theme</C>],
          ["Layout", "QuillRect, QuillInsets, QuillConstraints, QuillAlign, QuillStack, QuillFlex, QuillWrap, QuillBreakpoints, QuillColumn, QuillRow, QuillGrid", <C key="l">com.quillui.layout</C>],
          ["Layout engine", "QuillBoxConstraints, QuillLayoutNode, QuillNode, QuillSize, QuillSizedBox, QuillPaddingBox, QuillMarginBox, QuillConstrainedBox, QuillFlexBox, QuillWrapBox, QuillStackBox, QuillScrollBox, QuillCrossAxisAlignment, QuillLayoutValidator", <C key="le">com.quillui.layout</C>],
          ["Drawing", "QuillRender, QuillGradient, QuillTooltips, QuillScrollHints, QuillRenderContext", <C key="r">com.quillui.render</C>],
          ["Text", "QuillText, QuillTextStyle", <C key="tx">com.quillui.text</C>],
          ["Motion", "QuillTicker, QuillAnimation, QuillCurve, QuillCurves, QuillTransition, QuillMotion", <C key="mo">com.quillui.motion</C>],
          ["Widgets", "QuillButton, QuillCard, QuillPanel, QuillScrollList, QuillScrollView (deprecated), QuillScrollBar, QuillClipView, QuillWidgetBox, QuillTabBar, QuillToggle, QuillTextField, QuillSlider, QuillCheckbox, QuillRadio, QuillRadioGroup, QuillDropdown", <C key="w">com.quillui.widget</C>],
          ["Input styles", "QuillSelectionStyle, QuillSelectionStyles", <C key="in">com.quillui.input</C>],
          ["Overlays", "QuillOverlay, QuillPopupMenu, QuillModal, QuillToast", <C key="o">com.quillui.overlay</C>],
          ["Map", "QuillMap, QuillMapZone, QuillMapMarker", <C key="m">com.quillui.map</C>],
          ["HUD", "QuillTargetIndicator, QuillTargetIndicatorHud", <C key="h">com.quillui.hud</C>],
          ["i18n", "QuillLanguage", <C key="i18n">com.quillui.i18n</C>],
          ["Screen", "QuillScreen, QuillScreenLayout, QuillShortcut", <C key="s">com.quillui.screen</C>],
          ["Backend boundary", "QuillActionSink, QuillCommandSink", <C key="a">com.quillui.action</C>],
          ["Compatibility", "QuillApi", <C key="q">com.quillui.api</C>],
        ]}
      />

      <H2>Design rules</H2>
      <UL>
        <li>Use <C>QuillThemeData</C> / token groups instead of literal colours, spacing and radii.</li>
        <li>Derive positions with layout primitives and screen regions; do not repeat magic x/y values.</li>
        <li>Prefer <C>contentBounds()</C> and breakpoints so screens can shrink with the window.</li>
        <li>A screen renders state; every action goes through an <C>QuillActionSink</C>.</li>
        <li>Keep cards and action rows on the same 4 px grid.</li>
      </UL>

      <H2>Status</H2>
      <P>
        The current release is <C>0.2.0-alpha.8</C> with binary API level <C>2</C>. The API is intentionally
        small and may evolve before <C>1.0.0</C>. See <DocLink to="reference/api">API reference</DocLink> and{" "}
        <DocLink to="reference/compatibility">Compatibility</DocLink>.
      </P>

      <H2>Where to go next</H2>
      <OL>
        <li>
          <DocLink to="introduction/installation">Installation</DocLink>: requirements and adding the jar to a
          mod project.
        </li>
        <li>
          <DocLink to="introduction/quick-start">Quick Start</DocLink>: a first screen in a few lines.
        </li>
        <li>
          <DocLink to="guides/first-interface">Creating Your First Interface</DocLink>: a complete,
          copy-pasteable example.
        </li>
      </OL>
    </>
  );
}

function Installation() {
  return (
    <>
      <P>
        Quill UI is a <strong>separate client mod</strong>. Add its jar next to Fabric API in <C>mods/</C> and
        declare it as a dependency from the mods that compile against it. Dedicated servers do not need the
        jar, but client screens that use it do.
      </P>

      <H2>Requirements</H2>
      <DocTable
        head={["Component", "Version"]}
        rows={[
          ["Minecraft", "26.3"],
          ["Fabric Loader", "0.19.5 or newer"],
          ["Fabric API", "0.164.0+26.3"],
          ["Java", "25"],
        ]}
      />

      <H2>Build the jar</H2>
      <CodeBlock lang="bash" status="none" code={`gradlew.bat build --console=plain --no-daemon`} />
      <P>
        The jar is written to <C>build/libs/quill-ui-0.2.0-alpha.8.jar</C>. Put it in the instance&apos;s{" "}
        <C>mods/</C> folder.
      </P>

      <H2>Add the dependency</H2>
      <P>
        There is no Maven or Modrinth publication yet. During development, copy the jar into your project&apos;s{" "}
        <C>libs/</C> folder and declare a file dependency:
      </P>
      <CodeBlock
        lang="groovy"
        title="build.gradle"
        code={`
dependencies {
    implementation files("libs/quill-ui-0.2.0-alpha.8.jar")
}`}
      />

      <H3>Declare the dependency in your mod metadata</H3>
      <P>
        Quill UI declares <C>environment: "client"</C> and a hard dependency on Fabric API, so it is only
        loaded on the client. Your own screens must live in client-only code as well; see{" "}
        <DocLink to="fundamentals/screen">Screens</DocLink>.
      </P>

      <H2>Verify the setup</H2>
      <P>
        After refreshing Gradle, build your mod once. If the dependency cannot be resolved, check the file
        path and refresh the project. The packaged mod can report its version at runtime:
      </P>
      <CodeBlock
        code={`
String version = QuillApi.version(); // "0.2.0-alpha.8" in a Fabric runtime
boolean level1 = QuillApi.supports(1);`}
      />
    </>
  );
}

function QuickStart() {
  return (
    <>
      <P>
        This is the smallest useful Quill UI screen: a titled panel, one column of content and a themed
        button that sends a command. The code compiles against the real API.
      </P>

      <H2>1. Extend QuillScreen</H2>
      <P>
        <C>QuillScreen</C> owns the panel, a 48 px header and an optional close button. Override{" "}
        <C>buildContent()</C> and register widgets with <C>addRenderableWidget</C>.
      </P>
      <CodeBlock
        title="ExampleScreen.java"
        code={`
import com.quillui.action.QuillCommandSink;
import com.quillui.layout.QuillColumn;
import com.quillui.layout.QuillRect;
import com.quillui.screen.QuillScreen;
import com.quillui.theme.QuillSpacing;
import com.quillui.widget.QuillButton;
import net.minecraft.network.chat.Component;

public final class ExampleScreen extends QuillScreen {
    public ExampleScreen() {
        super(Component.literal("Example"), 420, 240);
    }

    @Override
    protected void buildContent() {
        QuillRect content = contentBounds();
        QuillColumn column = new QuillColumn(
                content.x(), content.y(), content.width(), QuillSpacing.SPACE_2
        );

        QuillRect slot = column.next(24);
        addRenderableWidget(new QuillButton(
                slot.x(), slot.y(), slot.width(), slot.height(),
                Component.literal("Run action"),
                QuillButton.Variant.PRIMARY,
                () -> QuillCommandSink.get().execute("example run")
        ));

        addRenderableWidget(closeButton(this::onClose));
    }

    @Override
    protected Component subtitle() {
        return Component.literal("A Quill UI screen.");
    }
}`}
      />

      <H2>2. Open it</H2>
      <P>
        Screens are client-only. Open yours from a client entry point such as a key binding handler:
      </P>
      <CodeBlock
        title="ClientEvents.java"
        code={`
Minecraft.getInstance().setScreen(new ExampleScreen());`}
      />
      <Callout kind="note">
        <P>
          <C>buildContent()</C> runs from <C>init()</C>, so you can safely use <C>panelX</C>,{" "}
          <C>panelY</C>, <C>contentTop()</C>, <C>contentBounds()</C>, <C>panelWidth()</C> and{" "}
          <C>panelHeight()</C> there. The panel size is a preference: it is clamped to the window minus{" "}
          <C>screenMargin()</C> and recalculated whenever the window or GUI scale changes.
        </P>
      </Callout>

      <H2>3. Next steps</H2>
      <UL>
        <li>
          Read <DocLink to="fundamentals/core-concepts">Core Concepts</DocLink> for the package model.
        </li>
        <li>
          Build a full screen in <DocLink to="guides/first-interface">Creating Your First Interface</DocLink>.
        </li>
        <li>
          Send real actions in <DocLink to="guides/backend-actions">Backend actions</DocLink>.
        </li>
      </UL>
    </>
  );
}

export const introduction: DocPage[] = [
  {
    slug: "overview",
    title: "Overview",
    description: "What Quill UI is, and how the framework is organised.",
    component: Overview,
  },
  ...roadmap,
  {
    slug: "installation",
    title: "Installation",
    description: "Requirements and adding Quill UI to a Fabric mod project.",
    component: Installation,
  },
  {
    slug: "quick-start",
    title: "Quick Start",
    description: "Build and open your first Quill UI screen.",
    component: QuickStart,
  },
];
