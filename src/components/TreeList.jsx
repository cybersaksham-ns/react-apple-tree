import React, { forwardRef, useState, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TreeItem from "./TreeItem";
import flattenTree from "../utils/flattenTree";

const TreeList = forwardRef(
  ({ treeData, itemHeight = 25, indentSize = 20, onMoveItem }, ref) => {
    const [flattenedData, setFlattenedData] = useState([]);

    useEffect(() => {
      const flattened = [];
      flattenTree(treeData, 0, flattened);
      setFlattenedData(flattened);
    }, [treeData]);

    const moveItem = (dragIndex, hoverIndex) => {
      const updatedData = [...flattenedData];
      const [draggedItem] = updatedData.splice(dragIndex, 1);
      updatedData.splice(hoverIndex, 0, draggedItem);

      setFlattenedData(updatedData);

      if (onMoveItem) {
        onMoveItem(dragIndex, hoverIndex);
      }
    };

    return (
      <DndProvider backend={HTML5Backend}>
        <List
          ref={ref}
          height={500}
          itemCount={flattenedData.length}
          itemSize={itemHeight}
          width={"100%"}
          itemData={flattenedData}
        >
          {({ index, style, data }) => (
            <TreeItem
              key={data[index].id}
              index={index}
              style={style}
              data={data}
              moveItem={moveItem}
            />
          )}
        </List>
      </DndProvider>
    );
  }
);

export default TreeList;
