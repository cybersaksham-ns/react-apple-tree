import styled from "styled-components";
import {
  DropZoneValues,
  RowMainButtonProps,
  RowMainContentWrapperProps,
} from "./types";

export const TreeItemRow = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: row;
`;

export const TreeItemIndentation = styled.div`
  display: flex;
`;

const LineBlock = styled.div`
  width: 40px;
  height: 100%;
  position: relative;
  opacity: 20%;

  &::after {
    position: absolute;
    content: "";
    background-color: black;
  }
  &::before {
    position: absolute;
    content: "";
    background-color: black;
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

export const TreeItemContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
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
    top: 38%;
    left: -25.5px;
  }
`;

export const RowMainContentWrapper = styled.div<RowMainContentWrapperProps>`
  width: 200px;
  height: 80%;
  display: flex;
  align-items: center;

  opacity: ${(props) => (props.$isDragging ? "0.4" : "1.0")};

  background-color: ${(props) =>
    props.$dropzone
      ? props.$dropzone === DropZoneValues.Self
        ? "lightgrey"
        : props.$dropzone === DropZoneValues.Allow
          ? "lightblue"
          : "lightcoral"
      : "transparent"};

  &:hover {
    border: 2px dotted black;
  }
`;
