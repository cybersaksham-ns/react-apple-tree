import React from "react";
import { FlatTreeItem } from "../../types";

export enum DropZoneValues {
  Self = "self",
  Allow = "allow",
  Disallow = "disallow",
}

export interface RowMainButtonProps {
  $isCollapsed: boolean;
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
