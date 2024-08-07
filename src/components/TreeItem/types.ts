import React from "react";
import { FlatTreeItem, RowDirection } from "../../types";

export interface TreeItemRowProps {
  $rowDirection?: RowDirection;
}

export interface RowMainButtonProps {
  $isCollapsed: boolean;
}

export enum DropZoneValues {
  Self = "self",
  Allow = "allow",
  Disallow = "disallow",
}
export interface RowMainContentWrapperProps {
  $isDragging?: boolean;
  $dropzone?: DropZoneValues;
}

export interface TreeItemComponentProps {
  style: React.CSSProperties;
  nodeIndex: number;
  node: FlatTreeItem;
}
