import { CanDragFn, ExtendedNodeData } from "../types";
import { promiseResolver } from "./promise-resolver";

export async function checkCanDragNode(
  canDragFn: CanDragFn,
  extendedNodeData: ExtendedNodeData
): Promise<boolean> {
  if (typeof canDragFn !== "undefined" && canDragFn !== null) {
    if (typeof canDragFn === "boolean") {
      return canDragFn;
    }
    return await promiseResolver(() => canDragFn(extendedNodeData));
  }
  return true;
}
