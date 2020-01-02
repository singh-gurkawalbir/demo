import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  IconButton,
  Grid,
  Paper,
  Breadcrumbs,
  Button,
} from '@material-ui/core';
import ArrowBackIcon from '../../components/icons/ArrowLeftIcon';
import ArrowRightIcon from '../../components/icons/ArrowRightIcon';
import * as selectors from '../../reducers';
import actions from '../../actions';
import LoadResources from '../../components/LoadResources';
import openExternalUrl from '../../utils/window';
import ConnectionSetupDialog from '../../components/ResourceSetupDialog';
import InstallationStep from '../../components/InstallStep';
import { getResourceSubType } from '../../utils/resource';
import resourceConstants from '../../forms/constants/connection';
import Spinner from '../../components/Spinner';
import Loader from '../../components/Loader';
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
    borderBottom: `solid 1px ${theme.palette.secondary.lightest}`,
    marginBottom: '29px',
  },
  innerContent: {
    width: '80vw',
  },
  stepTable: { position: 'relative', marginTop: '-20px' },
  floatRight: {
    float: 'right',
  },
  paper: {
    padding: theme.spacing(1, 2),
    background: theme.palette.background.default,
  },
}));
const getConnectionType = resource => {
  const { assistant, type } = getResourceSubType(resource);

  if (assistant) return assistant;

  return type;
};

export default function IntegrationAppAddNewStore(props) {
  const classes = useStyles();
  const history = useHistory();
  const { integrationId } = props.match.params;
  const [selectedConnectionId, setSelectedConnectionId] = useState(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [requestedSteps, setRequestedSteps] = useState(false);
  const dispatch = useDispatch();
  const integration =
    useSelector(state =>
      selectors.integrationAppSettings(state, integrationId)
    ) || {};
  const showUninstall = !!(
    integration &&
    integration.settings &&
    integration.settings.defaultSectionId
  );
  const integrationAppName = getIntegrationAppUrlName(integration.name);
  const { steps: addNewStoreSteps, error } = useSelector(state =>
    selectors.addNewStoreSteps(state, integrationId)
  );
  const selectedConnection = useSelector(state =>
    selectors.resource(state, 'connections', selectedConnectionId)
  );

  useEffect(() => {
    if ((!addNewStoreSteps || !addNewStoreSteps.length) && !requestedSteps) {
      dispatch(actions.integrationApp.store.addNew(integrationId));
      setRequestedSteps(true);
    }
  }, [addNewStoreSteps, requestedSteps, dispatch, integrationId]);
  useEffect(() => {
    if (
      addNewStoreSteps &&
      addNewStoreSteps.length &&
      !addNewStoreSteps.reduce(
        (result, step) => result || !step.completed,
        false
      )
    ) {
      setIsSetupComplete(true);
    }
  }, [addNewStoreSteps]);

  useEffect(() => {
    if (isSetupComplete) {
      // redirect to integration Settings
      dispatch(actions.integrationApp.store.clearSteps(integrationId));
      dispatch(actions.resource.request('integrations', integrationId));
      dispatch(actions.resource.requestCollection('flows'));
      dispatch(actions.resource.requestCollection('exports'));
      dispatch(actions.resource.requestCollection('imports'));
      dispatch(actions.resource.requestCollection('connections'));
      props.history.push(
        `/pg/integrationapps/${integrationAppName}/${integrationId}/flows`
      );
    }
  }, [
    dispatch,
    integrationAppName,
    integrationId,
    isSetupComplete,
    props.history,
  ]);

  if (error) {
    history.push(
      getRoutePath(
        `integrationapps/${integrationAppName}/${integrationId}/flows`
      )
    );

    return null;
  }

  if (!addNewStoreSteps || !addNewStoreSteps.length) {
    return (
      <Loader open>
        <Spinner color="primary" />
        <Typography variant="h5">Loading installation steps</Typography>
      </Loader>
    );
  }

  const handleStepClick = step => {
    const { _connectionId, installURL, installerFunction } = step;

    // handle connection step click
    if (_connectionId) {
      if (step.isTriggered) {
        return false;
      }

      setSelectedConnectionId(_connectionId);
      // handle Installation step click
    } else if (installURL) {
      if (!step.isTriggered) {
        dispatch(
          actions.integrationApp.store.updateStep(
            integrationId,
            installerFunction,
            'inProgress'
          )
        );
        openExternalUrl({ url: installURL });
      } else {
        if (step.verifying) {
          return false;
        }

        dispatch(
          actions.integrationApp.store.updateStep(
            integrationId,
            installerFunction,
            'verify'
          )
        );
        dispatch(
          actions.integrationApp.store.installStep(
            integrationId,
            installerFunction
          )
        );
      }
      // handle Action step click
    } else if (!step.isTriggered) {
      dispatch(
        actions.integrationApp.store.updateStep(
          integrationId,
          installerFunction,
          'inProgress'
        )
      );
      dispatch(
        actions.integrationApp.store.installStep(
          integrationId,
          installerFunction
        )
      );
    }
  };

  const handleBackClick = () => {
    props.history.goBack();
  };

  const handleSubmitComplete = (connId, isAuthorized) => {
    const step = addNewStoreSteps.find(s => s.isCurrentStep);

    if (
      resourceConstants.OAUTH_APPLICATIONS.includes(
        getConnectionType(selectedConnection)
      ) &&
      !isAuthorized
    ) {
      return;
    }

    dispatch(
      actions.integrationApp.store.updateStep(
        integrationId,
        (step || {}).installerFunction,
        'inProgress'
      )
    );
    dispatch(
      actions.integrationApp.store.installStep(
        integrationId,
        (step || {}).installerFunction
      )
    );
    setSelectedConnectionId(false);
  };

  const handleUninstall = () => {
    history.push(
      getRoutePath(
        `integrationapps/${integrationAppName}/${integrationId}/uninstall/${integration.settings.defaultSectionId}`
      )
    );
  };

  const handleClose = () => {
    setSelectedConnectionId(false);
  };

  return (
    <LoadResources required resources={['integrations', 'connections']}>
      {selectedConnectionId && (
        <ConnectionSetupDialog
          resourceId={selectedConnectionId}
          resourceType="connections"
          onClose={handleClose}
          onSubmitComplete={handleSubmitComplete}
        />
      )}
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

            <Grid item xs>
              <Paper elevation={0} className={classes.paper}>
                <Breadcrumbs
                  separator={<ArrowRightIcon />}
                  aria-label="breadcrumb">
                  <Typography color="textPrimary">Add New Store</Typography>
                  <Typography color="textPrimary">
                    {integration.name}
                  </Typography>
                </Breadcrumbs>
              </Paper>
            </Grid>
            {showUninstall && (
              <Grid item xs={1} className={classes.floatRight}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleUninstall}>
                  Uninstall
                </Button>
              </Grid>
            )}
          </Grid>
          <Grid container spacing={3} className={classes.stepTable}>
            {addNewStoreSteps.map((step, index) => (
              <InstallationStep
                key={step.name}
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
