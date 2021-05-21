import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles, fade } from '@material-ui/core/styles';
import { SortableHandle } from 'react-sortable-hoc';
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
    position: 'absolute',
    cursor: 'grab',
    left: '8px',
    top: '8px',
  },
  tileGripperWrapper: {
    display: 'flex',
  },
  testWrapper: {
    display: 'flex',
  },
}));

const DragHandle = SortableHandle(({ className }) => (
  <div className={className}>
    <GripperIcon />
  </div>
));

export default function HomePageCardContainer({ children, onClick }) {
  const classes = useStyles();
  const [showGripper, setShowGripper] = useState(false);

  return (
    <div
      className={classes.tileGripperWrapper}
      onMouseEnter={() => setShowGripper(true)}
      onMouseLeave={() => setShowGripper(false)}>
      <Paper
        className={classes.wrapper}
        elevation={0}
        onClick={onClick} >
        <div>
          {showGripper && (
          <DragHandle className={classes.gripper} />
          )}
          {children}
        </div>
      </Paper>
    </div>
  );
}
