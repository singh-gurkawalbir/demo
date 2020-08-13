import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  IconButton,
  Grid,
  Paper,
  Breadcrumbs,
} from '@material-ui/core';
import ArrowBackIcon from '../icons/ArrowLeftIcon';
import { selectors } from '../../reducers';
import actions from '../../actions';
import LoadResources from '../LoadResources';
import openExternalUrl from '../../utils/window';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import ResourceSetupDrawer from '../ResourceSetup';
import InstallationStep from '../InstallStep';
import resourceConstants from '../../forms/constants/connection';
import {
  getConnectionType,
  MODEL_PLURAL_TO_LABEL,
  generateNewId,
} from '../../utils/resource';
import jsonUtil from '../../utils/json';
import { INSTALL_STEP_TYPES } from '../../utils/constants';
import { SCOPES } from '../../sagas/resourceForm';
import Loader from '../Loader';
import Spinner from '../Spinner';
import { getApplicationName } from '../../utils/template';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
  },
  formHead: {
    borderBottom: `solid 1px ${theme.palette.secondary.lightest}`,
    marginBottom: 29,
  },

  stepTable: { maxWidth: 750 },
  floatRight: {
    float: 'right',
  },
  paper: {
    padding: theme.spacing(1, 2),
    background: theme.palette.background.default,
  },
}));

