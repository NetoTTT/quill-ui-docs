import { C, Callout, CodeBlock, DocLink, DocTable, Example, H2, H3, OL, P, UL } from "@/components/prose";
import { McCard, McButton, McMap, McToggle } from "@/components/mc";
import type { DocPage } from "../types";

function FirstInterface() {
  return (
    <>
      <P>
        This guide builds a complete settings screen with a card, a toggle and two actions. Every class and
        method used here exists in the current release.
      </P>
      <Example
        preview={
          <McCard title="Profile" className="w-full max-w-xs">
            <div className="space-y-3">
              <McToggle label="Show online status" on />
              <div className="flex gap-2">
                <McButton primary className="flex-1">Save</McButton>
                <McButton className="flex-1">Cancel</McButton>
              </div>
            </div>
          </McCard>
        }
      >
        <CodeBlock
          title="ProfileScreen.java"
          code={`
import com.quillui.action.QuillCommandSink;
import com.quillui.layout.QuillColumn;
import com.quillui.layout.QuillRect;
import com.quillui.layout.QuillRow;
import com.quillui.screen.QuillScreen;
import com.quillui.theme.QuillSpacing;
import com.quillui.widget.*;
import net.minecraft.client.gui.GuiGraphicsExtractor;
import net.minecraft.network.chat.Component;

public final class ProfileScreen extends QuillScreen {
    private QuillCard card;

    public ProfileScreen() {
        super(Component.literal("Profile"), 360, 240);
    }

    @Override
    protected void buildContent() {
        int x = panelX + contentInset();
        int width = panelWidth() - contentInset() * 2;
        card = new QuillCard(x, contentTop(), width, 120, Component.literal("Profile"));

        QuillRect body = card.content();
        QuillColumn column = new QuillColumn(
                body.x(), body.y(), body.width(), QuillSpacing.SPACE_2
        );

        QuillRect toggleSlot = column.next(18);
        addRenderableWidget(new QuillToggle(
                toggleSlot.x(), toggleSlot.y(), toggleSlot.width(), toggleSlot.height(),
                Component.literal("Show online status"),
                true,
                value -> QuillCommandSink.get().execute("profile online " + value)
        ));

        QuillRect actionSlot = column.next(20);
        QuillRow row = new QuillRow(
                actionSlot.x(), actionSlot.y(), actionSlot.height(), QuillSpacing.SPACE_2
        );

        QuillRect saveSlot = row.next(96);
        addRenderableWidget(new QuillButton(
                saveSlot.x(), saveSlot.y(), saveSlot.width(), saveSlot.height(),
                Component.literal("Save"),
                QuillButton.Variant.PRIMARY,
                () -> {
                    QuillCommandSink.get().execute("profile save");
                    onClose();
                }
        ));

        QuillRect cancelSlot = row.next(96);
        addRenderableWidget(new QuillButton(
                cancelSlot.x(), cancelSlot.y(), cancelSlot.width(), cancelSlot.height(),
                Component.literal("Cancel"),
                QuillButton.Variant.SECONDARY,
                this::onClose
        ));

        addRenderableWidget(closeButton(this::onClose));
    }

    @Override
    public void extractRenderState(
            GuiGraphicsExtractor graphics, int mouseX, int mouseY, float delta
    ) {
        card.render(graphics, font);
        super.extractRenderState(graphics, mouseX, mouseY, delta);
    }

    @Override
    protected Component subtitle() {
        return Component.literal("Changes are sent to the server.");
    }
}`}
        />
      </Example>

      <H2>What each part does</H2>
      <OL>
        <li>
          <strong>The constructor</strong> sets the window title and a preferred 360x240 panel; the panel shrinks to fit smaller windows without cutting off the shell.
        </li>
        <li>
          <strong>buildContent()</strong> derives <C>x</C> / <C>width</C> from the panel, so the content
          follows window and GUI-scale changes.
        </li>
        <li>
          <strong>The card</strong> reserves a heading and returns <C>content()</C>, the interior rectangle
          for the controls.
        </li>
        <li>
          <strong>The column</strong> stacks the toggle and the action row with one consistent gap.
        </li>
        <li>
          <strong>The row</strong> splits the action area into two equal-width buttons.
        </li>
        <li>
          <strong>closeButton(...)</strong> is added explicitly, so the screen has a themed close control.
        </li>
      </OL>
      <Callout kind="tip">
        <P>
          <C>card</C> is created in <C>buildContent()</C>, not in the constructor, because it needs{" "}
          <C>panelX</C> / <C>panelY</C>. Guard the render method if your screen can be shown before content
          is built.
        </P>
      </Callout>
      <Callout kind="note">
        <P>
          <C>QuillPanel</C> packages this card + column + row pattern into one helper. See{" "}
          <DocLink to="components/panels">Panels</DocLink> for the shorter version.
        </P>
      </Callout>
    </>
  );
}

