import React, { useCallback } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Position } from 'reactflow';
import { useDispatch, useSelector } from 'react-redux';
import DiamondMergeIcon from '../../DiamondMergeIcon';
import DefaultHandle from '../Handles/DefaultHandle';
import { useFlowContext } from '../../Context';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import messageStore from '../../../../../utils/messageStore';

const useStyles = makeStyles(() => ({
  container: {
    width: 34,
    height: 34,
    '&:hover': {
      cursor: 'default',
    },
  },
}));

export default function MergeNode({id, data}) {
  const classes = useStyles();
  const { dragNodeId, flowId } = useFlowContext();
  const dispatch = useDispatch();
  const isFlowSaveInProgress = useSelector(state => selectors.isFlowSaveInProgress(state, flowId));
  const isDroppable = !!dragNodeId && !isFlowSaveInProgress && data?.mergableTerminals?.includes(dragNodeId);

  const handleMouseOut = useCallback(() => {
    dispatch(actions.flow.mergeTargetClear(flowId));
  }, [flowId, dispatch]);
  const handleMouseOver = useCallback(() => {
    dispatch(actions.flow.mergeTargetSet(flowId, 'node', id));
  }, [dispatch, flowId, id]);

  return (
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    <div
      className={classes.container}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      data-test="mergenode"
      >
      <DefaultHandle type="target" position={Position.Left} />

      <DiamondMergeIcon isDroppable={isDroppable} tooltip={messageStore('FLOWBUILDER.MERGE_NODE_TOOLTIP')} />

      <DefaultHandle type="source" position={Position.Right} />
    </div>
  );
}
