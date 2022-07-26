import clsx from 'clsx';
import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position } from 'react-flow-renderer';
import { Tooltip } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import DiamondMergeIcon from '../../DiamondMergeIcon';
import TerminalIcon from '../../../../../components/icons/MergeIcon';
import DefaultHandle from '../Handles/DefaultHandle';
import { useFlowContext } from '../../Context';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import messageStore from '../../../../../utils/messageStore';

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
    '& svg': {
      backgroundColor: theme.palette.common.white,
      border: `solid 1px ${theme.palette.secondary.lightest}`,
      color: theme.palette.secondary.light,
      borderRadius: '50%',
      padding: 2,
      width: 20,
      height: 20,
    },
  },
  dropOffset: {
    marginLeft: -7,
    marginTop: -7,
  },
  notDraggableSpan: {
    cursor: 'default',
  },
  notDraggable: {
    opacity: 0.5,
    pointerEvents: 'none',
  },
}));

export default function TerminalNode({id, data = {}}) {
  const classes = useStyles();
  const { dragNodeId, flowId } = useFlowContext();
  const dispatch = useDispatch();
  const isFlowSaveInProgress = useSelector(state => selectors.isFlowSaveInProgress(state, flowId));
  const isDroppable = !isFlowSaveInProgress && dragNodeId && dragNodeId !== id;
  const isBeingDragged = dragNodeId && dragNodeId === id;

  const handleMouseOut = useCallback(() => {
    dispatch(actions.flow.mergeTargetClear(flowId));
  }, [dispatch, flowId]);
  const handleMouseOver = useCallback(() => {
    dispatch(actions.flow.mergeTargetSet(flowId, 'node', id));
  }, [dispatch, flowId, id]);

  return (
    <div
      data-test={`terminal-${id}`} className={clsx(classes.container, {
        [classes.dragging]: isBeingDragged,
        [classes.notDraggableSpan]: !data.draggable,
      })}>
      <DefaultHandle type="target" position={Position.Left} />
      {
      // eslint-disable-next-line no-nested-ternary
      isDroppable ? (
        <DiamondMergeIcon
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          isDroppable
          className={classes.dropOffset}
          />
      ) : (
        isBeingDragged ? (
          <TerminalIcon className={classes.dragging} />
        ) : (
          <Tooltip title={messageStore(data.draggable ? 'TERMINAL_NODE_TOOLTIP' : 'TERMINAL_NODE_FROZEN_TOOLTIP')} position="top">
            <span>
              <TerminalIcon
                disabled
                className={clsx(classes.terminal, {
                  [classes.notDraggable]: !data.draggable,
                })} />
            </span>
          </Tooltip>
        )
      )
    }
    </div>
  );
}
