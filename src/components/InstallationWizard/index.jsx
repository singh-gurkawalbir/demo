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
import ArrowBackIcon from '../icons/ArrowLeftIcon';
import * as selectors from '../../reducers';
import actions from '../../actions';
import LoadResources from '../LoadResources';
import openExternalUrl from '../../utils/window';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import ResourceSetupDialog from '../ResourceSetupDialog';
import InstallationStep from '../InstallStep';
import resourceConstants from '../../forms/constants/connection';
import {
  getResourceSubType,
  MODEL_PLURAL_TO_LABEL,
  generateNewId,
} from '../../utils/resource';
import jsonUtil from '../../utils/json';
import { INSTALL_STEP_TYPES } from '../../utils/constants';
import { SCOPES } from '../../sagas/resourceForm';
import getRoutePath from '../../utils/routePaths';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2),
    flexGrow: 1,
    width: '100%',
    padding: '10px 25px',
  },
  formHead: {
    borderBottom: `solid 1px ${theme.palette.secondary.lightest}`,
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

  return type;
};

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
  } = props;
  const [connection, setSelectedConnectionId] = useState(null);
  const [stackId, setShowStackDialog] = useState(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const dispatch = useDispatch();
  const { connectionMap, createdComponents } =
    useSelector(state => {
      if (type === 'clone') {
        return selectors.cloneData(state, resourceType, resourceId);
      } else if (type === 'template') {
        return selectors.templateSetup(state, templateId);
      }
    }) || {};

  useEffect(() => {
    if (
      installSteps.length &&
      !installSteps.reduce((result, step) => result || !step.completed, false)
    ) {
      setIsSetupComplete(true);
    } else if (!installSteps.length) {
      if (type === 'clone') {
        props.history.push(
          getRoutePath(`/clone/${resourceType}/${resourceId}/preview`)
        );
      } else {
        props.history.push(getRoutePath('/dashboard'));
      }
    }
  }, [installSteps, props.history, resourceId, resourceType, type]);

  useEffect(() => {
    if (isSetupComplete) {
      // Send the gathered information to BE to create all components
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
    if (createdComponents) {
      handleSetupComplete(createdComponents);
    }
  }, [createdComponents, handleSetupComplete]);

  if (!installSteps) {
    return <Typography>Invalid Configuration</Typography>;
  }

  const handleStepClick = (step, conn) => {
    const { _connectionId, installURL, type } = step;
    let bundleURL = installURL;

    // handle connection step click
    if (type === INSTALL_STEP_TYPES.CONNECTION) {
      if (step.isTriggered) {
        return false;
      }

      const newId = generateNewId();
      const connObj = { ...connectionMap[_connectionId] };

      delete connObj._id;
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

  const handleSubmitComplete = (connectionId, isAuthorized) => {
    if (
      resourceConstants.OAUTH_APPLICATIONS.includes(
        getConnectionType(connection.doc)
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

  return (
    <LoadResources required resources="connections,integrations">
      {connection && (
        <ResourceSetupDialog
          resourceId={connection.newId}
          resource={connection.doc}
          resourceType="connections"
          connectionType={connection.doc.type}
          onClose={handleConnectionClose}
          onSubmitComplete={handleSubmitComplete}
          addOrSelect
        />
      )}
      {stackId && (
        <ResourceSetupDialog
          onClose={handleStackClose}
          addOrSelect
          resourceId={stackId}
          resourceType="stacks"
          onSubmitComplete={handleStackSetupDone}
        />
      )}
      <div className={classes.root}>
        <div className={classes.innerContent}>
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
          <Grid container spacing={3} className={classes.stepTable}>
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
          </Grid>
        </div>
      </div>
    </LoadResources>
  );
}
