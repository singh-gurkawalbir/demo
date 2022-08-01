import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position } from 'react-flow-renderer';
import { Typography } from '@material-ui/core';
import DefaultHandle from '../Handles/DefaultHandle';

const useStyles = makeStyles(theme => ({
  emptyNode: {
    backgroundColor: theme.palette.secondary.lightest,
    width: 4,
    height: 2,
  },
  branchName: {
    position: 'fixed',
    bottom: 15,
    width: 200,
    textTransform: 'none',
    color: theme.palette.text.secondary,
  },
}));

export default function EmptyNode({ data = {} }) {
  const classes = useStyles();

  const branchName = data.name;

  return (
    <div>
      <DefaultHandle type="target" position={Position.Left} />
      { branchName && (
      <Typography variant="overline" className={classes.branchName}>
        {branchName}
      </Typography>
      )}
      <div className={classes.emptyNode} />
      <DefaultHandle type="source" position={Position.Right} />
    </div>
  );
}
