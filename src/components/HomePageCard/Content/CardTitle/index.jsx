import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    paddingBottom: 5,
    minHeight: 55,
    color: theme.palette.secondary.main,
    cursor: 'pointer',
  },
}));

export default function CardTitle({children}) {
  const classes = useStyles();

  return <div className={classes.root}>{children}</div>;
}

