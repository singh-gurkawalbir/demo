import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import { alpha } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import SortableHandle from '../../Sortable/SortableHandle';

const useStyles = makeStyles(theme => ({
  wrapper: {
    borderRadius: 4,
    padding: 22,
    minHeight: 318,
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid',
    borderColor: alpha(theme.palette.common.black, 0.1),
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
    [theme.breakpoints.between('sm', 'lg')]: {
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

export default function HomePageCardContainer({ children, onClick, isDragInProgress, isTileDragged }) {
  const classes = useStyles();
  const [showGripper, setShowGripper] = useState(false);

  useEffect(() => {
    if (isTileDragged) {
      setShowGripper(true);
    }
  }, [isTileDragged]);

  const handleMouseEnter = () => {
    if (!isDragInProgress) {
      setShowGripper(true);
    }
  };
  const handleMouseLeave = () => {
    if (!isDragInProgress) {
      setShowGripper(false);
    }
  };

  return (
    <div
      className={classes.tileGripperWrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <Paper
        className={classes.wrapper}
        elevation={0}
        onClick={onClick} >
        <div>
          <SortableHandle className={classes.gripper} isVisible={showGripper} />
          {children}
        </div>
      </Paper>
    </div>
  );
}

HomePageCardContainer.propTypes = {
  children: PropTypes.node.isRequired,
  onclick: PropTypes.func,
};
