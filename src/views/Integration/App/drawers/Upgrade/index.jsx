import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
} from '@material-ui/core';
import isEmpty from 'lodash/isEmpty';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import {
  generateNewId,
  isOauth,
} from '../../../../../utils/resource';
import LoadResources from '../../../../../components/LoadResources';
import openExternalUrl from '../../../../../utils/window';
import ResourceSetupDrawer from '../../../../../components/ResourceSetup/Drawer';
import InstallationStep from '../../../../../components/InstallStep';
import { SCOPES } from '../../../../../sagas/resourceForm';
import jsonUtil from '../../../../../utils/json';
import { INSTALL_STEP_TYPES, emptyObject,
} from '../../../../../constants';
import FormStepDrawer from '../../../../../components/InstallStep/FormStep';
import RawHtml from '../../../../../components/RawHtml';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import { buildDrawerUrl, drawerPaths } from '../../../../../utils/rightDrawer';
import RightDrawer from '../../../../../components/drawer/Right';
import DrawerHeader from '../../../../../components/drawer/Right/DrawerHeader';
import DrawerContent from '../../../../../components/drawer/Right/DrawerContent';
import DrawerFooter from '../../../../../components/drawer/Right/DrawerFooter';
import FilledButton from '../../../../../components/Buttons/FilledButton';

const useStyles = makeStyles(theme => ({
  installIntegrationWrapper: {
    padding: theme.spacing(2, 3),
  },
  installIntegrationWrapperContent: {
    maxWidth: 750,
  },
  message: {
    marginBottom: theme.spacing(2),
  },
  formHead: {
    borderBottom: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    marginBottom: 5,
  },
  floatRight: {
    float: 'right',
  },
  paper: {
    padding: theme.spacing(1, 2),
    background: theme.palette.background.default,
  },
  installIntegrationSteps: {
    display: 'flex',
    flexDirection: 'column',
  },
  noIntegrationMsg: {
    padding: theme.spacing(3),
  },
}));

