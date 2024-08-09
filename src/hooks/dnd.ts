import { useDrag, useDrop } from "react-dnd";
import { FlatTreeItem } from "../types";
import {
  AppendDropNodeProps,
  NodeAppendDirection,
} from "../contexts/DNDContextTypes";
import { useState } from "react";

export const DND_TYPE = "REACT_APPLE_TREE_ITEM";

interface DragHookProps {
  nodeIndex: number;
  listNode: FlatTreeItem;
}

interface DropHookProps {
  nodeIndex: number;
  listNode: FlatTreeItem;
  nodeElement: React.MutableRefObject<null>;
  shouldRunHoverFunction?: boolean;
  appendDropNode: (params: AppendDropNodeProps) => void;
  completeDrop: () => void;
}

interface DropHookReturnProps {
  isOver: boolean;
}

export const useDragHook = ({ nodeIndex, listNode }: DragHookProps) => {
  const [{ isDragging }, dragRef, dragPreview] = useDrag({
    type: DND_TYPE,
    item: { nodeIndex, listNode },
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

export const useDropHook = ({
  nodeIndex,
  listNode,
  nodeElement,
  shouldRunHoverFunction = true,
  appendDropNode,
  completeDrop,
}: DropHookProps) => {
  const [hoveredDepth, setHoveredDepth] = useState<number | null>(null);

  const [{ isOver }, dropRef] = useDrop<
    DragHookProps,
    any,
    DropHookReturnProps
  >({
    accept: DND_TYPE,
    drop: (item, monitor) => {
      completeDrop();
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    hover(item, monitor) {
      if (nodeElement.current) {
        const targetRect = (
          nodeElement.current as HTMLElement
        ).getBoundingClientRect();
        const clientOffset = monitor.getClientOffset();

        if (clientOffset) {
          const offsetX = clientOffset.x - targetRect.left;
          const offsetY = clientOffset.y - targetRect.top;
          const targetHeight = targetRect.height;
          let depth = Math.sign(offsetX) * Math.floor(Math.abs(offsetX / 34));
          if (depth === -0) {
            depth = 0;
          }
          if (hoveredDepth !== depth) {
            setHoveredDepth(depth);
            if (offsetY * 2 < targetHeight) {
              appendDropNode({
                depth,
                direction: NodeAppendDirection.Below,
                nodeIndex,
                flatNode: listNode,
              });
            } else {
              appendDropNode({
                depth,
                direction: NodeAppendDirection.Above,
                nodeIndex,
                flatNode: listNode,
              });
            }
          } else {
            if (!monitor.isOver()) {
              setHoveredDepth(null);
            }
          }
        }
      }
    },
  });

  return { isOver, dropRef };
};