function MapIntegration() {
  return (
    <>
      <P>
        <C>QuillMap</C> is a widget, so a map screen is just a normal <C>QuillScreen</C> with a map
        registered in <C>buildContent()</C>. This guide wires zones, markers, an entity provider and a
        selection commit.
      </P>
      <Callout kind="note" title="Extras dependency">
        <P>
          <C>QuillMap</C> ships in <C>quill-ui-extras</C>. Add the extras jar or Maven dependency to the
          client mod; core alone does not contain the map.
        </P>
      </Callout>
      <Example preview={<McMap className="w-full max-w-md" />}>
        <CodeBlock
          title="MapScreen.java"
          code={`
import com.quillui.action.QuillCommandSink;
import com.quillui.map.QuillMap;
import com.quillui.map.QuillMapMarker;
import com.quillui.map.QuillMapZone;
import com.quillui.layout.QuillRect;
import com.quillui.screen.QuillScreen;
import com.quillui.theme.QuillColors;
import com.quillui.theme.QuillThemeData;
import java.util.List;
import net.minecraft.client.Minecraft;
import net.minecraft.client.player.LocalPlayer;
import net.minecraft.core.BlockPos;
import net.minecraft.network.chat.Component;
import net.minecraft.world.entity.player.Player;

public final class MapScreen extends QuillScreen {
    private static final QuillThemeData THEME = QuillThemeData.DEFAULT;
    private QuillMap map;

    public MapScreen() {
        super(Component.literal("Map"), 420, 320, THEME);
    }

    @Override
    protected void buildContent() {
        QuillRect content = contentBounds();

        LocalPlayer player = Minecraft.getInstance().player;
        BlockPos center = player != null ? player.blockPosition() : BlockPos.ZERO;

        map = new QuillMap(
                content.x(), content.y(), content.width(),
                Math.min(220, content.height()),
                center, 64, 32, THEME
        );

        int success = THEME.color(QuillThemeData.ColorRole.SUCCESS);
        map.setZones(List.of(new QuillMapZone(
                new BlockPos(-16, 64, -16),
                new BlockPos(32, 64, 32),
                QuillColors.withAlpha(success, 0.2F),
                success,
                true
        )));

        map.setMarkers(List.of(new QuillMapMarker(
                center,
                Component.literal("You"),
                THEME.color(QuillThemeData.ColorRole.ACCENT)
        )));

        map.setEntityProvider(
                entity -> entity instanceof Player && entity != player,
                entity -> new QuillMapMarker(
                        entity.blockPosition(),
                        entity.getName(),
                        THEME.color(QuillThemeData.ColorRole.INFO)
                )
        );
        map.setEntityYRange(8, 8);

        map.setSelectionCommitListener(m -> {
            if (!m.hasSelection()) {
                return;
            }
            int minX = Math.min(m.from().getX(), m.to().getX());
            int minZ = Math.min(m.from().getZ(), m.to().getZ());
            QuillCommandSink.get().execute(
                    "example claim " + minX + " " + minZ + " "
                            + m.selectionWidth() + " " + m.selectionDepth()
            );
        });

        addRenderableWidget(map);
        addRenderableWidget(closeButton(this::onClose));
    }

    @Override
    public void removed() {
        if (map != null) {
            map.close();
        }
        super.removed();
    }

    @Override
    protected Component subtitle() {
        return Component.literal("Right or middle drag to pan. Scroll to zoom.");
    }
}`}
        />
      </Example>

      <H2>How the pieces fit</H2>
      <OL>
        <li>
          <strong>The map</strong> is centered on the player and registered like any other widget.
        </li>
        <li>
          <strong>Zones</strong> are world rectangles; the dashed flag controls the border style.
        </li>
        <li>
          <strong>Markers</strong> are static points with a label and a themed or custom colour.
        </li>
        <li>
          <strong>Entity providers</strong> are evaluated each render, so moving entities update without
          rebuilding the map. The Y range is relative to the local player.
        </li>
        <li>
          <strong>The commit listener</strong> runs once when a selection drag ends. It is the right place
          to send a command or payload.
        </li>
      </OL>

      <H2>Interaction defaults</H2>
      <P>
        <C>MouseBindings.DEFAULT</C> selects with the left button and pans with the right and middle
        buttons. The wheel zooms from 1× to 4×. Non-left drags reach the map because <C>QuillScreen</C>{" "}
        forwards them to the focused widget. See <DocLink to="components/map">Map</DocLink> for the full
        interaction and lifecycle reference.
      </P>

      <H2>Keep state server-authoritative</H2>
      <P>
        The map reads the client level and never writes gameplay state. Send the selection or marker
        action through an <C>QuillActionSink</C> (or a typed C2S payload), validate it on the server, and
        return an updated snapshot. Do not treat a client selection as a completed claim.
      </P>
      <Callout kind="note">
        <P>
          Close the map in <C>removed()</C>. It owns a dynamic texture; without <C>close()</C> the texture
          stays registered after the screen is gone.
        </P>
      </Callout>
    </>
  );
}

