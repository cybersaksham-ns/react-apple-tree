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
