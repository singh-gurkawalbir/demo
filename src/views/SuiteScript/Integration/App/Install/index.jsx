import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactResizeDetector from 'react-resize-detector';
import { isEqual } from 'lodash';
import { useHistory, useRouteMatch } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import InstallationStep from '../../../../../components/InstallStep';
import {SUITESCRIPT_CONNECTORS } from '../../../../../constants';
import openExternalUrl from '../../../../../utils/window';
import RightDrawer from '../../../../../components/drawer/Right';
import DrawerHeader from '../../../../../components/drawer/Right/DrawerHeader';
import DrawerContent from '../../../../../components/drawer/Right/DrawerContent';
import jsonUtil from '../../../../../utils/json';
import ResourceForm from '../../../../../components/SuiteScript/ResourceFormFactory';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import { COMM_STATES } from '../../../../../reducers/comms/networkComms';
import getRoutePath from '../../../../../utils/routePaths';
import LoadResources from '../../../../../components/LoadResources';
import ConnectionDrawer from '../drawer/Connection';
import CeligoPageBar from '../../../../../components/CeligoPageBar';
import ConnectionStatusPanel from '../../../../../components/SuiteScript/ConnectionStatusPanel';

const useStyles = makeStyles(theme => ({
  root: {
    // margin: theme.spacing(2),
    // flexGrow: 1,
    // width: '100%',
    maxHeight: `calc(100vh - (${theme.appBarHeight}px + ${theme.pageBarHeight}px))`,
    overflowY: 'auto',
  },
  formHead: {
    borderBottom: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    marginBottom: 29,
  },
  formContainer: {
    padding: theme.spacing(3),
    paddingTop: props => (props.notificationPanelHeight ? 0 : theme.spacing(3)),
    borderColor: 'rgb(0,0,0,0.1)',
    borderStyle: 'solid',
    borderWidth: '1px 0 0 0',
    overflowY: 'auto',
  },
  innerContent: {
    width: '100%',
    padding: theme.spacing(3),

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

export default function SuiteScriptIntegrationAppInstallation() {
  const [notificationPanelHeight, setNotificationPanelHeight] = useState(0);
  const classes = useStyles({
    notificationPanelHeight,
  });
  const dispatch = useDispatch();
  const match = useRouteMatch();

  const paramSSLinkedConnId = match.params.ssLinkedConnectionId;
  const suiteScriptConnectorId = match.params.integrationAppName;
  const { _id: connectorId, name, urlName, ssName } = useMemo(() => SUITESCRIPT_CONNECTORS.find(s => s._id === suiteScriptConnectorId), [suiteScriptConnectorId]);
  const resize = (width, height) => {
    setNotificationPanelHeight(height);
  };

  const [enqueueSnackbar] = useEnqueueSnackbar();
  const [ssConnection, setSSConnection] = useState(null);
  const history = useHistory();
  // using isEqual as shallowEqual doesn't do nested equality checks
  const { steps: installSteps, ssLinkedConnectionId, error, NETSUITE_CONNECTION, SALESFORCE_CONNECTION, ssIntegrationId, setupDone } = useSelector(state =>
    selectors.suiteScriptIntegrationAppInstallerData(state, connectorId), isEqual
  );
  const packageCommStatus = useSelector(state => selectors.commStatusPerPath(state, `/suitescript/connections/${ssLinkedConnectionId}/installer/getPackageURLs`, 'GET'));
  const currentStep = useMemo(() => installSteps.find(s => s.isCurrentStep), [
    installSteps,
  ]);
  const isInstallComplete = useSelector(state =>
    selectors.isSuiteScriptIntegrationAppInstallComplete(state, connectorId)
  );

  useEffect(() => {
    if (!installSteps || installSteps.length === 0) {
      dispatch(actions.suiteScript.installer.initSteps(
        connectorId,
      ));
    }
  }, [connectorId, dispatch, installSteps]);

  useEffect(() => {
    // to make final postInstall API call
    if (isInstallComplete && !setupDone && !error) {
      dispatch(actions.suiteScript.installer.completeSetup(connectorId, ssLinkedConnectionId));
      enqueueSnackbar({
        message: 'Please wait... configuring connector...',
        variant: 'success',
      });
    }
  }, [connectorId, enqueueSnackbar, dispatch, setupDone, isInstallComplete, ssLinkedConnectionId, error]);

  useEffect(() => {
    if (setupDone) {
      dispatch(actions.resource.requestCollection(`suitescript/connections/${ssLinkedConnectionId}/tiles`));
      history.replace(
        getRoutePath(`/suitescript/${ssLinkedConnectionId}/integrationapps/${urlName}/${ssIntegrationId}`)
      );
      dispatch(actions.suiteScript.installer.clearSteps(
        connectorId,
      ));
    }
  }, [connectorId, dispatch, history, setupDone, ssIntegrationId, ssLinkedConnectionId, urlName]);

  const verifySFBundle = useCallback(connectionId => {
    if (!currentStep.isTriggered && !connectionId) {
      dispatch(
        actions.suiteScript.installer.updateStep(
          connectorId,
          'inProgress'
        )
      );
      openExternalUrl({ url: currentStep.installURL });
    } else {
      if (currentStep.verifying) {
        return false;
      }

      dispatch(
        actions.suiteScript.installer.updateStep(
          connectorId,
          'verify'
        )
      );
      dispatch(
        actions.suiteScript.installer.verifySFBundle(
          connectorId,
          connectionId || ssLinkedConnectionId,
          ssName
        )
      );
    }
  }, [connectorId, currentStep, dispatch, ssLinkedConnectionId, ssName]);

  const verifyNSBundle = useCallback(connectionId => {
    if (!currentStep.isTriggered && !connectionId) {
      dispatch(
        actions.suiteScript.installer.updateStep(
          connectorId,
          'inProgress'
        )
      );
      openExternalUrl({ url: currentStep.installURL });
    } else {
      if (currentStep.verifying) {
        return false;
      }

      dispatch(
        actions.suiteScript.installer.updateStep(
          connectorId,
          'verify'
        )
      );
      dispatch(
        actions.suiteScript.installer.verifyNSBundle(
          connectorId,
          connectionId || ssLinkedConnectionId,
          !!connectionId,
          ssName
        )
      );
    }
  }, [connectorId, currentStep, dispatch, ssLinkedConnectionId, ssName]);

  const handleStepClick = useCallback(step => {
    const {
      connectionType,
      installURL,
      installerFunction,
      type,
      completed,
    } = step;

    if (completed) {
      return false;
    }

    if (type === 'connection') {
      if (step.isTriggered || step.verifying) {
        return false;
      }
      dispatch(
        actions.suiteScript.installer.updateStep(
          connectorId,
          'inProgress'
        )
      );
      history.push(`${match.url}/setConnection`);
    } else if (type === 'integrator-bundle') {
      verifyNSBundle();
    } else if (type === 'connector-bundle') {
      verifySFBundle();
    } else if (type === 'ssConnection') {
      if (step.isTriggered) {
        return false;
      }

      const doc = connectionType === 'netsuite' ? NETSUITE_CONNECTION : SALESFORCE_CONNECTION;

      if (doc) {
        dispatch(
          actions.suiteScript.resource.patchStaged(
            ssLinkedConnectionId,
            'connections',
            doc._id,
            jsonUtil.objectToPatchSet(doc),
          )
        );
        setSSConnection({
          _id: doc._id,
          doc,
        });
        history.push(`${match.url}/editConnection`);
      }
    } else if (installURL) {
      if (!step.isTriggered) {
        dispatch(
          actions.suiteScript.installer.updateStep(
            connectorId,
            'inProgress'
          )
        );
        openExternalUrl({ url: installURL });
      } else {
        if (step.verifying) {
          return false;
        }

        dispatch(
          actions.suiteScript.installer.updateStep(
            connectorId,
            'verify'
          )
        );
        dispatch(
          actions.suiteScript.installer.verifyPackage(
            connectorId,
            ssLinkedConnectionId,
            installerFunction
          )
        );
      }
      // handle Action step click
    } else if (!step.isTriggered && !installURL) {
      dispatch(
        actions.suiteScript.installer.updateStep(
          connectorId,
          'completed'
        )
      );
    }
  }, [NETSUITE_CONNECTION, SALESFORCE_CONNECTION, connectorId, dispatch, history, match.url, ssLinkedConnectionId, verifyNSBundle, verifySFBundle]);

  // const handleBackClick = useCallback(e => {
  //   e.preventDefault();
  //   history.push(getRoutePath('/marketplace'));
  // }, [history]);

  const handleSubmitComplete = useCallback((connectionId, isAuthorized, connectionDoc, skipDrawerClose) => {
    dispatch(
      actions.suiteScript.installer.updateSSLinkedConnectionId(
        connectorId,
        connectionId
      )
    );
    dispatch(
      actions.suiteScript.installer.updateStep(
        connectorId,
        'completed'
      )
    );
    verifyNSBundle(connectionId);
    if (!skipDrawerClose) {
      history.replace(`${match.url}`);
    }
  }, [connectorId, dispatch, history, verifyNSBundle, match.url]);

  const onSSConnSubmitComplete = useCallback(() => {
    if (currentStep.connectionType === 'salesforce') {
      dispatch(
        actions.suiteScript.installer.requestPackages(
          connectorId,
          ssLinkedConnectionId
        )
      );
    }
    dispatch(
      actions.suiteScript.installer.updateStep(
        connectorId,
        'completed'
      )
    );
    setSSConnection(null);
    history.goBack();
  }, [connectorId, currentStep, dispatch, history, ssLinkedConnectionId]);

  useEffect(() => {
    if (installSteps && installSteps.length > 0 && !ssLinkedConnectionId && paramSSLinkedConnId) {
      handleSubmitComplete(paramSSLinkedConnId, true, null, true);
    }
  }, [handleSubmitComplete, installSteps, paramSSLinkedConnId, ssLinkedConnectionId]);

  if (error) {
    enqueueSnackbar({
      message: error,
      variant: 'error',
    });
  }
  if (isInstallComplete && !setupDone) {
    return (
      <Spinner center="screen" />
    );
  }

  return (

    <LoadResources resources="integrations,connections">
      <CeligoPageBar
        title={`Install app: ${name}`}
        // Todo: (Mounika) please add the helpText
        infoText="we need to have the help text for the following."
         />

      <div className={classes.root}>
        <div className={classes.innerContent}>
          { packageCommStatus === COMM_STATES.LOADING && (

            <Spinner />

          )}
          <ConnectionDrawer
            connectorId={connectorId}
            handleSubmitComplete={handleSubmitComplete} />
          {ssConnection && (
          <RightDrawer
            isSuitescript
            path="editConnection"
            height="tall"
            width="medium">
            <DrawerHeader title="Set up connection" />
            <DrawerContent>
              <div className={classes.formContainer}>
                <div>
                  <ConnectionStatusPanel
                    resourceType="connections"
                    resourceId={ssConnection._id}
                    ssLinkedConnectionId={ssLinkedConnectionId}
                  />
                  <ReactResizeDetector handleHeight onResize={resize} />
                </div>
                <ResourceForm
                  ssLinkedConnectionId={ssLinkedConnectionId}
                  resourceId={ssConnection._id}
                  resourceType="connections"
                  onSubmitComplete={onSSConnSubmitComplete}
                  />
              </div>
            </DrawerContent>
          </RightDrawer>
          )}

          <div className={classes.stepTable}>
            {installSteps.map((step, index) => (
              <InstallationStep
                key={step.__index}
                handleStepClick={handleStepClick}
                index={index + 1}
                step={step}
              />
            ))}
          </div>
        </div>
      </div>
    </LoadResources>
  );
}
