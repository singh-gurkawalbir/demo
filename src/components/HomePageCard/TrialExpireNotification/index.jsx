import React, {useCallback, useState} from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import ButtonGroup from '../../ButtonGroup';
import WarningIcon from '../../icons/WarningIcon';
import actions from '../../../actions';
import getRoutePath from '../../../utils/routePaths';
import { INTEGRATION_ACCESS_LEVELS, USER_ACCESS_LEVELS } from '../../../utils/constants';
import useConfirmDialog from '../../ConfirmDialog';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';

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
    width: '90%',
    height: 45,
    overflowY: 'auto',
    wordBreak: 'break-word',
  },
  footer: {
    display: 'flex',
    width: 'calc(100% - 22px)',
    justifyContent: 'flex-start',
    position: 'absolute',
    bottom: 10,
    left: 22,
  },
  footerSingleBtn: {
    left: 0,
    width: '100%',
    justifyContent: 'center',
  },
  warningIcon: {
    color: theme.palette.warning.main,
  },
  warningIconRed: {
    color: theme.palette.error.main,
  },
  closeIconBtn: {
    float: 'right',
    padding: 0,
  },
  closeIcon: {
    fontSize: 18,
  },
  contentWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  details: {
    fontSize: 15,
  },
}));

function TrialExpireNotification({ content, expired, connectorId, licenseId, integrationAppTileName, integrationId, isIntegrationV2, resumable, accessLevel}) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const [enquesnackbar] = useEnqueueSnackbar();
  const [upgradeRequested, setUpgradeRequested] = useState(false);
  const single = isIntegrationV2 || !expired;

  const onClickRenewOrReactivateButton = useCallback(event => {
    event.stopPropagation();
    setUpgradeRequested(true);
    if (resumable) {
      dispatch(actions.integrationApp.license.resume(integrationId));
    } else {
      dispatch(actions.user.org.accounts.requestUpdate('connectorRenewal', connectorId, licenseId));
    }
  }, [connectorId, dispatch, integrationId, licenseId, resumable]);
  const handleUninstall = useCallback(event => {
    event.stopPropagation();
    if (![INTEGRATION_ACCESS_LEVELS.OWNER, USER_ACCESS_LEVELS.ACCOUNT_ADMIN].includes(accessLevel)) {
      enquesnackbar({ message: 'Contact your account owner to uninstall this integration app.' });
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
  }, [accessLevel, confirmDialog, enquesnackbar, history, integrationAppTileName, integrationId]);

  return (
    <div className={classes.trialExpireWrapper}>
      <div className={classes.contentWrapper}>
        <WarningIcon className={clsx(classes.warningIcon, {[classes.warningIconRed]: expired})} />
        <div className={classes.content}>
          <Typography variant="body2" className={classes.details}>{content}</Typography>
        </div>
      </div>
      <div className={clsx(classes.footer, {[classes.footerSingleBtn]: single})}>
        {single ? (
          <Button
            disabled={upgradeRequested} onClick={onClickRenewOrReactivateButton} data-test="Renew" variant="outlined"
            color="primary">
            {resumable ? 'Reactivate' : 'Renew'}
          </Button>
        ) : (
          <ButtonGroup>
            <Button
              disabled={upgradeRequested} onClick={onClickRenewOrReactivateButton} data-test="Renew" variant="outlined"
              color="primary">
              Renew
            </Button>
            <Button data-test="uninstall" variant="text" color="primary" onClick={handleUninstall}>
              Uninstall
            </Button>
          </ButtonGroup>
        )}
      </div>
      <div />
    </div>

  );
}

export default TrialExpireNotification;
