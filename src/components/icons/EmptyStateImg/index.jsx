import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import clsx from 'clsx';
import PropTypes from 'prop-types';
import getImageUrl from '../../../utils/image';

// const useStyles = makeStyles(theme => ({
//   small: {
//     maxHeight: '26px',
//   },
//   medium: {
//     maxHeight: theme.spacing(7),
//   },
//   large: {
//     maxWidth: theme.spacing(16),
//     maxHeight: theme.spacing(16),
//   },
// }));

export default function EmptyStateImg({ type, className}) {
  // const classes = useStyles();
  const path = getImageUrl(`images/react/empty-states/${type}.svg`);

  return (
    <img
      className={className}
      alt={type || 'Empty image'}
      src={path}
    />
  );
}

EmptyStateImg.propTypes = {
  alt: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
};
EmptyStateImg.defaultProps = {
  alt: 'Empty image',
};
