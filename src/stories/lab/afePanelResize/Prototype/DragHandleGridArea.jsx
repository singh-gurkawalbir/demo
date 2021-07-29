import clsx from 'clsx';
import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  dragBar: {
    padding: 8,
    cursor: p => p.orientation === 'vertical' ? 'ew-resize' : 'ns-resize',
    '&:hover > div': {
      borderColor: theme.palette.primary.light,
    },
  },
  line: {
    transition: theme.transitions.create('border-color'),
  },
  line_vertical: {
    width: 0,
    height: '100%',
    borderLeft: `solid 1px ${theme.palette.secondary.lightest}`,
  },
  line_horizontal: {
    width: '100%',
    height: 0,
    borderTop: `solid 1px ${theme.palette.secondary.lightest}`,
  },
}));

export default function DragHandleGridArea({area, orientation = 'vertical', onMouseDown}) {
  const classes = useStyles({orientation});

  return (
    <div
      className={classes.dragBar}
      style={{ gridArea: area }}
      onMouseDown={onMouseDown} >
      <div className={clsx(classes.line, classes[`line_${orientation}`])} />
    </div>
  );
}
