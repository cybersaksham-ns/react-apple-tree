import { FlatDataItem, GetNodeKeyFn, TreeItem } from "../types";

interface WalkFnProps<T> {
  treeData: Array<TreeItem<T>>;
  getNodeKey: GetNodeKeyFn<T>;
  callback: (data: FlatDataItem) => void;
  ignoreCollapsed?: boolean;
}

export function bfs<T>({
  treeData,
  getNodeKey,
  callback,
  ignoreCollapsed = false,
}: WalkFnProps<T>) {
  let queue = [...treeData];
  while (queue.length > 0) {
    let node = queue.shift();
    if (node) {
      if ((!ignoreCollapsed || node.expanded) && node.children) {
        queue.push(...node.children);
      }
      callback({ lowerSiblingCounts: [], node, parentNode: node, path: [] });
    }
  }
}