function Theming() {
  return (
    <>
      <P>
        A theme is an immutable <C>QuillThemeData</C> palette plus <C>QuillThemeMetrics</C>. Derive one from
        the default; no global palette is mutated. Screens scope their theme while building content, and
        widgets can still take an explicit theme.
      </P>

      <H2>A light palette</H2>
      <CodeBlock
        code={`
import com.quillui.theme.QuillColors;
import com.quillui.theme.QuillThemeData;
import com.quillui.theme.QuillThemeData.ColorRole;

QuillThemeData light = QuillThemeData.builder()
        .set(ColorRole.SCREEN_BG,            QuillColors.fromHex("#66000000")) // optional dim backdrop
        .set(ColorRole.PANEL_BG,             QuillColors.fromHex("#F5FAFF"))
        .set(ColorRole.PANEL_BORDER,         QuillColors.fromHex("#BBD9EE"))
        .set(ColorRole.HEADER_BG,            QuillColors.fromHex("#EAF6FF"))
        .set(ColorRole.DIVIDER,              QuillColors.fromHex("#BBD9EE"))
        .set(ColorRole.TITLE,                QuillColors.fromHex("#253746"))
        .set(ColorRole.TEXT,                 QuillColors.fromHex("#253746"))
        .set(ColorRole.TEXT_SOFT,            QuillColors.fromHex("#4B657A"))
        .set(ColorRole.MUTED,                QuillColors.fromHex("#64788A"))
        .set(ColorRole.MUTED_DARK,           QuillColors.fromHex("#7A8C9C"))
        .set(ColorRole.ACCENT,               QuillColors.fromHex("#23699A"))
        .set(ColorRole.ACCENT_HOVER,         QuillColors.fromHex("#3B95D0"))
        .set(ColorRole.PRIMARY_BG,           QuillColors.fromHex("#23699A"))
        .set(ColorRole.PRIMARY_BG_HOVER,     QuillColors.fromHex("#3B95D0"))
        .set(ColorRole.ON_ACCENT,            QuillColors.fromHex("#FFFFFF"))
        .set(ColorRole.DANGER_BG,            QuillColors.fromHex("#FDECEC"))
        .set(ColorRole.ON_DANGER,            QuillColors.fromHex("#9C3F3F"))
        .set(ColorRole.GHOST_BG,             QuillColors.fromHex("#00000000"))
        .set(ColorRole.GHOST_BORDER,         QuillColors.fromHex("#00000000"))
        .set(ColorRole.GHOST_TEXT,           QuillColors.fromHex("#4B657A"))
        .set(ColorRole.FOCUS_RING,           QuillColors.fromHex("#23699A"))
        .set(ColorRole.BUTTON_BG,            QuillColors.fromHex("#EAF6FF"))
        .set(ColorRole.BUTTON_HOVER,         QuillColors.fromHex("#D6ECFA"))
        .set(ColorRole.BUTTON_BORDER,        QuillColors.fromHex("#8CC8F0"))
        .set(ColorRole.BUTTON_DISABLED,      QuillColors.fromHex("#EAF6FF"))
        .set(ColorRole.BUTTON_DISABLED_BORDER, QuillColors.fromHex("#C5E5FA"))
        .set(ColorRole.BUTTON_DISABLED_TEXT, QuillColors.fromHex("#8FA3B4"))
        .set(ColorRole.SURFACE,              QuillColors.fromHex("#F0FFFFFF"))
        .set(ColorRole.SURFACE_ALT,          QuillColors.fromHex("#66EAF6FF"))
        .set(ColorRole.SURFACE_BORDER,       QuillColors.fromHex("#BBD9EE"))
        .set(ColorRole.SURFACE_HEADER,       QuillColors.fromHex("#EAF6FF"))
        .set(ColorRole.CHIP_BG,              QuillColors.fromHex("#EAF6FF"))
        .set(ColorRole.CHIP_BORDER,          QuillColors.fromHex("#8CC8F0"))
        .build();`}
      />

      <H2>Scope and metrics</H2>
      <P>
        <C>QuillScreen</C> runs <C>buildContent()</C> inside <C>QuillThemeScope</C>, so widgets created
        there inherit the screen theme. Factories also read <C>QuillThemeMetrics</C> for standard control
        sizes. Use an explicit theme when a component needs a different palette.
      </P>
      <CodeBlock
        code={`
QuillThemeMetrics compact = new QuillThemeMetrics(
        18, 180, 260, 100, 6, 16, 6
);
QuillThemeData light = light.withMetrics(compact);

// In buildContent(), widgets inherit the screen theme:
add(QuillButton.primary("Save", this::save), column.next(20));
add(QuillTextField.of(font, hint), column.next(20));`}
      />

      <H2>Apply it</H2>
      <P>
        Widgets take the theme as their last constructor argument. <C>QuillCard</C> and{" "}
        <C>QuillPanel</C> take it after the title; <C>QuillPanel</C> also accepts a custom gap.
      </P>
      <CodeBlock
        code={`
QuillCard card = new QuillCard(
        x, y, width, 96,
        Component.literal("Status"),
        light
);

QuillButton save = new QuillButton(
        x, y, 120, 20,
        Component.literal("Save"),
        QuillButton.Variant.PRIMARY,
        this::save,
        light
);

QuillToggle toggle = new QuillToggle(
        x, y, 180, 20,
        Component.literal("Enabled"),
        true,
        this::setEnabled,
        light
);`}
      />

      <H2>Contrast checks</H2>
      <P>
        Ask the palette for warnings after building it. The built-in checks cover the text/surface pairs
        used by Quill widgets, including the new semantic roles.
      </P>
      <CodeBlock
        code={`
for (String warning : light.contrastWarnings()) {
    LOGGER.warn("Quill theme: {}", warning);
}`}
      />
      <P>Use <C>QuillContrast</C> directly for custom pairs:</P>
      <CodeBlock
        code={`
boolean readable = QuillContrast.meetsText(
        light.color(ColorRole.TEXT),
        light.color(ColorRole.SURFACE)
);

String label = QuillContrast.describe(
        light.color(ColorRole.TEXT),
        light.color(ColorRole.PANEL_BG)
); // e.g. "12.34:1"`}
      />

      <H2>The screen shell</H2>
      <P>
        <C>QuillScreen</C> has a constructor overload that takes the same palette. Pass it and the panel,
        header, footer and close button use your theme too.
      </P>
      <CodeBlock
        code={`
public ProfileScreen() {
    super(Component.literal("Profile"), 360, 240, light);
}`}
      />
      <P>
        The three-argument constructor uses <C>QuillThemeData.DEFAULT</C> for the shell.
      </P>

      <H2>Choosing roles</H2>
      <UL>
        <li>
          Keep <C>ACCENT</C> and <C>ACCENT_HOVER</C> close enough that hover is visible but not jarring.
        </li>
        <li>
          Set <C>ON_ACCENT</C> together with <C>PRIMARY_BG</C>, and <C>ON_DANGER</C> together with{" "}
          <C>DANGER_BG</C>. Those pairs carry button text.
        </li>
        <li>
          <C>GHOST_TEXT</C> must stay readable on <C>PANEL_BG</C>, and <C>FOCUS_RING</C> must be visible on
          every surface.
        </li>
        <li>
          <C>SCREEN_BG</C> is transparent by default; a translucent value dims the world behind the panel.
        </li>
        <li>
          <C>DANGER</C>, <C>SUCCESS</C> and <C>INFO</C> are semantic; do not reuse them as decoration.
        </li>
        <li>
          The full role list is in <DocLink to="reference/colors">Colour reference</DocLink>.
        </li>
      </UL>
      <H3>Per-widget overrides</H3>
      <P>
        Passing a different theme to one widget works, but too many overrides break visual consistency.
        Prefer one palette per screen.
      </P>
    </>
  );
}

