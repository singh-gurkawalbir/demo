import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  IconButton,
  Grid,
  Paper,
  Breadcrumbs,
} from '@material-ui/core';
import ArrowBackIcon from '../../components/icons/ArrowLeftIcon';
import * as selectors from '../../reducers';
import actions from '../../actions';
import LoadResources from '../../components/LoadResources';
import openExternalUrl from '../../utils/window';
import ArrowRightIcon from '../../components/icons/ArrowRightIcon';
import InstallationStep from '../../components/InstallStep';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2),
    flexGrow: 1,
    width: '100%',
    padding: '10px 25px',
  },
  formHead: {
    borderBottom: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    marginBottom: 29,
  },
  innerContent: {
    width: '80vw',
  },
  stepTable: { position: 'relative', marginTop: -20 },
  floatRight: {
    float: 'right',
  },
  paper: {
    padding: theme.spacing(1, 2),
    background: theme.palette.background.default,
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
        actions.integrationApp.uninstaller.preUninstall(storeId, integrationId)
      );
      setRequestedPreUninstall(true);
    }
  }, [uninstallSteps, requestPreUninstall, dispatch, storeId, integrationId]);

  useEffect(() => {
    if (
      uninstallSteps.length &&
      !uninstallSteps.reduce((result, step) => result || !step.completed, false)
    ) {
      dispatch(actions.resource.request('integrations', integrationId));
      setIsSetupComplete(true);
    }
  }, [dispatch, integrationId, uninstallSteps]);

  useEffect(() => {
    if (isSetupComplete) {
      // redirect to integration Settings
      if (integration.mode !== 'uninstall') {
        props.history.push(`/pg/connectors/${integrationId}/settings/flows`);
      } else {
        dispatch(
          actions.integrationApp.uninstaller.uninstallIntegration(integrationId)
        );
        props.history.push('/pg');
      }
    }
  }, [
    dispatch,
    integration,
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
    const { installURL, uninstallerFunction } = step;

    // handle connection step click
    if (installURL) {
      if (!step.isTriggered) {
        dispatch(
          actions.integrationApp.uninstaller.updateStep(
            integrationId,
            uninstallerFunction,
            'inProgress'
          )
        );
        openExternalUrl({ url: installURL });
      } else {
        if (step.verifying) {
          return false;
        }

        dispatch(
          actions.integrationApp.uninstaller.updateStep(
            integrationId,
            uninstallerFunction,
            'verify'
          )
        );
        dispatch(
          actions.integrationApp.uninstaller.stepUninstall(
            integrationId,
            uninstallerFunction
          )
        );
      }
      // handle Action step click
    } else if (!step.isTriggered) {
      dispatch(
        actions.integrationApp.uninstaller.updateStep(
          integrationId,
          uninstallerFunction,
          'inProgress'
        )
      );
      dispatch(
        actions.integrationApp.uninstaller.stepUninstall(
          storeId,
          integrationId,
          uninstallerFunction
        )
      );
    }
  };

  const handleBackClick = () => {
    dispatch(actions.integrationApp.uninstaller.clearSteps(integrationId));
    props.history.goBack();
  };

  return (
    <LoadResources required resources="connections,integrations">
      <div className={classes.root}>
        <div className={classes.innerContent}>
          <Grid container className={classes.formHead}>
            <Grid item xs={1}>
              <IconButton
                data-test="back"
                onClick={handleBackClick}
                size="medium">
                <ArrowBackIcon fontSize="inherit" />
              </IconButton>
            </Grid>
            <Grid item>
              <Paper elevation={0} className={classes.paper}>
                <Breadcrumbs
                  separator={<ArrowRightIcon />}
                  aria-label="breadcrumb">
                  <Typography color="textPrimary">Setup</Typography>
                  <Typography color="textPrimary">
                    {integration.name}
                  </Typography>
                  <Typography color="textPrimary">{storeName}</Typography>
                </Breadcrumbs>
              </Paper>
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
