import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  IconButton,
  Breadcrumbs,
} from '@material-ui/core';
import ArrowBackIcon from '../icons/ArrowLeftIcon';
import { selectors } from '../../reducers';
import actions from '../../actions';
import LoadResources from '../LoadResources';
import openExternalUrl from '../../utils/window';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import ResourceSetupDrawer from '../ResourceSetup/Drawer';
import InstallationStep from '../InstallStep';
import {
  MODEL_PLURAL_TO_LABEL,
  generateNewId,
} from '../../utils/resource';
import jsonUtil from '../../utils/json';
import { emptyObject, INSTALL_STEP_TYPES } from '../../utils/constants';
import { SCOPES } from '../../sagas/resourceForm';
import Loader from '../Loader';
import Spinner from '../Spinner';
import { getApplication } from '../../utils/template';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    margin: theme.spacing(2),
  },
  formHead: {
    borderBottom: `solid 1px ${theme.palette.secondary.lightest}`,
    marginBottom: 29,
    display: 'flex',
    alignItems: 'center',
  },
  stepTable: { maxWidth: 750 },
  paper: {
    padding: theme.spacing(1, 2),
    background: theme.palette.background.default,
  },
  arrowBackButton: {
    padding: theme.spacing(1),
  },
}));

/* This file is used only incase of Resource cloning other than Integrations
* Refactor this code to either remove common code or make this explicit to be used only for clone
* Remove 'type' property and template type related ghost code
*/
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

  const [installInProgress, setInstallInProgress] = useState(false);
  const [connection, setSelectedConnectionId] = useState(null);
  const [stackId, setShowStackDialog] = useState(null);
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const history = useHistory();
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
    ) || emptyObject;
  const { redirectTo, isInstallFailed, destinationEnvironment } = useSelector(state => {
    const redirectOptions = selectors.redirectToOnInstallationComplete(state, {
      resourceType,
      resourceId,
      templateId,
    });

    return {
      redirectTo: redirectOptions.redirectTo,
      isInstallFailed: redirectOptions.isInstallFailed,
      destinationEnvironment: redirectOptions.destinationEnvironment,
    };
  }, shallowEqual
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
      connObj.application = getApplication(connObj)?.name;
      dispatch(
        actions.resource.patchStaged(
          newId,
          jsonUtil.objectToPatchSet(connObj),
          SCOPES.VALUE
        )
      );
      setSelectedConnectionId({ newId, doc: connectionMap[_connectionId] });
      history.push(`${match.url}/configure/connections/${newId}`);

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
    } else if (type === INSTALL_STEP_TYPES.STACK) {
      if (!stackId) {
        const newStackId = generateNewId();

        setShowStackDialog(newStackId);
        history.push(`${match.url}/configure/stacks/${newStackId}`);
      }
    }
  };

  const handleBackClick = () => {
    props.history.goBack();
  };

  const handleSubmitComplete = connectionId => {
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
      <div className={classes.root}>
        {variant !== 'new' && (
          <div className={classes.formHead}>

            <IconButton onClick={handleBackClick} size="medium" className={classes.arrowBackButton}>
              <ArrowBackIcon />
            </IconButton>

            <div>
              <Breadcrumbs separator={<ArrowRightIcon />}>
                <Typography color="textPrimary">Setup</Typography>
                <Typography color="textPrimary">
                  {resource.name ||
                      MODEL_PLURAL_TO_LABEL[resourceType] ||
                      'Template'}
                </Typography>
              </Breadcrumbs>
            </div>
          </div>
        )}
        <div className={classes.stepTable}>
          {installSteps.map((step, index) => (
            <InstallationStep
              key={step.key || step.name}
              templateId={templateId}
              connectionMap={connectionMap}
              handleStepClick={handleStepClick}
              index={index + 1}
              step={step}
            />
          ))}
        </div>
      </div>
      <ResourceSetupDrawer
        mode="clone"
        templateId={templateId}
        onClose={handleConnectionClose}
        onSubmitComplete={handleSubmitComplete}
        handleStackSetupDone={handleStackSetupDone}
        handleStackClose={handleStackClose}
        cloneResourceType={resourceType}
        cloneResourceId={resourceId}
       />
    </LoadResources>
  );
}
