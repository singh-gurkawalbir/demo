import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  dragBar: {
    padding: 8,
    cursor: 'ew-resize',
    '&:hover > div': {
      borderColor: theme.palette.primary.light,
    },
  },
  line: {
    width: 0,
    height: '100%',
    transition: theme.transitions.create('border-color'),
    borderLeft: `solid 1px ${theme.palette.secondary.lightest}`,
  },
}));

export default function DragHandleY({area, onMouseDown}) {
  const classes = useStyles();

  return (
    <div
      className={classes.dragBar}
      style={{ gridArea: area }}
      onMouseDown={onMouseDown} >
      <div className={classes.line} />
    </div>
  );
}