export default function InstallationWizard(props) {
  const classes = useStyles();
  const {
    resourceType,
    resourceId,
    installSteps = [],
    type,
    runKey,
    templateId,
    resource,
    handleSetupComplete,
    variant,
  } = props;
  const oAuthApplications = useMemo(
    () => [
      ...resourceConstants.OAUTH_APPLICATIONS,
      'netsuite-oauth',
      'shopify-oauth',
      'acumatica-oauth',
    ],
    []
  );
  const [installInProgress, setInstallInProgress] = useState(false);
  const [connection, setSelectedConnectionId] = useState(null);
  const [stackId, setShowStackDialog] = useState(null);
  let environment;
  const dispatch = useDispatch();
  const isSetupComplete = useSelector(state =>
    selectors.isSetupComplete(state, { resourceId, resourceType, templateId })
  );
  const { connectionMap, data } =
    useSelector(state =>
      selectors.installSetup(state, {
        templateId,
        resourceType,
        resourceId,
      })
    ) || {};
  const {redirectTo, isInstallFailed, environment: destinationEnvironment } = useSelector(state =>
    selectors.redirectToOnInstallationComplete(state, {
      resourceType,
      resourceId,
      templateId,
    })
  );

  useEffect(() => {
    if (isSetupComplete) {
      // Send the gathered information to BE to create all components
      setInstallInProgress(true);

      if (type === 'clone') {
        dispatch(actions.clone.createComponents(resourceType, resourceId));
      } else if (type === 'template') {
        dispatch(actions.template.createComponents(templateId, runKey));
      }
    }
  }, [
    dispatch,
    isSetupComplete,
    props.history,
    resourceId,
    templateId,
    resourceType,
    type,
    runKey,
  ]);
  useEffect(() => {
    if (redirectTo || isInstallFailed) {
      setInstallInProgress(false);
      handleSetupComplete(redirectTo, isInstallFailed, destinationEnvironment);
    }
  }, [
    dispatch,
    handleSetupComplete,
    redirectTo,
    resourceId,
    resourceType,
    templateId,
    isInstallFailed,
    destinationEnvironment,
  ]);

  if (!installSteps) {
    return <Typography>Invalid Configuration</Typography>;
  }

  if (data) {
    environment = data.sandbox ? 'sandbox' : 'production';
  }

  const handleStepClick = (step, conn) => {
    const { _connectionId, installURL, type, completed } = step;
    let bundleURL = installURL;

    if (completed) {
      return false;
    }
    // handle connection step click
    if (type === INSTALL_STEP_TYPES.CONNECTION) {
      if (step.isTriggered) {
        return false;
      }

      const newId = generateNewId();
      const connObj = { ...connectionMap[_connectionId] };

      if (data && Object.prototype.hasOwnProperty.call(data, 'sandbox')) {
        connObj.sandbox = !!data.sandbox;
      }

      delete connObj._id;
      connObj.application = getApplicationName(connObj);
      dispatch(
        actions.resource.patchStaged(
          newId,
          jsonUtil.objectToPatchSet(connObj),
          SCOPES.VALUE
        )
      );
      setSelectedConnectionId({ newId, doc: connectionMap[_connectionId] });

      // handle Installation step click
    } else if (type === INSTALL_STEP_TYPES.INSTALL_PACKAGE) {
      if (!step.isTriggered) {
        dispatch(
          actions.template.updateStep(
            { ...step, status: 'triggered' },
            templateId
          )
        );

        if (
          conn &&
          conn.type === 'netsuite' &&
          ((conn.netsuite || {}).dataCenterURLs || {}).systemDomain
        ) {
          bundleURL = conn.netsuite.dataCenterURLs.systemDomain + bundleURL;
        }

        openExternalUrl({ url: bundleURL });
      } else {
        if (step.verifying) {
          return false;
        }

        dispatch(
          actions.template.updateStep(
            { ...step, status: 'verifying' },
            templateId
          )
        );
        dispatch(
          actions.template.verifyBundleOrPackageInstall(
            step,
            { _id: step.options._connectionId },
            templateId
          )
        );
      }
      // handle Action step click
    } else if (type === INSTALL_STEP_TYPES.STACK) {
      if (!stackId) setShowStackDialog(generateNewId());
    }
  };

  const handleBackClick = () => {
    props.history.goBack();
  };

  const handleSubmitComplete = (connectionId, createdConnectionDoc, isAuthorized) => {
    if (
      oAuthApplications.includes(
        getConnectionType(createdConnectionDoc)
      ) &&
      !isAuthorized
    ) {
      return;
    }

    dispatch(
      actions.template.updateStep(
        {
          _connectionId: connection.doc._id,
          newConnectionId: connectionId,
          status: 'completed',
          verifyBundleStep: ['netsuite', 'salesforce'].includes(
            connection.doc.type
          )
            ? connection.doc.type
            : false,
        },
        templateId
      )
    );

    setSelectedConnectionId(false);
  };

  const handleStackSetupDone = stackId => {
    dispatch(
      actions.template.updateStep(
        { status: 'completed', stackId, type: INSTALL_STEP_TYPES.STACK },
        templateId
      )
    );

    setShowStackDialog(false);
  };

  const handleConnectionClose = () => {
    setSelectedConnectionId(false);
  };

  const handleStackClose = () => {
    setShowStackDialog(false);
  };

  if (installInProgress) {
    return (
      <Loader open>
        {type === 'clone' ? 'Cloning' : 'Installing'}
        <Spinner />
      </Loader>
    );
  }

  return (
    <LoadResources required resources="connections,integrations">
      {connection && (
        <ResourceSetupDrawer
          resourceId={connection.newId}
          resource={connection.doc}
          resourceType="connections"
          environment={environment}
          connectionType={connection.doc.type}
          onClose={handleConnectionClose}
          onSubmitComplete={handleSubmitComplete}
          addOrSelect
        />
      )}
      {stackId && (
        <ResourceSetupDrawer
          onClose={handleStackClose}
          addOrSelect
          resourceId={stackId}
          resourceType="stacks"
          onSubmitComplete={handleStackSetupDone}
        />
      )}
      <div className={classes.root}>
        {variant !== 'new' && (
          <Grid container className={classes.formHead}>
            <Grid item xs={1}>
              <IconButton onClick={handleBackClick} size="medium">
                <ArrowBackIcon fontSize="inherit" />
              </IconButton>
            </Grid>
            <Grid item xs>
              <Paper elevation={0} className={classes.paper}>
                <Breadcrumbs separator={<ArrowRightIcon />}>
                  <Typography color="textPrimary">Setup</Typography>
                  <Typography color="textPrimary">
                    {resource.name ||
                      MODEL_PLURAL_TO_LABEL[resourceType] ||
                      'Template'}
                  </Typography>
                </Breadcrumbs>
              </Paper>
            </Grid>
          </Grid>
        )}
        <div className={classes.stepTable}>
          {installSteps.map((step, index) => (
            <InstallationStep
              key={step.name}
              templateId={templateId}
              connectionMap={connectionMap}
              handleStepClick={handleStepClick}
              index={index + 1}
              step={step}
            />
          ))}
        </div>
      </div>
    </LoadResources>
  );
}
