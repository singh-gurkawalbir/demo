import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  title: {
    display: 'flex',
    fontSize: 14,
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.secondary.main,
    fontFamily: 'Roboto400',
  },
}));

export default function TitleTypography({className, children}) {
  const classes = useStyles();

  return (
    <Typography
      component="div"
      className={clsx(classes.title, className)}
      variant="overline">
      {children}
    </Typography>
  );
}
