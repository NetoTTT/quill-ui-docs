import { C, Callout, CodeBlock, DocLink, DocTable, Example, H2, P, UL } from "@/components/prose";
import { McList } from "@/components/mc";
import type { DocPage } from "../types";

function ListView() {
  return (
    <>
      <P>
        <C>QuillListView&lt;T&gt;</C> is a list whose rows are measured layout trees. Each row can
        contain real widgets, so row actions keep their own clicks, tooltips and focus instead of using
        one draw callback for the whole row.
      </P>
      <Example preview={<McList className="w-56" items={["Ada — Miner", "Bolt — Builder", "Cora — Farmer"]} />}>
        <CodeBlock
          code={`
QuillListView<Worker> list = new QuillListView<>(
        0, 0, 208, 190, 36,
        (worker, index) -> QuillNodes.row(6,
                QuillNodes.flexible(QuillNodes.column(2,
                        text(Component.literal(worker.name())),
                        text(Component.literal(worker.rank() + " - " + worker.job()))
                )),
                QuillNodes.widget(
                        QuillButton.secondary("Pay", () -> pay(worker)),
                        46, 16
                )
        ),
        (worker, index) -> select(worker)
);
list.replaceItems(workers);
list.setSelected(selected);`}
        />
      </Example>

      <H2>Construction</H2>
      <CodeBlock
        code={`
QuillListView(int x, int y, int width, int height, int rowHeight,
        RowBuilder<T> rowBuilder,
        ClickHandler<T> clickHandler)

QuillListView(int x, int y, int width, int height, int rowHeight,
        RowBuilder<T> rowBuilder,
        ClickHandler<T> clickHandler,
        QuillThemeData theme)`}
      />
      <P>
        <C>RowBuilder.build(item, index)</C> returns a <C>QuillLayoutNode</C>.{" "}
        <C>ClickHandler.onClick(item, index)</C> runs when the row itself is selected. The shorter
        constructor inherits <C>QuillThemeScope</C>; a null theme falls back to{" "}
        <C>QuillThemeData.DEFAULT</C>.
      </P>

      <H2>Methods</H2>
      <DocTable
        head={["Member", "Effect"]}
        rows={[
          [<C key="1">replaceItems(List&lt;T&gt;)</C>, "Replaces items, rebuilds rows and resets the scroll. Clears selection if the item is gone."],
          [<C key="2">size() / get(index)</C>, "Item count and item access."],
          [<C key="3">setSelected(item) / selectedItem() / isSelected(item)</C>, "Selection by item value, not by index."],
          [<C key="4">padding(QuillInsets)</C>, "Space between the row surface and its content; default 10 px horizontally."],
          [<C key="5">scrollOffset() / setScrollOffset(int)</C>, "Preserve or restore the row scroll across content rebuilds."],
          [<C key="6">rowWidth() / rowTop(index) / rowAt(mouseX, mouseY)</C>, "Visible row width, screen Y and hit-tested row index."],
          [<C key="7">rowHeight()</C>, "Row pitch including the row surface."],
        ]}
      />

      <H2>Rendering and input</H2>
      <UL>
        <li>The list paints the row surface, highlight, selection and a thin scrollbar; it clips and scrolls the rows.</li>
        <li>Mouse clicks are routed to the widgets in the clicked row first. Clicking the row surface selects it and calls the click handler.</li>
        <li>Tab and Shift+Tab move focus through active row widgets and scroll the focused control into view.</li>
        <li>Key presses, typed characters and <C>capturesInput()</C> are forwarded to the focused row widget.</li>
        <li>Row builders run inside the list theme scope through <C>QuillThemeScope.supply(...)</C>, so factory widgets use the correct palette.</li>
        <li><C>QuillPaintable</C> nodes in a row are painted before that row's widgets.</li>
      </UL>
      <Callout kind="note">
        <P>
          Selection is by value: replacing the backing items does not leave a stale index. Use string or
          record equality deliberately; mutable items should have a stable <C>equals</C>/<C>hashCode</C>.
        </P>
      </Callout>
      <Callout kind="tip">
        <P>
          For simple text rows with no child widgets, <C>QuillScrollList&lt;T&gt;</C> is lighter. Use{" "}
          <C>QuillListView</C> when rows contain buttons, labels or other measured widgets. See{" "}
          <DocLink to="fundamentals/layout-engine">Layout Engine</DocLink> for the node types.
        </P>
      </Callout>
    </>
  );
}

export const listViewComponents: DocPage[] = [
  {
    slug: "list-view",
    title: "List Views",
    description: "Node-based rows with real widgets, selection and scroll preservation.",
    component: ListView,
  },
];
