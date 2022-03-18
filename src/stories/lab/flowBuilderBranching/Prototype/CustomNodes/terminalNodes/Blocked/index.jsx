import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position } from 'react-flow-renderer';
import DefaultHandle from '../../Handles/DefaultHandle';

const useStyles = makeStyles(() => ({
  container: {
    width: 1,
    height: 1,
    background: 'red',
  },
}));

export default function TerminalBlockedNode() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <DefaultHandle type="target" position={Position.Left} />
    </div>
  );
}
