import React, { useCallback, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { Tooltip, Typography } from '@material-ui/core';
import { selectors } from '../../reducers';
import actions from '../../actions';
import NotificationToaster from '../NotificationToaster';
import FilledButton from '../Buttons/FilledButton';
import useConfirmDialog from '../ConfirmDialog';
import { useSelectorMemo } from '../../hooks';
import { emptyObject } from '../../constants';

const useStyles = makeStyles(theme => ({
  fixConnectionBtn: {
    fontSize: 15,
    lineHeight: '17px',
    padding: 6,
  },
  titleStatusPanel: {
    color: theme.palette.secondary.main,
    fontFamily: 'Roboto400',
  },
}));

export default function ConnectionVanLicenseStatusPanel({ className, resourceType, resourceId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const resource = useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId
  )?.merged || emptyObject;

  const licenseActionDetails = useSelector(state =>
    selectors.platformLicenseWithMetadata(state)
  );

  const [upgradeRequested, setUpgradeRequested] = useState(false);
  const {confirmDialog} = useConfirmDialog();

  const onRequestUpgradeClick = useCallback(() => {
    confirmDialog({
      title: 'Request upgrade',
      message: 'We will contact you to discuss your business needs and get you access to VAN.',
      buttons: [
        { label: 'Submit request',
          onClick: () => {
            dispatch(
              actions.analytics.gainsight.trackEvent('VAN_UPGRADE_BUTTON_CLICKED')
            );
            setUpgradeRequested(true);

            dispatch(actions.license.requestUpdate('upgrade', {feature: 'VAN'}));
          },
        },
        { label: 'Cancel',
          variant: 'text',
        },
      ],
    });
  }, [confirmDialog, dispatch]);
  const vanLicensePresent = (resourceType === 'connections' && resource.type === 'van' && licenseActionDetails.van === true) ? (
    <NotificationToaster variant="warning" size="large">
      <Typography component="div" variant="h6" className={classes.titleStatusPanel}>
        <b>Additional action required after saving</b>
        <br />You must contact celigo to gain access to our VAN customer portal to configure and manage your VAN service.After saving this connection, email us at <b>VANsetup@celigo.com</b> and we will reach out with more information.
      </Typography>
    </NotificationToaster>
  ) : (<></>);

  return (
    <div className={className}>
      {resourceType === 'connections' && resource.type === 'van' && licenseActionDetails.van === false ? (
        <NotificationToaster variant="info" size="large">
          <Typography component="div" variant="h6" className={classes.titleStatusPanel}>
            <a href="https://docs.celigo.com/hc/en-us/articles/12532590542107-What-is-a-value-added-network-VAN-connection-" rel="noreferrer" target="_blank">VAN Connector</a>(Value Added Network) is not included in your accounts current subscription plan.
            <br /><b> Request access to VAN to securely exchange EDI messages with your trading partners.</b>
            <br />
            <br />
            {licenseActionDetails.subscriptionActions.actions.indexOf(
              'request-upgrade'
            ) > -1 && (
              <Tooltip title={upgradeRequested ? 'We have received your request and will be in touch soon.' : ''} placement="bottom-start" >
                <span>
                  <FilledButton
                    onClick={onRequestUpgradeClick}
                    disabled={upgradeRequested}
                    id="request-van-upgrade-buttton"
            >
                    {!upgradeRequested ? 'Request upgrade' : 'Access Requested'}
                  </FilledButton>
                </span>
              </Tooltip>
            )}
          </Typography>
        </NotificationToaster>
      ) : vanLicensePresent}
    </div>
  );
}
