import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position } from 'react-flow-renderer';
import CircleIcon from '../CircleIcon';
import DefaultHandle from '../../Handles/DefaultHandle';

const useStyles = makeStyles(theme => ({
  container: {
    width: 24,
    height: 24,
  },
  terminal: {
    backgroundColor: theme.palette.common.white,
    border: `solid 1px ${theme.palette.secondary.light}`,
    color: theme.palette.secondary.light,
    borderRadius: '50%',
    padding: 2,
  },
}));

export default function TerminalBlockedNode() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <DefaultHandle type="target" position={Position.Left} />
      <CircleIcon />
    </div>
  );
}
