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
import ResourceSetupDialog from '../../components/ResourceSetupDialog';
import InstallationStep from '../../components/InstallStep';
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

export default function Clone(props) {
  const classes = useStyles();
  const { resourceType, resourceId } = props.match.params;
  const [connection, setSelectedConnectionId] = useState(null);
  const [stackId, setShowStackDialog] = useState(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const dispatch = useDispatch();
  const resource =
    useSelector(state => selectors.resource(state, resourceType, resourceId)) ||
    {};
  const installSteps = useSelector(state =>
    selectors.cloneInstallSteps(state, resourceType, resourceId)
  );
  const { connectionMap, createdComponents } =
    useSelector(state =>
      selectors.cloneData(state, resourceType, resourceId)
    ) || {};

  useEffect(() => {
    if (
      installSteps.length &&
      !installSteps.reduce((result, step) => result || !step.completed, false)
    ) {
      setIsSetupComplete(true);
    } else if (!installSteps.length) {
      props.history.push(
        getRoutePath(`/clone/${resourceType}/${resourceId}/preview`)
      );
    }
  }, [installSteps, props.history, resourceId, resourceType]);

  useEffect(() => {
    if (isSetupComplete) {
      // Send the gathered information to BE to create all components
      dispatch(actions.clone.createComponents(resourceType, resourceId));
    }
  }, [dispatch, isSetupComplete, props.history, resourceId, resourceType]);
  useEffect(() => {
    if (createdComponents) {
      dispatch(actions.clone.clearData(resourceType, resourceId));
      dispatch(actions.resource.requestCollection('integrations'));
      dispatch(actions.resource.requestCollection('flows'));
      dispatch(actions.resource.requestCollection('connections'));
      dispatch(actions.resource.requestCollection('exports'));
      dispatch(actions.resource.requestCollection('imports'));
      dispatch(actions.resource.requestCollection('stacks'));

      if (['integrations', 'flows'].includes(resourceType)) {
        // redirect to integration Settings
        const integration = createdComponents.find(
          c => c.model === 'Integration'
        );

        if (integration) {
          props.history.push(
            getRoutePath(`/integrations/${integration._id}/settings/flows`)
          );
        } else {
          props.history.push('/');
        }
      } else {
        props.history.push(getRoutePath(`/${resourceType}`));
      }
    }
  }, [createdComponents, dispatch, props.history, resourceId, resourceType]);

  if (!installSteps) {
    return <Typography>Invalid Resource</Typography>;
  }

  const handleStepClick = (step, conn) => {
    const { _connectionId, installURL, type } = step;
    let bundleURL = installURL;

    // handle connection step click
    if (type === INSTALL_STEP_TYPES.CONNECTION) {
      if (step.isTriggered) {
        return false;
      }

      const newId = `${generateNewId()}`;
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
          actions.clone.updateStep(
            { ...step, status: 'triggered' },
            resourceType,
            resourceId
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
          actions.clone.updateStep(
            { ...step, status: 'verifying' },
            resourceType,
            resourceId
          )
        );
        dispatch(
          actions.clone.verifyBundleOrPackageInstall(
            step,
            { _id: step.options._connectionId },
            resourceType,
            resourceId
          )
        );
      }
      // handle Action step click
    } else if (type === INSTALL_STEP_TYPES.STACK) {
      if (!stackId) setShowStackDialog(`${generateNewId()}`);
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
      actions.clone.updateStep(
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
        resourceType,
        resourceId
      )
    );
    setSelectedConnectionId(false);
  };

  const handleStackSetupDone = stackId => {
    dispatch(
      actions.clone.updateStep(
        { status: 'completed', stackId, type: INSTALL_STEP_TYPES.STACK },
        resourceType,
        resourceId
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
                    {resource.name || MODEL_PLURAL_TO_LABEL[resourceType]}
                  </Typography>
                </Breadcrumbs>
              </Paper>
            </Grid>
          </Grid>
          <Grid container spacing={3} className={classes.stepTable}>
            {installSteps.map((step, index) => (
              <InstallationStep
                key={step.name}
                templateId={`${resourceType}-${resourceId}`}
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
