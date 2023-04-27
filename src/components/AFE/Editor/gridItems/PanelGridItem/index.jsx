import React from 'react';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  gridItem: {
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
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

