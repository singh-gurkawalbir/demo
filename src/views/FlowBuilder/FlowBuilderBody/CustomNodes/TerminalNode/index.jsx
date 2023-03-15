import clsx from 'clsx';
import React, { useCallback } from 'react';
import { Typography, Tooltip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Position } from 'reactflow';
import { useDispatch, useSelector } from 'react-redux';
import DiamondMergeIcon from '../../DiamondMergeIcon';
import TerminalIcon from '../../../../../components/icons/MergeIcon';
import DefaultHandle from '../Handles/DefaultHandle';
import { useFlowContext } from '../../Context';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import { message } from '../../../../../utils/messageStore';
import { GRAPH_ELEMENTS_TYPE } from '../../../../../constants';

const useStyles = makeStyles(theme => ({
  container: {
    width: 20,
    height: 20,
  },
  terminal: {
    backgroundColor: theme.palette.background.paper,
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
  notDraggableSpan: {
    cursor: 'default',
  },
  notDraggable: {
    opacity: 0.5,
    pointerEvents: 'none',
  },
  branchName: {
    position: 'fixed',
    bottom: 25,
    width: 200,
    textTransform: 'none',
    color: theme.palette.text.secondary,
  },
}));

export default function TerminalNode({ id, data = {} }) {
  const classes = useStyles();
  const { dragNodeId, flowId, elements, elementsMap } = useFlowContext();
  const dispatch = useDispatch();
  const isFlowSaveInProgress = useSelector(state =>
    selectors.isFlowSaveInProgress(state, flowId)
  );
  const isDroppable = !isFlowSaveInProgress && dragNodeId && dragNodeId !== id;
  const isBeingDragged = dragNodeId && dragNodeId === id;
  const edge = elements.find(el => el.target === id);
  const isEmptyBranch = edge && elementsMap[edge.source]?.type === GRAPH_ELEMENTS_TYPE.ROUTER;
  const branchName = data.name || '';
  const handleMouseOut = useCallback(() => {
    dispatch(actions.flow.mergeTargetClear(flowId));
  }, [dispatch, flowId]);
  const handleMouseOver = useCallback(() => {
    dispatch(actions.flow.mergeTargetSet(flowId, 'node', id));
  }, [dispatch, flowId, id]);

  return (
    <div
      data-test={`terminal-${id}`}
      className={clsx(classes.container, {
        [classes.dragging]: isBeingDragged,
        [classes.notDraggableSpan]: !data.draggable,
      })}
    >
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
          <>
            {isEmptyBranch && branchName && (
              <Typography variant="overline" className={classes.branchName}>
                {branchName}
              </Typography>
            )}
            {isBeingDragged ? (
              <TerminalIcon className={classes.dragging} />
            ) : (
              <Tooltip
                title={
                  data.draggable
                    ? message.FLOWBUILDER.TERMINAL_NODE_TOOLTIP
                    : message.FLOWBUILDER.TERMINAL_NODE_FROZEN_TOOLTIP
                }
                position="top"
              >
                <span>
                  <TerminalIcon
                    disabled
                    className={clsx(classes.terminal, {
                      [classes.notDraggable]: !data.draggable,
                    })}
                  />
                </span>
              </Tooltip>
            )}
          </>
        )
      }
    </div>
  );
}
