import { RowDirection } from "../../types";

export interface StyledTreeItemRowProps {
  $rowDirection?: RowDirection;
}

export interface StyledRowMainButtonProps {
  $isCollapsed: boolean;
}

export enum DropZoneValues {
  Self = "self",
  Allow = "allow",
  Disallow = "disallow",
}
export interface StyledRowMainContentWrapperProps {
  $isDragging?: boolean;
  $dropzone?: DropZoneValues;
  $isSearchedNode?: boolean;
  $isSearchFocus?: boolean;
}
