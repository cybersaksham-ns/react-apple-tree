import React, { forwardRef, useState, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import TreeItem from "../TreeItem";
import {
  convertTreeToNode,
  convertOneLevelToList,
  collapseOneLevelToNode,
} from "../../utils/convertTree";

const TreeList = forwardRef(({ treeData, itemHeight = 45 }, ref) => {
  const [nodes, setNodes] = useState({});
  const [rootNode, setRootNode] = useState(null);
  const [nodeList, setNodeList] = useState([]);

  useEffect(() => {
    let nodeInformation = {};
    let rootNode = convertTreeToNode(treeData, nodeInformation);
    setNodes({ ...nodeInformation });
    setRootNode(rootNode);
  }, [treeData]);

  useEffect(() => {
    if (rootNode) {
      setNodeList([rootNode]);
    }
  }, [rootNode]);

  const onExpandOrCollapseFunction = (node, index) => {
    if (node.isCollapsed) {
      setNodeList([...convertOneLevelToList(node, nodes, nodeList, index)]);
    } else {
      setNodeList([...collapseOneLevelToNode(node, nodeList, index)]);
    }
  };

  return (
    <List
      ref={ref}
      height={500}
      itemCount={nodeList.length}
      itemSize={itemHeight}
      width={"100%"}
      itemData={nodeList}
    >
      {({ index, style, data }) => (
        <TreeItem
          key={data[index].id}
          style={style}
          node={data[index]}
          nodesData={nodes}
          onExpandFunction={() =>
            onExpandOrCollapseFunction(data[index], index)
          }
        />
      )}
    </List>
  );
});

export default TreeList;
