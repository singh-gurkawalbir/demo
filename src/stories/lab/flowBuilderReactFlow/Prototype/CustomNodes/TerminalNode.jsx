import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position } from 'react-flow-renderer';
import { IconButton } from '@material-ui/core';
import Icon from '../../../../../components/icons/FlowsIcon';
import DefaultHandle from './Handles/DefaultHandle';

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.common.white,
    border: `solid 1px ${theme.palette.secondary.light}`,
    padding: 0,
  },
}));

export default function TerminalNode() {
  const classes = useStyles();

  return (
    <div>
      <DefaultHandle type="target" position={Position.Left} />
      <IconButton className={classes.button}>
        <Icon />
      </IconButton>
    </div>
  );
}