function UpgradeInstallation() {
  const classes = useStyles();
  const [stackId, setShowStackDialog] = useState(null);
  const history = useHistory();
  const match = useRouteMatch();
  const { currentIntegrationId: integrationId } = match.params;
  const [connection, setConnection] = useState(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isResourceStaged, setIsResourceStaged] = useState(false);
  const dispatch = useDispatch();

  const integration = useSelectorMemo(selectors.mkIntegrationAppSettings, integrationId);

  const { _connectorId } = integration?._connectorId || emptyObject;

  const helpUrl = useSelector(state => {
    const integrationApp = selectors.resource(state, 'published', _connectorId);

    return integrationApp && integrationApp.helpURL;
  });
  const changeEditionSteps = useSelector(state =>
    selectors.integrationChangeEditionSteps(state, integrationId),
  shallowEqual
  );

  const status = useSelector(state => selectors.getStatus(state, integrationId)?.status);

  const { openOauthConnection, connectionId } = useSelector(
    state => selectors.v2canOpenOauthConnection(state, integrationId),
    (left, right) => (left.openOauthConnection === right.openOauthConnection && left.connectionId === right.connectionId)
  );

  const oauthConnection = useSelectorMemo(selectors.makeResourceSelector, 'connections', connectionId);

  useEffect(() => {
    if (openOauthConnection && oauthConnection) {
      dispatch(actions.integrationApp.upgrade.installer.setOauthConnectionMode(connectionId, false, integrationId));
      setConnection({
        _connectionId: connectionId,
      });
      history.push(buildDrawerUrl({
        path: drawerPaths.INSTALL.CONFIGURE_RESOURCE_SETUP,
        baseUrl: match.url,
        params: { resourceType: 'connections', resourceId: connectionId },
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionId, dispatch, integrationId, openOauthConnection, oauthConnection]);

  const handleClose = useCallback(() => {
    setConnection(false);
  }, []);
  const isFrameWork2 = changeEditionSteps.length;

  useEffect(() => {
    const allStepsCompleted = status === 'done';

    if (changeEditionSteps.length) {
      if (allStepsCompleted && !isSetupComplete) {
        dispatch(actions.resource.request('integrations', integrationId));
        dispatch(actions.integrationApp.upgrade.setStatus(integrationId, { showWizard: false }));
        history.goBack();
        setIsSetupComplete(true);
      } else if (!allStepsCompleted && isSetupComplete) {
        setIsSetupComplete(false);
      }
    }
  }, [changeEditionSteps, dispatch, history, integrationId, isSetupComplete, status]);

  const handleSubmitComplete = useCallback(
    (connId, isAuthorized, connectionDoc = {}) => {
      const step = changeEditionSteps.find(s => s.isCurrentStep);

      dispatch(
        actions.integrationApp.upgrade.installer.updateStep(
          integrationId,
          (step || {}).installerFunction,
          'inProgress'
        )
      );

      if (isFrameWork2) {
        dispatch(
          actions.integrationApp.upgrade.installer.scriptInstallStep(
            integrationId,
             connection?._connectionId || connId,
             connectionDoc
          )
        );
      }
      if (connectionDoc && !isOauth(connectionDoc)) {
        setConnection(false);
      }
    },
    [changeEditionSteps, connection?._connectionId, dispatch, integrationId, isFrameWork2]
  );

  if (!changeEditionSteps) {
    return <Typography className={classes.noIntegrationMsg}>No integration found</Typography>;
  }

  const handleStepClick = step => {
    const {
      _connectionId,
      installURL,
      installerFunction,
      type,
      sourceConnection,
      completed,
      url,
      updatedUrl,
      form,
    } = step;

    if (completed) {
      return false;
    }

    if (_connectionId || type === 'connection' || sourceConnection) {
      if (step.isTriggered) {
        return false;
      }

      const newId = generateNewId();

      if (!_connectionId) {
        dispatch(
          actions.resource.patchStaged(
            newId,
            jsonUtil.objectToPatchSet({
              ...sourceConnection,
              newIA: true,
              _id: newId,
              _integrationId: integrationId,
              _connectorId,
              installStepConnection: true,
            }),
            SCOPES.VALUE
          )
        );
        setIsResourceStaged(true);
      }
      setConnection({
        newId,
        doc: sourceConnection,
        _connectionId,
      });
      history.push(buildDrawerUrl({
        path: drawerPaths.INSTALL.CONFIGURE_RESOURCE_SETUP,
        baseUrl: match.url,
        params: { resourceType: 'connections', resourceId: _connectionId || newId },
      }));
    } else if (isFrameWork2 && !step.isTriggered && !installURL && !url && type !== 'stack') {
      dispatch(
        actions.integrationApp.upgrade.installer.updateStep(
          integrationId,
          installerFunction,
          'inProgress'
        )
      );

      if (type === INSTALL_STEP_TYPES.FORM || type === INSTALL_STEP_TYPES.URL) {
        dispatch(
          actions.integrationApp.upgrade.installer.getCurrentStep(integrationId, step)
        );
      } else {
        dispatch(
          actions.integrationApp.upgrade.installer.scriptInstallStep(integrationId)
        );
      }
      if (type === INSTALL_STEP_TYPES.FORM) {
        history.push(buildDrawerUrl({
          path: drawerPaths.INSTALL.FORM_STEP,
          baseUrl: match.url,
          params: { formType: 'install' },
        }));
      }
    } else if (installURL || url || updatedUrl) {
      if (!step.isTriggered) {
        dispatch(
          actions.integrationApp.upgrade.installer.updateStep(
            integrationId,
            installerFunction,
            'inProgress'
          )
        );
        openExternalUrl({ url: installURL || url || updatedUrl});
      } else {
        if (step.verifying) {
          return false;
        }

        dispatch(
          actions.integrationApp.upgrade.installer.updateStep(
            integrationId,
            installerFunction,
            'verify'
          )
        );

        if (!_connectorId && step._connId) {
          dispatch(
            actions.integrationApp.templates.upgrade.installer.verifyBundleOrPackageInstall(
              integrationId,
              step._connId,
              installerFunction,
              isFrameWork2
            )
          );
        } else if (isFrameWork2) {
          dispatch(
            actions.integrationApp.upgrade.installer.scriptInstallStep(integrationId)
          );
        }
      }
    } else if (type === 'stack') {
      if (!stackId) {
        const newStackId = generateNewId();

        setShowStackDialog(newStackId);
        history.push(buildDrawerUrl({
          path: drawerPaths.INSTALL.CONFIGURE_RESOURCE_SETUP,
          baseUrl: match.url,
          params: { resourceType: 'stacks', resourceId: newStackId },
        }));
      }
    } else if (!isEmpty(form)) {
      dispatch(actions.integrationApp.upgrade.installer.updateStep(
        integrationId,
        installerFunction,
        'inProgress',
        form
      ));
      history.push(buildDrawerUrl({
        path: drawerPaths.INSTALL.FORM_STEP,
        baseUrl: match.url,
        params: { formType: 'install' },
      }));
    } else if (!step.isTriggered) {
      dispatch(
        actions.integrationApp.upgrade.installer.updateStep(
          integrationId,
          installerFunction,
          'inProgress'
        )
      );
    }
  };
  const handleStackSetupDone = stackId => {
    dispatch(
      actions.integrationApp.upgrade.installer.scriptInstallStep(
        integrationId, '', '', '', stackId,
      )
    );

    setShowStackDialog(false);
  };

  const handleStackClose = () => {
    setShowStackDialog(false);
  };

  return (
    <LoadResources required resources="connections,integrations,published">
      <div className={classes.installIntegrationWrapper}>
        <div className={classes.installIntegrationWrapperContent}>
          {helpUrl ? (
            <RawHtml
              className={classes.message}
              options={{ allowedHtmlTags: ['a', 'br'] }}
              html={` Complete the steps below to install your ${_connectorId ? 'integration app' : 'integration'}.<br />
            Need more help? <a href="${helpUrl}" target="_blank">Check out our help guide</a>`} />
          ) : (
            <Typography className={classes.message}>{`Complete the steps below to install your ${_connectorId ? 'integration app' : 'integration'}.`}</Typography>
          )}
          <div className={classes.installIntegrationSteps}>
            {changeEditionSteps.map((step, index) => (
              <InstallationStep
                key={step.name}
                handleStepClick={handleStepClick}
                index={index + 1}
                step={step}
                integrationId={integrationId}
                isFrameWork2={isFrameWork2}
              />
            ))}
          </div>
        </div>
      </div>
      <FormStepDrawer integrationId={integrationId} />
      <ResourceSetupDrawer
        integrationId={integrationId}
        onClose={handleClose}
        onSubmitComplete={handleSubmitComplete}
        handleStackSetupDone={handleStackSetupDone}
        handleStackClose={handleStackClose}
        isResourceStaged={isResourceStaged}
        setIsResourceStaged={setIsResourceStaged}
        mode="install"
      />
    </LoadResources>
  );
}

export default function UpgradeDrawer() {
  const history = useHistory();
  const onClose = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <RightDrawer
      onClose={onClose}
      path={drawerPaths.UPGRADE.INSTALL}
      height="tall">
      <DrawerHeader title="Upgrade plan" />
      <DrawerContent>
        <UpgradeInstallation />
      </DrawerContent>
      <DrawerFooter>
        <FilledButton
          onClick={onClose}
        >
          Close
        </FilledButton>
      </DrawerFooter>
    </RightDrawer>
  );
}

