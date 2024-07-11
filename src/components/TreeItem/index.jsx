import React, { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  TreeItemRow,
  TreeItemIndentation,
  EmptyBlock,
  VerticalLineBlock,
  HorizontalLineBlock,
  VerticalAndHorizontalLineBlock,
  TreeItemContent,
  RowMainButton,
  RowMainContentWrapper,
} from "./index.styles";
import DropZone from "../DropZone";

const TreeItem = ({ style, node, nodesData, onExpandFunction }) => {
  const itemRef = useRef(null);

  const [{ isOver }, drop] = useDrop({
    accept: "TREE_ITEM",
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      const draggedNode = item.node;
      const dropNode = node;
      if (!draggedNode || !dropNode || draggedNode.id === dropNode.id) {
        return;
      }
      console.log("drop", draggedNode, dropNode);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    hover(item, monitor) {
      const draggedNode = item.node;
      const hoveredNode = node;
      if (!draggedNode || !hoveredNode || draggedNode.id === hoveredNode.id) {
        return;
      }
      // TODO: remove previous dropzones and create new
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "TREE_ITEM",
    item: { node },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <TreeItemRow ref={itemRef} style={{ ...style }}>
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
      <TreeItemContent>
        {node.children.length > 0 && (
          <RowMainButton
            $isCollapsed={node.isCollapsed}
            onClick={onExpandFunction}
          />
        )}
        <RowMainContentWrapper
          ref={(node) => {
            drag(drop(node));
          }}
        >
          {isDragging ? (
            <DropZone
              isDragging={isDragging}
              children={<div>{node.name}</div>}
            />
          ) : (
            <div>{node.name}</div>
          )}
        </RowMainContentWrapper>
      </TreeItemContent>
    </TreeItemRow>
  );
};

export default TreeItem;
