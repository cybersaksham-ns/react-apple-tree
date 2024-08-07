import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { ReactAppleTreeProps } from "./types";

import { TreeDataContextProvider } from "./contexts/TreeDataContext";
import { PropDataContextProvider } from "./contexts/PropDataContext";

import TreeList from "./components/TreeList";

export default function ReactAppleTree<T>(
  props: React.PropsWithChildren<ReactAppleTreeProps<T>>
) {
  return (
    <DndProvider backend={HTML5Backend}>
      <PropDataContextProvider>
        <TreeDataContextProvider>
          <TreeList {...props} />
        </TreeDataContextProvider>
      </PropDataContextProvider>
    </DndProvider>
  );
}
