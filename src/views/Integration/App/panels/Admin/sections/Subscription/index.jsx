// eslint-disable-next-line no-unused-vars
import React, { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Grid, Divider, Typography, makeStyles } from '@material-ui/core';
import PanelHeader from '../../../../../../../components/PanelHeader';
import actions from '../../../../../../../actions';
import { selectors } from '../../../../../../../reducers';
import useSelectorMemo from '../../../../../../../hooks/selectors/useSelectorMemo';
import Addons from './Addons';

const useStyles = makeStyles(theme => ({
  header: {
    background: theme.palette.background.paper,
    textAlign: 'left',
    padding: theme.spacing(1, 2),
    borderRadius: [4, 4, 0, 0],
  },
  message: {
    paddingBottom: theme.spacing(2),
    textAlign: 'left',
    paddingLeft: theme.spacing(2),
  },
  heading: {
    paddingBottom: theme.spacing(1),
  },
  content: {
    padding: '30px 30px 30px 0',
  },
  container: {
    padding: '0 0 16px 16px',
  },
  button: {
    margin: theme.spacing(1),
  },
  planContent: {
    margin: 0,
    lineHeight: '16px',
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

  const [upgradeSettingsRequested, setUpgradeSettingsRequested] = useState(false);
  const license = useSelector(state =>
    selectors.integrationAppLicense(state, integrationId)
  );

  const {
    plan,
    createdText,
    expiresText,
    upgradeText,
    upgradeRequested,
  } = license;
  const handleUpgrade = () => {
    if (upgradeText === 'CONTACT US TO UPGRADE') {
      dispatch(
        actions.integrationApp.settings.requestUpgrade(integrationId, {
          licenseId: license._id,
        })
      );
    } else {
      setUpgradeSettingsRequested(true);
      dispatch(actions.integrationApp.settings.upgrade(integrationId, license));
    }
  };

  return (
    <>
      <PanelHeader title="Subscription details" />
      <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.planContent}>
            <Grid container className={classes.container}>
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
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  disabled={upgradeRequested || upgradeSettingsRequested}
                  onClick={handleUpgrade}>
                  {upgradeText}
                </Button>
                )}
              </Grid>
            </Grid>
          </div>
          <Divider />
        </div>
        <Typography className={classes.message}>
          Your subscription gives you access to install and run one instance
          (tile) of this Integration App. Contact your Account Manager for more
          info.
        </Typography>
        <Addons childId={childId} integrationId={integrationId} />
      </div>
    </>
  );
}
