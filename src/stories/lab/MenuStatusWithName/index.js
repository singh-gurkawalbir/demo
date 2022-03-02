import React from 'react';
import PropTypes from 'prop-types';

export default function MenuStatusWithName({name, status, isDragbar}) {
  return (
    <li>
      {isDragbar && <span> </span>} <span>{name}</span> <span>{status}</span>
    </li>
  );
}

MenuStatusWithName.propTypes = {
  name: PropTypes.string.isRequired,
  status: PropTypes.node,
  isDragbar: PropTypes.bool,
};
