import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position, useStoreState } from 'react-flow-renderer';
import { Tooltip } from '@material-ui/core';
import DiamondIcon from '../../../icons/DiamondIcon';
import TerminalIcon from '../../../../../../../components/icons/MergeIcon';
import DefaultHandle from '../../Handles/DefaultHandle';

const useStyles = makeStyles(theme => ({
  container: {
    width: 20,
    height: 20,
  },
  terminal: {
    backgroundColor: theme.palette.common.white,
    border: `solid 1px ${theme.palette.secondary.lightest}`,
    color: theme.palette.secondary.light,
    borderRadius: '50%',
    padding: 2,
    width: 20,
    height: 20,
  },
}));

export const useIsTerminalOrMergeNodeDroppable = nodeId => {
  const selectedElements = useStoreState(state => state.selectedElements);

  if (!selectedElements) {
    return false;
  }
  const dragElement = selectedElements[0];

  if (!['terminalFree', 'merge'].includes(dragElement.type)) {
    return false;
  }

  return nodeId !== dragElement.id;
};

export default function TerminalFreeNode({ id }) {
  const classes = useStyles();

  const isDroppable = useIsTerminalOrMergeNodeDroppable(id);

  return (
    <div className={classes.container}>
      <DefaultHandle type="target" position={Position.Left} />
      {isDroppable ? (
        <DiamondIcon isDroppable />
      ) : (
        <Tooltip title="Drag to merge with other branch" position="top">
          <span>
            <TerminalIcon className={classes.terminal} />
          </span>
        </Tooltip>
      )}
    </div>
  );
}
