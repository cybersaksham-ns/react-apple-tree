import styled, { css } from "styled-components";
import {
  DropZoneValues,
  RowMainButtonProps,
  RowMainContentWrapperProps,
  TreeItemRowProps,
} from "./types";

export const TreeItemRow = styled.div<TreeItemRowProps>`
  min-height: 43px;
  display: flex;
  flex-direction: ${({ $rowDirection }) =>
    $rowDirection ? ($rowDirection === "rtl" ? "row-reverse" : "row") : "row"};
  white-space: nowrap;
`;

export const TreeItemIndentation = styled.div`
  display: flex;
`;

const LineBlock = styled.div`
  width: 40px;
  height: 100%;
  position: relative;

  &::after {
    position: absolute;
    content: "";
    background-color: var(--ns-rat-tree-lines-color);
  }
  &::before {
    position: absolute;
    content: "";
    background-color: var(--ns-rat-tree-lines-color);
  }
`;

export const EmptyBlock = styled(LineBlock)``;

export const VerticalLineBlock = styled(LineBlock)`
  &::after {
    width: 1px;
    height: 100%;
    left: 50%;
    top: 0;
  }
`;

export const HorizontalLineBlock = styled(LineBlock)`
  &::before {
    height: 1px;
    width: 50%;
    right: 0;
    top: 50%;
  }
`;

export const VerticalAndHorizontalLineBlock = styled(LineBlock)`
  &::after {
    width: 1px;
    height: 100%;
    left: 50%;
    top: 0;
  }
  &::before {
    height: 1px;
    width: 50%;
    right: 0;
    top: 50%;
  }
`;

export const RowMainButton = styled.div<RowMainButtonProps>`
  height: 100%;
  position: relative;
  cursor: pointer;

  &::before {
    height: 12px;
    width: 12px;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: absolute;
    ${({ $isCollapsed }) => ($isCollapsed ? "content: '►';" : "content: '▼';")}
    font-size: 10px;
    top: calc(50% - 6px);
    left: -25.5px;
  }
`;

export const RowMainContentWrapper = styled.div<RowMainContentWrapperProps>`
  height: 80%;
  display: flex;
  align-items: center;
  padding: 10px 10px 10px 0;
  position: absolute;

  ${({ $isSearchFocus }) =>
    $isSearchFocus &&
    css`
      border: 2px solid var(--ns-rat-search-node-outline-color);
    `}

  ${({ $isDragging, $dropzone }) =>
    ($isDragging || $dropzone) &&
    css`
      &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        width: 100%;
        height: 100%;
        ${$isDragging &&
        css`
          background-color: var(--ns-rat-node-hover-color);
        `}
        ${$dropzone === DropZoneValues.Allow &&
        css`
          background-color: var(--ns-rat-can-drop-color);
        `}
        ${$dropzone === DropZoneValues.Disallow &&
        css`
          background-color: var(--ns-rat-cannot-drop-color);
        `}
      }
    `}
`;

export const RowDragIcon = styled.div`
  padding: 5px 2px;
  display: flex;
  align-items: center;
  opacity: 0.6;
  cursor: move;

  &:hover {
    background-color: #898c94;
  }
`;

export const RowTitleContentWrapper = styled.div`
  font-weight: 600;
  margin-left: 10px;
`;

export const RowButtonsWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  margin-left: 20px;
  gap: 10px;
`;

export const TreeItemContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;

  &:hover ${RowMainContentWrapper} {
    background-color: var(--ns-rat-node-hover-color);
  }
`;
