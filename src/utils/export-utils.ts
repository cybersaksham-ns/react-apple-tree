import {
  AddNodeUnderParentFnParams,
  AddNodeUnderParentFnReturnType,
  ChangeNodeAtPathFnParams,
  ChangeNodeAtPathFnReturnType,
  GetDescendantCountFnParams,
  GetDescendantCountFnReturnType,
  GetNodeAtPathFnParams,
  GetNodeAtPathFnReturnType,
  GetNodeDataAtTreeIndexOrNextIndexFnParams,
  GetVisibleNodeCountFnParams,
  GetVisibleNodeCountFnReturnType,
  GetVisibleNodeInfoAtIndexFnParams,
  GetVisibleNodeInfoAtIndexFnReturnType,
  MapDescendantsFnParams,
  MapFnParams,
  MapFnReturnType,
  RemoveNodeAtPathFnParams,
  RemoveNodeAtPathFnReturnType,
  RemoveNodeFnParams,
  RemoveNodeFnReturnType,
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
}: MapFnParams<T>): MapFnReturnType<T> {
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
}: ToggleExpandedForAllFnParams<T>): ToggleExpandedForAllFnReturnType<T> {
  return map({
    treeData,
    callback: ({ node }) => ({ ...node, expanded }),
    getNodeKey: ({ treeIndex }) => treeIndex,
    ignoreCollapsed: false,
  });
}

/**
 * Changes a node at a specific path in a tree data structure.
 *
 * @template T - The type of the node.
 * @param {ChangeNodeAtPathFnParams<T>} options - The options for changing the node.
 * @param {Array<TreeItem>} options.treeData - The tree data structure.
 * @param {NumberOrStringArray} options.path - The path to the node.
 * @param {TreeItem | ((params: { node: TreeItem, treeIndex: number }) => TreeItem)} options.newNode - The new node or a function that returns the new node.
 * @param {GetNodeKeyFn} options.getNodeKey - The function to get the key of a node.
 * @param {boolean} [options.ignoreCollapsed=true] - Whether to ignore collapsed nodes.
 * @returns {Array<TreeItem>} - The updated tree data structure.
 * @throws {Error} - If the path references children of a node with no children or if no node is found at the given path.
 */
export function changeNodeAtPath<T>({
  treeData,
  path,
  newNode,
  getNodeKey,
  ignoreCollapsed = true,
}: ChangeNodeAtPathFnParams<T>): ChangeNodeAtPathFnReturnType<T> {
  const RESULT_MISS = "RESULT_MISS";
  const traverse = ({
    isPseudoRoot = false,
    node,
    currentTreeIndex,
    pathIndex,
  }: any): any => {
    if (
      !isPseudoRoot &&
      getNodeKey({ node, treeIndex: currentTreeIndex }) !== path[pathIndex]
    ) {
      return RESULT_MISS;
    }

    if (pathIndex >= path.length - 1) {
      // If this is the final location in the path, return its changed form
      return typeof newNode === "function"
        ? newNode({ node, treeIndex: currentTreeIndex })
        : newNode;
    }
    if (!node.children) {
      // If this node is part of the path, but has no children, return the unchanged node
      throw new Error("Path referenced children of node with no children.");
    }

    let nextTreeIndex = currentTreeIndex + 1;
    for (let i = 0; i < node.children.length; i += 1) {
      const result = traverse({
        node: node.children[i],
        currentTreeIndex: nextTreeIndex,
        pathIndex: pathIndex + 1,
      });

      // If the result went down the correct path
      if (result !== RESULT_MISS) {
        if (result) {
          // If the result was truthy (in this case, an object),
          //  pass it to the next level of recursion up
          return {
            ...node,
            children: [
              ...node.children.slice(0, i),
              result,
              ...node.children.slice(i + 1),
            ],
          };
        }
        // If the result was falsy (returned from the newNode function), then
        //  delete the node from the array.
        return {
          ...node,
          children: [
            ...node.children.slice(0, i),
            ...node.children.slice(i + 1),
          ],
        };
      }

      nextTreeIndex +=
        1 + getDescendantCount({ node: node.children[i], ignoreCollapsed });
    }

    return RESULT_MISS;
  };

  // Use a pseudo-root node in the beginning traversal
  const result = traverse({
    node: { children: treeData },
    currentTreeIndex: -1,
    pathIndex: -1,
    isPseudoRoot: true,
  });

  if (result === RESULT_MISS) {
    throw new Error("No node found at the given path.");
  }

  return result.children;
}

/**
 * Removes a node at the specified path in the tree data.
 *
 * @template T - The type of the tree data.
 * @param {RemoveNodeAtPathFnParams<T>} params - The parameters for removing a node.
 * @param {Array<TreeItem<T>>} params.treeData - The tree data.
 * @param {NumberOrStringArray} params.path - The path to the node to be removed.
 * @param {GetNodeKeyFn<T>} params.getNodeKey - The function to get the key of a node.
 * @param {boolean} [params.ignoreCollapsed=true] - Whether to ignore collapsed nodes.
 * @returns {RemoveNodeAtPathFnReturnType<T>} - The updated tree data after removing the node.
 */
export function removeNodeAtPath<T>({
  treeData,
  path,
  getNodeKey,
  ignoreCollapsed = true,
}: RemoveNodeAtPathFnParams<T>): RemoveNodeAtPathFnReturnType<T> {
  return changeNodeAtPath({
    treeData,
    path,
    getNodeKey,
    ignoreCollapsed,
    newNode: null,
  });
}

