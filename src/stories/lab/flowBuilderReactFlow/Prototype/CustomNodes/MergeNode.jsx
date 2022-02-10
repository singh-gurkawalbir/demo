import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position } from 'react-flow-renderer';
import { IconButton } from '@material-ui/core';
import Icon from '../../../../../components/icons/AddIcon';
import DefaultHandle from './Handles/DefaultHandle';

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.common.white,
    border: `solid 1px ${theme.palette.secondary.light}`,
  },
}));

export default function MergeNode() {
  const classes = useStyles();

  return (
    <div>
      <DefaultHandle type="target" position={Position.Left} />

      <IconButton className={classes.button}>
        <Icon />
      </IconButton>

      <DefaultHandle type="source" position={Position.Right} />
    </div>
  );
}
