import { C, Callout, CodeBlock, DocLink, DocTable, Example, H2, P, UL } from "@/components/prose";
import { McModal, McToast } from "@/components/mc";
import type { DocPage } from "../types";

function Overlays() {
  return (
    <>
      <P>
        Overlays render above the normal widget tree and own their input routing. <C>QuillScreen</C>{" "}
        keeps a small stack, draws open overlays after the screen footer and prunes them automatically
        once <C>isOpen()</C> becomes false.
      </P>
      <Example
        preview={
          <div className="relative flex h-44 w-full max-w-sm items-center justify-center overflow-hidden rounded-md border border-line bg-mist/40">
            <McModal className="scale-[0.82]" />
            <McToast className="absolute top-2 right-2" />
          </div>
        }
      >
        <CodeBlock
          code={`
screen.openOverlay(new QuillModal(
        Component.translatable("mymod.confirm.title"),
        Component.translatable("mymod.confirm.body"),
        Component.translatable("gui.ok"),
        Component.translatable("gui.cancel"),
        this::confirm,
        this::cancel,
        theme
));

screen.showToast(Component.translatable("mymod.saved"));`}
        />
      </Example>

      <H2>Screen stack</H2>
      <DocTable
        head={["Member", "Effect"]}
        rows={[
          [<C key="1">openOverlay(QuillOverlay)</C>, "Pushes an overlay and clears the focused widget."],
          [<C key="2">closeOverlay(QuillOverlay)</C>, "Calls close() and removes that overlay."],
          [<C key="3">closeOverlays()</C>, "Closes and removes every overlay, including toasts."],
          [<C key="4">showToast(Component)</C>, "Adds a toast with the default 3.0 s lifetime and returns it."],
          [<C key="5">showToast(Component, float)</C>, "Adds a toast with an explicit lifetime in seconds."],
        ]}
      />
      <P>
        Overlays are rendered in insertion order, so the last opened overlay paints on top and receives
        input first. Calling <C>closeOverlays()</C> invokes <C>close()</C> on every overlay, which also
        runs pending cancel callbacks.
      </P>

      <H2>QuillOverlay</H2>
      <P>
        <C>QuillOverlay</C> is an interface with default no-op input methods. Implement only what the
        overlay needs: rendering, hit testing, dismissal policy and input blocking.
      </P>
      <DocTable
        head={["Member", "Default", "Meaning"]}
        rows={[
          [<C key="1">render(graphics, mouseX, mouseY, delta)</C>, "required", "Draws the overlay above the screen."],
          [<C key="2">mouseClicked / mouseReleased / mouseDragged</C>, "false", "Return true when the overlay consumed the event."],
          [<C key="3">mouseScrolled(...)</C>, "false", "Return true to consume wheel input."],
          [<C key="4">keyPressed(KeyEvent)</C>, "false", "Return true to consume the key."],
          [<C key="5">isOpen()</C>, "true", "The screen prunes overlays that return false."],
          [<C key="6">close()</C>, "no-op", "Called by closeOverlay / closeOverlays and outside-click dismissal."],
          [<C key="7">dismissOnOutsideClick()</C>, "true", "Close when a click does not land inside the overlay."],
          [<C key="8">blocksInput()</C>, "false", "Swallow clicks, wheel, drag and keys that reach this overlay."],
        ]}
      />
      <Callout kind="note">
        <P>
          Input is routed from the newest overlay to the oldest. A consumed event stops the chain; a
          blocking overlay stops it without handling the event; only after the overlay stack passes does
          the screen forward input to widgets and shortcuts. While a blocking overlay is open, widgets are
          rendered with off-screen mouse coordinates, so hover highlights do not light up behind a modal.
        </P>
      </Callout>

      <H2>Popup menu</H2>
      <P>
        <C>QuillPopupMenu</C> is an anchored list. It draws a themed panel, highlights the selected row
        and the hovered row, selects on click, closes on an outside click and closes with Escape. The
        caller owns the anchor bounds; the popup owns selection state and the close callback.
      </P>
      <CodeBlock
        code={`
screen.openOverlay(new QuillPopupMenu(
        anchorX,
        anchorY + anchorHeight,
        anchorWidth,
        18,
        options,
        selectedIndex,
        theme,
        index -> selected = index,
        null // optional onClose
));`}
      />
      <DocTable
        head={["Constructor argument", "Meaning"]}
        rows={[
          ["x, y, width, rowHeight", "Anchor bounds in GUI pixels. Row height is clamped to at least 12."],
          ["items", "Rows; null becomes an empty list."],
          ["selected", "Initially highlighted index."],
          ["onSelect", "Receives the clicked index; the popup closes afterwards."],
          ["onClose", "Runs once when the popup closes, for any reason."],
        ]}
      />
      <P>
        <C>selected()</C> returns the last selected index. The panel height is{" "}
        <C>items.size() * rowHeight + 4</C>. Clicking outside the panel closes it without selecting.
        There is no keyboard navigation beyond Escape; use <C>QuillDropdown</C> when you want the
        packaged open/close behaviour.
      </P>

      <H2>Modal</H2>
      <P>
        <C>QuillModal</C> is a centered confirmation dialog with a fixed 360×190 panel. It dims the
        screen, blocks click-through, ignores outside clicks, cancels on Escape and confirms on Enter.
      </P>
      <CodeBlock
        code={`
QuillModal modal = new QuillModal(
        Component.translatable("mymod.confirm.title"),
        Component.translatable("mymod.confirm.body"),
        Component.translatable("gui.ok"),
        Component.translatable("gui.cancel"),
        this::confirm,
        this::cancel,
        theme
);
screen.openOverlay(modal);`}
      />
      <UL>
        <li>The body is wrapped to the panel width and limited to five lines.</li>
        <li>A blank confirm or cancel label hides that button; both blank leaves no action row.</li>
        <li>
          <C>close()</C> runs the cancel callback when the modal was not confirmed, so{" "}
          <C>closeOverlay(modal)</C> and <C>closeOverlays()</C> do not leave a pending action behind.
        </li>
        <li>Enter runs confirm, Escape runs cancel; both close the modal.</li>
      </UL>
      <Callout kind="warning">
        <P>
          The modal is a confirmation surface, not a form container. Buttons and text fields cannot be
          added inside it; build a dedicated <DocLink to="fundamentals/screen">QuillScreen</DocLink>{" "}
          for forms and use the modal only to confirm the outcome.
        </P>
      </Callout>

      <H2>Toast</H2>
      <P>
        <C>QuillToast</C> is a short-lived top-right notification. It never captures input, so a toast
        over a popup or modal does not stop that overlay from receiving clicks or keys.
      </P>
      <CodeBlock
        code={`
screen.showToast(Component.translatable("mymod.saved"));
screen.showToast(Component.translatable("mymod.saved"), 2.5F); // seconds

QuillToast toast = new QuillToast(
        Component.translatable("mymod.saved"), 2.5F, theme);
screen.openOverlay(toast);
toast.close(); // dismiss early`}
      />
      <UL>
        <li>Lifetime is wall-clock based, with a 500 ms minimum and a 3.0 s default.</li>
        <li>Fade in is 150 ms and fade out is 350 ms; text wraps at 260 px.</li>
        <li>The overlay is pruned automatically when it expires; no tick bookkeeping is needed.</li>
        <li>Toasts use <C>PANEL_BG</C>, <C>PANEL_BORDER</C>, <C>ACCENT</C> and <C>TEXT</C>.</li>
      </UL>

      <H2>Rules</H2>
      <UL>
        <li>A dropdown or menu should not mutate game state; send an action after selection.</li>
        <li>Keep <C>dismissOnOutsideClick()</C> true for menus and non-modal popups.</li>
        <li>Set <C>blocksInput()</C> true for modal surfaces.</li>
        <li>Leave both flags false for passive overlays such as toasts.</li>
        <li>
          Use <C>QuillPopupMenu</C> and overlays for menus instead of rendering an unclipped list inside
          a widget.
        </li>
      </UL>
      <Callout kind="tip">
        <P>
          The overlay stack is also documented from the screen side in{" "}
          <DocLink to="fundamentals/screen">Screens</DocLink>. For packaging a select control, see{" "}
          <DocLink to="components/dropdown">Dropdowns</DocLink>.
        </P>
      </Callout>
    </>
  );
}

export const overlayComponents: DocPage[] = [
  {
    slug: "overlays",
    title: "Overlays",
    description: "Popup menus, modals and toasts on a screen-level overlay stack.",
    component: Overlays,
  },
];