function Internationalization() {
  return (
    <>
      <P>
        Quill UI does not define a second translation system. It uses Minecraft&apos;s language files and{" "}
        <C>Component.translatable</C>, so a language change applies consistently to Quill and to the host
        mod. <C>QuillLanguage</C> is only a thin bridge for listing and switching the active language.
      </P>

      <H2>Language files</H2>
      <CodeBlock
        lang="text"
        status="none"
        title="resources"
        code={`
src/main/resources/assets/<modid>/lang/en_us.json
src/main/resources/assets/<modid>/lang/pt_br.json`}
      />
      <CodeBlock
        lang="json"
        status="none"
        title="en_us.json"
        code={`
{
  "mymod.config.title": "Configuration",
  "mymod.config.language": "Language",
  "mymod.config.save": "Save"
}`}
      />
      <CodeBlock
        code={`
QuillButton save = new QuillButton(
        x, y, width, 20,
        Component.translatable("mymod.config.save"),
        QuillButton.Variant.PRIMARY,
        action
);`}
      />
      <P>
        Keep the <C>Component</C> instead of calling <C>getString()</C>; the text resolves against the
        current language when it is rendered. Avoid <C>Component.literal</C> for user-facing text.
      </P>

      <H2>QuillLanguage</H2>
      <DocTable
        head={["Member", "Effect"]}
        rows={[
          [<C key="1">text(key, args...)</C>, "Shortcut for Component.translatable(key, args)."],
          [<C key="2">selectedCode()</C>, "Current locale code, for example en_us."],
          [<C key="3">selected()</C>, "LanguageOption for the current language, or null."],
          [<C key="4">available()</C>, "All languages provided by the client as LanguageOption records."],
          [<C key="5">setSelected(code)</C>, "Changes language, saves the option and reloads resources."],
          [<C key="6">setSelected(code, Supplier&lt;Screen&gt;)</C>, "Same, then rebuilds the supplied screen after the reload."],
        ]}
      />
      <P>
        <C>LanguageOption</C> exposes <C>code</C>, <C>name</C> (Component) and <C>bidirectional</C>.
        <C>setSelected</C> returns false for an unknown or null code.
      </P>
      <CodeBlock
        code={`
QuillLanguage.LanguageOption current = QuillLanguage.selected();
List<QuillLanguage.LanguageOption> languages = QuillLanguage.available();

QuillLanguage.setSelected("pt_br");`}
      />

      <H2>Rebuild after reload</H2>
      <P>
        Language switching reloads resources. Screens built only from translatable components can stay
        open. If a screen prebuilds literal labels or cached strings, reopen it after the reload:
      </P>
      <CodeBlock
        code={`
QuillLanguage.setSelected("pt_br", MyConfigScreen::new);`}
      />
      <P>
        The two-argument overload sets the language, saves the option and calls the supplier on the client
        thread after <C>reloadResourcePacks()</C> finishes.
      </P>

      <H2>Config-screen pattern</H2>
      <CodeBlock
        code={`
List<QuillLanguage.LanguageOption> languages = QuillLanguage.available();
QuillLanguage.LanguageOption current = QuillLanguage.selected();

QuillButton language = new QuillButton(
        x, y, width, 20,
        Component.translatable("mymod.config.language")
                .append(Component.literal(": " + current.name().getString())),
        QuillButton.Variant.SECONDARY,
        () -> {
            int index = languages.indexOf(current);
            QuillLanguage.LanguageOption next =
                    languages.get((index + 1) % languages.size());
            QuillLanguage.setSelected(next.code(), MyConfigScreen::new);
        }
);`}
      />

      <H2>Rules</H2>
      <UL>
        <li>Use <C>Component.translatable</C> for visible UI strings.</li>
        <li>Namespace keys by mod, for example <C>mymod.config.title</C>.</li>
        <li>Provide at least <C>en_us.json</C>; missing keys fall back to the key.</li>
        <li>Language changes are global, not per screen or per mod.</li>
        <li>Do not translate internal IDs, command names or network values.</li>
      </UL>
    </>
  );
}

