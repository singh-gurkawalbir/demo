import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@mui/styles';
import { Typography } from '@mui/material';

const useStyles = makeStyles(theme => ({
  wrapper: {
    color: theme.palette.text.primary,
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '10px',
    borderTop: '1px solid',
    borderColor: theme.palette.divider,
    paddingTop: 10,
    width: '100%',
  },
}));

export default function Info(props) {
  const classes = useStyles();
  const { variant, label } = props;

  return (
    <div className={classes.wrapper}>
      <Typography variant="body2">{variant}</Typography>
      <Typography variant="body2">{label}</Typography>
    </div>
  );
}

