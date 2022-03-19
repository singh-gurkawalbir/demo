import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position } from 'react-flow-renderer';
import Icon from '../../icons/DiamondIcon';
import DefaultHandle from '../Handles/DefaultHandle';
import { useIsTerminalOrMergeNodeDroppable } from '../terminalNodes/Free';

const useStyles = makeStyles(() => ({
  container: {
    width: 34,
    height: 34,
  },
}));

export default function MergeNode({id}) {
  const classes = useStyles();
  const isDroppable = useIsTerminalOrMergeNodeDroppable(id);

  return (
    <div className={classes.container}>
      <DefaultHandle type="target" position={Position.Left} />

      <Icon isDroppable={isDroppable} />

      <DefaultHandle type="source" position={Position.Right} />
    </div>
  );
}
