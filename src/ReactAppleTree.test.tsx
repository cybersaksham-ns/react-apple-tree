import "@testing-library/jest-dom";

import React from "react";
import { render, screen } from "@testing-library/react";
import ReactAppleTree from "./ReactAppleTree";
import { ReactAppleTreeProps } from "./types";

interface GetDummyNodeProps {
  id: number;
  children?: Array<any>;
  expanded?: boolean;
}

const getDummyNode = ({ id, children, expanded }: GetDummyNodeProps) => ({
  id,
  name: `Node ${id}`,
  children,
  expanded,
});

const treeData = [
  getDummyNode({
    id: 1,
    children: [
      getDummyNode({ id: 2, children: [getDummyNode({ id: 3 })] }),
      getDummyNode({ id: 4 }),
    ],
  }),
  getDummyNode({ id: 5 }),
];

const expandedTreeData = [
  getDummyNode({
    id: 1,
    expanded: true,
    children: [
      getDummyNode({
        id: 2,
        expanded: true,
        children: [getDummyNode({ id: 3 })],
      }),
      getDummyNode({ id: 4 }),
    ],
  }),
  getDummyNode({ id: 5 }),
];

const defaultProps: ReactAppleTreeProps<any> = {
  treeData,
  onChange: () => {},
  getNodeKey: ({ node }) => node.id,
};

describe("ReactAppleTree", () => {
  // Rendering
  it("renders without crashing", () => {
    const { container } = render(<ReactAppleTree {...defaultProps} />);

    expect(container).toBeInTheDocument();
  });

  // Custom node renderer
  it("renders with custom node renderer", () => {
    render(
      <ReactAppleTree
        {...defaultProps}
        generateNodeProps={({ node }) => ({
          title: () => "Node - " + node.name,
        })}
      />
    );
    expect(screen.queryByText("Node - Node 1")).toBeInTheDocument();
  });

  // Rendering nodes
  it("should render 0 nodes for empty treeData", () => {
    render(<ReactAppleTree {...defaultProps} treeData={[]} />);
    expect(screen.queryAllByRole("row").length).toEqual(0);
  });
  it("should render 1 node for treeData with 1 node", () => {
    render(
      <ReactAppleTree {...defaultProps} treeData={[getDummyNode({ id: 1 })]} />
    );
    expect(screen.queryAllByRole("row").length).toEqual(1);
  });
  it("should render 3 nodes for treeData with 3 nodes", () => {
    render(
      <ReactAppleTree
        {...defaultProps}
        treeData={[
          getDummyNode({ id: 1 }),
          getDummyNode({ id: 2 }),
          getDummyNode({ id: 3 }),
        ]}
      />
    );
    expect(screen.queryAllByRole("row").length).toEqual(3);
  });

  // Nested Tree
  it("should render nested, expanded tree", () => {
    render(<ReactAppleTree {...defaultProps} treeData={expandedTreeData} />);
    expect(screen.queryAllByRole("row").length).toEqual(5);
  });
  it("should render nested, collapsed tree", () => {
    render(<ReactAppleTree {...defaultProps} treeData={treeData} />);
    expect(screen.queryAllByRole("row").length).toEqual(2);
  });
});
