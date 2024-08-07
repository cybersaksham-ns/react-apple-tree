import { ReactAppleTreeProps } from "../types";

export const defaultAppleTreeProps: ReactAppleTreeProps = {
  treeData: [],
  onChange: () => {},
  getNodeKey: () => {
    return -1;
  },
};
