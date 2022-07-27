import clsx from 'clsx';
import React, { useCallback } from 'react';
import { makeStyles, Typography, Tooltip } from '@material-ui/core';
import { Position } from 'react-flow-renderer';
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
  const { dragNodeId, flowId } = useFlowContext();
  const dispatch = useDispatch();
  const isFlowSaveInProgress = useSelector(state =>
    selectors.isFlowSaveInProgress(state, flowId)
  );
  const isDroppable = !isFlowSaveInProgress && dragNodeId && dragNodeId !== id;
  const isBeingDragged = dragNodeId && dragNodeId === id;

  // TODO: @Sravan, set this variable to falsey if you do not want the branch name to show up...
  // which, i think, is any time the branch has at least one PP. so only if it is empty...
  // Note that since this branch name text is not known to dagre, it will not path find around it.
  // The implication is that possibly some graph edges or nodes could overlap... we could overcome
  // this by making the branch name appear on hover and position overtop (high z-index) the other
  // elements, but I suspect in most cases it will be fine, and we want the branch name to be visible
  // always...  If you fin d scenarios where there is an overlap, and these scenarios are very likely,
  // i'll have to refactor the node itself to be large enough to hold this new branch name text prior to
  // sending the node sizes to dagre... but this would be a much more challenging task, and could have
  // other layout implications!
  // FYI, the CSS trick here is the 'fixed' position which ignores its DOM node's size when rendering the
  // existing icon. Then a bottom offset of 25px, and a width of 200px to set the position/bounds of the
  // text relative to the icon. since the offset is from the bottom, single line or double line names are
  // offset correctly from the top of the icon.
  // Also note that the storybook branching stories are broken again. I fixed them locally by adding some
  // optional chaining, but i did not include this in the PR to keep it clean... please periodically check
  // the stories, as any UX developer will likely work in storybook (like me). It is WAY faster for me to
  // develop there...
  const branchName =
    data.branchName || 'This is a sample branch name that is long and wraps';
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
            {branchName && (
              <Typography variant="overline" className={classes.branchName}>
                {branchName}
              </Typography>
            )}
            {isBeingDragged ? (
              <TerminalIcon className={classes.dragging} />
            ) : (
              <Tooltip
                title={messageStore(
                  data.draggable
                    ? 'TERMINAL_NODE_TOOLTIP'
                    : 'TERMINAL_NODE_FROZEN_TOOLTIP'
                )}
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
