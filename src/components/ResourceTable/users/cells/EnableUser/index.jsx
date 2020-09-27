import React, { useCallback } from 'react';
import CeligoSwitch from '../../../../CeligoSwitch';
import { ACCOUNT_IDS } from '../../../../../utils/constants';

export default function EnableUser({ user, integrationId}) {
  const handleSwitch = useCallback(() => {
    // console.log('switch click');
  }, []);

  return (
    <CeligoSwitch
      data-test="disableUser"
      disabled={!user.accepted || (integrationId && (user._id === ACCOUNT_IDS.OWN))}
      checked={!user.disabled}
      onChange={handleSwitch}
      />
  );
}
