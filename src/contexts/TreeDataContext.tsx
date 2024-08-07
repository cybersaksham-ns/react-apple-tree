import React, { createContext, useContext, useEffect, useState } from "react";
import { ContextProviderProps, FlatTreeItem, NodeKey, TreeMap } from "../types";
import { PropDataContext } from "./PropDataContext";
import { collapseNode, expandNodeOneLevelUtils, flattenNode } from "../utils";

interface TreeContextProps {
  treeMap: TreeMap;
  flatTree: Array<FlatTreeItem>;
  expandOrCollapseNode: (nodeKey: NodeKey) => void;
}

const TreeDataContext = createContext<TreeContextProps>({
  treeMap: {},
  flatTree: [],
  expandOrCollapseNode: () => {},
});

const TreeDataContextProvider = (
  props: ContextProviderProps
): React.JSX.Element => {
  const [treeMap, setTreeMap] = useState<TreeMap>({});
  const [flatTree, setFlatTree] = useState<Array<FlatTreeItem>>([]);
  const { appleTreeProps } = useContext(PropDataContext);

  useEffect(() => {
    if (appleTreeProps && appleTreeProps.treeData) {
      const [map, flatArray] = flattenNode(
        appleTreeProps.treeData,
        appleTreeProps.getNodeKey
      );
      setTreeMap({ ...map });
      setFlatTree([...flatArray]);
    }
  }, [appleTreeProps]);

  function expandOrCollapseNode(nodeKey: NodeKey) {
    if (!treeMap[nodeKey].expanded) {
      const [map, flatArray] = expandNodeOneLevelUtils(
        nodeKey,
        treeMap[nodeKey],
        treeMap,
        flatTree,
        appleTreeProps.getNodeKey
      );

      setTreeMap({ ...map });
      setFlatTree([...flatArray]);
    } else {
      const flatArray = collapseNode(
        nodeKey,
        treeMap[nodeKey],
        treeMap,
        flatTree
      );
      setFlatTree([...flatArray]);
    }
    appleTreeProps.onChange(appleTreeProps.treeData);
  }

  return (
    <TreeDataContext.Provider
      value={{ treeMap, flatTree, expandOrCollapseNode }}
    >
      {props.children}
    </TreeDataContext.Provider>
  );
};

export { TreeDataContext, TreeDataContextProvider };
