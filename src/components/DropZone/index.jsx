import React from "react";
import { DropZoneRow } from "./index.styles";

const DropZone = ({ allowDrop }) => {
  return <DropZoneRow $allowDrop={allowDrop} />;
};

export default DropZone;
