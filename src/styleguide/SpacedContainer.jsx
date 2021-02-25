import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

export default function SpacedContainer({ children}) {
  const classes = useStyles();

  return <div className={classes.root}>{children}</div>;
}

