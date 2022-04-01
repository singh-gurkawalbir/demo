/*
 TODO:
 This file needs to be re-implemented as a stepper functionality drawer as per new mocks.
 As of now this is not a drawer, but a standalone page.
*/
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Link,
} from '@material-ui/core';
import isEmpty from 'lodash/isEmpty';
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
import { SCOPES } from '../../../../../sagas/resourceForm';
import jsonUtil from '../../../../../utils/json';
import { INSTALL_STEP_TYPES, emptyObject,
} from '../../../../../utils/constants';
import FormStepDrawer from '../../../../../components/InstallStep/FormStep';
import CloseIcon from '../../../../../components/icons/CloseIcon';
import RawHtml from '../../../../../components/RawHtml';
import getRoutePath from '../../../../../utils/routePaths';
import HelpIcon from '../../../../../components/icons/HelpIcon';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import TrashIcon from '../../../../../components/icons/TrashIcon';
import { TextButton } from '../../../../../components/Buttons';
import { DRAWER_URL_PREFIX } from '../../../../../utils/rightDrawer';

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

export default function ConnectorInstallation(props) {
  const classes = useStyles();
  const { integrationId } = props.match.params;
  const [stackId, setShowStackDialog] = useState(null);
  const history = useHistory();
  const match = useRouteMatch();
  const [connection, setConnection] = useState(null);
  const { confirmDialog } = useConfirmDialog();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const dispatch = useDispatch();

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
      history.replace(`${match.url}/${DRAWER_URL_PREFIX}/configure/connections/${connectionId}`);
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
      dispatch(actions.resource.request('integrations', integrationId));
      dispatch(actions.resource.requestCollection('flows'));
      dispatch(actions.resource.requestCollection('exports'));
      dispatch(actions.resource.requestCollection('licenses'));
      dispatch(actions.resource.requestCollection('imports'));
      dispatch(actions.resource.requestCollection('connections'));

      if (mode === 'settings') {
        if (
          initChild &&
          initChild.function &&
          childIntegrationMode === 'install'
        ) {
          setIsSetupComplete(false);
          props.history.push(
            getRoutePath(`/integrationapps/${integrationChildAppName}/${childIntegrationId}/setup`)
          );
        } else if (parentId) {
          props.history.push(
            getRoutePath(`/integrationapps/${integrationAppName}/${parentId}/child/${integrationId}/flows`)
          );
        } else if (integrationInstallSteps && integrationInstallSteps.length > 0) {
          if (_connectorId) {
            props.history.push(
              getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}`)
            );
          } else {
            props.history.push(
              getRoutePath(`/integrations/${integrationId}/flows`)
            );
          }
        } else {
          props.history.push(
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
    props.history,
    childIntegrationId,
    childIntegrationMode,
    integrationChildAppName,
    initChild,
    parentId,
    integrationInstallSteps]);

  if (!installSteps) {
    return <Typography className={classes.noIntegrationMsg}>No integration found</Typography>;
  }

  const handleUninstall = e => {
    e.preventDefault();
    confirmDialog({
      title: 'Confirm uninstall',
      message: 'Are you sure you want to uninstall?',
      buttons: [
        {
          label: 'Uninstall',
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
      }
      setConnection({
        newId,
        doc: sourceConnection,
        _connectionId,
      });
      history.push(`${match.url}/${DRAWER_URL_PREFIX}/configure/connections/${_connectionId || newId}`);
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
        history.push(`${match.url}/${DRAWER_URL_PREFIX}/form/install`);
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

        if (!_connectorId && step.connectionId) {
          dispatch(
            actions.integrationApp.templates.installer.verifyBundleOrPackageInstall(
              integrationId,
              step.connectionId,
              installerFunction,
              isFrameWork2
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
        history.push(`${match.url}/${DRAWER_URL_PREFIX}/configure/stacks/${newStackId}`);
      }
    } else if (!isEmpty(form)) {
      dispatch(actions.integrationApp.installer.updateStep(
        integrationId,
        installerFunction,
        'inProgress',
        form
      ));
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
          {_connectorId ? (
            <TextButton
              data-test="uninstall"
              component={Link}
              onClick={handleUninstall}
              startIcon={<CloseIcon />}
             >
              Uninstall
            </TextButton>
          )
            : (
              <TextButton
                data-test="deleteIntegration"
                onClick={handleUninstall}
                startIcon={<TrashIcon />}>
                Delete integration
              </TextButton>
            )}

        </div>
      </CeligoPageBar>
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
        mode="install"
      />
    </LoadResources>
  );
}
