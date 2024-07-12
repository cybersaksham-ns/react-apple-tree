import React, { useRef, useContext, useEffect } from "react";
import { useDrag } from "react-dnd";
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
import { NodeDataContext } from "../../contexts/NodeDataContext";

const TreeItem = ({ style, nodeIndex, node }) => {
  const itemRef = useRef(null);
  const { expandOrCollapseNode, startNodeDrag } = useContext(NodeDataContext);

  const [{ isDragging }, drag] = useDrag({
    type: "TREE_ITEM",
    item: { node, index: nodeIndex, depth: node.depth },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    if (isDragging) {
      startNodeDrag(node, nodeIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

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
            onClick={() => expandOrCollapseNode(node, nodeIndex)}
          />
        )}
        <RowMainContentWrapper
          ref={drag}
          $dropzone={node.dropzone}
          $isDragging={node.isDragging}
        >
          <div>{node.name}</div>
        </RowMainContentWrapper>
      </TreeItemContent>
    </TreeItemRow>
  );
};

export default TreeItem;
