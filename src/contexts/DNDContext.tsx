import React, { createContext, useContext, useState } from "react";
import {
  ContextProviderProps,
  FlatTreeItem,
  NumberOrStringArray,
} from "../types";
import { PropDataContext } from "./PropDataContext";
import { TreeDataContext } from "./TreeDataContext";
import {
  OnHoverNodeProps,
  DraggingNodeInformation,
  DropZoneInformation,
  NodeAppendDirection,
  StartDragProps,
} from "./DNDContextTypes";
import {
  calculateNodeDepth,
  collapseNode,
  expandNode,
  getParentKeyAndSiblingCountFromList,
  moveNodeToDifferentParent,
} from "../utils/node-operations";
import { removeItemAtGivenIndexFromArray } from "../utils/common";

interface DNDContextProps {
  draggingNodeInformation: DraggingNodeInformation | null;
  dropzoneInformation: DropZoneInformation | null;
  startDrag: (params: StartDragProps) => void;
  hoverNode: (params: OnHoverNodeProps) => void;
  completeDrop: () => void;
}

const DNDContext = createContext<DNDContextProps>({
  draggingNodeInformation: null,
  dropzoneInformation: null,
  startDrag: (params: StartDragProps) => {},
  hoverNode: (params: OnHoverNodeProps) => {},
  completeDrop: () => {},
});

