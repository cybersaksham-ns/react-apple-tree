import React, { useContext, useEffect, useMemo, useState } from "react";
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
import { ExtendedNodeProps, FlatTreeItem } from "../../types";
import { useDragHook } from "../../hooks/dnd";
import DragHandle from "../../assets/DragHandle";

interface TreeItemComponentProps {
  style: React.CSSProperties;
  nodeIndex: number;
  node: FlatTreeItem;
}

const TreeItem = ({ style, nodeIndex, node }: TreeItemComponentProps) => {
  const { appleTreeProps } = useContext(PropDataContext);
  const { treeMap, expandOrCollapseNode } = useContext(TreeDataContext);

  const [depth, setDepth] = useState(node.path.length - 1);
  const [treeNode, setTreeNode] = useState(treeMap[node.mapId]);
  const [parentNode, setParentNode] = useState(
    treeMap[node.path[node.path.length - 1]]
  );
  const [nodePropsData, setNodePropsData] = useState<ExtendedNodeProps>({});

  useEffect(() => {
    setDepth(node.path.length - 1);
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

  const { isDragging, dragRef, dragPreview } = useDragHook({});

  return (
    <TreeItemRow
      style={{ ...style }}
      $rowDirection={appleTreeProps.rowDirection}
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
      <TreeItemContent>
        {treeNode.children && treeNode.children.length > 0 && (
          <RowMainButton
            $isCollapsed={!treeNode.expanded}
            onClick={() => expandOrCollapseNode(node.mapId)}
          />
        )}
        <RowMainContentWrapper
          className={nodePropsData.className || ""}
          style={{ ...nodePropsData.style, opacity: isDragging ? 0.4 : 1 }}
          ref={(node) => dragPreview(node)}
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
