import { RowDirection } from "../../types";

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
