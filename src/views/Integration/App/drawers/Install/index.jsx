/*
 TODO: 
 This file needs to be re-implemented as a stepper functionality drawer as per new mocks.
 As of now this is not a drawer, but a standalone page.
*/
import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  IconButton,
  Button,
  Grid,
  Paper,
  Breadcrumbs,
} from '@material-ui/core';
import ArrowBackIcon from '../../../../../components/icons/ArrowLeftIcon';
import * as selectors from '../../../../../reducers';
import actions from '../../../../../actions';
import {
  getResourceSubType,
  generateNewId,
  isOauth,
} from '../../../../../utils/resource';
import LoadResources from '../../../../../components/LoadResources';
import openExternalUrl from '../../../../../utils/window';
import resourceConstants from '../../../../../forms/constants/connection';
import ArrowRightIcon from '../../../../../components/icons/ArrowRightIcon';
import ConnectionSetupDialog from '../../../../../components/ResourceSetupDialog';
import InstallationStep from '../../../../../components/InstallStep';
import useConfirmDialog from '../../../../../components/ConfirmDialog';
import { getIntegrationAppUrlName } from '../../../../../utils/integrationApps';
import { SCOPES } from '../../../../../sagas/resourceForm';
import jsonUtil from '../../../../../utils/json';

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
const getConnectionType = resource => {
  const { assistant, type } = getResourceSubType(resource);

  if (assistant) return assistant;

  if (resource.type === 'netsuite') {
    if (resource.netsuite.authType === 'token-auto') {
      return 'netsuite-oauth';
    }
  }

  return type;
};

