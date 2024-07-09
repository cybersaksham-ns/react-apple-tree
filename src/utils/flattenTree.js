function flattenTree(node, depth = 0, flattened = []) {
  flattened.push({ ...node, depth });
  node.children.forEach((child) => flattenTree(child, depth + 1, flattened));
}

export default flattenTree;
