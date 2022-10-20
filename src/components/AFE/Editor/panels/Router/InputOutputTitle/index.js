import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Help from '../../../../../Help';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  helpButton: {
    padding: 0,
    margin: 2,
  },
  message: {
    backgroundColor: theme.palette.secondary.lightest,
    borderRadius: 4,
    padding: theme.spacing(0.5, 2),
    color: theme.palette.secondary.darkest,
    fontFamily: 'Roboto400',
    lineHeight: 1,
  },
}));

export default function InputOutputTitle({ activeProcessor, type }) {
  const classes = useStyles();
  const helpKey = `afe.router.${type}`;
  let title = '';

  if (type === 'input') {
    title = activeProcessor === 'javascript' ? 'Function input' : 'Input';
  } else { // output
    title = activeProcessor === 'javascript' ? 'Function output' : 'Output';
  }

  return (
    <div className={classes.wrapper}>
      <Typography variant="body1" component="div">{title}</Typography>
      <Help
        title={title}
        className={classes.helpButton}
        helpKey={helpKey}
      />
    </div>
  );
}
