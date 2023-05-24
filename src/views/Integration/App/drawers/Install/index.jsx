/*
 TODO:
 This file needs to be re-implemented as a stepper functionality drawer as per new mocks.
 As of now this is not a drawer, but a standalone page.
*/
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import {
  Typography,
  Link,
  Box,
} from '@mui/material';
import isEmpty from 'lodash/isEmpty';
import { TextButton } from '@celigo/fuse-ui';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import {
  generateNewId,
  isOauth,
} from '../../../../../utils/resource';
import CeligoPageBar from '../../../../../components/CeligoPageBar';
import LoadResources from '../../../../../components/LoadResources';
import openExternalUrl from '../../../../../utils/window';
import ResourceSetupDrawer from '../../../../../components/ResourceSetup/Drawer';
import InstallationStep from '../../../../../components/InstallStep';
import useConfirmDialog from '../../../../../components/ConfirmDialog';
import { getIntegrationAppUrlName } from '../../../../../utils/integrationApps';
import jsonUtil from '../../../../../utils/json';
import { INSTALL_STEP_TYPES, emptyObject,
} from '../../../../../constants';
import FormStepDrawer from '../../../../../components/InstallStep/FormStep';
import CloseIcon from '../../../../../components/icons/CloseIcon';
import RawHtml from '../../../../../components/RawHtml';
import getRoutePath from '../../../../../utils/routePaths';
import HelpIcon from '../../../../../components/icons/HelpIcon';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import { buildDrawerUrl, drawerPaths } from '../../../../../utils/rightDrawer';
import { message } from '../../../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
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
}));

