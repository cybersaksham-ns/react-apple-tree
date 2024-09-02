import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { ReactAppleTreeProps } from "./types";

import ReactAppleTreeWithoutDndContext from "./ReactAppleTreeWithoutDNDContext";

export default function ReactAppleTree<T>(
  props: React.PropsWithChildren<ReactAppleTreeProps<T>>
) {
  return (
    <DndProvider backend={HTML5Backend}>
      <ReactAppleTreeWithoutDndContext {...props} />
    </DndProvider>
  );
}
