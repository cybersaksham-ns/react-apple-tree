import React, { createContext, useEffect, useState } from "react";

import {
  convertTreeToNode,
  convertOneLevelToList,
  collapseOneLevelToNode,
} from "../utils/convertTree";

const NodeDataContext = createContext();

const NodeDataState = (props) => {
  const [jsonTreeData, setjsonTreeData] = useState(null);
  const [nodesMap, setNodesMap] = useState({});
  const [rootNode, setRootNode] = useState(null);
  const [nodeListUI, setNodeListUI] = useState([]);

  // Listen updates to json tree data
  useEffect(() => {
    if (jsonTreeData) {
      createIDMapFromJsonData(jsonTreeData);
    }
  }, [jsonTreeData]);

  // Create IDs map from json tree data
  const createIDMapFromJsonData = (treeData) => {
    let nodeInformation = {};
    let rootNode = convertTreeToNode(treeData, nodeInformation);
    setNodesMap({ ...nodeInformation });
    setRootNode(rootNode);
  };

  // Expand or collapse a node
  const expandOrCollapseNode = (node, index) => {
    if (node.isCollapsed) {
      setNodeListUI([
        ...convertOneLevelToList(node, nodesMap, nodeListUI, index),
      ]);
    } else {
      setNodeListUI([...collapseOneLevelToNode(node, nodeListUI, index)]);
    }
  };

  return (
    <NodeDataContext.Provider
      value={{
        jsonTreeData,
        setjsonTreeData,
        nodesMap,
        rootNode,
        nodeListUI,
        setNodeListUI,
        createIDMapFromJsonData,
        expandOrCollapseNode,
      }}
    >
      {props.children}
    </NodeDataContext.Provider>
  );
};

export { NodeDataContext, NodeDataState };
