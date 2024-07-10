import React, { forwardRef, useState, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import TreeItem from "../TreeItem";
import { flattenTree } from "../../utils/flattenTree";

const TreeList = forwardRef(
  ({ treeData, itemHeight = 25, indentSize = 20, onMoveItem }, ref) => {
    const [flattenedData, setFlattenedData] = useState([]);

    useEffect(() => {
      const flattened = [];
      flattenTree(treeData, 0, flattened);
      setFlattenedData(flattened);
    }, [treeData]);

    return (
      <List
        ref={ref}
        height={500}
        itemCount={flattenedData.length}
        itemSize={itemHeight}
        width={"100%"}
        itemData={flattenedData}
      >
        {({ index, style, data }) => (
          <TreeItem key={data[index].id} style={style} node={data[index]} />
        )}
      </List>
    );
  }
);

export default TreeList;
