import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

const TreeItem = ({ index, style, data, moveItem }) => {
  const item = data[index];
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
  const indentStyle = { paddingLeft: item.depth * 20 };

  return (
    <div
      ref={(node) => {
        if (node) {
          itemRef.current = node;
          drag(drop(node));
        }
      }}
      style={{ ...style, opacity, ...indentStyle }}
    >
      {item.name}
    </div>
  );
};

export default TreeItem;
