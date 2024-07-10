import styled from "styled-components";

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

export const RowMainButton = styled.div`
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
    ${(props) => (props.isCollapsed ? "content: '►';" : "content: '▼';")}
    font-size: 10px;
    top: 38%;
    left: -25.5px;
  }
`;

export const RowMainContentWrapper = styled.div`
  width: 100%;
`;
