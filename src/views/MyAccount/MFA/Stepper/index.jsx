import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  flexContainer: {
    display: 'flex',
  },
  stepperIndex: {
    position: 'relative',
    zIndex: 1,
    borderRadius: '50%',
    display: 'inline-block',
    border: `1px solid ${theme.palette.secondary.lightest}`,
    width: 22,
    lineHeight: '22px',
    textAlign: 'center',
    backgroundColor: theme.palette.background.paper,
  },
  line: {
    '&:before': {
      content: '""',
      height: '100%',
      backgroundColor: theme.palette.secondary.lightest,
      width: 1,
      position: 'absolute',
      top: 0,
      left: -11,
    },
  },
  childrenContainer: {
    position: 'relative',
    paddingLeft: theme.spacing(2),
  },
}));

export default function Stepper({ index, children, isLast }) {
  const classes = useStyles();

  return (
    <div className={classes.flexContainer}>
      <div>
        <span className={classes.stepperIndex}>{index}</span>
      </div>
      <div className={clsx(classes.childrenContainer, { [classes.line]: !isLast })}>
        {children}
      </div>
    </div>
  );
}
