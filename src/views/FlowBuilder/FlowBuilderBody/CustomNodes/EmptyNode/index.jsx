import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position } from 'react-flow-renderer';
import DefaultHandle from '../Handles/DefaultHandle';

const useStyles = makeStyles(theme => ({
  emptyNode: {
    backgroundColor: theme.palette.secondary.lightest,
    width: 4,
    height: 2,
  },
}));

export default function EmptyNode() {
  const classes = useStyles();

  return (
    <div>
      <DefaultHandle type="target" position={Position.Left} />
      <div className={classes.emptyNode} />
      <DefaultHandle type="source" position={Position.Right} />
    </div>
  );
}
