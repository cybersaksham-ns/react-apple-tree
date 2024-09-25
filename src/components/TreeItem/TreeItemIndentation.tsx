import React, { useContext, useEffect, useState } from "react";
import {
  StlyedHighlightedLineBlock,
  StyledEmptyBlock,
  StyledHorizontalLineBlock,
  StyledTreeItemIndentation,
  StyledVerticalAndHorizontalLineBlock,
  StyledVerticalLineBlock,
} from "./index.styles";
import { PropDataContext } from "../../contexts/PropDataContext";
import { DEFAULT_SCAFFOLD_BLOCK_PX_WIDTH } from "../../constants";
import { DNDContext } from "../../contexts/DNDContext";
import { getActualDropLineInformation } from "../../utils/node-style";
import { FlatTreeItem } from "../../types";
import { calculateNodeDepth } from "../../utils/node-operations";

interface TreeItemIndentationProps {
  nodeIndex: number;
  node: FlatTreeItem;
}

const TreeItemIndentation = ({ nodeIndex, node }: TreeItemIndentationProps) => {
  const { appleTreeProps } = useContext(PropDataContext);
  const { dropzoneInformation } = useContext(DNDContext);
  const [depth, setDepth] = useState(calculateNodeDepth(node) - 1);

  useEffect(() => {
    setDepth(calculateNodeDepth(node) - 1);
  }, [node]);

  const {
    actualDropLineDepth,
    startActualDropLine,
    midActualDropLine,
    endActualDropLine,
  } = getActualDropLineInformation(nodeIndex, dropzoneInformation);

  return (
    <StyledTreeItemIndentation>
      {depth > 0 &&
        (actualDropLineDepth === 0 && endActualDropLine ? (
          <StlyedHighlightedLineBlock
            $scaffoldWidth={
              appleTreeProps.scaffoldBlockPxWidth ||
              DEFAULT_SCAFFOLD_BLOCK_PX_WIDTH
            }
            $position="end"
          />
        ) : actualDropLineDepth === 0 && midActualDropLine ? (
          <StlyedHighlightedLineBlock
            $scaffoldWidth={
              appleTreeProps.scaffoldBlockPxWidth ||
              DEFAULT_SCAFFOLD_BLOCK_PX_WIDTH
            }
            $position="mid"
          />
        ) : (
          <StyledEmptyBlock
            $scaffoldWidth={
              appleTreeProps.scaffoldBlockPxWidth ||
              DEFAULT_SCAFFOLD_BLOCK_PX_WIDTH
            }
          />
        ))}
      {depth > 0 &&
        Array.from(new Array(depth - 1)).map((el, i) =>
          actualDropLineDepth === i + 1 &&
          (startActualDropLine || midActualDropLine || endActualDropLine) ? (
            <StlyedHighlightedLineBlock
              $scaffoldWidth={
                appleTreeProps.scaffoldBlockPxWidth ||
                DEFAULT_SCAFFOLD_BLOCK_PX_WIDTH
              }
              $position={
                startActualDropLine
                  ? "start"
                  : midActualDropLine
                    ? "mid"
                    : "end"
              }
            />
          ) : (
            <StyledVerticalLineBlock
              key={`rat_item_indentation_${node.mapId}_${i}`}
              $scaffoldWidth={
                appleTreeProps.scaffoldBlockPxWidth ||
                DEFAULT_SCAFFOLD_BLOCK_PX_WIDTH
              }
            />
          )
        )}
      {startActualDropLine ? (
        <StlyedHighlightedLineBlock
          $scaffoldWidth={
            appleTreeProps.scaffoldBlockPxWidth ||
            DEFAULT_SCAFFOLD_BLOCK_PX_WIDTH
          }
          $position="start"
        />
      ) : depth === 0 ? (
        <StyledHorizontalLineBlock
          $scaffoldWidth={
            appleTreeProps.scaffoldBlockPxWidth ||
            DEFAULT_SCAFFOLD_BLOCK_PX_WIDTH
          }
          data-testid={`tree-item-indentation-main-block-${node.mapId}`}
        />
      ) : (
        <StyledVerticalAndHorizontalLineBlock
          $scaffoldWidth={
            appleTreeProps.scaffoldBlockPxWidth ||
            DEFAULT_SCAFFOLD_BLOCK_PX_WIDTH
          }
          data-testid={`tree-item-indentation-main-block-${node.mapId}`}
        />
      )}
    </StyledTreeItemIndentation>
  );
};

export default TreeItemIndentation;
