import { Node } from "../models/Node";

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

export const convertOneLevelToList = (node, nodeMap, nodeList, nodeIndex) => {
  node.isCollapsed = false;
  let flattendArray = [node];
  node.children.forEach((id) => flattendArray.push(nodeMap[id]));
  if (nodeIndex >= 0 && nodeIndex < nodeList.length) {
    nodeList = [
      ...nodeList.slice(0, nodeIndex),
      ...flattendArray,
      ...nodeList.slice(nodeIndex + 1),
    ];
  }
  return nodeList;
};

export const collapseOneLevelToNode = (node, nodeList, nodeIndex) => {
  let start = nodeIndex;
  let end = start + 1;
  while (end < nodeList.length) {
    let childNode = nodeList[end];
    if (childNode.depth > node.depth) {
      childNode.isCollapsed = true;
      end += 1;
    } else {
      break;
    }
  }
  node.isCollapsed = true;
  return [...nodeList.slice(0, start + 1), ...nodeList.slice(end)];
};

export const refactorNodeList = (nodeList) => {};
