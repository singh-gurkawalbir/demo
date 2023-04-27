import React from 'react';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  flexContainer: {
    display: 'flex',
  },
  stepperIndex: {
    position: 'relative',
    zIndex: 1,
    borderRadius: '50%',
    display: 'inline-block',
    border: `2px solid ${theme.palette.secondary.lightest}`,
    width: 22,
    lineHeight: '18px',
    textAlign: 'center',
    backgroundColor: theme.palette.background.paper,
    fontSize: 13,
    color: theme.palette.secondary.light,
  },
  line: {
    '&:before': {
      content: '""',
      height: '100%',
      backgroundColor: theme.palette.secondary.lightest,
      width: 2,
      position: 'absolute',
      top: 0,
      left: theme.spacing(-1.5),
    },
  },
  childrenContainer: {
    position: 'relative',
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    flex: 1,
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
