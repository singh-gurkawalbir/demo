import React from 'react';
import PropTypes from 'prop-types';
import SortableHandle from '../../../components/Sortable/SortableHandle';

export default function MenuLinkWithStatus({name, status, isGripperVisible = false, onMouseEnter, onMouseLeave}) {
  return (
    <li>
      {isGripperVisible && (
      <span onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <SortableHandle isVisible={isGripperVisible} />
      </span>
      )}
      <span>{name}</span>
      <span>{status}</span>
    </li>
  );
}

MenuLinkWithStatus.propTypes = {
  name: PropTypes.string.isRequired,
  status: PropTypes.node,
  isGripperVisible: PropTypes.bool,
};
