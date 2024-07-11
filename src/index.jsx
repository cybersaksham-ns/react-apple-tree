import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { forwardRef } from "react";

import TreeList from "./components/TreeList";
import { NodeDataState } from "./contexts/NodeDataContext";

export default forwardRef((props, ref) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <NodeDataState>
        <TreeList {...props} ref={ref} />
      </NodeDataState>
    </DndProvider>
  );
});
