import React from 'react';
import clsx from 'clsx';
import Paper from '@material-ui/core/Paper';
import { makeStyles, fade } from '@material-ui/core/styles';
import classNames from 'classnames';
import GripperIcon from '../../icons/GripperIcon';

const useStyles = makeStyles(theme => ({
  wrapper: {
    borderRadius: 4,
    padding: 22,
    minHeight: 318,
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid',
    borderColor: fade(theme.palette.common.black, 0.1),
    transitionProperty: 'all',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeIn,
    overflow: 'hidden',
    position: 'relative',
    display: 'inline-block',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 0 7px rgba(0,0,0,0.1)',
    },
    [theme.breakpoints.between('sm', 'md')]: {
      minWidth: '100%',
      maxWidth: '100%',
    },
  },
  center: {
    textAlign: 'center',
  },
  wrapperPlaceholder: {
    background: theme.palette.secondary.lightest,
    borderStyle: 'dashed',
    borderColor: theme.palette.primary.main,
  },
  gripper: {
    color: theme.palette.primary.main,
  }
}));

function HomePageCardContainer(props) {
  const classes = useStyles();
  const { children, isCardSelected = false } = props;

  return (
    <>
      {!isCardSelected ?
        <Paper
          className={classNames(classes.wrapper)}
          elevation={0}
          onClick={props.onClick}>
          <div>{children}</div>
        </Paper> :
        <Paper
          className={clsx(classes.wrapper, classes.wrapperPlaceholder)}
          elevation={0}
          onClick={props.onClick}>
          <GripperIcon className={classes.gripper} />
        </Paper>}
    </>
  );
}

export default HomePageCardContainer;
