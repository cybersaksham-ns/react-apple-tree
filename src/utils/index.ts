import {
  FlatTreeItem,
  GetNodeKeyFn,
  NodeKey,
  NumberOrStringArray,
  TreeItem,
  TreeMap,
} from "../types";

export function flattenNode<T>(
  treeData: Array<TreeItem<T>>,
  getNodeKey: GetNodeKeyFn<T>,
  initialPath: NumberOrStringArray = [],
  parentKey: NodeKey | null = null
): [TreeMap, Array<FlatTreeItem>] {
  const flattenedArray: Array<FlatTreeItem> = [];
  const map: TreeMap = {};

  const flatten = (
    node: TreeItem<T>,
    path: NumberOrStringArray = [],
    parentKey: NodeKey | null
  ): void => {
    const mapId = getNodeKey({ node });
    map[mapId] = node;
    flattenedArray.push({ mapId, path: [...path, mapId], parentKey });

    if (node.expanded && node.children) {
      node.children.forEach((child) => flatten(child, [...path, mapId], mapId));
    }
  };

  treeData.forEach((node) => flatten(node, initialPath, parentKey));

  return [map, flattenedArray];
}

export function expandNodeOneLevelUtils<T>(
  nodeKey: NodeKey,
  node: TreeItem<T>,
  treeMap: TreeMap,
  flatTree: Array<FlatTreeItem>,
  getNodeKey: GetNodeKeyFn<T>
): [TreeMap, Array<FlatTreeItem>] {
  let idx = flatTree.findIndex((el) => el.mapId === nodeKey);
  if (idx !== -1 && !node.expanded) {
    node.expanded = true;
    const [map, flatArray] = flattenNode(
      [node],
      getNodeKey,
      flatTree[idx].path.slice(0, -1),
      flatTree[idx].parentKey
    );
    treeMap = { ...treeMap, ...map };
    flatTree = [
      ...flatTree.slice(0, idx),
      ...flatArray,
      ...flatTree.slice(idx + 1),
    ];
  }
  return [treeMap, flatTree];
}

export function collapseNode<T>(
  nodeKey: NodeKey,
  node: TreeItem<T>,
  treeMap: TreeMap,
  flatTree: Array<FlatTreeItem>
): Array<FlatTreeItem> {
  let idx = flatTree.findIndex((el) => el.mapId === nodeKey);
  if (idx !== -1 && node.expanded) {
    node.expanded = false;
    let nodeData = flatTree[idx];
    let start = idx;
    let end = idx + 1;
    while (end < flatTree.length) {
      let child = flatTree[end];
      if (calculateNodeDepth(child) > calculateNodeDepth(nodeData)) {
        treeMap[child.mapId].expanded = false;
        end += 1;
      } else {
        break;
      }
    }
    flatTree = [...flatTree.slice(0, start + 1), ...flatTree.slice(end)];
  }
  return flatTree;
}

export function getParentKeyAndSiblingCountFromList(
  flatTree: Array<FlatTreeItem>,
  nodeIndex: number
): [NodeKey | null, number] {
  let flatNode = flatTree[nodeIndex];
  let nodeDepth = calculateNodeDepth(flatNode);

  let parentKey: NodeKey | null = null;
  let siblingCount = 0;

  let start = nodeIndex - 1;
  while (start >= 0) {
    let sibling = flatTree[start];
    if (calculateNodeDepth(sibling) === nodeDepth) {
      siblingCount++;
    } else if (calculateNodeDepth(sibling) < nodeDepth) {
      parentKey = sibling.mapId;
      break;
    }
    start -= 1;
  }
  if (start === -1) {
    parentKey = null;
  }
  return [parentKey, siblingCount];
}

export function moveNodeToDifferentParent(
  treeData: Array<TreeItem>,
  treeMap: TreeMap,
  nodeKey: NodeKey,
  prevParentKey: NodeKey | null,
  nextParentKey: NodeKey | null,
  siblingIndex: number,
  getNodeKey: GetNodeKeyFn
): Array<TreeItem> {
  let treeNode = treeMap[nodeKey];

  // Removing from previous parent
  let prevParent = prevParentKey ? treeMap[prevParentKey] : null;
  let prevChildren = prevParent ? prevParent.children || [] : treeData;
  let idx = prevChildren.findIndex((node) => nodeKey === getNodeKey({ node }));
  prevChildren = [
    ...prevChildren.slice(0, idx),
    ...prevChildren.slice(idx + 1),
  ];
  if (prevParent) {
    prevParent.children = prevChildren;
  } else {
    treeData = prevChildren;
  }

  // Appendig to next parent
  let nextParent = nextParentKey ? treeMap[nextParentKey] : null;
  let nextChildren: Array<TreeItem> = nextParent
    ? nextParent.children || []
    : treeData;
  nextChildren = [
    ...nextChildren.slice(0, siblingIndex),
    treeNode,
    ...nextChildren.slice(siblingIndex),
  ];
  if (nextParent) {
    nextParent.children = nextChildren;
  } else {
    treeData = nextChildren;
  }

  return treeData;
}

export function calculateNodeDepth(flatNode: FlatTreeItem): number {
  if (flatNode.forcedDepth) {
    return flatNode.forcedDepth;
  } else {
    return flatNode.path.length;
  }
}