const DNDContextProvider = (props: ContextProviderProps): React.JSX.Element => {
  const { treeMap, setTreeMap, flatTree, setFlatTree } =
    useContext(TreeDataContext);
  const { appleTreeProps, setAppleTreeProps } = useContext(PropDataContext);

  const [draggingNodeInformation, setDraggingNodeInformation] =
    useState<DraggingNodeInformation | null>(null);
  const [dropzoneInformation, setDropzoneInformation] =
    useState<DropZoneInformation | null>(null);

  // When drag start on any node
  function startDrag(params: StartDragProps) {
    const flatNode = flatTree[params.nodeIndex];
    const treeNode = treeMap[flatNode.mapId];
    setDraggingNodeInformation({
      treeNode,
      flatNode,
      dragStartIndex: params.nodeIndex,
      dragStartDepth: calculateNodeDepth(flatNode),
      initialExpanded: treeNode.expanded,
    });
    const flatArray = collapseNode(flatNode.mapId, treeNode, treeMap, flatTree);
    setFlatTree([...flatArray]);
  }

  // When dragging node is hovering over some node
  function hoverNode(params: OnHoverNodeProps) {
    if (!draggingNodeInformation) return;
    const flatNode = flatTree[params.nodeIndex];

    // Calculate temp drop index
    let tmpDropIndex = params.nodeIndex;
    if (params.direction === NodeAppendDirection.Below) {
      tmpDropIndex += 1;
    }
    let hoverDropIndex = tmpDropIndex;
    let newFlatList = [...flatTree];
    let newTreeMap = { ...treeMap };

    // Removing dragging node if exists
    if (
      newFlatList[draggingNodeInformation.dragStartIndex].mapId ===
      draggingNodeInformation.flatNode.mapId
    ) {
      newFlatList = removeItemAtGivenIndexFromArray(
        newFlatList,
        draggingNodeInformation.dragStartIndex
      );
      if (hoverDropIndex > draggingNodeInformation.dragStartIndex) {
        hoverDropIndex -= 1;
      }
    }

    // Removing dropzone node if exists
    if (
      dropzoneInformation &&
      dropzoneInformation.dropIndex < newFlatList.length &&
      newFlatList[dropzoneInformation.dropIndex].mapId ===
        dropzoneInformation.flatNode.mapId
    ) {
      newFlatList = removeItemAtGivenIndexFromArray(
        newFlatList,
        dropzoneInformation.dropIndex
      );
      if (hoverDropIndex > dropzoneInformation.dropIndex) {
        hoverDropIndex -= 1;
      }
    }

    // Calculate actual depth
    let dropNodeDepth = calculateNodeDepth(flatNode) + params.depth;
    if (tmpDropIndex === 0) {
      dropNodeDepth = 0;
    } else {
      let start = tmpDropIndex - 1;
      while (start >= 0) {
        if (
          flatTree[start].mapId === draggingNodeInformation.flatNode.mapId ||
          flatTree[start].mapId === dropzoneInformation?.flatNode.mapId ||
          calculateNodeDepth(flatTree[start]) > dropNodeDepth
        ) {
          start -= 1;
        } else {
          break;
        }
      }
      tmpDropIndex = start + 1;
    }
    if (tmpDropIndex <= 0) {
      tmpDropIndex = 0;
      dropNodeDepth = 1;
    } else {
      let prevDepth = calculateNodeDepth(flatTree[tmpDropIndex - 1]);
      if (dropNodeDepth <= prevDepth) {
        dropNodeDepth = prevDepth;
      } else {
        dropNodeDepth = prevDepth + 1;
      }
    }

    let hoverDropDepth = dropNodeDepth;

    // Expanding previous node
    if (hoverDropIndex > 0) {
      let prevNode = newFlatList[hoverDropIndex - 1];
      let prevTreeNode = treeMap[prevNode.mapId];
      if (calculateNodeDepth(prevNode) < hoverDropDepth) {
        const [map, updatedFlatList] = expandNode(
          prevNode.mapId,
          prevTreeNode,
          treeMap,
          newFlatList,
          appleTreeProps.getNodeKey
        );
        newTreeMap = { ...map };
        newFlatList = [...updatedFlatList];
      }
    }

    // Calculating actual drop location
    let actualDropIndex = hoverDropIndex;
    while (actualDropIndex < flatTree.length) {
      if (
        flatTree[actualDropIndex].mapId ===
          draggingNodeInformation.flatNode.mapId ||
        flatTree[actualDropIndex].mapId ===
          dropzoneInformation?.flatNode.mapId ||
        calculateNodeDepth(flatTree[actualDropIndex]) > dropNodeDepth
      ) {
        actualDropIndex += 1;
      } else {
        break;
      }
    }

    // Get position of node in tree
    const [parentKey, siblingCount] = getParentKeyAndSiblingCountFromList(
      flatTree,
      params.nodeIndex
    );

    // Checking can drop
    let canDrop = true;
    let prevParent = null;
    if (draggingNodeInformation.flatNode.path.at(-2)) {
      prevParent = treeMap[draggingNodeInformation.flatNode.path.at(-2) || ""];
    }
    let nextParent = null;
    let nextParentPath: NumberOrStringArray = [];
    if (parentKey) {
      nextParent = treeMap[parentKey];
      let nextParentIndex = newFlatList.findIndex(
        (node) => node.mapId === parentKey
      );
      if (nextParentIndex !== -1) {
        nextParentPath = newFlatList[nextParentIndex].path;
      }
    }

    let moveNodeData = {
      node: draggingNodeInformation.treeNode,
      path: [...nextParentPath, draggingNodeInformation.flatNode.mapId],
      treeIndex: draggingNodeInformation.dragStartIndex,
      nextParent: nextParent,
      nextPath: [...nextParentPath, draggingNodeInformation.flatNode.mapId],
      nextTreeIndex: actualDropIndex - 1,
      prevParent: prevParent,
      prevPath: draggingNodeInformation.flatNode.path,
      prevTreeIndex: draggingNodeInformation.dragStartIndex,
    };
    if (appleTreeProps.canDrop) {
      canDrop = appleTreeProps.canDrop(moveNodeData);
    }

    // Creating new dropzone node
    let newFlatNode: FlatTreeItem = {
      ...draggingNodeInformation.flatNode,
      forcedDepth: hoverDropDepth,
    };
    if (
      hoverDropIndex === draggingNodeInformation.dragStartIndex &&
      hoverDropDepth === draggingNodeInformation.dragStartDepth
    ) {
      newFlatNode.draggingNode = true;
    } else {
      if (canDrop) {
        newFlatNode.dropSuccessNode = true;
      } else {
        newFlatNode.dropErrorNode = true;
      }
    }
    newFlatList = [
      ...newFlatList.slice(0, hoverDropIndex),
      { ...newFlatNode },
      ...newFlatList.slice(hoverDropIndex),
    ];

    // Updating UI
    setFlatTree([...newFlatList]);
    setTreeMap({ ...newTreeMap });
    setDropzoneInformation({
      dropIndex: hoverDropIndex,
      dropDepth: hoverDropDepth,
      actualDropIndex,
      flatNode: newFlatNode,
      flatList: newFlatList,
      nextParentKey: parentKey,
      siblingIndex: siblingCount,
      canDrop: canDrop,
      moveNodeData: moveNodeData,
    });
  }

  // Node is dropped
  function completeDrop() {
    if (draggingNodeInformation && dropzoneInformation) {
      let newTree = moveNodeToDifferentParent(
        appleTreeProps.treeData,
        treeMap,
        draggingNodeInformation.flatNode.mapId,
        draggingNodeInformation.flatNode.parentKey,
        dropzoneInformation.nextParentKey,
        dropzoneInformation.siblingIndex,
        appleTreeProps.getNodeKey
      );
      if (draggingNodeInformation.initialExpanded) {
        draggingNodeInformation.treeNode.expanded = true;
      }
      appleTreeProps.onMoveNode?.({
        ...dropzoneInformation.moveNodeData,
        treeData: structuredClone(newTree),
        nextParentNode: dropzoneInformation.moveNodeData.nextParent,
      });
      setAppleTreeProps({ treeData: [...newTree] });
      setDropzoneInformation(null);
      setDraggingNodeInformation(null);
    }
  }

  return (
    <DNDContext.Provider
      value={{
        draggingNodeInformation,
        dropzoneInformation,
        startDrag,
        hoverNode,
        completeDrop,
      }}
    >
      {props.children}
    </DNDContext.Provider>
  );
};

export { DNDContext, DNDContextProvider };
