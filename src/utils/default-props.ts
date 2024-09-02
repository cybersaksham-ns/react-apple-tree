import { getReactElementText } from "./common";
import { ReactAppleTreeProps } from "../types";
import { DND_TYPE } from "../hooks/dnd";

export const DefaultRowHeight = 62;
export const DefaultScaffoldBlockPxWidth = 44;
export const DefaultSlideRegionSize = 100;

export const defaultAppleTreeProps: ReactAppleTreeProps = {
  treeData: [],
  onChange: () => {},
  getNodeKey: () => {
    return -1;
  },
  canDrag: true,
  canDrop: () => true,
  searchMethod: ({ node, searchQuery }) => {
    let titleMatch: boolean = false;
    let subtitleMatch = false;

    if (typeof node.title === "object") {
      titleMatch = getReactElementText(node.title).indexOf(searchQuery) > -1;
    } else {
      titleMatch = node.title
        ? String(node.title).indexOf(searchQuery) > -1
        : false;
    }

    if (typeof node.subtitle === "object") {
      subtitleMatch =
        getReactElementText(node.subtitle).indexOf(searchQuery) > -1;
    } else {
      subtitleMatch = node.subtitle
        ? String(node.subtitle).indexOf(searchQuery) > -1
        : false;
    }

    return titleMatch || subtitleMatch;
  },
  onlyExpandSearchedNodes: false,
  dndType: DND_TYPE,
  isVirtualized: true,
  rowHeight: DefaultRowHeight,
  scaffoldBlockPxWidth: DefaultScaffoldBlockPxWidth,
  slideRegionSize: DefaultSlideRegionSize,
};
