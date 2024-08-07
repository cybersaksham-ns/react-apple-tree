import {
  FlatTreeItem,
  GetNodeKeyFn,
  NodeKey,
  NumberOrStringArray,
  TreeItem,
  TreeMap,
} from "../types";

export function flattenTree<T>(
  treeData: Array<TreeItem<T>>,
  getNodeKey: GetNodeKeyFn<T> = () => {
    return 0;
  },
  initialPath: NumberOrStringArray = []
): [TreeMap, Array<FlatTreeItem>] {
  const flattenedArray: Array<FlatTreeItem> = [];
  const map: TreeMap = {};

  const flatten = (node: TreeItem<T>, path: NumberOrStringArray = []): void => {
    const mapId = getNodeKey(node);
    map[mapId] = node;
    flattenedArray.push({ mapId, path: [...path, mapId] });

    if (node.expanded && node.children) {
      node.children.forEach((child) => flatten(child, [...path, mapId]));
    }
  };

  treeData.forEach((node) => flatten(node, initialPath));

  return [map, flattenedArray];
}

export function expandNodeOneLevelUtils<T>(
  nodeKey: NodeKey,
  node: TreeItem<T>,
  treeMap: TreeMap,
  flatTree: Array<FlatTreeItem>,
  getNodeKey: GetNodeKeyFn<T> = () => {
    return 0;
  }
): [TreeMap, Array<FlatTreeItem>] {
  let idx = flatTree.findIndex((el) => el.mapId === nodeKey);
  if (
    idx !== -1 &&
    !node.expanded &&
    node.children &&
    node.children.length > 0
  ) {
    node.expanded = true;
    const [map, flatArray] = flattenTree(
      [node],
      getNodeKey,
      flatTree[idx].path.slice(0, -1)
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
  if (
    idx !== -1 &&
    node.expanded &&
    node.children &&
    node.children.length > 0
  ) {
    node.expanded = false;
    let nodeData = flatTree[idx];
    let start = idx;
    let end = idx + 1;
    while (end < flatTree.length) {
      let child = flatTree[end];
      if (child.path.length > nodeData.path.length) {
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
