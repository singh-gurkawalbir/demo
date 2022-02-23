import React from 'react';
import PropTypes from 'prop-types';
import getImageUrl from '../../../utils/image';

export default function EmptyStateImg({ type}) {
  const path = getImageUrl(`images/react/empty-states/${type}.png`);

  return (
    <img
      alt={type || 'Empty state'}
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
