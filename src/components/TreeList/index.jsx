import React, { forwardRef, useEffect, useContext } from "react";
import { FixedSizeList as List } from "react-window";

import TreeItem from "../TreeItem";
import { NodeDataContext } from "../../contexts/NodeDataContext";

const TreeList = forwardRef(({ treeData, itemHeight = 45 }, ref) => {
  const { rootNode, nodeListUI, setNodeListUI, setjsonTreeData } =
    useContext(NodeDataContext);

  useEffect(() => {
    setjsonTreeData(treeData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeData]);

  useEffect(() => {
    if (rootNode) {
      setNodeListUI([rootNode]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootNode]);

  return (
    <List
      ref={ref}
      height={500}
      itemCount={nodeListUI.length}
      itemSize={itemHeight}
      width={"100%"}
      itemData={nodeListUI}
    >
      {({ index, style, data }) => (
        <TreeItem
          key={data[index].id}
          style={style}
          nodeIndex={index}
          node={data[index]}
        />
      )}
    </List>
  );
});

export default TreeList;
