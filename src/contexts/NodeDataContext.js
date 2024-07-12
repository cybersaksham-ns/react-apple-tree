import React, { createContext, useEffect, useState } from "react";

import { Node } from "../models/Node";
import {
  convertTreeToNode,
  convertOneLevelToList,
  collapseOneLevelToNode,
} from "../utils/refactorTree";
import { dfs } from "../utils/traversal";

const NodeDataContext = createContext();

const NodeDataState = (props) => {
  const [jsonTreeData, setjsonTreeData] = useState(null);
  const [itemHeight, setItemHeight] = useState(null);
  const [nodesMap, setNodesMap] = useState({});
  const [rootNode, setRootNode] = useState(null);
  const [nodeListUI, setNodeListUI] = useState([]);
  const [dropzoneInformation, setdropzoneInformation] = useState(null);
  const [draggingNodeInformation, setDraggingNodeInformation] = useState(null);

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

  // Delete a node from ui list
  const deleteNodeFromUI = (index) => {
    setNodeListUI([
      ...nodeListUI.slice(0, index),
      ...nodeListUI.slice(index + 1),
    ]);
  };

  // Start dragging a node
  const startNodeDrag = (node, index) => {
    let newList = collapseOneLevelToNode(node, nodeListUI, index);
    newList = [...newList.slice(0, index), ...newList.slice(index + 1)];
    setDraggingNodeInformation({ node, index, depth: node.depth });
    setNodeListUI([...newList]);
  };

  // Drop node
  const dropNode = () => {
    draggingNodeInformation.node.depth = dropzoneInformation.depth;
    // Calculate refactored index
    let start = dropzoneInformation.index + 1;
    while (start < nodeListUI.length) {
      if (nodeListUI[start].depth <= dropzoneInformation.depth) {
        break;
      } else {
        start += 1;
      }
    }
    let newList = [
      ...nodeListUI.slice(0, dropzoneInformation.index),
      ...nodeListUI.slice(dropzoneInformation.index + 1),
    ];
    // Updating ui list
    if (start > dropzoneInformation.index) {
      newList = [
        ...newList.slice(0, start - 1),
        draggingNodeInformation.node,
        ...newList.slice(start - 1),
      ];
    } else {
      newList = [
        ...newList.slice(0, start),
        draggingNodeInformation.node,
        ...newList.slice(start),
      ];
    }
    // Update children depth
    dfs(draggingNodeInformation.node, nodesMap, (child) => {
      child.depth = nodesMap[child.parent].depth + 1;
    });
    // Update old parent
    let siblings = Array.from(
      nodesMap[draggingNodeInformation.node.parent].children
    );
    siblings.splice(siblings.indexOf(draggingNodeInformation.node.id), 1);
    nodesMap[draggingNodeInformation.node.parent].children = siblings;
    // Update new parent
    let parentIndex = start - 1;
    while (parentIndex >= 0) {
      let parent = nodeListUI[parentIndex];
      if (parent.dropzone == null && parent.depth < dropzoneInformation.depth) {
        draggingNodeInformation.node.parent = parent.id;
        let childIndex = Array.from(parent.children).indexOf(
          nodeListUI[start].id
        );
        if (childIndex === -1) {
          parent.children.push(draggingNodeInformation.node.id);
        } else {
          parent.children = [
            ...parent.children.slice(0, childIndex),
            draggingNodeInformation.node.id,
            ...parent.children.slice(childIndex),
          ];
        }
        parent.isCollapsed = false;
        break;
      }
      parentIndex -= 1;
    }
    setNodeListUI([...newList]);
    setDraggingNodeInformation(null);
    setdropzoneInformation(null);
  };

  // Create dropzone
  const createDropzone = (index, depth) => {
    if (draggingNodeInformation == null) {
      return;
    }
    // Refactoring dropzone depth
    for (let i = index - 1; i >= 0; i--) {
      let prevNode = nodeListUI[i];
      if (prevNode.depth > depth) {
        continue;
      } else if (prevNode.depth < depth) {
        depth = prevNode.depth + 1;
        break;
      } else if (prevNode.depth === depth) {
        depth = prevNode.depth;
        break;
      }
    }
    let newNodeList = [...nodeListUI];
    if (dropzoneInformation) {
      if (
        dropzoneInformation.index === index &&
        dropzoneInformation.depth === depth
      ) {
        return;
      } else {
        newNodeList = [
          ...newNodeList.slice(0, dropzoneInformation.index),
          ...newNodeList.slice(dropzoneInformation.index + 1),
        ];
      }
    }
    let dragIndex = draggingNodeInformation.index;
    let dragDepth = draggingNodeInformation.depth;
    let newNode;
    if (dragIndex === index && dragDepth === depth) {
      newNode = new Node({
        depth,
        dropzone: "self",
      });
    } else {
      newNode = new Node({ depth, dropzone: "allow" });
    }
    setdropzoneInformation({ index, depth });
    newNodeList = [
      ...newNodeList.slice(0, index),
      newNode,
      ...newNodeList.slice(index),
    ];
    setNodeListUI([...newNodeList]);
  };

  return (
    <NodeDataContext.Provider
      value={{
        jsonTreeData,
        setjsonTreeData,
        itemHeight,
        setItemHeight,
        nodesMap,
        rootNode,
        nodeListUI,
        setNodeListUI,
        createIDMapFromJsonData,
        expandOrCollapseNode,
        startNodeDrag,
        dropNode,
        createDropzone,
      }}
    >
      {props.children}
    </NodeDataContext.Provider>
  );
};

export { NodeDataContext, NodeDataState };
