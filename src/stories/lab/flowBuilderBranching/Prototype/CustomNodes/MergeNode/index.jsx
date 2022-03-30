import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position } from 'react-flow-renderer';
import Icon from '../../icons/DiamondIcon';
import DefaultHandle from '../Handles/DefaultHandle';
import { useFlowContext } from '../../Context';
import actions from '../../reducer/actions';

const useStyles = makeStyles(() => ({
  container: {
    width: 34,
    height: 34,
  },
}));

export default function MergeNode({id}) {
  const classes = useStyles();
  const { dragNodeId, setState, flow } = useFlowContext();
  const firstRouterId = flow.routers[0]._id;
  const isDroppable = !!dragNodeId && firstRouterId !== id;

  const handleMouseOut = () => setState({type: actions.MERGE_TARGET_CLEAR});
  const handleMouseOver = () => setState({
    type: actions.MERGE_TARGET_SET,
    targetType: 'node',
    targetId: id,
  });

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
