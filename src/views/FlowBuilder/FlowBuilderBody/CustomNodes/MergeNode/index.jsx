import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position } from 'react-flow-renderer';
import { useDispatch } from 'react-redux';
import Icon from '../../../../../components/icons/DiamondMergeIcon';
import DefaultHandle from '../Handles/DefaultHandle';
import { useFlowContext } from '../../Context';
import actions from '../../../../../actions';

const useStyles = makeStyles(() => ({
  container: {
    width: 34,
    height: 34,
  },
}));

export default function MergeNode({id}) {
  const classes = useStyles();
  const { dragNodeId, flow } = useFlowContext();
  const flowId = flow?._id;
  const dispatch = useDispatch();
  const firstRouterId = flow?.routers?.[0]?._id;
  const isDroppable = !!dragNodeId && firstRouterId !== id;

  const handleMouseOut = useCallback(() => {
    dispatch(actions.flow.mergeTargetClear(flowId));
  }, []);
  const handleMouseOver = useCallback(() => {
    dispatch(actions.flow.mergeTargetSet(flowId, 'node', id));
  }, []);

  return (
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    <div
      className={classes.container}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      >
      <DefaultHandle type="target" position={Position.Left} />

      <Icon isDroppable={isDroppable} />

      <DefaultHandle type="source" position={Position.Right} />
    </div>
  );
}
