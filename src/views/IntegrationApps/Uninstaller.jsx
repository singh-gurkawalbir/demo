import { useHistory, Redirect } from 'react-router-dom';
import { useEffect } from 'react';
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
import getRoutePath from '../../utils/routePaths';
import { getIntegrationAppUrlName } from '../../utils/integrationApps';

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

export default function IntegrationAppUninstaller({ match }) {
  const classes = useStyles();
  const history = useHistory();
  const { integrationId, storeId } = match.params;
  const dispatch = useDispatch();
  const integration =
    useSelector(state =>
      selectors.integrationAppSettings(state, integrationId)
    ) || {};
  const integrationAppName = getIntegrationAppUrlName(integration.name);
  const isUninstallComplete = useSelector(state =>
    selectors.isUninstallComplete(state, { integrationId, storeId })
  );
  const { steps: uninstallSteps, error } = useSelector(state =>
    selectors.integrationUninstallSteps(state, integrationId)
  );

  useEffect(() => {
    if (!error && !uninstallSteps)
      dispatch(
        actions.integrationApp.uninstaller.preUninstall(storeId, integrationId)
      );
  }, [dispatch, error, integrationId, storeId, uninstallSteps]);

  useEffect(() => {
    if (
      uninstallSteps &&
      uninstallSteps.removeIntegration &&
      integration &&
      integration.mode === 'uninstall'
    ) {
      dispatch(
        actions.integrationApp.uninstaller.uninstallIntegration(integrationId)
      );
      history.push(getRoutePath('dashboard'));
    }
  }, [dispatch, history, integration, integrationId, uninstallSteps]);

  useEffect(() => {
    if (isUninstallComplete) {
      // redirect to integration Settings
      if (integration.mode !== 'uninstall') {
        dispatch(actions.integrationApp.uninstaller.clearSteps(integrationId));
        history.push(
          `/pg/integrationapps/${integrationAppName}/${integrationId}/flows`
        );
      } else {
        dispatch(
          actions.integrationApp.uninstaller.uninstallIntegration(integrationId)
        );
        history.push(getRoutePath('dashboard'));
      }
    }
  }, [
    dispatch,
    history,
    integration.mode,
    integrationAppName,
    integrationId,
    isUninstallComplete,
  ]);

  if (!integration || !integration._id) {
    return <LoadResources required resources="integrations" />;
  }

  if (error) {
    return <Redirect push={false} to={getRoutePath('dashboard')} />;
  }

  const storeName = integration.stores
    ? (integration.stores.find(s => s.value === storeId) || {}).label
    : undefined;
  const handleStepClick = step => {
    // TODO: installURL should eventually changed to uninstallURL. Currently it is left as installURL to support shopify uninstall.
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
    history.goBack();
  };

  return (
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
                <Typography color="textPrimary">{integration.name}</Typography>
                <Typography color="textPrimary">{storeName}</Typography>
              </Breadcrumbs>
            </Paper>
          </Grid>
        </Grid>
        <Grid container spacing={3} className={classes.stepTable}>
          {(uninstallSteps || []).map((step, index) => (
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
  );
}
