import { useDrag } from "react-dnd";

export const useDragHook = (item: any) => {
  const [{ isDragging }, dragRef, dragPreview] = useDrag({
    type: "TREE_ITEM",
    item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return {
    isDragging,
    dragRef,
    dragPreview,
  };
};
