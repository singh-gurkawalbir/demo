import React, { useCallback } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import RenewIcon from '../../../../../icons/RenewIcon';
import { selectors } from '../../../../../../reducers';
import { isIntegrationAppVerion2 } from '../../../../../../utils/integrationApps';
import { TILE_STATUS } from '../../../../../../utils/constants';
import actions from '../../../../../../actions';
import FieldMessage from '../../../../../DynaForm/fields/FieldMessage';

export default {
  key: 'RenewOrReactivate',
  useLabel: rowData => {
    const licenseMessageContent = useSelector(state => selectors.tileLicenseDetails(state, rowData).licenseMessageContent);

    return (
      <div>
        Renew subscription
        <FieldMessage
          isValid
          description={licenseMessageContent}
           />
      </div>
    );
  },
  icon: RenewIcon,
  useHasAccess: rowData => {
    const {_integrationId, status} = rowData;
    const isIntegrationV2 = useSelector(state => {
      const i = selectors.resource(state, 'integrations', _integrationId);

      return isIntegrationAppVerion2(i, true);
    });

    const {licenseMessageContent, expired, trialExpired, showTrialLicenseMessage, resumable} = useSelector(state =>
      selectors.tileLicenseDetails(state, rowData), shallowEqual
    );
    // Single means only button displayed here (Buy or renew), unistall button will be added if it is not single.
    const single = status === TILE_STATUS.IS_PENDING_SETUP || (!trialExpired && (isIntegrationV2 || !expired));

    if (!licenseMessageContent) return false;
    if (showTrialLicenseMessage) return false; // buy
    if (!showTrialLicenseMessage && single && resumable) return false; // reactivate

    return true;
  },
  useOnClick: rowData => {
    const { _connectorId} = rowData;
    const dispatch = useDispatch();
    const licenseId = useSelector(state =>
      selectors.tileLicenseDetails(state, rowData).licenseId
    );
    const handleRenew = useCallback(() => {
      dispatch(actions.user.org.accounts.requestUpdate('connectorRenewal', _connectorId, licenseId));
    }, [_connectorId, dispatch, licenseId]);

    return handleRenew;
  },
};
