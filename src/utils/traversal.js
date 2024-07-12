export const dfs = (node, nodesMap, cb) => {
  node.children.forEach((el) => {
    let child = nodesMap[el];
    cb(child);
    dfs(child, nodesMap, cb);
  });
};

export const bfs = (node, nodesMap, levels, shouldTake, cb) => {
  let finalList = [];
  let queue = [node];
  let level = 0;
  while (queue.length > 0 || level > levels) {
    let root = queue.shift();
    if (shouldTake(root)) {
      finalList.push(root);
      queue.push(...Array.from(root.children).map((el) => nodesMap[el]));
      level += 1;
      cb(root);
    }
  }
  return finalList;
};
