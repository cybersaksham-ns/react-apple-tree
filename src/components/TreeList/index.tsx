import React, { useContext, useEffect } from "react";
import { FixedSizeList as List } from "react-window";

import { ReactAppleTreeProps } from "../../types";
import { PropDataContext } from "../../contexts/PropDataContext";
import TreeItem from "../TreeItem";
import { TreeDataContext } from "../../contexts/TreeDataContext";

export default function TreeList<T>(props: ReactAppleTreeProps<T>) {
  const { setAppleTreeProps } = useContext(PropDataContext);
  const { flatTree } = useContext(TreeDataContext);

  useEffect(() => {
    setAppleTreeProps(props);
  }, [props]);

  return (
    <div>
      <List
        height={500}
        width={"100%"}
        itemSize={45}
        itemCount={flatTree.length}
        itemData={flatTree}
      >
        {({ index, style, data }) => (
          <TreeItem
            key={data[index].mapId}
            style={style}
            node={data[index]}
            nodeIndex={index}
          />
        )}
      </List>
    </div>
  );
}