/**
 * Removes a node from the tree data and return information about new treedata and removed node.
 *
 * @template T - The type of the tree node.
 * @param {RemoveNodeFnParams<T>} params - The parameters for removing the node.
 * @param {Array<TreeItem<T>>} params.treeData - The tree data.
 * @param {NumberOrStringArray} params.path - The path to the node to be removed.
 * @param {GetNodeKeyFn<T>} params.getNodeKey - The function to get the key of a node.
 * @param {boolean} [params.ignoreCollapsed=true] - Whether to ignore collapsed nodes.
 * @returns {RemoveNodeFnReturnType<T>} - The result of removing the node.
 * @property {Array<TreeItem<T>>} treeData - The updated tree data after removing the node.
 * @property {TreeItem<T>} node - The removed node.
 * @property {number} treeIndex - The index of the removed node in the tree.
 */
export function removeNode<T>({
  treeData,
  path,
  getNodeKey,
  ignoreCollapsed = true,
}: RemoveNodeFnParams<T>): RemoveNodeFnReturnType<T> {
  let removedNode = null;
  let removedTreeIndex = null;
  const nextTreeData = changeNodeAtPath({
    treeData,
    path,
    getNodeKey,
    ignoreCollapsed,
    newNode: ({ node, treeIndex }) => {
      removedNode = node;
      removedTreeIndex = treeIndex;
      return null;
    },
  });

  return {
    treeData: nextTreeData,
    node: removedNode,
    treeIndex: removedTreeIndex,
  };
}

/**
 * Retrieves the node at the specified path in the tree data.
 *
 * @template T - The type of the tree node.
 * @param {GetNodeAtPathFnParams<T>} params - The parameters for retrieving the node.
 * @param {NumberOrStringArray} params.path - The path to the node in the tree data.
 * @param {Array<TreeItem<T>>} params.treeData - The tree data.
 * @param {GetNodeKeyFn<T>} params.getNodeKey - The function to get the key of a node.
 * @param {boolean} [params.ignoreCollapsed=true] - Whether to ignore collapsed nodes.
 * @returns {NodeData<T> | null} - The found node information or null if not found.
 */
export function getNodeAtPath<T>({
  treeData,
  path,
  getNodeKey,
  ignoreCollapsed = true,
}: GetNodeAtPathFnParams<T>): GetNodeAtPathFnReturnType<T> {
  let foundNodeInfo = null;

  try {
    changeNodeAtPath({
      treeData,
      path,
      getNodeKey,
      ignoreCollapsed,
      newNode: ({ node, treeIndex }) => {
        foundNodeInfo = { node, treeIndex };
        return node;
      },
    });
  } catch (err) {
    return null;
  }

  return foundNodeInfo;
}

/**
 * Adds a new node under a parent node in a tree data.
 *
 * @template T - The type of the tree node.
 * @param {AddNodeUnderParentFnParams<T>} params - The parameters for adding the node.
 * @param {Array<TreeItem<T>>} params.treeData - The array representing the tree data.
 * @param {TreeItem<T>} params.newNode - The new node to be added.
 * @param {NumberOrStringArray} [params.parentKey=null] - The key of the parent node. If null, the new node will be added as the root node.
 * @param {GetNodeKeyFn<T>} params.getNodeKey - The function to get the key of a node.
 * @param {boolean} [params.ignoreCollapsed=true] - Whether to ignore collapsed nodes.
 * @param {boolean} [params.expandParent=false] - Whether to expand the parent node after adding the new node.
 * @param {boolean} [params.addAsFirstChild=false] - Whether to add the new node as the first child of the parent node.
 * @returns {AddNodeUnderParentFnReturnType<T>} - The updated tree data and the index of the inserted node.
 * @throws {Error} - If no node is found with the given parent key.
 * @throws {Error} - If trying to add to children defined by a function.
 */
export function addNodeUnderParent<T>({
  treeData,
  newNode,
  parentKey = null,
  getNodeKey,
  ignoreCollapsed = true,
  expandParent = false,
  addAsFirstChild = false,
}: AddNodeUnderParentFnParams<T>): AddNodeUnderParentFnReturnType<T> {
  if (parentKey === null) {
    return addAsFirstChild
      ? {
          treeData: [newNode, ...(treeData || [])],
          treeIndex: 0,
        }
      : {
          treeData: [...(treeData || []), newNode],
          treeIndex: (treeData || []).length,
        };
  }

  let insertedTreeIndex = null;
  let hasBeenAdded = false;
  const changedTreeData = map({
    treeData,
    getNodeKey,
    ignoreCollapsed,
    callback: ({ node, treeIndex, path }) => {
      const key = path ? path[path.length - 1] : null;
      // Return nodes that are not the parent as-is
      if (hasBeenAdded || key !== parentKey) {
        return node;
      }
      hasBeenAdded = true;

      const parentNode = {
        ...node,
      };

      if (expandParent) {
        parentNode.expanded = true;
      }

      // If no children exist yet, just add the single newNode
      if (!parentNode.children) {
        insertedTreeIndex = treeIndex + 1;
        return {
          ...parentNode,
          children: [newNode],
        };
      }

      if (typeof parentNode.children === "function") {
        throw new Error("Cannot add to children defined by a function");
      }

      let nextTreeIndex = treeIndex + 1;
      for (let i = 0; i < parentNode.children.length; i += 1) {
        nextTreeIndex +=
          1 +
          getDescendantCount({ node: parentNode.children[i], ignoreCollapsed });
      }

      insertedTreeIndex = nextTreeIndex;

      const children = addAsFirstChild
        ? [newNode, ...parentNode.children]
        : [...parentNode.children, newNode];

      return {
        ...parentNode,
        children,
      };
    },
  });

  if (!hasBeenAdded) {
    throw new Error("No node found with the given key.");
  }

  return {
    treeData: changedTreeData,
    treeIndex: insertedTreeIndex,
  };
}
