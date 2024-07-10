import { Node } from "../types";

export const convertTreeToNode = (
  treeData,
  nodeInformation,
  depth = 0,
  parent = null
) => {
  let node = new Node({
    id: treeData["id"],
    name: treeData["name"],
    depth,
    parent,
  });
  nodeInformation[node.id] = node;
  (treeData["children"] || []).forEach((el) => {
    let child = convertTreeToNode(el, nodeInformation, depth + 1, node.id);
    node.children.push(child.id);
  });
  return node;
};

export const convertTreeToList = (node) => {};

export const convertOneLevelToList = (node, nodeList) => {};

export const flattenTree = (node, depth = 0, flattened = []) => {
  flattened.push({ ...node, depth, isCollapsed: true });
  node.children.forEach((child) => flattenTree(child, depth + 1, flattened));
};

export const flattenTreeForOneLevel = (node, flattened = [], nodeIndex) => {
  let flattendArray = [];
  node.children.forEach((child) =>
    flattendArray.push({ ...child, depth: node.depth + 1 })
  );
  if (nodeIndex >= 0 && nodeIndex < flattened.length) {
    flattened = [
      ...flattened.slice(0, nodeIndex),
      ...flattendArray,
      ...flattened.slice(nodeIndex + 1),
    ];
  }
};
