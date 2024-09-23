import "@testing-library/jest-dom";

import React from "react";
import { render } from "@testing-library/react";
import ReactAppleTree from "./ReactAppleTree";
import { ReactAppleTreeProps } from "./types";

describe("ReactAppleTree", () => {
  it("renders without crashing", () => {
    const props: ReactAppleTreeProps<any> = {
      treeData: [
        {
          id: 1,
          name: "Node 1",
          children: [
            {
              id: 2,
              name: "Node 2",
              children: [
                {
                  id: 3,
                  name: "Node 3",
                  children: [],
                },
              ],
            },
            {
              id: 4,
              name: "Node 4",
              children: [],
            },
          ],
        },
      ],
      onChange: () => {},
      getNodeKey: ({ node }) => node.id,
    };

    const { container } = render(<ReactAppleTree {...props} />);

    expect(container).toBeInTheDocument();
  });
});
