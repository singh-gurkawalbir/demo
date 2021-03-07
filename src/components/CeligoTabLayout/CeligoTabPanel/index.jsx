import React from 'react';
import PropTypes from 'prop-types';

export default function CeligoTabPanel(props) {
  const { children, value, panelId, ...other } = props;

  return (
    <div hidden={value !== panelId} {...other} >
      {value === panelId && children}
    </div>
  );
}

CeligoTabPanel.propTypes = {
  children: PropTypes.node,
  panelId: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
