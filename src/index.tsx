import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./library.css";

import { ReactAppleTreeProps } from "./types";

import { TreeDataContextProvider } from "./contexts/TreeDataContext";
import { PropDataContextProvider } from "./contexts/PropDataContext";
import { DNDContextProvider } from "./contexts/DNDContext";

import TreeList from "./components/TreeList";

export default function ReactAppleTree<T>(
  props: React.PropsWithChildren<ReactAppleTreeProps<T>>
) {
  return (
    <DndProvider backend={HTML5Backend}>
      <PropDataContextProvider>
        <TreeDataContextProvider>
          <DNDContextProvider>
            <div className="react-apple-tree">
              <TreeList {...props} />
            </div>
          </DNDContextProvider>
        </TreeDataContextProvider>
      </PropDataContextProvider>
    </DndProvider>
  );
}
