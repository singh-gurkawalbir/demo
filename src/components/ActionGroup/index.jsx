import clsx from 'clsx';
import React from 'react';
import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  spaceBetween: { flexGrow: 100 },
  actions: {
    display: 'flex',
    alignItems: 'center',
  },
  left: {
    '& > *': {
      marginRight: theme.spacing(2),
    },
  },
  right: {
    '& > :not(:last-child)': {
      marginRight: theme.spacing(2),
    },
  },
}));

export default function ActionGroup({ children, className, position = 'left' }) {
  const classes = useStyles();

  return (
    <>
      {position === 'right' && (<div className={classes.spaceBetween} />)}
      <div className={clsx(classes.actions, classes[position], className)}>
        {children}
      </div>
    </>
  );
}

ActionGroup.propTypes = {
  position: PropTypes.oneOf(['left', 'right']),
  children: PropTypes.node.isRequired,
};
ActionGroup.defaultProps = {
  position: 'left',
};
