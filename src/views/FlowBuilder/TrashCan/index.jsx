import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Tooltip } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(theme => ({
  root: {
    // border: 'solid 1px lightgreen',
    width: 110,
    height: 110,
    '&:hover svg': {
      width: 80,
      height: 80,
    },
  },
  button: {
    position: 'absolute',
    margin: theme.spacing(1),
    bottom: 0,
    right: 0,
    '& svg': {
      transition: theme.transitions.create(['width', 'height'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  },
}));

export default function TrashCan({ className, ...rest }) {
  const classes = useStyles();

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Tooltip title="Drag applications here to delete">
        <IconButton aria-label="delete" size="large" className={classes.button}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}
