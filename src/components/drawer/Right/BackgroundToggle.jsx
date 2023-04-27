import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useDrawerContext } from './DrawerContext';

const useStyles = makeStyles(theme => ({
  dark: {
    backgroundColor: theme.palette.background.default,
  },
  light: {
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function DrawerSubHeader({ children, reverse }) {
  const classes = useStyles();
  const { height } = useDrawerContext();

  let name = 'light';

  if ((height === 'short' && !reverse) || (height === 'tall' && reverse)) {
    name = 'dark';
  }

  return (
    <div className={classes[name]}>
      {children}
    </div>
  );
}
