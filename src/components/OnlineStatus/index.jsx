import React from 'react';
import PropTypes from 'prop-types';
import Status from '../Buttons/Status';

export default function OnlineStatus({offline}) {
  return (
    <Status size="small" variant={offline ? 'error' : 'success'} >
      {offline ? 'Offline' : 'Online'}
    </Status>
  );
}

OnlineStatus.propTypes = {
  offline: PropTypes.string.isRequired,
};
