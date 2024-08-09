import { FlatTreeItem, NodeKey, TreeItem } from "../types";

export enum NodeAppendDirection {
  Above = "above",
  Below = "below",
}

export type DraggingNodeInformation = {
  treeNode: TreeItem;
  flatNode: FlatTreeItem;
  dragStartIndex: number;
  dragStartDepth: number;
  initialExpanded?: boolean;
};

export type DropZoneInformation = {
  flatList?: Array<FlatTreeItem>;
  flatNode: FlatTreeItem;
  dropIndex: number;
  dropDepth: number;
  actualDropIndex?: number;
  nextParentKey: NodeKey | null;
  siblingIndex: number;
};

export interface StartDragProps {
  nodeIndex: number;
  flatNode: FlatTreeItem;
}

export interface AppendDropNodeProps {
  nodeIndex: number;
  flatNode: FlatTreeItem;
  direction: NodeAppendDirection;
  depth: number;
}
