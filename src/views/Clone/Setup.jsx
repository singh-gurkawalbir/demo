import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import {
  Typography,
  IconButton,
  Breadcrumbs,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Spinner } from '@celigo/fuse-ui';
import actions from '../../actions';
import { selectors } from '../../reducers';
import LoadResources from '../../components/LoadResources';
import getRoutePath from '../../utils/routePaths';
import { HOME_PAGE_PATH, emptyObject, INSTALL_STEP_TYPES } from '../../constants';
import ArrowBackIcon from '../../components/icons/ArrowLeftIcon';
import openExternalUrl from '../../utils/window';
import ArrowRightIcon from '../../components/icons/ArrowRightIcon';
import ResourceSetupDrawer from '../../components/ResourceSetup/Drawer';
import InstallationStep from '../../components/InstallStep';
import {
  MODEL_PLURAL_TO_LABEL,
  generateNewId,
} from '../../utils/resource';
import jsonUtil from '../../utils/json';
import Loader from '../../components/Loader';
import { getApplication } from '../../utils/template';
import { drawerPaths, buildDrawerUrl } from '../../utils/rightDrawer';

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
  arrowBackButton: {
    padding: theme.spacing(1),
  },
}));

export default function Clone() {
  const classes = useStyles();
  const match = useRouteMatch();
  const { resourceType, resourceId } = match.params;
  const history = useHistory();
  const dispatch = useDispatch();
  const templateId = `${resourceType}-${resourceId}`;
  const resourceName = useSelector(state => {
    const resource = selectors.resource(state, resourceType, resourceId);

    return resource?.name || MODEL_PLURAL_TO_LABEL[resourceType];
  });

  const installSteps = useSelector(state =>
    selectors.cloneInstallSteps(state, resourceType, resourceId)
  );

  useEffect(() => {
    if (!installSteps.length) {
      history.push(`/clone/${resourceType}/${resourceId}/preview`);
    }
  });

  const handleSetupComplete = useCallback(
    (redirectTo, isInstallFailed, environment) => {
      // Incase clone is failed, then redirect to the dashboard
      if (isInstallFailed) {
        history.replace(getRoutePath(HOME_PAGE_PATH));
      } else {
        if (environment) {
          dispatch(
            actions.user.preferences.update({ environment })
          );
        }
        history.push(redirectTo);
      }
      dispatch(actions.template.clearTemplate(`${resourceType}-${resourceId}`));
    },
    [dispatch, history, resourceId, resourceType]
  );
  const [installInProgress, setInstallInProgress] = useState(false);
  const [connection, setSelectedConnectionId] = useState(null);
  const isSetupComplete = useSelector(state =>
    selectors.isSetupComplete(state, { resourceId, resourceType, templateId })
  );
  const { connectionMap, data } = useSelector(state =>
    selectors.installSetup(state, { resourceType, resourceId, templateId }), shallowEqual
  ) || emptyObject;
  const { redirectTo, isInstallFailed, destinationEnvironment } = useSelector(state => {
    const redirectOptions = selectors.redirectToOnInstallationComplete(state, { resourceType, resourceId, templateId });

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
      dispatch(actions.clone.createComponents(resourceType, resourceId));
    }
  }, [
    dispatch,
    isSetupComplete,
    resourceId,
    resourceType,
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
    isInstallFailed,
    destinationEnvironment,
  ]);

  if (!installSteps) {
    return <Typography>Invalid Configuration</Typography>;
  }

  const handleStepClick = (step, conn) => {
    const { _connectionId, installURL, type, completed } = step;
    let bundleURL = installURL;
    let netsuitePackageType = null;

    if (step?.name.startsWith('Integrator Bundle')) {
      netsuitePackageType = 'suitebundle';
    } else if (step?.name.startsWith('Integrator SuiteApp')) {
      netsuitePackageType = 'suiteapp';
    }

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
        )
      );
      setSelectedConnectionId({ newId, doc: connectionMap[_connectionId] });
      history.push(buildDrawerUrl({
        path: drawerPaths.INSTALL.CONFIGURE_RESOURCE_SETUP,
        baseUrl: match.url,
        params: { resourceType: 'connections', resourceId: newId },
      }));
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
            templateId,
            netsuitePackageType,
            true                                  // true here sets the isManualVerification flag to true which means the user has triggered the verification
          )
        );
      }
    } else if (type === INSTALL_STEP_TYPES.STACK) {
      const newStackId = generateNewId();

      history.push(buildDrawerUrl({
        path: drawerPaths.INSTALL.CONFIGURE_RESOURCE_SETUP,
        baseUrl: match.url,
        params: { resourceType: 'stacks', resourceId: newStackId },
      }));
    }
  };

  const handleBackClick = () => {
    history.goBack();
  };

  const handleSubmitComplete = connectionId => {
    if (connection?.doc) {
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
    }
    setSelectedConnectionId(false);
  };

  const handleStackSetupDone = stackId => {
    dispatch(
      actions.template.updateStep(
        { status: 'completed', stackId, type: INSTALL_STEP_TYPES.STACK },
        templateId
      )
    );
  };

  const handleConnectionClose = () => {
    setSelectedConnectionId(false);
  };

  if (installInProgress) {
    return <Loader open> Cloning <Spinner /> </Loader>;
  }

  return (
    <LoadResources required resources="connections,integrations">
      <div className={classes.root}>
        <div className={classes.formHead}>
          <IconButton onClick={handleBackClick} size="medium" className={classes.arrowBackButton}>
            <ArrowBackIcon />
          </IconButton>
          <div>
            <Breadcrumbs separator={<ArrowRightIcon />}>
              <Typography color="textPrimary">Setup</Typography>
              <Typography color="textPrimary"> {resourceName} </Typography>
            </Breadcrumbs>
          </div>
        </div>
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
        cloneResourceType={resourceType}
        cloneResourceId={resourceId}
       />
    </LoadResources>
  );
}
