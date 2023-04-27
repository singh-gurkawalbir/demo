import React from 'react';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
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

export default function TitleTypography({className, children, sx}) {
  const classes = useStyles();

  return (
    <Typography
      component="div"
      className={clsx(classes.title, className)}
      variant="overline"
      sx={sx}>
      {children}
    </Typography>
  );
}
