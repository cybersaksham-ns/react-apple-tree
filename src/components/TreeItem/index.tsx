import React, { useContext } from "react";
import { TreeItemComponentProps } from "./types";
import {
  EmptyBlock,
  HorizontalLineBlock,
  RowMainButton,
  RowMainContentWrapper,
  TreeItemContent,
  TreeItemIndentation,
  TreeItemRow,
  VerticalAndHorizontalLineBlock,
  VerticalLineBlock,
} from "./index.styles";
import { TreeDataContext } from "../../contexts/TreeDataContext";

const TreeItem = ({ style, nodeIndex, node }: TreeItemComponentProps) => {
  const { treeMap, expandOrCollapseNode } = useContext(TreeDataContext);
  let depth = node.path.length - 1;
  let treeNode = treeMap[node.mapId];

  return (
    <TreeItemRow style={{ ...style }}>
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
        <RowMainContentWrapper>
          <div>{node.mapId}</div>
        </RowMainContentWrapper>
      </TreeItemContent>
    </TreeItemRow>
  );
};

export default TreeItem;
