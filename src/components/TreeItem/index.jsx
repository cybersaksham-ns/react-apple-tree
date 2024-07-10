import React, { useRef } from "react";
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
} from "./index.styled";

const TreeItem = ({ style, node, nodesData, onExpandFunction }) => {
  const itemRef = useRef(null);

  return (
    <TreeItemRow
      ref={(node) => {
        if (node) {
          itemRef.current = node;
        }
      }}
      style={{ ...style }}
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
      <TreeItemContent>
        {node.children.length > 0 && (
          <RowMainButton
            $isCollapsed={node.isCollapsed}
            onClick={onExpandFunction}
          />
        )}
        <RowMainContentWrapper>{node.name}</RowMainContentWrapper>
      </TreeItemContent>
    </TreeItemRow>
  );
};

export default TreeItem;