export default function ConnectorInstallation(props) {
  const classes = useStyles();
  const { integrationId } = props.match.params;
  const history = useHistory();
  const [connection, setConnection] = useState(null);
  const { confirmDialog } = useConfirmDialog();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const dispatch = useDispatch();
  const integration = useSelector(state =>
    selectors.integrationAppSettings(state, integrationId)
  );
  const installSteps = useSelector(state =>
    selectors.integrationInstallSteps(state, integrationId)
  );
  const selectedConnection = useSelector(state =>
    selectors.resource(
      state,
      'connections',
      connection && connection._connectionId
    )
  );
  const integrationAppName = getIntegrationAppUrlName(
    integration && integration.name
  );
  const handleClose = useCallback(() => {
    setConnection(false);
  }, []);
  const isFrameWork2 =
    integration && integration.installSteps && integration.installSteps.length;

  useEffect(() => {
    if (
      installSteps.length &&
      !isSetupComplete &&
      !installSteps.reduce((result, step) => result || !step.completed, false)
    ) {
      dispatch(actions.resource.request('integrations', integrationId));
      setIsSetupComplete(true);
    }
  }, [dispatch, installSteps, integrationId, isSetupComplete]);

  const mode = integration && integration.mode;
  const oAuthApplications = [
    ...resourceConstants.OAUTH_APPLICATIONS,
    'netsuite-oauth',
  ];
  const handleSubmitComplete = useCallback(
    (connId, isAuthorized, connectionDoc = {}) => {
      // Here connection Doc will come into picture for only for IA2.0 and if connection step doesn't contain connection Id.
      const step = installSteps.find(s => s.isCurrentStep);

      if (
        selectedConnection &&
        oAuthApplications.includes(getConnectionType(selectedConnection)) &&
        !isAuthorized &&
        !(
          getConnectionType(selectedConnection) === 'shopify' &&
          selectedConnection &&
          selectedConnection.http &&
          selectedConnection.http.auth &&
          selectedConnection.http.auth.type === 'basic'
        )
      ) {
        return;
      }

      dispatch(
        actions.integrationApp.installer.updateStep(
          integrationId,
          (step || {}).installerFunction,
          'inProgress'
        )
      );

      if (isFrameWork2) {
        dispatch(
          actions.integrationApp.installer.scriptInstallStep(
            integrationId,
            connection && connection._connectionId,
            connectionDoc
          )
        );
      } else {
        dispatch(
          actions.integrationApp.installer.installStep(
            integrationId,
            (step || {}).installerFunction,
            connection && connection._connectionId
          )
        );
      }

      if (!isOauth(connectionDoc)) setConnection(false);
    },
    [
      connection,
      dispatch,
      installSteps,
      integrationId,
      isFrameWork2,
      oAuthApplications,
      selectedConnection,
    ]
  );

  useEffect(() => {
    if (isSetupComplete) {
      // redirect to integration Settings
      dispatch(actions.resource.request('integrations', integrationId));
      dispatch(actions.resource.requestCollection('flows'));
      dispatch(actions.resource.requestCollection('exports'));
      dispatch(actions.resource.requestCollection('imports'));

      if (mode === 'settings') {
        props.history.push(
          `/pg/integrationapps/${integrationAppName}/${integrationId}/flows`
        );
      }
    }
  }, [
    dispatch,
    mode,
    integrationAppName,
    integrationId,
    isSetupComplete,
    props.history,
  ]);

  if (!installSteps || !integration || !integration._connectorId) {
    return <Typography>No Integration Found</Typography>;
  }

  const handleUninstall = e => {
    e.preventDefault();
    confirmDialog({
      title: 'Uninstall',
      message: `Are you sure you want to uninstall`,
      buttons: [
        {
          label: 'Cancel',
        },
        {
          label: 'Yes',
          onClick: () => {
            const storeId = (integration.stores || {}).length
              ? integration.stores[0].value
              : undefined;

            if (
              integration.settings &&
              integration.settings.supportsMultiStore
            ) {
              history.push(
                `/pg/integrationapps/${integrationAppName}/${integrationId}/uninstall/${storeId}`
              );
            } else {
              history.push(
                `/pg/integrationapps/${integrationAppName}/${integrationId}/uninstall`
              );
            }
          },
        },
      ],
    });
  };

  const handleStepClick = step => {
    const {
      _connectionId,
      installURL,
      installerFunction,
      type,
      sourceConnection,
    } = step;

    if (_connectionId || type === 'connection') {
      if (step.isTriggered) {
        return false;
      }

      const newId = generateNewId();
      const connObj = sourceConnection;

      delete connObj._id;

      if (!_connectionId)
        dispatch(
          actions.resource.patchStaged(
            newId,
            jsonUtil.objectToPatchSet({
              ...sourceConnection,
              newIA: true,
              _id: newId,
              _integrationId: integration._id,
              _connectorId: integration._connectorId,
            }),
            SCOPES.VALUE
          )
        );
      setConnection({
        newId,
        doc: sourceConnection,
        _connectionId,
      });
    } else if (isFrameWork2 && !step.isTriggered) {
      dispatch(
        actions.integrationApp.installer.updateStep(
          integrationId,
          installerFunction,
          'inProgress'
        )
      );
      dispatch(
        actions.integrationApp.installer.scriptInstallStep(integrationId)
      );
    } else if (installURL) {
      if (!step.isTriggered) {
        dispatch(
          actions.integrationApp.installer.updateStep(
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
          actions.integrationApp.installer.updateStep(
            integrationId,
            installerFunction,
            'verify'
          )
        );
        dispatch(
          actions.integrationApp.installer.installStep(
            integrationId,
            installerFunction
          )
        );
      }
      // handle Action step click
    } else if (!step.isTriggered) {
      dispatch(
        actions.integrationApp.installer.updateStep(
          integrationId,
          installerFunction,
          'inProgress'
        )
      );
      dispatch(
        actions.integrationApp.installer.installStep(
          integrationId,
          installerFunction
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
      {connection && connection._connectionId && (
        <ConnectionSetupDialog
          resourceId={connection._connectionId}
          onClose={handleClose}
          onSubmitComplete={handleSubmitComplete}
        />
      )}
      {connection && connection.doc && !connection._connectionId && (
        <ConnectionSetupDialog
          resourceId={connection.newId}
          resource={connection.doc}
          resourceType="connections"
          environment="production"
          connectionType={connection.doc.type}
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
                  <Typography color="textPrimary">Setup</Typography>
                  <Typography color="textPrimary">
                    {integration.name}
                  </Typography>
                </Breadcrumbs>
              </Paper>
            </Grid>
            <Grid item xs={1} className={classes.floatRight}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleUninstall}>
                Uninstall
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={3} className={classes.stepTable}>
            {installSteps.map((step, index) => (
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
