import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Position } from 'reactflow';
import { Typography } from '@mui/material';
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
  infoText: {
    position: 'fixed',
    bottom: 15,
    width: 400,
    textTransform: 'none',
  },
}));

export default function EmptyNode({ data = {} }) {
  const classes = useStyles();

  const {infoText, name: branchName} = data;

  return (
    <div>
      <DefaultHandle type="target" position={Position.Left} />
      { branchName && (
      <Typography variant="overline" className={classes.branchName}>
        {branchName}
      </Typography>
      )}
      { infoText && (
      <Typography variant="h5" className={classes.infoText}>
        {infoText}
      </Typography>
      )}
      <div className={classes.emptyNode} />
      <DefaultHandle type="source" position={Position.Right} />
    </div>
  );
}
