// eslint-disable-next-line no-unused-vars
import React, { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Divider, Typography, Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { FilledButton } from '@celigo/fuse-ui';
import PanelHeader from '../../../../../../../components/PanelHeader';
import actions from '../../../../../../../actions';
import { selectors } from '../../../../../../../reducers';
import useSelectorMemo from '../../../../../../../hooks/selectors/useSelectorMemo';
import Addons from './Addons';
import useConfirmDialog from '../../../../../../../components/ConfirmDialog';
import messageStore from '../../../../../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  header: {
    background: theme.palette.background.paper,
    textAlign: 'left',
    padding: theme.spacing(1, 2),
    borderRadius: [4, 4, 0, 0],
  },
  heading: {
    paddingBottom: theme.spacing(1),
  },
  customisedBlock: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(1, 2),
    textAlign: 'left',
  },
  leftBlock: {
    flexBasis: '80%',
  },
}));

export default function SubscriptionSection({ childId, integrationId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const integration = useSelectorMemo(selectors.mkIntegrationAppSettings, integrationId);
  const {confirmDialog} = useConfirmDialog();

  const isLicenseExpired = useSelector(state => selectors.isIntegrationAppLicenseExpired(state, integrationId));
  const [upgradeSettingsRequested, setUpgradeSettingsRequested] = useState(false);
  const license = useSelector(state =>
    selectors.integrationAppLicense(state, integrationId)
  );
  const plan = useSelector(state =>
    selectors.integrationAppEdition(state, integrationId)
  );

  const {
    createdText,
    expiresText,
    upgradeText,
    upgradeRequested,
  } = license;
  const handleUpgrade = () => {
    if (upgradeText === 'Request upgrade') {
      confirmDialog({
        title: 'Request upgrade',
        message: messageStore('SUBSCRIPTION.CONTACT_FOR_BUSINESS_NEEDS', {plan: 'ideal'}),
        buttons: [
          {
            label: 'Submit request',
            onClick: () => {
              dispatch(
                actions.integrationApp.settings.requestUpgrade(integrationId, {
                  licenseId: license._id,
                })
              );
            },
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
    } else {
      setUpgradeSettingsRequested(true);
      dispatch(actions.integrationApp.settings.upgrade(integrationId, license));
    }
  };

  return (
    <>
      <PanelHeader title="Subscription details" />
      <div className={classes.root}>
        <Box sx={{ paddingBottom: theme => theme.spacing(2) }}>
          <Box
            sx={{
              margin: '0px',
              lineHeight: '16px',
            }}>
            <Grid container sx={{ padding: '0 0 16px 16px' }}>
              <Grid item xs={2}>
                <Typography data-test="iaPlan" >
                  {' '}
                  {plan}{' '}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography data-test="iaVersion">
                  {`Version ${integration.version}`}
                </Typography>
                <Typography data-test="integrationId" >
                  {`Integration ID ${integrationId}`}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography >{createdText}</Typography>
                <Typography >{expiresText}</Typography>
              </Grid>
              <Grid item xs={3}>
                {upgradeText && (
                <FilledButton
                  sx={{margin: 1}}
                  disabled={upgradeRequested || upgradeSettingsRequested || isLicenseExpired}
                  onClick={handleUpgrade}>
                  {upgradeText}
                </FilledButton>
                )}
              </Grid>
            </Grid>
          </Box>
          <Divider />
        </Box>
        <Typography
          sx={{
            padding: theme => theme.spacing(0, 2, 2),
            textAlign: 'left',
          }}>
          Your subscription gives you access to install and run one instance
          (tile) of this Integration App. Contact your Account Manager for more
          info.
        </Typography>
        <Addons childId={childId} integrationId={integrationId} />
      </div>
    </>
  );
}
