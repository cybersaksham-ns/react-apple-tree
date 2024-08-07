import { NodeKey, TreeItem } from "../types";
import { promiseResolver } from "./promise-resolver";

export function defaultOnChange<T>(
  fn: any,
  treeData?: Array<TreeItem<T>>
): void {
  if (fn && treeData) {
    promiseResolver(() => fn(treeData));
  }
}

export async function defaultGetNodeKey<T>(
  fn: any,
  node: TreeItem<T>,
  treeIndex?: number
): Promise<NodeKey> {
  if (fn) {
    return await promiseResolver(() => fn());
  }
  return treeIndex || 0;
}
