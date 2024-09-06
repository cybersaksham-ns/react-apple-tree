import { CanDragFn, ExtendedNodeData } from "../types";

export function checkCanDragNode(
  canDragFn: CanDragFn,
  extendedNodeData: ExtendedNodeData
): boolean {
  if (typeof canDragFn !== "undefined" && canDragFn !== null) {
    if (typeof canDragFn === "boolean") {
      return canDragFn;
    }
    return canDragFn(extendedNodeData);
  }
  return true;
}
