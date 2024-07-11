import React from "react";
import { DropZoneRow } from "./index.styles";

const DropZone = ({ allowDrop, isDragging, children }) => {
  return (
    <DropZoneRow $allowDrop={allowDrop} $isDragging={isDragging}>
      {children}
    </DropZoneRow>
  );
};

export default DropZone;
