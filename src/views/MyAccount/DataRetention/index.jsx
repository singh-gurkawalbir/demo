import React, { useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import PanelHeader from '../../../components/PanelHeader';
import NotificationToaster from '../../../components/NotificationToaster';
import messageStore from '../../../utils/messageStore';
import RawHtml from '../../../components/RawHtml';
import TextButton from '../../../components/Buttons/TextButton';
import ButtonWithTooltip from '../../../components/Buttons/ButtonWithTooltip';
import useConfirmDialog from '../../../components/ConfirmDialog';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import DataRetentionPeriod from './DataRetentionPeriod';
import Spinner from '../../../components/Spinner';
import { MAX_DATA_RETENTION_PERIOD } from '../../../constants';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  contentWrapper: {
    padding: theme.spacing(0, 2, 2),
  },
  upgradeLicenseNotification: {
    marginBottom: theme.spacing(2),
  },
}));

export default function DataRetention() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [enquesnackbar] = useEnqueueSnackbar();
  const { confirmDialog } = useConfirmDialog();
  const dataRetentionLicenseUpgradeRequested = useSelector(state =>
    selectors.dataRetentionLicenseUpgradeRequested(state)
  );
  const platformLicenseActionMessage = useSelector(state =>
    selectors.platformLicenseActionMessage(state)
  );
  const maxAllowedDataRetention = useSelector(state => selectors.platformLicense(state)?.maxAllowedDataRetention);
  const areUserAccountSettingsLoaded = useSelector(selectors.areUserAccountSettingsLoaded);

  const onRequestUpgradeClick = useCallback(() => {
    confirmDialog({
      title: 'Request upgrade',
      message: 'We will contact you to discuss your business needs and recommend an ideal subscription plan.',
      buttons: [
        { label: 'Submit request',
          dataTest: 'confirmDataRetentionRequestUpgrade',
          onClick: () => {
            dispatch(actions.license.requestUpdate('upgrade', {feature: 'dataRetention'}));
            dispatch(actions.license.dataRetentionLicenseUpgradeRequested());
          },
        },
        { label: 'Cancel',
          dataTest: 'confirmDataRetentionRequestUpgradeCancel',
          variant: 'text',
        },
      ],
    });
  }, [confirmDialog, dispatch]);

  useEffect(() => {
    if (!areUserAccountSettingsLoaded) {
      dispatch(actions.accountSettings.request());
    }
  }, [areUserAccountSettingsLoaded, dispatch]);

  useEffect(() => {
    if (platformLicenseActionMessage === messageStore('FEATURE_LICENSE_UPGRADE_REQUEST_SUBMITTED_MESSAGE')) {
      enquesnackbar({message: <RawHtml html={platformLicenseActionMessage} />, variant: 'success'});
      dispatch(actions.license.clearActionMessage());
    }
  }, [dispatch, enquesnackbar, platformLicenseActionMessage]);

  if (!areUserAccountSettingsLoaded) {
    return (
      <div className={classes.root}>
        <PanelHeader title="Data retention" />
        <Spinner loading size="large" />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <PanelHeader title="Data retention" infoText={messageStore('DATA_RETENTION_TAB_INFO')} />
      <div className={classes.contentWrapper}>
        {(maxAllowedDataRetention !== MAX_DATA_RETENTION_PERIOD) && (
          <NotificationToaster variant="info" size="large" className={classes.upgradeLicenseNotification} >
            <RawHtml html={messageStore('DATA_RETENTION_LICENSE_UPGRADE')} />
            <ButtonWithTooltip
              tooltipProps={{
                title: dataRetentionLicenseUpgradeRequested ? messageStore('FEATURE_LICENSE_UPGRADE_REQUESTED_TOOLTIP_MESSAGE') : '',
                placement: 'bottom-start'}}>
              <TextButton
                size="large" bold="true" color="primary"
                data-test="dataRetentionRequestUpgrade"
                onClick={onRequestUpgradeClick}
                disabled={dataRetentionLicenseUpgradeRequested}>
                {dataRetentionLicenseUpgradeRequested ? 'Upgrade requested' : 'Request upgrade'}
              </TextButton>
            </ButtonWithTooltip>
          </NotificationToaster>
        )}
        <DataRetentionPeriod />
      </div>
    </div>
  );
}

