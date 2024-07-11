import styled from "styled-components";

export const DropZoneRow = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  width: 200px;
  border: 2px dotted black;
  background-color: ${(props) =>
    props.$isDragging
      ? "lightgrey"
      : props.$allowDrop
      ? "lightblue"
      : "lightcoral"};
`;
