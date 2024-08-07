import React from "react";
import TreeItem from "../TreeItem";
import { FlatTreeItem } from "../../types";

interface ItemRendererProps {
  index: number;
  style: React.CSSProperties;
  data: Array<FlatTreeItem>;
}

const ItemRenderer = ({ index, style, data }: ItemRendererProps) => {
  return (
    <TreeItem
      key={data[index].mapId}
      style={style}
      node={data[index]}
      nodeIndex={index}
    />
  );
};

export default ItemRenderer;
