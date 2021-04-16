import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles(theme => ({
  labelTop: {
    padding: theme.spacing(2, 1),
    fontWeight: 'bold',
  },
}));

export default function CronLabel(props) {
  const classes = useStyles();
  const { unit } = props;

  return (
    <Typography className={classes.labelTop}>{`Every * ${unit}`} </Typography>
  );
}
