import {
  GetDescendantCountFnParams,
  GetDescendantCountFnReturnType,
  GetNodeDataAtTreeIndexOrNextIndexFnParams,
  GetVisibleNodeCountFnParams,
  GetVisibleNodeCountFnReturnType,
  GetVisibleNodeInfoAtIndexFnParams,
  GetVisibleNodeInfoAtIndexFnReturnType,
  MapDescendantsFnParams,
  MapFnParams,
  MapFnReturnType,
  ToggleExpandedForAllFnParams,
  ToggleExpandedForAllFnReturnType,
  TreeItem,
  WalkDescendantsFnParams,
  WalkFnParams,
  WalkFnReturnType,
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
 * @param {TreeItem} params.node - The node for which to calculate the descendant count.
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

/**
 * Calculates the count of visible nodes in a tree data structure.
 *
 * @template T - The type of the tree node.
 * @param {GetVisibleNodeCountFnParams<T>} params - The parameters for calculating the visible node count.
 * @param {Array<TreeItem<T>>} params.treeData - The array representing tree data.
 * @returns {GetDescendantCountFnReturnType} - The count of visible nodes in the tree.
 */
export function getVisibleNodeCount<T>({
  treeData,
}: GetVisibleNodeCountFnParams<T>): GetVisibleNodeCountFnReturnType {
  function traverse(node: TreeItem<T>): number {
    if (
      !node.children ||
      node.expanded !== true ||
      typeof node.children === "function"
    ) {
      return 1;
    }

    return (
      1 +
      node.children.reduce(
        (total, currentNode) => total + traverse(currentNode),
        0
      )
    );
  }

  return treeData.reduce(
    (total, currentNode) => total + traverse(currentNode),
    0
  );
}

/**
 * Retrieves information about a visible node at a specific index in the tree.
 *
 * @template T - The type of the tree node.
 * @param {GetVisibleNodeInfoAtIndexFnParams<T>} params - The parameters for retrieving the visible node information.
 * @param {T[]} params.treeData - The array of tree data.
 * @param {number} params.index - The index of the target node.
 * @param {GetNodeKeyFn<T>} params.getNodeKey - The function to get the unique key of a tree node.
 * @returns {GetVisibleNodeInfoAtIndexFnReturnType<T> | null} - The information about the visible node at the specified index, or null if not found.
 */
export function getVisibleNodeInfoAtIndex<T>({
  treeData,
  index: targetIndex,
  getNodeKey,
}: GetVisibleNodeInfoAtIndexFnParams<T>): GetVisibleNodeInfoAtIndexFnReturnType<T> {
  if (!treeData || treeData.length < 1) {
    return null;
  }

  // Call the tree traversal with a pseudo-root node
  const result = getNodeDataAtTreeIndexOrNextIndex({
    targetIndex,
    getNodeKey,
    node: {
      children: treeData,
      expanded: true,
    } as TreeItem<T>,
    currentIndex: -1,
    path: [],
    lowerSiblingCounts: [],
    isPseudoRoot: true,
  });

  if (result.node) {
    return result;
  }

  return null;
}

function walkDescendants<T>({
  callback,
  getNodeKey,
  ignoreCollapsed,
  isPseudoRoot = false,
  node,
  parentNode = null,
  currentIndex,
  path = [],
  lowerSiblingCounts = [],
}: WalkDescendantsFnParams<T>): any {
  // The pseudo-root is not considered in the path
  const selfPath = isPseudoRoot
    ? []
    : [...path, getNodeKey({ node, treeIndex: currentIndex })];
  const selfInfo = isPseudoRoot
    ? null
    : {
        node,
        parentNode,
        path: selfPath,
        lowerSiblingCounts,
        treeIndex: currentIndex,
      };

  if (!isPseudoRoot) {
    const callbackResult = callback(selfInfo);

    // Cut walk short if the callback returned false
    if (callbackResult === false) {
      return false;
    }
  }

  // Return self on nodes with no children or hidden children
  if (
    !node.children ||
    (node.expanded !== true && ignoreCollapsed && !isPseudoRoot)
  ) {
    return currentIndex;
  }

  // Get all descendants
  let childIndex: number | false = currentIndex;
  const childCount = node.children.length;
  if (typeof node.children !== "function") {
    for (let i = 0; i < childCount; i += 1) {
      childIndex = walkDescendants({
        callback,
        getNodeKey,
        ignoreCollapsed,
        node: node.children[i],
        parentNode: isPseudoRoot ? null : node,
        currentIndex: childIndex + 1,
        lowerSiblingCounts: [...lowerSiblingCounts, childCount - i - 1],
        path: selfPath,
      });

      // Cut walk short if the callback returned false
      if (childIndex === false) {
        return false;
      }
    }
  }

  return childIndex;
}

/**
 * Walks through the tree data and performs a callback function on each node.
 *
 * @template T - The type of the tree node.
 * @param {WalkFnParams<T>} params - The parameters for the walk function.
 * @param {Array<TreeItem>} params.treeData - The tree data to walk through.
 * @param {GetNodeKeyFn} params.getNodeKey - The function to get the key of a tree node.
 * @param {Function} params.callback - The callback function to be performed on each node.
 * @param {boolean} [params.ignoreCollapsed=true] - Whether to ignore collapsed nodes.
 * @returns {void} - Returns nothing.
 */
export function walk<T>({
  treeData,
  getNodeKey,
  callback,
  ignoreCollapsed = true,
}: WalkFnParams<T>): WalkFnReturnType {
  if (!treeData || treeData.length < 1) {
    return;
  }

  walkDescendants({
    callback,
    getNodeKey,
    ignoreCollapsed,
    isPseudoRoot: true,
    node: { children: treeData } as TreeItem<T>,
    currentIndex: -1,
    path: [],
    lowerSiblingCounts: [],
  });
}

function mapDescendants<T>({
  callback,
  getNodeKey,
  ignoreCollapsed,
  isPseudoRoot = false,
  node,
  parentNode = null,
  currentIndex,
  path = [],
  lowerSiblingCounts = [],
}: MapDescendantsFnParams<T>): any {
  const nextNode = { ...node };

  // The pseudo-root is not considered in the path
  const selfPath = isPseudoRoot
    ? []
    : [...path, getNodeKey({ node: nextNode, treeIndex: currentIndex })];
  const selfInfo = {
    node: nextNode,
    parentNode,
    path: selfPath,
    lowerSiblingCounts,
    treeIndex: currentIndex,
  };

  // Return self on nodes with no children or hidden children
  if (
    !nextNode.children ||
    (nextNode.expanded !== true && ignoreCollapsed && !isPseudoRoot)
  ) {
    return {
      treeIndex: currentIndex,
      node: callback(selfInfo),
    };
  }

  // Get all descendants
  let childIndex = currentIndex;
  const childCount = nextNode.children.length;
  if (typeof nextNode.children !== "function") {
    nextNode.children = nextNode.children.map((child, i) => {
      const mapResult = mapDescendants({
        callback,
        getNodeKey,
        ignoreCollapsed,
        node: child,
        parentNode: isPseudoRoot ? null : nextNode,
        currentIndex: childIndex + 1,
        lowerSiblingCounts: [...lowerSiblingCounts, childCount - i - 1],
        path: selfPath,
      });
      childIndex = mapResult.treeIndex;

      return mapResult.node;
    });
  }

  return {
    node: callback(selfInfo),
    treeIndex: childIndex,
  };
}

/**
 * Maps over the tree data and returns an array of mapped values.
 *
 * @template T - The type of the tree data.
 * @param {MapFnParams<T>} params - The parameters for the map function.
 * @param {Array<TreeItem>} params.treeData - The tree data to be mapped.
 * @param {GetNodeKeyFn} params.getNodeKey - The function to get the unique key of each node.
 * @param {Function} params.callback - The callback function to be called for each node.
 * @param {boolean} [params.ignoreCollapsed=true] - Whether to ignore collapsed nodes.
 * @returns {Array<T>} - The array of mapped values.
 */
export function map<T>({
  treeData,
  getNodeKey,
  callback,
  ignoreCollapsed = true,
}: MapFnParams<T>): MapFnReturnType {
  if (!treeData || treeData.length < 1) {
    return [];
  }

  return mapDescendants({
    callback,
    getNodeKey,
    ignoreCollapsed,
    isPseudoRoot: true,
    node: { children: treeData } as TreeItem<T>,
    currentIndex: -1,
    path: [],
    lowerSiblingCounts: [],
  }).node.children;
}

/**
 * Toggles the expanded state for all nodes in the tree data.
 *
 * @template T - The type of the tree data nodes.
 * @param {ToggleExpandedForAllFnParams<T>} params - The parameters for toggling the expanded state.
 * @param {Array<TreeItem>} params.treeData - The tree data containing the nodes.
 * @param {boolean} [params.expanded=true] - The desired expanded state. Defaults to `true`.
 * @returns {ToggleExpandedForAllFnReturnType} - The updated tree data with the expanded state toggled.
 */
export function toggleExpandedForAll<T>({
  treeData,
  expanded = true,
}: ToggleExpandedForAllFnParams<T>): ToggleExpandedForAllFnReturnType {
  return map({
    treeData,
    callback: ({ node }) => ({ ...node, expanded }),
    getNodeKey: ({ treeIndex }) => treeIndex,
    ignoreCollapsed: false,
  });
}
