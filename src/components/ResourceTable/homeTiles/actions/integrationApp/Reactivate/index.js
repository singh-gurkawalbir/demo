import React, { useCallback } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import ReactivateIcon from '../../../../../icons/ReactivateIcon';
import { selectors } from '../../../../../../reducers';
import { isIntegrationAppVersion2 } from '../../../../../../utils/integrationApps';
import { TILE_STATUS, INTEGRATION_ACCESS_LEVELS, USER_ACCESS_LEVELS } from '../../../../../../constants';
import actions from '../../../../../../actions';
import useEnqueueSnackbar from '../../../../../../hooks/enqueueSnackbar';
import FieldMessage from '../../../../../DynaForm/fields/FieldMessage';

const useStyles = makeStyles(theme => ({
  icon: {
    marginTop: theme.spacing(-6),
    marginRight: theme.spacing(1),
  },
}));

export default {
  key: 'Reactivate',
  useLabel: rowData => {
    const classes = useStyles();
    const licenseMessageContent = useSelector(state => selectors.tileLicenseDetails(state, rowData).licenseMessageContent);

    return (
      <>
        <div className={classes.icon}>
          <ReactivateIcon />
        </div>
        <div>
          Reactivate integration
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

    // Single means only button displayed here (Buy or renew), unistall button will be added if it is not single.
    const single = status === TILE_STATUS.IS_PENDING_SETUP || (!trialExpired && (isIntegrationV2 || !expired));

    if (single && !showTrialLicenseMessage && resumable) return true;

    return false;
  },
  useOnClick: rowData => {
    const { _integrationId} = rowData;
    const accessLevel = rowData.integration?.permissions?.accessLevel;
    const [enquesnackbar] = useEnqueueSnackbar();
    const dispatch = useDispatch();

    const handleReactivate = useCallback(() => {
      if (![INTEGRATION_ACCESS_LEVELS.OWNER, USER_ACCESS_LEVELS.ACCOUNT_ADMIN].includes(accessLevel)) {
        enquesnackbar({ message: 'Contact your account owner to reactivate this integration app.', variant: 'error' });
      } else {
        dispatch(actions.integrationApp.license.resume(_integrationId));
      }
    }, [_integrationId, accessLevel, dispatch, enquesnackbar]);

    return handleReactivate;
  },
};
