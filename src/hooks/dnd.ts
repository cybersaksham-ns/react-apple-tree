import { useDrag, useDrop } from "react-dnd";
import { FlatTreeItem } from "../types";

export const DND_TYPE = "REACT_APPLE_TREE_ITEM";

interface DragHookProps {
  listNode: FlatTreeItem;
}

export const useDragHook = ({ listNode }: DragHookProps) => {
  const [{ isDragging }, dragRef, dragPreview] = useDrag({
    type: DND_TYPE,
    item: { listNode },
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

export const useDropHook = () => {
  const [{ isOver }, dropRef] = useDrop({
    accept: DND_TYPE,
    drop: (item, monitor) => {},
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    hover(item, monitor) {},
  });

  return { isOver, dropRef };
};
