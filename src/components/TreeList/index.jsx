import React, { forwardRef, useEffect, useContext } from "react";
import { FixedSizeList as List } from "react-window";
import { useDrop } from "react-dnd";

import TreeItem from "../TreeItem";
import { NodeDataContext } from "../../contexts/NodeDataContext";

const TreeList = forwardRef(({ treeData, itemHeight = 45 }, ref) => {
  const {
    rootNode,
    nodeListUI,
    setNodeListUI,
    setjsonTreeData,
    setItemHeight,
    createDropzone,
    dropNode,
  } = useContext(NodeDataContext);

  useEffect(() => {
    setjsonTreeData(treeData);
    setItemHeight(itemHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (rootNode) {
      setNodeListUI([rootNode]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootNode]);

  const [{ isOver }, drop] = useDrop({
    accept: "TREE_ITEM",
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      dropNode();
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    hover(item, monitor) {
      let dragDiffOffset = monitor.getDifferenceFromInitialOffset();
      let hoverIndex =
        item.index +
        Math.floor(Math.abs(dragDiffOffset.y) / itemHeight) *
          Math.sign(dragDiffOffset.y);
      let hoverDepth =
        item.depth +
        Math.floor(Math.abs(dragDiffOffset.x) / 40) *
          Math.sign(dragDiffOffset.x);
      createDropzone(hoverIndex, hoverDepth);
    },
  });

  return (
    <div ref={drop}>
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
    </div>
  );
});

export default TreeList;
