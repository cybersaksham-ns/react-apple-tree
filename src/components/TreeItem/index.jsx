import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  TreeItemRow,
  TreeItemIndentation,
  EmptyBlock,
  VerticalLineBlock,
  HorizontalLineBlock,
  VerticalAndHorizontalLineBlock,
  TreeItemContent,
} from "./index.styled";

const TreeItem = ({ index, style, node, moveItem }) => {
  const itemRef = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: "TREE_ITEM",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "TREE_ITEM",
    hover(item, monitor) {
      if (!itemRef.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = itemRef.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();

      if (clientOffset) {
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;
        // Only perform the move when the mouse has crossed half of the items height
        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }
        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }
        moveItem(dragIndex, hoverIndex);
        item.index = hoverIndex;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const opacity = isDragging ? 0.5 : 1;
  const indentStyle = { paddingLeft: node.depth * 0 };

  return (
    <TreeItemRow
      ref={(node) => {
        if (node) {
          itemRef.current = node;
          drag(drop(node));
        }
      }}
      style={{ ...style, opacity, ...indentStyle }}
    >
      <TreeItemIndentation>
        {node.depth > 0 ? <EmptyBlock /> : <></>}
        {node.depth > 0 &&
          Array.from(new Array(node.depth - 1)).map((el, i) => (
            <VerticalLineBlock key={`rat_item_indentation_${node.id}_${i}`} />
          ))}
        {node.depth === 0 ? (
          <HorizontalLineBlock />
        ) : (
          <VerticalAndHorizontalLineBlock />
        )}
      </TreeItemIndentation>
      <TreeItemContent>{node.name}</TreeItemContent>
    </TreeItemRow>
  );
};

export default TreeItem;
