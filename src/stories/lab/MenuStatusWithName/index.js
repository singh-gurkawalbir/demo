import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import AddIcon from '../../../components/icons/AddIcon';

export default function MenuStatusWithName({name, status, isDragbar, onClick}) {
  return (
    <li>
      {isDragbar && <span> <IconButton onClick={onClick}><AddIcon /></IconButton></span>} <span>{name}</span> <span>{status}</span>
    </li>
  );
}

MenuStatusWithName.propTypes = {
  name: PropTypes.string.isRequired,
  status: PropTypes.node,
  isDragbar: PropTypes.bool,
};
