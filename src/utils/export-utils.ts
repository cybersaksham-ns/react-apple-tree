import {
  GetDescendantCountFnParams,
  GetDescendantCountFnReturnType,
  GetNodeDataAtTreeIndexOrNextIndexFnParams,
} from "../types";

/**
 * Performs a depth-first traversal over all of the node descendants,
 * incrementing currentIndex by 1 for each
 */
function getNodeDataAtTreeIndexOrNextIndex<T>({
  targetIndex,
  node,
  currentIndex,
  getNodeKey,
  path = [],
  lowerSiblingCounts = [],
  ignoreCollapsed = true,
  isPseudoRoot = false,
}: GetNodeDataAtTreeIndexOrNextIndexFnParams<T>): any {
  // The pseudo-root is not considered in the path
  const selfPath = !isPseudoRoot
    ? [...path, getNodeKey({ node, treeIndex: currentIndex })]
    : [];

  // Return target node when found
  if (currentIndex === targetIndex) {
    return {
      node,
      lowerSiblingCounts,
      path: selfPath,
    };
  }

  // Add one and continue for nodes with no children or hidden children
  if (!node.children || (ignoreCollapsed && node.expanded !== true)) {
    return { nextIndex: currentIndex + 1 };
  }

  // Iterate over each child and their descendants and return the
  // target node if childIndex reaches the targetIndex
  let childIndex = currentIndex + 1;
  const childCount = node.children.length;
  for (let i = 0; i < childCount; i += 1) {
    const result = getNodeDataAtTreeIndexOrNextIndex({
      ignoreCollapsed,
      getNodeKey,
      targetIndex,
      node: node.children[i],
      currentIndex: childIndex,
      lowerSiblingCounts: [...lowerSiblingCounts, childCount - i - 1],
      path: selfPath,
    });

    if (result.node) {
      return result;
    }

    childIndex = result.nextIndex;
  }

  // If the target node is not found, return the farthest traversed index
  return { nextIndex: childIndex };
}

/**
 * Calculates the number of descendants for a given node.
 *
 * @template T - The type of the node.
 * @param {GetDescendantCountFnParams<T>} params - The parameters for calculating the descendant count.
 * @param {T} params.node - The node for which to calculate the descendant count.
 * @param {boolean} [params.ignoreCollapsed=true] - Whether to ignore collapsed nodes.
 * @returns {number} - The number of descendants for the given node.
 */
export function getDescendantCount<T>({
  node,
  ignoreCollapsed = true,
}: GetDescendantCountFnParams<T>): GetDescendantCountFnReturnType {
  if (!node.children || (ignoreCollapsed && node.expanded !== true)) {
    return 0;
  }
  let count = node.children.length;
  if (!ignoreCollapsed || node.expanded) {
    node.children.forEach((child) => {
      count += getDescendantCount({ node: child, ignoreCollapsed });
    });
  }
  return count;
}
