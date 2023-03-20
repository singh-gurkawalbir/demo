import React, {useCallback, useState} from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useDispatch } from 'react-redux';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import WarningIcon from '../../icons/WarningIcon';
import ExpiredIcon from '../../icons/ErrorIcon';
import actions from '../../../actions';
import { INTEGRATION_ACCESS_LEVELS, USER_ACCESS_LEVELS, TILE_STATUS } from '../../../constants';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import ActionGroup from '../../ActionGroup';
import { FilledButton, TextButton} from '../../Buttons';
import useHandleDelete from '../../../views/Integration/hooks/useHandleDelete';
import useConfirmDialog from '../../ConfirmDialog';
import {message} from '../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  trialExpireWrapper: {
    background: theme.palette.background.default,
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    padding: 10,
    boxSizing: 'border-box',
    zIndex: 2,
    height: '100px',
  },
  content: {
    display: 'flex',
    width: '89%',
    maxHeight: 45,
    overflowY: 'auto',
    wordBreak: 'break-word',
  },
  footer: {
    display: 'flex',
    width: 'calc(100% - 22px)',
    justifyContent: 'flex-start',
    position: 'absolute',
    bottom: 10,
    left: 42,
  },
  footerSingleBtn: {
    left: 0,
    width: '100%',
    justifyContent: 'center',
  },
  warningIcon: {
    color: theme.palette.warning.main,
  },
  expiredIcon: {
    color: theme.palette.error.main,
  },
  contentWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  details: {
    fontSize: 15,
  },
}));

export default function TileNotification({
  content,
  expired,
  connectorId,
  licenseId,
  integrationId,
  isIntegrationV2,
  mode,
  name,
  _connectorId,
  supportsMultiStore,
  resumable,
  accessLevel,
  showTrialLicenseMessage,
  tileStatus,
  trialExpired,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {confirmDialog} = useConfirmDialog();
  const [enquesnackbar] = useEnqueueSnackbar();
  const [upgradeRequested, setUpgradeRequested] = useState(false);
  // Single means only one button displayed here (Buy or renew), uninstall button will be added if it is not single.
  const single = tileStatus === TILE_STATUS.IS_PENDING_SETUP || (!trialExpired && (isIntegrationV2 || !expired));

  const onClickBuyButton = useCallback(event => {
    if (event) {
      event.stopPropagation();
    }
    confirmDialog({
      title: 'Request to buy subscription',
      message: message.SUBSCRIPTION.CONTACT_TO_BUY,
      buttons: [
        {
          label: 'Submit request',
          onClick: () => {
            setUpgradeRequested(true);
            dispatch(actions.license.requestUpdate('connectorRenewal', {connectorId, licenseId}));
          },
        },
        {
          label: 'Cancel',
          variant: 'text',
        },
      ],
    });
  }, [confirmDialog, connectorId, dispatch, licenseId]);
  const onClickRenewOrReactivateButton = useCallback(event => {
    event.stopPropagation();
    setUpgradeRequested(true);
    if (resumable) {
      if (![INTEGRATION_ACCESS_LEVELS.OWNER, USER_ACCESS_LEVELS.ACCOUNT_ADMIN].includes(accessLevel)) {
        enquesnackbar({ message: message.INTEGRATION.CONTACT_OWNER, variant: 'error' });
      } else {
        return dispatch(actions.integrationApp.license.resume(integrationId));
      }
    } else if (showTrialLicenseMessage) {
      onClickBuyButton();
    } else {
      confirmDialog({
        title: 'Request to renew subscription',
        message: message.SUBSCRIPTION.CONTACT_TO_RENEW,
        buttons: [
          {
            label: 'Submit request',
            onClick: () => {
              dispatch(actions.license.requestUpdate('connectorRenewal', {connectorId, licenseId}));
            },
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
    }
  }, [accessLevel, confirmDialog, connectorId, dispatch, enquesnackbar, integrationId, licenseId, onClickBuyButton, resumable, showTrialLicenseMessage]);

  const handleUninstall = useHandleDelete(integrationId, {mode, supportsMultiStore, name, _connectorId});

  return (
    <div className={classes.trialExpireWrapper}>
      <div className={classes.contentWrapper}>
        {expired || trialExpired ? (
          <ExpiredIcon className={classes.expiredIcon} />
        )
          : <WarningIcon className={classes.warningIcon} />}
        <div className={classes.content}>
          <Typography variant="body2" className={classes.details}>{content}</Typography>
        </div>
      </div>
      <div className={clsx(classes.footer, {[classes.footerSingleBtn]: single})}>
        {single && !showTrialLicenseMessage && (
          <FilledButton
            disabled={upgradeRequested}
            onClick={onClickRenewOrReactivateButton}
            data-test="RenewOrReactivate"
           >
            {resumable ? 'Reactivate' : 'Request to renew'}
          </FilledButton>
        )}
        {single && showTrialLicenseMessage && (
          <FilledButton
            disabled={upgradeRequested}
            onClick={onClickBuyButton}
            data-test="buy"
            >
            Request to buy
          </FilledButton>
        )}
        {!single && (
        <ActionGroup>
          <FilledButton
            disabled={upgradeRequested}
            onClick={onClickRenewOrReactivateButton}
            data-test="RenewOrReactivateDouble"
           >
            {showTrialLicenseMessage ? 'Request to buy' : 'Request to renew'}
          </FilledButton>
          <TextButton
            data-test="uninstall"
            onClick={handleUninstall}>
            Uninstall
          </TextButton>
        </ActionGroup>
        )}
      </div>
      <div />
    </div>
  );
}
