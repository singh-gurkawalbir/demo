import React, { useCallback, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@material-ui/core';
import { selectors } from '../../reducers';
import actions from '../../actions';
import NotificationToaster from '../NotificationToaster';
import FilledButton from '../Buttons/FilledButton';
import useConfirmDialog from '../ConfirmDialog';
import { useSelectorMemo } from '../../hooks';
import { emptyObject } from '../../constants';
import ButtonWithTooltip from '../Buttons/ButtonWithTooltip';
import {message} from '../../utils/messageStore';
import RawHtml from '../RawHtml';

const useStyles = makeStyles(theme => ({
  titleStatusPanel: {
    marginTop: theme.spacing(0.5),
  },
  upgradeButton: {
    margin: theme.spacing(2, 0),
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
      title: 'Request access to VAN connector',
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

  if (resourceType !== 'connections' && resource.type !== 'van') {
    return null;
  }

  return (
    <div className={className}>
      {licenseActionDetails.van === false ? (
        <NotificationToaster variant="info" size="large">
          <Typography component="div" variant="body2" className={classes.titleStatusPanel}>
            <RawHtml html={message.SUBSCRIPTION.REQUEST_RECEIVED_VAN} />
            <ButtonWithTooltip
              tooltipProps={{
                title: upgradeRequested ? message.SUBSCRIPTION.VAN_LICENSE_UPGRADE_TOOLTIP_MESSAGE : '',
                placement: 'bottom-start'}}>
              <FilledButton
                onClick={onRequestUpgradeClick}
                disabled={upgradeRequested}
                id="request-van-upgrade-buttton"
                className={classes.upgradeButton}>
                {!upgradeRequested ? 'Request access' : 'Access Requested'}
              </FilledButton>
            </ButtonWithTooltip>
          </Typography>
        </NotificationToaster>
      ) : (
        <NotificationToaster variant="warning" size="large">
          <Typography component="div" variant="body2" className={classes.titleStatusPanel}>
            <RawHtml html={message.SUBSCRIPTION.VAN_LICENSE_APPROVED} />
          </Typography>
        </NotificationToaster>
      )}
    </div>
  );
}
