import React from "react";
import {
  ConnectDragPreview,
  ConnectDragSource,
  ConnectDropTarget,
} from "react-dnd";
import { ListProps } from "react-window";

export type FlatTreeItem = {
  mapId: NodeKey;
  path: NumberOrStringArray;
  parentKey: NodeKey | null;
  draggingNode?: boolean;
  dropSuccessNode?: boolean;
  dropErrorNode?: boolean;
  forcedDepth?: number;
};

// Common Types
export type NumberOrStringArray = Array<string | number>;
export type ContextProviderProps = { children: React.JSX.Element };
export type NodeKey = string | number;
export type TreeMap = Record<NodeKey, TreeItem>;

export type TreeItem<T = {}> = T & {
  title?: React.ReactNode | undefined;
  subtitle?: React.ReactNode | undefined;
  expanded?: boolean | undefined;
  children?: Array<TreeItem<T>> | undefined;
};

export interface TreeNode<T = {}> {
  node: TreeItem<T>;
}

export interface TreePath {
  path: NumberOrStringArray;
}

export interface TreeIndex {
  treeIndex: number;
}

export interface FullTree<T = {}> {
  treeData: Array<TreeItem<T>>;
}

export interface NodeData<T = {}> extends TreeNode<T>, TreePath, TreeIndex {}

export interface FlatDataItem<T = {}> extends TreeNode<T>, TreePath {
  lowerSiblingCounts: number[];
  parentNode: TreeItem<T>;
}

export interface SearchData<T = {}> extends NodeData<T> {
  searchQuery: any;
}

export interface ExtendedNodeData<T = {}> extends NodeData<T> {
  parentNode?: TreeItem<T>;
  lowerSiblingCounts: number[];
  isSearchMatch: boolean;
  isSearchFocus: boolean;
}

export interface ExtendedNodeProps {
  buttons?: Array<React.ReactNode>;
  title?: () => React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export interface OnVisibilityToggleData<T = {}>
  extends FullTree<T>,
    TreeNode<T> {
  expanded: boolean;
}

export interface OnDragStateChangedData<T = {}> {
  isDragging: boolean;
  draggedNode: TreeItem<T>;
}

interface PreviousAndNextLocation {
  prevTreeIndex: number;
  prevPath: NumberOrStringArray;
  nextTreeIndex: number;
  nextPath: NumberOrStringArray;
}

export interface OnDragPreviousAndNextLocation<T = {}>
  extends PreviousAndNextLocation {
  prevParent: TreeItem<T> | null;
  nextParent: TreeItem<T> | null;
}

export interface ShouldCopyData<T = {}> {
  node: TreeNode<T>;
  prevPath: NumberOrStringArray;
  prevTreeIndex: number;
}

export interface OnMovePreviousAndNextLocation<T = {}>
  extends PreviousAndNextLocation {
  nextParentNode: TreeItem<T> | null;
}

export type NodeRenderer<T = {}> = React.ComponentType<NodeRendererProps<T>>;

export interface NodeRendererProps<T = {}> {
  node: TreeItem<T>;
  path: NumberOrStringArray;
  treeIndex: number;
  isSearchMatch: boolean;
  isSearchFocus: boolean;
  canDrag: boolean;
  scaffoldBlockPxWidth: number;
  toggleChildrenVisibility?(data: NodeData<T>): void;
  buttons?: React.JSX.Element[] | undefined;
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
  title?:
    | ((data: NodeData<T>) => React.JSX.Element | React.JSX.Element)
    | undefined;
  subtitle?:
    | ((data: NodeData<T>) => React.JSX.Element | React.JSX.Element)
    | undefined;
  icons?: React.JSX.Element[] | undefined;
  lowerSiblingCounts: number[];
  swapDepth?: number | undefined;
  swapFrom?: number | undefined;
  swapLength?: number | undefined;
  listIndex: number;
  treeId: string;
  rowDirection?: "ltr" | "rtl" | undefined;

  connectDragPreview: ConnectDragPreview;
  connectDragSource: ConnectDragSource;
  parentNode?: TreeItem<T> | undefined;
  startDrag: any;
  endDrag: any;
  isDragging: boolean;
  didDrop: boolean;
  draggedNode?: TreeItem<T> | undefined;
  isOver: boolean;
  canDrop?: boolean | undefined;
}

export type PlaceholderRenderer<T = {}> = React.ComponentType<
  PlaceholderRendererProps<T>
>;

export interface PlaceholderRendererProps<T = {}> {
  isOver: boolean;
  canDrop: boolean;
  draggedNode: TreeItem<T>;
}

export type TreeRenderer<T = {}> = React.ComponentType<TreeRendererProps<T>>;

export interface TreeRendererProps<T = {}> {
  treeIndex: number;
  treeId: string;
  swapFrom?: number | undefined;
  swapDepth?: number | undefined;
  swapLength?: number | undefined;
  scaffoldBlockPxWidth: number;
  lowerSiblingCounts: number[];
  rowDirection?: "ltr" | "rtl" | undefined;

