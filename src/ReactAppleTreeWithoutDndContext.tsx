import React from "react";
import "./public/library.css";

import { ReactAppleTreeProps } from "./types";

import { TreeDataContextProvider } from "./contexts/TreeDataContext";
import { PropDataContextProvider } from "./contexts/PropDataContext";
import { DNDContextProvider } from "./contexts/DNDContext";

import TreeList from "./components/TreeList";
import { classnames } from "./utils/common";
import { SearchContextProvider } from "./contexts/SearchContext";

export default function ReactAppleTreeWithoutDndContext<T>(
  props: React.PropsWithChildren<ReactAppleTreeProps<T>>
) {
  return (
    <PropDataContextProvider>
      <TreeDataContextProvider>
        <SearchContextProvider>
          <DNDContextProvider>
            <div className={classnames("react-apple-tree", props.className)}>
              <TreeList {...props} />
            </div>
          </DNDContextProvider>
        </SearchContextProvider>
      </TreeDataContextProvider>
    </PropDataContextProvider>
  );
}
