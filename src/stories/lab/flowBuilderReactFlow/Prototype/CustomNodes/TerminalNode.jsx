import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position, Handle } from 'react-flow-renderer';
import { IconButton } from '@material-ui/core';
import Icon from '../../../../../components/icons/FlowsIcon';

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.common.white,
    border: `solid 1px ${theme.palette.secondary.light}`,
    padding: 0,
  },
  handle: {
    border: 0,
    width: 1,
    height: 1,
    backgroundColor: 'transparent',
  },

}));

export default function PageGenerator() {
  const classes = useStyles();

  return (
    <div>
      <Handle type="target" position={Position.Left} className={classes.handle} />
      <IconButton className={classes.button}>
        <Icon />
      </IconButton>
    </div>
  );
}