  listIndex: number;
  children: React.JSX.Element[];
  style?: React.CSSProperties | undefined;

  // Drop target
  connectDropTarget: ConnectDropTarget;
  isOver: boolean;
  canDrop?: boolean | undefined;
  draggedNode?: TreeItem<T> | undefined;

  // used in dndManager
  getPrevRow: () => FlatDataItem | null;
  node: TreeItem<T>;
  path: NumberOrStringArray;
}

interface ThemeTreeProps<T = {}> {
  style?: React.CSSProperties | undefined;
  innerStyle?: React.CSSProperties | undefined;
  reactVirtualizedListProps?: Partial<ListProps> | undefined;
  scaffoldBlockPxWidth?: number | undefined;
  slideRegionSize?: number | undefined;
  rowHeight?: ((info: NodeData<T>) => number) | number | undefined;
  nodeContentRenderer?: NodeRenderer<T> | undefined;
  placeholderRenderer?: PlaceholderRenderer<T> | undefined;
}

export interface ThemeProps<T = {}> extends ThemeTreeProps<T> {
  treeNodeRenderer?: TreeRenderer<T> | undefined;
}

// Prop Functions
export type OnChangeFn<T> = (treeData: Array<TreeItem<T>>) => void;
export type GetNodeKeyFn<T = {}> = (data: TreeNode<T>) => NodeKey;
export type GenerateNodePropsFn<T> = (
  data: ExtendedNodeData<T>
) => ExtendedNodeProps;
export type OnMoveNodeFn<T> = (
  data: NodeData<T> & FullTree<T> & OnMovePreviousAndNextLocation<T>
) => void;
export type OnVisibilityToggleFn<T> = (data: OnVisibilityToggleData<T>) => void;
export type OnDragStateChangedFn<T> = (data: OnDragStateChangedData<T>) => void;
export type MaxDepth = number | undefined;
export type RowDirection = "ltr" | "rtl" | undefined;
export type CanDragFn =
  | ((data: ExtendedNodeData) => boolean)
  | boolean
  | undefined;
export type CanDropFn<T> = (
  data: OnDragPreviousAndNextLocation<T> & NodeData<T>
) => boolean;
export type CanNodeHaveChildrenFn<T> = (node: TreeItem<T>) => boolean;
export type SearchMethodFn<T> = (data: SearchData<T>) => boolean;
export type SearchQuery = string | any | undefined;
export type SearchFocusOffset = number | undefined;
export type OnlyExpandSearchedNodes = boolean | undefined;
export type SearchFinishCallbackFn<T> = (matches: Array<NodeData<T>>) => void;
export type DNDType = string | undefined;
export type ShouldCopyOnOutsideDropFn<T> =
  | boolean
  | ((data: ShouldCopyData<T>) => boolean)
  | undefined;
export type Classname = string | undefined;
export type IsVirtualized = boolean | undefined;

export interface ReactAppleTreeProps<T = {}> extends ThemeTreeProps<T> {
  treeData: Array<TreeItem<T>>; //
  onChange: OnChangeFn<T>; //
  getNodeKey: GetNodeKeyFn<T>; //
  generateNodeProps?: GenerateNodePropsFn<T>; //
  onMoveNode?: OnMoveNodeFn<T>;
  onVisibilityToggle?: OnVisibilityToggleFn<T>; //
  onDragStateChanged?: OnDragStateChangedFn<T>;
  maxDepth?: MaxDepth;
  rowDirection?: RowDirection; //
  canDrag?: CanDragFn; //
  canDrop?: CanDropFn<T>;
  canNodeHaveChildren?: CanNodeHaveChildrenFn<T>;
  theme?: ThemeProps<T> | undefined;
  searchMethod?: SearchMethodFn<T>;
  searchQuery?: SearchQuery;
  searchFocusOffset?: SearchFocusOffset;
  onlyExpandSearchedNodes?: OnlyExpandSearchedNodes;
  searchFinishCallback?: SearchFinishCallbackFn<T>;
  dndType?: DNDType;
  shouldCopyOnOutsideDrop?: ShouldCopyOnOutsideDropFn<T>;
  className?: Classname; //
  isVirtualized?: IsVirtualized; //
  dragDropManager?: any; //
}
