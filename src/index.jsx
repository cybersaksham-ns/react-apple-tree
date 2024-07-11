import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { forwardRef } from "react";

import TreeList from "./components/TreeList";

export default forwardRef((props, ref) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <TreeList {...props} ref={ref} />
    </DndProvider>
  );
});
