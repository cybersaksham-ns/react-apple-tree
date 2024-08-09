import React, { createContext, useContext, useState } from "react";
import { ContextProviderProps, FlatTreeItem } from "../types";
import { PropDataContext } from "./PropDataContext";
import { TreeDataContext } from "./TreeDataContext";
import {
  AppendDropNodeProps,
  DraggingNodeInformation,
  DropZoneInformation,
  NodeAppendDirection,
  StartDragProps,
} from "./DNDContextTypes";
import {
  calculateNodeDepth,
  collapseNode,
  expandNodeOneLevelUtils,
  getParentKeyAndSiblingCountFromList,
  moveNodeToDifferentParent,
} from "../utils";

interface DNDContextProps {
  draggingNodeInformation: DraggingNodeInformation | null;
  dropzoneInformation: DropZoneInformation | null;
  startDrag: (params: StartDragProps) => void;
  appendDropNode: (params: AppendDropNodeProps) => void;
  completeDrop: () => void;
}

const DNDContext = createContext<DNDContextProps>({
  draggingNodeInformation: null,
  dropzoneInformation: null,
  startDrag: (params: StartDragProps) => {},
  appendDropNode: (params: AppendDropNodeProps) => {},
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

  function removeNodeFromFlatList(
    nodeIndex: number,
    initialList: Array<FlatTreeItem>
  ) {
    return [
      ...initialList.slice(0, nodeIndex),
      ...initialList.slice(nodeIndex + 1),
    ];
  }

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
  function appendDropNode(params: AppendDropNodeProps) {
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
      newFlatList = removeNodeFromFlatList(
        draggingNodeInformation.dragStartIndex,
        newFlatList
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
      newFlatList = removeNodeFromFlatList(
        dropzoneInformation.dropIndex,
        newFlatList
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
        const [map, updatedFlatList] = expandNodeOneLevelUtils(
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
      newFlatNode.dropSuccessNode = true;
    }
    newFlatList = [
      ...newFlatList.slice(0, hoverDropIndex),
      { ...newFlatNode },
      ...newFlatList.slice(hoverDropIndex),
    ];

    // Get position of node in tree
    const [parentKey, siblingCount] = getParentKeyAndSiblingCountFromList(
      flatTree,
      params.nodeIndex
    );

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
      setAppleTreeProps({ ...appleTreeProps, treeData: [...newTree] });
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
        appendDropNode,
        completeDrop,
      }}
    >
      {props.children}
    </DNDContext.Provider>
  );
};

export { DNDContext, DNDContextProvider };
