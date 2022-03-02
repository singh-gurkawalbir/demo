import React from 'react';
import PropTypes from 'prop-types';
import SortableHandle from '../../../components/Sortable/SortableHandle';

export default function MenuStatusWithName({name, status, isGripperVisible = false, onMouseEnter, onMouseLeave}) {
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

MenuStatusWithName.propTypes = {
  name: PropTypes.string.isRequired,
  status: PropTypes.node,
  isGripperVisible: PropTypes.bool,
};
