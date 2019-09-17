import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, IconButton, Grid } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import * as selectors from '../../reducers';
import actions from '../../actions';
import LoadResources from '../../components/LoadResources';
import openExternalUrl from '../../utils/window';
import InstallationStep from '../../components/InstallStep';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2),
    flexGrow: 1,
    width: '100%',
    padding: '10px 25px',
  },
  formHead: {
    borderBottom: 'solid 1px #e5e5e5',
    marginBottom: '29px',
  },
  backBtn: {
    background: `url(${process.env.CDN_BASE_URI}images/icons/back.png) no-repeat scroll center center`,
    height: '24px',
    marginRight: '10px',
    width: '17px',
    padding: 0,
    margin: '0 10px 0 0',
    minHeight: '24px',
  },
  innerContent: {
    width: '80vw',
  },
  stepTable: { position: 'relative', marginTop: '-20px' },
  floatRight: {
    float: 'right',
  },
}));

export default function IntegratorAppUninstalleer(props) {
  const classes = useStyles();
  const { integrationId } = props.match.params;
  let { storeId } = props.match.params;
  const [requestPreUninstall, setRequestedPreUninstall] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const dispatch = useDispatch();
  const integration = useSelector(state =>
    selectors.integrationAppSettings(state, integrationId)
  );
  const uninstallSteps = useSelector(state =>
    selectors.integrationUninstallSteps(state, integrationId)
  );

  if (
    !storeId &&
    integration.settings.supportsMultiStore &&
    (integration.stores || {}).length
  ) {
    storeId = integration.stores[0].value;
  }

  useEffect(() => {
    if ((!uninstallSteps || !uninstallSteps.length) && !requestPreUninstall) {
      dispatch(
        actions.integrationApps.uninstaller.preUninstall(storeId, integrationId)
      );
      setRequestedPreUninstall(true);
    }
  }, [uninstallSteps, requestPreUninstall, dispatch, storeId, integrationId]);

  useEffect(() => {
    if (
      uninstallSteps.length &&
      !uninstallSteps.reduce((result, step) => result || !step.completed, false)
    ) {
      setIsSetupComplete(true);
    }
  }, [uninstallSteps]);

  useEffect(() => {
    if (isSetupComplete) {
      // redirect to integration Settings
      if (integration.mode !== 'uninstall') {
        dispatch(actions.integrationApps.uninstaller.clearSteps(integrationId));
        dispatch(actions.resource.request('integrations', integrationId));
        props.history.push(`/pg/integrations/${integrationId}/settings/flows`);
      } else {
        dispatch(
          actions.integrationApps.uninstaller.deleteIntegration(integrationId)
        );
        props.history.push('/pg');
      }
    }
  }, [
    dispatch,
    integration.mode,
    integrationId,
    isSetupComplete,
    props.history,
  ]);

  if (!uninstallSteps || !integration || !integration._connectorId) {
    return <Typography>No Integration Found</Typography>;
  }

  const storeName = integration.stores
    ? (integration.stores.find(s => s.value === storeId) || {}).label
    : undefined;
  const handleStepClick = step => {
    const { uninstallURL, uninstallerFunction } = step;

    // handle connection step click
    if (uninstallURL) {
      if (!step.isTriggered) {
        dispatch(
          actions.integrationApps.uninstaller.updateStep(
            integrationId,
            uninstallerFunction,
            'inProgress'
          )
        );
        openExternalUrl({ url: uninstallURL });
      } else {
        if (step.verifying) {
          return false;
        }

        dispatch(
          actions.integrationApps.uninstaller.updateStep(
            integrationId,
            uninstallerFunction,
            'verify'
          )
        );
        dispatch(
          actions.integrationApps.uninstaller.stepUninstall(
            integrationId,
            uninstallerFunction
          )
        );
      }
      // handle Action step click
    } else if (!step.isTriggered) {
      dispatch(
        actions.integrationApps.uninstaller.updateStep(
          integrationId,
          uninstallerFunction,
          'inProgress'
        )
      );
      dispatch(
        actions.integrationApps.uninstaller.stepUninstall(
          storeId,
          integrationId,
          uninstallerFunction
        )
      );
    }
  };

  const handleBackClick = e => {
    e.preventDefault();
    props.history.push(`/pg`);
  };

  return (
    <LoadResources required resources="connections,integrations">
      <div className={classes.root}>
        <div className={classes.innerContent}>
          <Grid container className={classes.formHead}>
            <Grid item xs={1}>
              <IconButton onClick={handleBackClick} size="medium">
                <ArrowBackIcon fontSize="inherit" />
              </IconButton>
            </Grid>
            <Grid item>
              <Typography variant="h6">
                Uninstall &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&gt;{integration.name}{' '}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&gt; {storeName}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={3} className={classes.stepTable}>
            {uninstallSteps.map((step, index) => (
              <InstallationStep
                key={step.name}
                mode="uninstall"
                handleStepClick={handleStepClick}
                index={index + 1}
                step={step}
              />
            ))}
          </Grid>
        </div>
      </div>
    </LoadResources>
  );
}
