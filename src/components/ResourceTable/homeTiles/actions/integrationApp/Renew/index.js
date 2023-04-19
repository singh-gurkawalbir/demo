import React, { useCallback } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import RenewIcon from '../../../../../icons/RenewIcon';
import { selectors } from '../../../../../../reducers';
import { isIntegrationAppVersion2 } from '../../../../../../utils/integrationApps';
import { TILE_STATUS } from '../../../../../../constants';
import actions from '../../../../../../actions';
import FieldMessage from '../../../../../DynaForm/fields/FieldMessage';

const useStyles = makeStyles(theme => ({
  icon: {
    marginTop: theme.spacing(-6),
    marginRight: theme.spacing(1),
  },
}));

export default {
  key: 'Renew',
  useLabel: rowData => {
    const classes = useStyles();
    const licenseMessageContent = useSelector(state => selectors.tileLicenseDetails(state, rowData).licenseMessageContent);

    return (
      <>
        <div className={classes.icon}>
          <RenewIcon />
        </div>
        <div>
          Renew subscription
          <FieldMessage
            isValid
            description={licenseMessageContent}
           />
        </div>
      </>
    );
  },
  useHasAccess: rowData => {
    const {_integrationId, status} = rowData;
    const isIntegrationV2 = useSelector(state => {
      const i = selectors.resource(state, 'integrations', _integrationId);

      return isIntegrationAppVersion2(i, true);
    });

    const {licenseMessageContent, expired, trialExpired, showTrialLicenseMessage, resumable} = useSelector(state =>
      selectors.tileLicenseDetails(state, rowData), shallowEqual
    );

    if (!licenseMessageContent) return false;
    if (showTrialLicenseMessage) return false; // buy

    // Single means only button displayed here (Buy or renew), unistall button will be added if it is not single.
    const single = status === TILE_STATUS.IS_PENDING_SETUP || (!trialExpired && (isIntegrationV2 || !expired));

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
      dispatch(actions.license.requestUpdate('connectorRenewal', {connectorId: _connectorId, licenseId}));
    }, [_connectorId, dispatch, licenseId]);

    return handleRenew;
  },
};
