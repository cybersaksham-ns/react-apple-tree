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
  opacity: 40%;

  &::after {
    position: absolute;
    content: "";
    background-color: black;
  }
`;

export const VerticalLineBlock = styled(LineBlock)`
  &::after {
    width: 1px;
    left: 50%;
    top: 0;
    height: 100%;
  }
`;

export const TreeItemContent = styled.div`
  width: 100%;
`;
