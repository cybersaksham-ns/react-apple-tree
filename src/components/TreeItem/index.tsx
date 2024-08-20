import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  EmptyBlock,
  HorizontalLineBlock,
  RowButtonsWrapper,
  RowDragIcon,
  RowMainButton,
  RowMainContentWrapper,
  TreeItemContent,
  TreeItemIndentation,
  TreeItemRow,
  VerticalAndHorizontalLineBlock,
  VerticalLineBlock,
} from "./index.styles";
import { TreeDataContext } from "../../contexts/TreeDataContext";
import { PropDataContext } from "../../contexts/PropDataContext";
import { DNDContext } from "../../contexts/DNDContext";
import { ExtendedNodeProps, FlatTreeItem } from "../../types";
import { useDragHook, useDropHook } from "../../hooks/dnd";
import DragHandle from "../../assets/DragHandle";
import { DropZoneValues } from "./types";
import { calculateNodeDepth } from "../../utils";

interface TreeItemComponentProps {
  style?: React.CSSProperties;
  nodeIndex: number;
  node: FlatTreeItem;
}

const TreeItem = ({ style, nodeIndex, node }: TreeItemComponentProps) => {
  const { appleTreeProps } = useContext(PropDataContext);
  const { treeMap, expandOrCollapseNode } = useContext(TreeDataContext);
  const {
    draggingNodeInformation,
    dropzoneInformation,
    startDrag,
    appendDropNode,
    completeDrop,
  } = useContext(DNDContext);

  const [depth, setDepth] = useState(calculateNodeDepth(node) - 1);
  const [treeNode, setTreeNode] = useState(treeMap[node.mapId]);
  const [parentNode, setParentNode] = useState(
    treeMap[node.path[node.path.length - 1]]
  );
  const [nodePropsData, setNodePropsData] = useState<ExtendedNodeProps>({});

  const showActualDropLines = dropzoneInformation
    ? dropzoneInformation.actualDropIndex ||
      -1 > dropzoneInformation.dropIndex + 1
    : false;
  const startActualDropLine =
    showActualDropLines &&
    dropzoneInformation &&
    nodeIndex === dropzoneInformation.dropIndex;
  const midActualDropLine =
    showActualDropLines &&
    dropzoneInformation &&
    nodeIndex > dropzoneInformation.dropIndex &&
    nodeIndex + 1 < (dropzoneInformation.actualDropIndex || -1);
  const endActualDropLine =
    showActualDropLines &&
    dropzoneInformation &&
    nodeIndex + 1 === dropzoneInformation.actualDropIndex;
  const checkMultipleDropLine =
    (startActualDropLine && midActualDropLine) ||
    (startActualDropLine && endActualDropLine) ||
    (midActualDropLine && endActualDropLine);

  useEffect(() => {
    setDepth(calculateNodeDepth(node) - 1);
    setTreeNode(treeMap[node.mapId]);
    setParentNode(treeMap[node.path[node.path.length - 2]]);
  }, [node, treeMap]);

  useMemo(() => {
    if (appleTreeProps.generateNodeProps && parentNode !== treeNode) {
      setNodePropsData(
        appleTreeProps.generateNodeProps({
          node: treeNode,
          isSearchFocus: false,
          isSearchMatch: false,
          lowerSiblingCounts: [],
          parentNode,
          path: node.path,
          treeIndex: nodeIndex,
        })
      );
    }
  }, [node, appleTreeProps, treeNode, nodeIndex, parentNode]);

  useEffect(() => {
    if (appleTreeProps.onVisibilityToggle) {
      appleTreeProps.onVisibilityToggle({
        expanded: treeNode.expanded || false,
        node: treeNode,
        treeData: appleTreeProps.treeData,
      });
    }
  }, [treeNode.expanded]);

  const nodeElement = useRef(null);

  const { isDragging, dragRef, dragPreview } = useDragHook({
    nodeIndex,
    listNode: node,
  });
  const { isOver, dropRef } = useDropHook({
    nodeIndex,
    listNode: node,
    nodeElement,
    shouldRunHoverFunction:
      !node.draggingNode && !node.dropSuccessNode && !node.dropErrorNode,
    appendDropNode,
    completeDrop,
  });

  useEffect(() => {
    if (isDragging) {
      startDrag({ nodeIndex, flatNode: node });
    } else {
      if (
        dropzoneInformation &&
        draggingNodeInformation &&
        node.mapId === draggingNodeInformation.flatNode.mapId
      ) {
        completeDrop();
      }
    }
  }, [isDragging]);

  return (
    <TreeItemRow
      style={{ ...style }}
      $rowDirection={appleTreeProps.rowDirection}
      ref={(node) => dropRef(node)}
    >
      <TreeItemIndentation>
        {depth > 0 ? <EmptyBlock /> : <></>}
        {depth > 0 &&
          Array.from(new Array(depth - 1)).map((el, i) => (
            <VerticalLineBlock
              key={`rat_item_indentation_${node.mapId}_${i}`}
            />
          ))}
        {depth === 0 ? (
          <HorizontalLineBlock />
        ) : (
          <VerticalAndHorizontalLineBlock />
        )}
      </TreeItemIndentation>
      <TreeItemContent ref={nodeElement}>
        {treeNode.children && treeNode.children.length > 0 && (
          <RowMainButton
            $isCollapsed={!treeNode.expanded}
            onClick={() => expandOrCollapseNode(node.mapId)}
          />
        )}
        <RowMainContentWrapper
          className={nodePropsData.className || ""}
          style={{ ...nodePropsData.style }}
          ref={(node) => dragPreview(node)}
          $isDragging={isDragging}
          $dropzone={node.dropSuccessNode ? DropZoneValues.Allow : undefined}
        >
          <RowDragIcon ref={(node) => dragRef(node)}>
            <DragHandle />
          </RowDragIcon>
          {nodePropsData.title ? (
            nodePropsData.title()
          ) : (
            <div>{treeNode.title || ""}</div>
          )}
          {nodePropsData.buttons && (
            <RowButtonsWrapper>
              {nodePropsData.buttons.map((btn) => btn)}
            </RowButtonsWrapper>
          )}
        </RowMainContentWrapper>
      </TreeItemContent>
    </TreeItemRow>
  );
};

export default TreeItem;
