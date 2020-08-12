import React from 'react';
import clsx from 'clsx';
import { makeStyles, CircularProgress } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
  center: {
    textAlign: 'center',
  },
});

/**
 * Render an indeterminate spinning indicator.
 */
function Spinner(props) {
  const classes = useStyles();
  const { loading, color, className, ...rest } = props;
  const progress = (
    <CircularProgress
      color={color || 'inherit'}
      className={className}
      {...rest}
    />
  );

  return loading ? (
    <div className={clsx(classes.center, className)}>{progress}</div>
  ) : (
    progress
  );
}

Spinner.propTypes = {
  size: PropTypes.number,
  thickness: PropTypes.number,
};

export default Spinner;