export default function ConnectorInstallation() {
  const classes = useStyles();
  const [stackId, setShowStackDialog] = useState(null);
  const history = useHistory();
  const match = useRouteMatch();
  const { integrationId: _integrationId, childId } = match.params;
  const [connection, setConnection] = useState(null);
  const { confirmDialog } = useConfirmDialog();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isResourceStaged, setIsResourceStaged] = useState(false);
  const dispatch = useDispatch();

  const integrationId = childId || _integrationId;

  const integration = useSelectorMemo(selectors.mkIntegrationAppSettings, integrationId);

  const {
    name: integrationName,
    install = [],
    integrationInstallSteps = [],
    mode,
    children,
    supportsMultiStore,
    _connectorId,
    initChild,
    parentId,
  } = useMemo(() => integration ? {
    name: integration.name,
    initChild: integration.initChild,
    install: integration.install,
    mode: integration.mode,
    children: integration.children,
    supportsMultiStore: !!(integration.settings && integration.settings.supportsMultiStore),
    _connectorId: integration._connectorId,
    integrationInstallSteps: integration.installSteps,
    parentId: integration._parentId,
  } : emptyObject, [integration]);

  const {
    name: childIntegrationName,
    id: childIntegrationId,
    mode: childIntegrationMode,
  } = useSelector(state => {
    const id = selectors.getChildIntegrationId(state, integrationId);

    if (id) {
      const integration = selectors.resource(state, 'integrations', id);

      if (integration) {
        return {
          name: integration.name,
          id: integration._id,
          mode: integration.mode,
        };
      }
    }

    return emptyObject;
  }, shallowEqual);
  const helpUrl = useSelector(state => {
    const integrationApp = selectors.resource(state, 'published', _connectorId);

    return integrationApp && integrationApp.helpURL;
  });
  const installSteps = useSelector(state =>
    selectors.integrationInstallSteps(state, integrationId),
  shallowEqual
  );

  const { openOauthConnection, connectionId } = useSelector(
    state => selectors.canOpenOauthConnection(state, integrationId),
    (left, right) => (left.openOauthConnection === right.openOauthConnection && left.connectionId === right.connectionId)
  );

  const oauthConnection = useSelectorMemo(selectors.makeResourceSelector, 'connections', connectionId);

  useEffect(() => {
    if (openOauthConnection && oauthConnection) {
      dispatch(actions.integrationApp.installer.setOauthConnectionMode(connectionId, false, integrationId));
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

  const integrationAppName = getIntegrationAppUrlName(integrationName);
  const integrationChildAppName = getIntegrationAppUrlName(childIntegrationName);
  const handleClose = useCallback(() => {
    setConnection(false);
  }, []);
  const isCloned = install.find(step => step.isClone);
  const isFrameWork2 = integrationInstallSteps.length || isCloned;

  const redirectTo = useSelector(state => selectors.shouldRedirect(state, integrationId));

  // init the install for IA2.0 to get updated installSteps
  useEffect(() => {
    if (isFrameWork2) {
      dispatch(actions.integrationApp.installer.init(integrationId));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (redirectTo) {
      history.push(getRoutePath(redirectTo));
      dispatch(actions.resource.integrations.clearRedirect(integrationId));
    }
  }, [dispatch, history, integrationId, redirectTo]);

  useEffect(() => {
    const allStepsCompleted = !installSteps.reduce((result, step) => result || !step.completed, false);

    if (installSteps.length) {
      if (allStepsCompleted && !isSetupComplete) {
        dispatch(actions.resource.request('integrations', integrationId));
        setIsSetupComplete(true);
      } else if (!allStepsCompleted && isSetupComplete) {
        // reset local state if some new steps were added
        setIsSetupComplete(false);
      }
    }
  }, [dispatch, installSteps, integrationId, isSetupComplete]);

  const handleSubmitComplete = useCallback(
    (connId, isAuthorized, connectionDoc = {}) => {
      // Here connection Doc will come into picture for only for IA2.0 and if connection step doesn't contain connection Id.
      const step = installSteps.find(s => s.isCurrentStep);

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
             connection?._connectionId || connId,
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
      if (connectionDoc && !isOauth(connectionDoc)) {
        setConnection(false);
      }
    },
    [
      connection,
      dispatch,
      installSteps,
      integrationId,
      isFrameWork2,
    ]
  );

  useEffect(() => {
    if (isSetupComplete) {
      // redirect to integration Settings
      // TODO: move this to data layer
      dispatch(actions.resource.request('integrations', integrationId));
      dispatch(actions.resource.requestCollection('flows', undefined, undefined, integrationId));
      dispatch(actions.resource.requestCollection('exports', undefined, undefined, integrationId));
      dispatch(actions.license.refreshCollection());
      dispatch(actions.resource.requestCollection('imports', undefined, undefined, integrationId));
      dispatch(actions.resource.requestCollection('connections', undefined, undefined, integrationId));
      dispatch(actions.resource.requestCollection('asynchelpers', undefined, undefined, integrationId));
      dispatch(actions.resource.requestCollection('scripts'));

      if (mode === 'settings') {
        if (
          initChild &&
          initChild.function &&
          childIntegrationMode === 'install'
        ) {
          setIsSetupComplete(false);
          history.push(
            getRoutePath(`/integrationapps/${integrationChildAppName}/${childIntegrationId}/setup`)
          );
        } else if (parentId) {
          dispatch(actions.resource.requestCollection('tree/metadata', undefined, undefined, parentId));
          history.push(
            getRoutePath(`/integrationapps/${integrationAppName}/${parentId}/child/${integrationId}/flows`)
          );
        } else if (integrationInstallSteps && integrationInstallSteps.length > 0) {
          if (_connectorId) {
            history.push(
              getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}`)
            );
          } else {
            history.push(
              getRoutePath(`/integrations/${integrationId}/flows`)
            );
          }
        } else {
          history.push(
            getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/flows`)
          );
        }
      }
    }
  }, [dispatch,
    mode,
    _connectorId,
    integrationAppName,
    integrationId,
    isSetupComplete,
    history,
    childIntegrationId,
    childIntegrationMode,
    integrationChildAppName,
    initChild,
    parentId,
    integrationInstallSteps,
    isFrameWork2,
  ]);

  if (!installSteps) {
    return <Typography sx={{ padding: theme => theme.spacing(3) }}>No integration found</Typography>;
  }

  const handleUninstall = e => {
    e.preventDefault();
    confirmDialog({
      title: 'Confirm uninstall',
      message: message.SURE_UNINSTALL,
      buttons: [
        {
          label: 'Uninstall',
          error: true,
          onClick: () => {
            if (!_connectorId) {
              dispatch(actions.resource.integrations.delete(integrationId));

              return;
            }
            const childId = children?.length
              ? children[0].value
              : undefined;

            // for old cloned IAs, uninstall should happen the old way
            if (isFrameWork2 && !isCloned) {
              const { url } = match;
              const urlExtractFields = url.split('/');
              const index = urlExtractFields.findIndex(
                element => element === 'child'
              );

              // REVIEW: @ashu, review with Dave once
              // if url contains '/child/xxx' use that id as child id
              if (index === -1) {
                history.push(
                  getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/uninstall`)
                );
              } else {
                history.push(
                  getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/uninstall/child/${urlExtractFields[index + 1]}`)
                );
              }
            } else if (supportsMultiStore) {
              history.push(
                getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/uninstall/child/${childId}`)
              );
            } else {
              history.push(
                getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/uninstall`)
              );
            }
          },
        },
        {
          label: 'Cancel',
          variant: 'text',
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
      completed,
      url,
      updatedUrl,
      form,
    } = step;

    let netsuitePackageType = null;

    if (step?.name.startsWith('Integrator Bundle')) {
      netsuitePackageType = 'suitebundle';
    } else if (step?.name.startsWith('Integrator SuiteApp')) {
      netsuitePackageType = 'suiteapp';
    }

    if (completed) {
      return false;
    }

    if (_connectionId || type === 'connection' || (sourceConnection && !(step?.name.startsWith('Integrator Bundle') || step?.name.startsWith('Integrator SuiteApp')))) {
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
          )
        );
        setIsResourceStaged(true);
        setConnection({
          newId,
          doc: sourceConnection,
          _connectionId,
        });
      }
      history.push(buildDrawerUrl({
        path: drawerPaths.INSTALL.CONFIGURE_RESOURCE_SETUP,
        baseUrl: match.url,
        params: { resourceType: 'connections', resourceId: _connectionId || newId },
      }));
    } else if (isFrameWork2 && !step.isTriggered && !installURL && !url && type !== 'stack') {
      dispatch(
        actions.integrationApp.installer.updateStep(
          integrationId,
          installerFunction,
          'inProgress'
        )
      );

      if (type === INSTALL_STEP_TYPES.FORM || type === INSTALL_STEP_TYPES.URL) {
        dispatch(
          actions.integrationApp.installer.getCurrentStep(integrationId, step)
        );
      } else {
        dispatch(
          actions.integrationApp.installer.scriptInstallStep(integrationId)
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
          actions.integrationApp.installer.updateStep(
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
          actions.integrationApp.installer.updateStep(
            integrationId,
            installerFunction,
            'verify'
          )
        );

        if (!_connectorId && step._connId) {
          dispatch(
            actions.integrationApp.templates.installer.verifyBundleOrPackageInstall(
              integrationId,
              step._connId,
              installerFunction,
              isFrameWork2,
              netsuitePackageType,
              true                               // true here sets the isManualVerification flag to true which means the user has triggered the verification
            )
          );
        } else if (isFrameWork2) {
          dispatch(
            actions.integrationApp.installer.scriptInstallStep(integrationId)
          );
        } else {
          dispatch(
            actions.integrationApp.installer.installStep(
              integrationId,
              installerFunction
            )
          );
        }
      }
      // handle Action step click
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
      dispatch(actions.integrationApp.installer.updateStep(
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
  const handleStackSetupDone = stackId => {
    dispatch(
      actions.integrationApp.installer.scriptInstallStep(
        integrationId, '', '', '', stackId,
      )
    );

    setShowStackDialog(false);
  };

  const handleStackClose = () => {
    setShowStackDialog(false);
  };

  const handleHelpUrlClick = e => {
    e.preventDefault();
    openExternalUrl({ url: helpUrl });
  };

  return (
    <LoadResources required resources="connections,integrations,published">
      <CeligoPageBar
        title={`Install integration: ${integrationName}`}
        // Todo: (Mounika) please add the helpText
        // infoText="we need to have the help text for the following."
        >
        <div className={classes.actions}>
          {helpUrl && (
            <TextButton
              data-test="viewHelpGuide"
              component={Link}
              onClick={handleHelpUrlClick}
              startIcon={<HelpIcon />}
              >
              View help guide
            </TextButton>
          )}

          <TextButton
            data-test="uninstall"
            component={Link}
            onClick={handleUninstall}
            startIcon={<CloseIcon />}
             >
            Uninstall
          </TextButton>

        </div>
      </CeligoPageBar>
      <Box sx={{ padding: theme => theme.spacing(2, 3) }}>
        <Box sx={{ maxWidth: 750 }}>
          {helpUrl ? (
            <RawHtml
              className={classes.message}
              options={{ allowedHtmlTags: ['a', 'br'] }}
              html={` Complete the steps below to install your ${_connectorId ? 'integration app' : 'integration'}.<br /> 
            Need more help? <a href="${helpUrl}" target="_blank">Check out our help guide</a>`} />
          ) : (
            <Typography sx={{ marginBottom: theme => theme.spacing(2) }}>{`Complete the steps below to install your ${_connectorId ? 'integration app' : 'integration'}.`}</Typography>
          )}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}>
            {installSteps.map((step, index) => (
              <InstallationStep
                key={step.name}
                handleStepClick={handleStepClick}
                index={index + 1}
                step={step}
                integrationId={integrationId}
                isFrameWork2={isFrameWork2}
              />
            ))}
          </Box>
        </Box>
      </Box>
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
