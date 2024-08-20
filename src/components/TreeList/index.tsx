import React, { useContext, useEffect } from "react";
import { FixedSizeList as List } from "react-window";

import { ReactAppleTreeProps } from "../../types";
import { PropDataContext } from "../../contexts/PropDataContext";
import { TreeDataContext } from "../../contexts/TreeDataContext";
import ItemRenderer from "./ItemRenderer";
import TreeItem from "../TreeItem";

export default function TreeList<T>(props: ReactAppleTreeProps<T>) {
  const { setAppleTreeProps } = useContext(PropDataContext);
  const { flatTree } = useContext(TreeDataContext);

  useEffect(() => {
    setAppleTreeProps(props);
  }, [props]);

  return (
    <div>
      {props.isVirtualized ? (
        <List
          height={500}
          width={"100%"}
          itemSize={45}
          itemCount={flatTree.length}
          itemData={flatTree}
          itemKey={(index, data) => {
            return data[index].mapId;
          }}
        >
          {ItemRenderer}
        </List>
      ) : (
        <div style={{ position: "relative" }}>
          {flatTree.map((node, i) => (
            <TreeItem
              key={node.mapId}
              node={node}
              nodeIndex={i}
              style={{
                position: "absolute",
                left: 0,
                top: 45 * i,
                height: "45px",
                width: "100%",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
