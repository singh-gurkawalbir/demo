import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import clsx from 'clsx';
import InfoIcon from '../icons/InfoIcon';

const useStyles = makeStyles(theme => ({
  infoFilter: {
    fontStyle: 'italic',
    display: 'flex',
    alignItems: 'flex-start',
    color: theme.palette.secondary.main,
    '& > svg': {
      marginTop: 2,
      marginRight: theme.spacing(0.5),
      fontSize: theme.spacing(2),
      color: theme.palette.text.hint,
    },
  },
}));

export default function InfoMessage({className, infoMessage }) {
  const classes = useStyles();

  return (
    <Typography component="div" variant="caption" className={clsx(classes.infoFilter, className)}>
      <InfoIcon />
      {infoMessage}
    </Typography>
  );
}