function BackendActions() {
  return (
    <>
      <P>
        Quill UI never mutates game state. A screen renders a state snapshot and emits actions through the{" "}
        <C>QuillActionSink</C> boundary.
      </P>

      <H2>Command-first</H2>
      <P>
        <C>QuillCommandSink</C> is the zero-dependency implementation. It sends a slash command as the local
        player through the vanilla client command path, and does nothing when there is no player or the
        action is blank.
      </P>
      <CodeBlock
        code={`
QuillCommandSink.get().execute("example config set page 2");`}
      />
      <P>
        This is simple, auditable and works with server-side commands. Use it when the server already owns
        the command surface.
      </P>

      <H2>Typed actions</H2>
      <P>
        For forms and frequent toggles, implement <C>QuillActionSink&lt;A&gt;</C> with a project-specific C2S
        payload. The widgets do not change.
      </P>
      <CodeBlock
        code={`
public enum ConfigAction {
    SAVE,
    CANCEL
}

public final class PacketSink implements QuillActionSink<ConfigAction> {
    @Override
    public void execute(ConfigAction action) {
        sendSafely(new ConfigActionPayload(action));
        // The client never writes authoritative state.
    }
}`}
      />

      <H2>Server responsibilities</H2>
      <OL>
        <li>Validate permission and value ranges.</li>
        <li>Apply the change and persist it.</li>
        <li>Send an updated state snapshot to the client.</li>
        <li>Reject stale revisions or rate-limit abusive requests.</li>
      </OL>
      <Callout kind="note">
        <P>
          A <C>QuillToggle</C> flips its local visual immediately. If the server rejects the change, send a
          new snapshot and call <C>setValue(...)</C> so the visual matches the authoritative state.
        </P>
      </Callout>
    </>
  );
}

