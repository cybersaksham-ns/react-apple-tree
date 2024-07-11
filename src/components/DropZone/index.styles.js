import styled from "styled-components";

export const DropZoneRow = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 200px;
  padding: 0 10px;
  border: 2px dotted black;
  background-color: ${(props) =>
    props.$allowDrop ? "lightblue" : "lightcoral"};
`;
