import clsx from 'clsx';
import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
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
      '&:last-child': {
        marginRight: 0,
      },
    },

  },
  right: {
    '& > :not(:last-child)': {
      marginRight: theme.spacing(2),
    },
  },
}));

export default function ActionGroup({ children, position, className }) {
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
  className: PropTypes.string,
};
ActionGroup.defaultProps = {
  position: 'left',
};
