import React, {useCallback, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import WarningIcon from '../../icons/WarningIcon';
import ExpiredIcon from '../../icons/ErrorIcon';
import actions from '../../../actions';
import getRoutePath from '../../../utils/routePaths';
import { INTEGRATION_ACCESS_LEVELS, USER_ACCESS_LEVELS, TILE_STATUS } from '../../../utils/constants';
import useConfirmDialog from '../../ConfirmDialog';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import ActionGroup from '../../ActionGroup';
import { FilledButton, TextButton} from '../../Buttons';

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

export default function TileNotification({ content, expired, connectorId, licenseId, integrationAppTileName, integrationId, isIntegrationV2, resumable, accessLevel, showTrialLicenseMessage, tileStatus, trialExpired, supportsMultiStore}) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const [enquesnackbar] = useEnqueueSnackbar();
  const [upgradeRequested, setUpgradeRequested] = useState(false);
  // Single means only button displayed here (Buy or renew), unistall button will be added if it is not single.
  const single = tileStatus === TILE_STATUS.IS_PENDING_SETUP || (!trialExpired && (isIntegrationV2 || !expired));

  const onClickRenewOrReactivateButton = useCallback(event => {
    event.stopPropagation();
    setUpgradeRequested(true);
    if (resumable) {
      if (![INTEGRATION_ACCESS_LEVELS.OWNER, USER_ACCESS_LEVELS.ACCOUNT_ADMIN].includes(accessLevel)) {
        enquesnackbar({ message: 'Contact your account owner to reactivate this integration app.', variant: 'error' });
      } else {
        dispatch(actions.integrationApp.license.resume(integrationId));
      }
    } else {
      dispatch(actions.user.org.accounts.requestUpdate('connectorRenewal', connectorId, licenseId));
    }
  }, [accessLevel, connectorId, dispatch, enquesnackbar, integrationId, licenseId, resumable]);
  const onClickBuyButton = useCallback(event => {
    event.stopPropagation();
    setUpgradeRequested(true);
    dispatch(actions.user.org.accounts.requestUpdate('connectorRenewal', connectorId, licenseId));
  }, [connectorId, dispatch, licenseId]);
  const handleUninstall = useCallback(event => {
    event.stopPropagation();
    if (![INTEGRATION_ACCESS_LEVELS.OWNER, USER_ACCESS_LEVELS.ACCOUNT_ADMIN].includes(accessLevel)) {
      enquesnackbar({ message: 'Contact your account owner to uninstall this integration app.' });
    } else if (supportsMultiStore) {
      enquesnackbar({ message: 'To uninstall, please navigate to Admin → Uninstall inside the Integration App and select the desired store.', variant: 'error' });
    } else {
      confirmDialog({
        title: 'Confirm uninstall',
        message: 'Are you sure you want to uninstall?',
        buttons: [
          {
            label: 'Uninstall',
            onClick: () => {
              history.push(
                getRoutePath(
                  `integrationapps/${integrationAppTileName}/${integrationId}/uninstall`
                )
              );
            },
          },
          {
            label: 'Cancel',
            color: 'secondary',
          },
        ],
      });
    }
  }, [accessLevel, confirmDialog, enquesnackbar, history, integrationAppTileName, integrationId, supportsMultiStore]);

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
            {resumable ? 'Reactivate' : 'Renew'}
          </FilledButton>
        )}
        {single && showTrialLicenseMessage && (
          <FilledButton
            disabled={upgradeRequested}
            onClick={onClickBuyButton}
            data-test="buy"
            >
            Buy
          </FilledButton>
        )}
        {!single && (
        <ActionGroup>
          <FilledButton
            disabled={upgradeRequested}
            onClick={onClickRenewOrReactivateButton}
            data-test="RenewOrReactivateDouble"
           >
            {showTrialLicenseMessage ? 'Buy' : 'Renew'}
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
