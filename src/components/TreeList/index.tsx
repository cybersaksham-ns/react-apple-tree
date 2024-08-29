import React, { useContext, useEffect, useRef } from "react";
import { FixedSizeList as List } from "react-window";

import { ReactAppleTreeProps } from "../../types";
import { PropDataContext } from "../../contexts/PropDataContext";
import { TreeDataContext } from "../../contexts/TreeDataContext";
import ItemRenderer from "./ItemRenderer";
import TreeItem from "../TreeItem";
import { SearchContext } from "../../contexts/SearchContext";
import { StyledNormalList } from "./index.styles";

export default function TreeList<T>(props: ReactAppleTreeProps<T>) {
  const { appleTreeProps, setAppleTreeProps } = useContext(PropDataContext);
  const { flatTree } = useContext(TreeDataContext);
  const { searchedNodeIndex } = useContext(SearchContext);
  const virtualListRef = useRef<List>(null);
  const normalListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAppleTreeProps(props);
  }, [props]);

  const scrollVirtualList = (index: number) => {
    if (virtualListRef.current) {
      virtualListRef.current.scrollToItem(index, "smart");
    }
  };

  const scrollNormalList = (index: number) => {
    console.log("data:: list", normalListRef.current);
    if (normalListRef.current) {
      normalListRef.current.scrollTo({
        top: 33 * index,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (searchedNodeIndex) {
      scrollVirtualList(searchedNodeIndex);
      scrollNormalList(searchedNodeIndex);
    }
  }, [searchedNodeIndex]);

  return (
    <div>
      {appleTreeProps.isVirtualized ? (
        <List
          ref={virtualListRef}
          height={500}
          width={"100%"}
          itemSize={33}
          itemCount={flatTree.length}
          itemData={flatTree}
          itemKey={(index, data) => {
            return data[index].mapId;
          }}
        >
          {ItemRenderer}
        </List>
      ) : (
        <StyledNormalList ref={normalListRef}>
          {flatTree.map((node, i) => (
            <TreeItem
              key={node.mapId}
              node={node}
              nodeIndex={i}
              style={{
                position: "absolute",
                left: 0,
                top: 33 * i,
                height: "33px",
                width: "100%",
              }}
            />
          ))}
        </StyledNormalList>
      )}
    </div>
  );
}
