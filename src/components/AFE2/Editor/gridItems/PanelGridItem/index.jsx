import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  gridItem: {
    border: 'solid 1px rgb(0,0,0,0.3)',
    overflow: 'hidden',
    minWidth: 150,
    minHeight: 70,
  },
}));

export default function PanelGridItem({ children, gridArea }) {
  const classes = useStyles();

  return (
    <div className={classes.gridItem} style={{ gridArea }}>
      {children}
    </div>
  );
}