function BestPractices() {
  return (
    <>
      <P>
        These rules apply to any Quill UI screen and keep the framework easy to extend.
      </P>

      <H2>Structure</H2>
      <UL>
        <li>Keep screens and widgets in client-only packages; Quill UI is a client mod.</li>
        <li>Build the widget tree in <C>buildContent()</C>; do not rebuild it every frame.</li>
        <li>Keep game logic out of widgets: callbacks should call your own services or an action sink.</li>
        <li>Derive every rectangle from the panel and layout primitives.</li>
      </UL>

      <H2>Visual consistency</H2>
      <UL>
        <li>Use <C>QuillThemeData</C> and token groups instead of literal colours and sizes.</li>
        <li>Stay on the 4 px spacing grid.</li>
        <li>One primary action per screen; use secondary for Cancel and ghost for utility actions.</li>
        <li>Reserve semantic colours for their meaning.</li>
      </UL>

      <H2>Usability</H2>
      <UL>
        <li>Buttons and toggles already support Enter and Space; keep a visible focus outline.</li>
        <li>Test at the smallest and largest GUI scale, and at a narrow window width.</li>
        <li>Use translation keys in <C>Component.translatable(...)</C> instead of hard-coded strings.</li>
        <li>Do not hide essential information in a tooltip.</li>
      </UL>

      <H2>Networking</H2>
      <UL>
        <li>Interface code runs on the client. Send a packet or command to change server state.</li>
        <li>Validate everything on the server; the client is never authoritative.</li>
        <li>Send a fresh snapshot after a change instead of assuming the UI state is correct.</li>
      </UL>
    </>
  );
}

export const guides: DocPage[] = [
  {
    slug: "first-interface",
    title: "Creating Your First Interface",
    description: "A complete settings screen built from real Quill UI classes.",
    component: FirstInterface,
  },
  {
    slug: "map-integration",
    title: "Map Integration",
    description: "Add zones, markers, entity providers and selection commits to a map screen.",
    component: MapIntegration,
  },
  {
    slug: "theming",
    title: "Theming",
    description: "Build and apply a custom QuillThemeData palette.",
    component: Theming,
  },
  {
    slug: "internationalization",
    title: "Internationalization",
    description: "Use Minecraft language files and switch the active language at runtime.",
    component: Internationalization,
  },
  {
    slug: "backend-actions",
    title: "Backend Actions",
    description: "Send UI actions to the server without mutating state on the client.",
    component: BackendActions,
  },
  {
    slug: "best-practices",
    title: "Best Practices",
    description: "Structure, consistency, usability and networking guidance.",
    component: BestPractices,
  },
];
