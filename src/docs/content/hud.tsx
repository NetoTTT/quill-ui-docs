import { C, Callout, CodeBlock, DocLink, DocTable, Example, H2, P, UL } from "@/components/prose";
import { McTargetIndicator } from "@/components/mc";
import type { DocPage } from "../types";

function TargetIndicator() {
  return (
    <>
      <P>
        <C>QuillTargetIndicator</C> is a generic off-screen target ring for the HUD. When a world
        position leaves the camera view, it draws a badge and an outward chevron on a ring around the
        crosshair, with an optional distance label.
      </P>
      <P>
        It knows nothing about LaborCraft, claims, economy or{" "}
        <C>WorldHighlightManager</C>. The consumer supplies the target, colour, optional icon and
        distance formatter.
      </P>
      <Example preview={<McTargetIndicator className="w-full max-w-md" />}>
        <CodeBlock
          title="TargetIndicator.java"
          code={`
QuillTargetIndicator indicator = new QuillTargetIndicator(0xFF48D7A0)
        .setTarget(new BlockPos(128, 64, -32))
        .setColor(0xFF48D7A0)
        .setIcon((graphics, x, y, size) -> graphics.item(stack, x, y))
        .setDistanceFormatter(distance -> Component.literal(Math.round(distance) + " m"))
        .setDistanceVisible(true)
        .setChevronVisible(true)
        .setMaxRange(96.0)
        .setRing(0.30, 60.0, 180.0)
        .setEdgeMargin(24)
        .setBadgeSize(11)
        .setShowWhenOnScreen(false);`}
        />
      </Example>

      <H2>Register with Fabric</H2>
      <P>
        <C>QuillTargetIndicatorHud</C> is a thin <C>HudElement</C> adapter. Register it with Fabric&apos;s{" "}
        <C>HudElementRegistry</C> and keep the indicator in your client state.
      </P>
      <CodeBlock
        code={`
import com.quillui.hud.QuillTargetIndicator;
import com.quillui.hud.QuillTargetIndicatorHud;
import net.fabricmc.api.ClientModInitializer;
import net.fabricmc.fabric.api.client.rendering.v1.hud.HudElementRegistry;
import net.minecraft.resources.Identifier;

public final class TargetHudInit implements ClientModInitializer {
    private final QuillTargetIndicator indicator = new QuillTargetIndicator(0xFF48D7A0);

    @Override
    public void onInitializeClient() {
        HudElementRegistry.addLast(
                Identifier.fromNamespaceAndPath("mymod", "target_indicator"),
                new QuillTargetIndicatorHud(indicator)
        );
    }
}`}
      />
      <P>
        <C>addLast</C> draws after the vanilla HUD. To place it at a specific layer, use{" "}
        <C>attachElementBefore(...)</C> or <C>attachElementAfter(...)</C> with a{" "}
        <C>VanillaHudElements</C> anchor:
      </P>
      <CodeBlock
        code={`
HudElementRegistry.attachElementBefore(
        VanillaHudElements.CHAT,
        Identifier.fromNamespaceAndPath("mymod", "target_indicator"),
        new QuillTargetIndicatorHud(indicator)
);`}
      />

      <H2>Updating the target</H2>
      <P>
        Set the target whenever the highlighted object changes. <C>BlockPos</C> targets use the center
        of the block; <C>Vec3</C> targets use the exact position.
      </P>
      <CodeBlock
        code={`
indicator.setTarget(entity.position());          // exact position
indicator.setTarget(new BlockPos(x, y, z));      // block center
indicator.clearTarget();                         // hide the ring`}
      />
      <P>
        Distance is measured from the camera, not from the player&apos;s feet. The indicator does not
        need to be updated every frame; it reads the current target when it renders.
      </P>

      <H2>Appearance</H2>
      <DocTable
        head={["Setter", "Effect"]}
        rows={[
          [<C key="1">setColor(int)</C>, "Accent for the badge border, chevron and distance text (ARGB)."],
          [<C key="2">setBackgroundColor(int)</C>, "Badge and label background. Default 0xCC101820."],
          [<C key="3">setIcon(IconRenderer)</C>, "Draws a custom icon inside the badge; null restores the coloured square."],
          [<C key="4">setDistanceFormatter(Function&lt;Double, Component&gt;)</C>, "Formats the distance. Default rounds to \"N m\"; null hides the label."],
          [<C key="5">setDistanceVisible(boolean)</C>, "Shows or hides the distance label. Default true."],
          [<C key="6">setChevronVisible(boolean)</C>, "Shows or hides the outward arrow. Default true."],
        ]}
      />
      <CodeBlock
        code={`
indicator.setIcon((graphics, x, y, size) ->
        graphics.item(stack, x, y)); // size = 2 * badgeSize - 6

indicator.setDistanceFormatter(distance ->
        Component.translatable("mymod.distance.meters", Math.round(distance)));`}
      />
      <Callout kind="note">
        <P>
          The indicator does not read <C>QuillThemeData</C>. Colours are supplied by the caller, so the
          HUD can intentionally stay readable on top of the world. Use{" "}
          <DocLink to="reference/colors">theme roles</DocLink> if you want it to follow the active theme.
        </P>
      </Callout>

      <H2>Geometry</H2>
      <DocTable
        head={["Setter", "Default", "Meaning"]}
        rows={[
          [<C key="1">setMaxRange(double)</C>, "96", "Targets closer than 0.5 or farther than this are not drawn. Minimum 1."],
          [<C key="2">setRing(factor, min, max)</C>, "0.30, 60, 180", "Ring radius = clamp(min(guiWidth, guiHeight) * factor, min, max); factor >= 0.01, min >= 1, max >= min."],
          [<C key="3">setEdgeMargin(int)</C>, "24", "Keeps the badge centre at least this far from the screen edges; clamped to >= 0."],
          [<C key="4">setBadgeSize(int)</C>, "11", "Half-size of the badge, clamped 2–64. The full badge is 2× this value (22 px by default)."],
          [<C key="5">setOnScreenThreshold(double)</C>, "0.98", "How close to the viewport edge an on-screen target must be before it is hidden; clamped 0–2."],
          [<C key="6">setShowWhenOnScreen(boolean)</C>, "false", "Keep the ring visible while the target is inside the viewport."],
        ]}
      />
      <P>
        <C>setShowWhenOnScreen(true)</C> does not move the badge onto the target. The indicator always
        sits on the ring; it only skips the on-screen visibility check. The badge is clamped to the edge
        margin, and the distance label flips above the badge when it would overflow the bottom edge.
      </P>

      <H2>Rendering rules</H2>
      <UL>
        <li>Nothing is drawn without a target, a local player/level, an initialized camera or a positive GUI size.</li>
        <li>Targets behind the camera still produce a direction, so the ring can point backward.</li>
        <li>The chevron points outward along the direction from the screen centre to the target.</li>
        <li>The distance label sits below the badge, or above it near the bottom edge.</li>
        <li>The indicator is client-only and never mutates gameplay state.</li>
        <li>It redraws every frame but has no animation or interpolation; motion comes from target changes.</li>
      </UL>

      <H2>API</H2>
      <DocTable
        head={["Member", "Notes"]}
        rows={[
          [<C key="1">QuillTargetIndicator(int color)</C>, "Constructor. Colour is required; there is no no-arg constructor."],
          [<C key="2">setTarget(Vec3) / setTarget(BlockPos)</C>, "Sets the highlighted position; BlockPos uses the block centre."],
          [<C key="3">clearTarget() / target()</C>, "Hides the ring / returns the current Vec3 or null."],
          [<C key="4">render(GuiGraphicsExtractor)</C>, "Draws the ring. Called by the HUD adapter."],
          [<C key="5">IconRenderer</C>, "Functional interface: render(graphics, x, y, size)."],
          [<C key="6">new QuillTargetIndicatorHud(indicator)</C>, "Fabric HudElement adapter."],
          [<C key="7">indicator()</C>, "Adapter accessor for the wrapped indicator."],
        ]}
      />
      <Callout kind="tip">
        <P>
          The default distance formatter is hard-coded to <C>&quot; m&quot;</C>. For a translated HUD,
          replace it with <C>Component.translatable(...)</C>.
        </P>
      </Callout>
    </>
  );
}

export const hud: DocPage[] = [
  {
    slug: "target-indicator",
    title: "Target Indicator",
    description: "Generic off-screen target ring for the HUD, with a Fabric adapter.",
    component: TargetIndicator,
  },
];
