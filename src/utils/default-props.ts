import { NodeKey, TreeItem } from "../types";

export function defaultGetNodeKey<T>(
  node: TreeItem<T>,
  treeIndex?: number
): NodeKey {
  return treeIndex || 0;
}
