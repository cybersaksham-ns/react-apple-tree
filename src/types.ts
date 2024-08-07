import React from "react";

// Common Types
export type NumberOrStringArray = Array<string | number>;
export type ContextProviderProps = { children: React.JSX.Element };
export type NodeKey = string | number;
export type TreeMap = Record<NodeKey, TreeItem>;

// Tree Item
export type TreeItem<T = {}> = T & {
  title?: React.ReactNode | undefined;
  subtitle?: React.ReactNode | undefined;
  expanded?: boolean | undefined;
  children?: Array<TreeItem<T>> | undefined;
};
export type FlatTreeItem = {
  mapId: NodeKey;
  path: NumberOrStringArray;
};

// Prop Functions
export type GetNodeKeyFn<T> = (
  node: TreeItem<T>,
  treeIndex?: number
) => NodeKey;

export interface ReactAppleTreeProps<T = {}> {
  // treeData: Array<TreeItem<T>>;
  treeData?: Array<TreeItem<T>>;
  onChange?: (treeData: Array<TreeItem<T>>) => void;
  getNodeKey?: GetNodeKeyFn<T>;
  generateNodeProps?: (
    node: TreeItem<T>,
    path: NumberOrStringArray,
    treeIndex: number,
    lowerSiblingCounts: number[],
    isSearchMatch: boolean,
    isSearchFocus: boolean
  ) => object;
  onMoveNode?: (
    treeData: Array<TreeItem<T>>,
    node: TreeItem<T>,
    nextParentNode: TreeItem<T>,
    prevPath: NumberOrStringArray,
    prevTreeIndex: number,
    nextPath: NumberOrStringArray,
    nextTreeIndex: number
  ) => void;
  onVisibilityToggle?: (
    treeData: Array<TreeItem<T>>,
    node: TreeItem<T>,
    expanded: boolean,
    path: NumberOrStringArray
  ) => void;
  onDragStateChanged?: (isDragging: boolean, draggedNode: TreeItem<T>) => void;
  maxDepth?: number;
  rowDirection?: "rtl" | "ltr";
  canDrag?:
    | ((
        node: TreeItem<T>,
        path: NumberOrStringArray,
        treeIndex: number,
        lowerSiblingCounts: number[],
        isSearchMatch: boolean,
        isSearchFocus: boolean
      ) => boolean)
    | boolean;
  canDrop?: (
    node: TreeItem<T>,
    prevPath: NumberOrStringArray,
    prevParent: TreeItem<T>,
    prevTreeIndex: number,
    nextPath: NumberOrStringArray,
    nextParent: TreeItem<T>,
    nextTreeIndex: number
  ) => boolean;
  canNodeHaveChildren?: (node: TreeItem<T>) => boolean;
  theme?: any;
  searchMethod?: (
    node: TreeItem<T>,
    path: NumberOrStringArray,
    treeIndex: number,
    searchQuery: any
  ) => boolean;
  searchQuery?: string | any;
  searchFocusOffset?: number;
  onlyExpandSearchedNodes?: boolean;
  searchFinishCallback?: (
    matches: {
      node: TreeItem<T>;
      path: NumberOrStringArray;
      treeIndex: number;
    }[]
  ) => void;
  dndType?: string;
  shouldCopyOnOutsideDrop?:
    | ((
        node: TreeItem<T>,
        prevPath: NumberOrStringArray,
        prevTreeIndex: number
      ) => boolean)
    | boolean;
  reactVirtualizedListProps?: object;
  style?: React.CSSProperties;
  innerStyle?: React.CSSProperties;
  className?: string;
  rowHeight?:
    | number
    | ((
        treeIndex: number,
        node: TreeItem<T>,
        path: NumberOrStringArray
      ) => number);
  slideRegionSize?: number;
  scaffoldBlockPxWidth?: number;
  isVirtualized?: boolean;
  nodeContentRenderer?: any;
  placeholderRenderer?: any;
}
