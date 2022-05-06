
import clsx from 'clsx';
import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position } from 'react-flow-renderer';
import { Tooltip } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import DiamondIcon from '../../../../../../components/icons/DiamondIcon';
import TerminalIcon from '../../../../../../components/icons/MergeIcon';
import DefaultHandle from '../../Handles/DefaultHandle';
import { useFlowContext } from '../../../Context';
import actions from '../../../../../../actions';

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
  dragging: {
    display: 'none',
    width: 0,
    height: 0,
  },
  dropOffset: {
    marginLeft: -7,
    marginTop: -7,
  },
}));

export default function TerminalFreeNode({ id }) {
  const classes = useStyles();
  const { dragNodeId, flowId } = useFlowContext();
  const dispatch = useDispatch();
  const isDroppable = dragNodeId && dragNodeId !== id;
  const isBeingDragged = dragNodeId && dragNodeId === id;

  const handleMouseOut = useCallback(() => {
    dispatch(actions.flow.mergeTargetClear(flowId));
  }, []);
  const handleMouseOver = useCallback(() => {
    dispatch(actions.flow.mergeTargetSet(flowId, 'node', id));
  }, []);

  return (
    <div className={clsx(classes.container, {[classes.dragging]: isBeingDragged})}>
      <DefaultHandle type="target" position={Position.Left} />
      {
      // eslint-disable-next-line no-nested-ternary
      isDroppable ? (
        <DiamondIcon
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          isDroppable
          className={classes.dropOffset}
          />
      ) : (
        isBeingDragged ? (
          <TerminalIcon className={classes.dragging} />
        ) : (
          <Tooltip title="Drag to merge with other branch" position="top">
            <span>
              <TerminalIcon className={classes.terminal} />
            </span>
          </Tooltip>
        )
      )
    }
    </div>
  );
}
