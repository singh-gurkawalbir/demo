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
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import {
  getConnectionType,
  generateNewId,
  isOauth,
} from '../../../../../utils/resource';
import CeligoPageBar from '../../../../../components/CeligoPageBar';
import LoadResources from '../../../../../components/LoadResources';
import openExternalUrl from '../../../../../utils/window';
import resourceConstants from '../../../../../forms/constants/connection';
import ResourceSetupDrawer from '../../../../../components/ResourceSetup';
import InstallationStep from '../../../../../components/InstallStep';
import useConfirmDialog from '../../../../../components/ConfirmDialog';
import { getIntegrationAppUrlName } from '../../../../../utils/integrationApps';
import { SCOPES } from '../../../../../sagas/resourceForm';
import jsonUtil from '../../../../../utils/json';
import { INSTALL_STEP_TYPES, emptyObject } from '../../../../../utils/constants';
import FormStepDrawer from '../../../../../components/InstallStep/FormStep';
import CloseIcon from '../../../../../components/icons/CloseIcon';
import IconTextButton from '../../../../../components/IconTextButton';
import RawHtml from '../../../../../components/RawHtml';
import getRoutePath from '../../../../../utils/routePaths';
import HelpIcon from '../../../../../components/icons/HelpIcon';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';

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
    stores,
    supportsMultiStore,
    _connectorId,
    initChild,
    parentId,
  } = useMemo(() => integration ? {
    name: integration.name,
    initChild: integration.initChild,
    install: integration.install,
    mode: integration.mode,
    stores: integration.stores,
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
    selectors.integrationInstallSteps(state, integrationId)
  );
  const currentStep = useMemo(() => installSteps.find(s => s.isCurrentStep), [
    installSteps,
  ]);
  const currStepIndex = useMemo(() => installSteps.indexOf(currentStep), [
    currentStep,
    installSteps,
  ]);
  const { openOauthConnection, connectionId } = useSelector(
    state => selectors.canOpenOauthConnection(state, integrationId),
    (left, right) => (left.openOauthConnection === right.openOauthConnection && left.connectionId === right.connectionId)
  );

  if (openOauthConnection) {
    dispatch(actions.integrationApp.installer.setOauthConnectionMode(connectionId, false, integrationId));
    setConnection({
      _connectionId: connectionId,
    });
  }
  const selectedConnectionType = useSelector(state => {
    const selectedConnection = selectors.resource(
      state,
      'connections',
      connection && connection._connectionId
    );

    return getConnectionType(selectedConnection);
  });
  const integrationAppName = getIntegrationAppUrlName(integrationName);
  const integrationChildAppName = getIntegrationAppUrlName(childIntegrationName);
  const handleClose = useCallback(() => {
    setConnection(false);
  }, []);
  const isCloned = install.find(step => step.isClone);
  const isFrameWork2 = integrationInstallSteps.length || isCloned;

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

  const oAuthApplications = useMemo(
    () => [
      ...resourceConstants.OAUTH_APPLICATIONS,
      'netsuite-oauth',
      'shopify-oauth',
      'acumatica-oauth',
    ],
    []
  );
  const handleSubmitComplete = useCallback(
    (connId, isAuthorized, connectionDoc = {}) => {
      // Here connection Doc will come into picture for only for IA2.0 and if connection step doesn't contain connection Id.
      const step = installSteps.find(s => s.isCurrentStep);

      if (
        oAuthApplications.includes(selectedConnectionType) &&
        !isAuthorized
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
      oAuthApplications,
      selectedConnectionType,
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
            getRoutePath(`/integrationapps/${integrationAppName}/${parentId}`)
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
            const storeId = stores?.length
              ? stores[0].value
              : undefined;

            // for old cloned IAs, uninstall should happen the old way
            if (isFrameWork2 && !isCloned) {
              const {url} = match;
              const urlExtractFields = url.split('/');
              const index = urlExtractFields.findIndex(
                element => element === 'child'
              );

              // REVIEW: @ashu, review with Dave once
              // if url contains '/child/xxx' use that id as store id
              if (index === -1) {
                history.push(
                  getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/uninstall`)
                );
              } else {
                history.push(
                  getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/uninstall/${urlExtractFields[index + 1]}`)
                );
              }
            } else if (supportsMultiStore) {
              history.push(
                getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/uninstall/${storeId}`)
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
          color: 'secondary',
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
    } else if (isFrameWork2 && !step.isTriggered && !installURL && !url) {
      dispatch(
        actions.integrationApp.installer.updateStep(
          integrationId,
          installerFunction,
          'inProgress'
        )
      );

      if (type === INSTALL_STEP_TYPES.FORM) {
        dispatch(
          actions.integrationApp.installer.getCurrentStep(integrationId, step)
        );
        // history.push(`${match.url}/form/${index}`);
      } else {
        dispatch(
          actions.integrationApp.installer.scriptInstallStep(integrationId)
        );
      }
    } else if (installURL || url) {
      if (!step.isTriggered) {
        dispatch(
          actions.integrationApp.installer.updateStep(
            integrationId,
            installerFunction,
            'inProgress'
          )
        );
        openExternalUrl({ url: installURL || url });
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

        if (isFrameWork2) {
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

  const handleHelpUrlClick = e => {
    e.preventDefault();
    openExternalUrl({url: helpUrl});
  };

  return (
    <LoadResources required resources="connections,integrations,published">
      <CeligoPageBar
        title={`Install app: ${integrationName}`}
        // Todo: (Mounika) please add the helpText
        // infoText="we need to have the help text for the following."
        >
        <div className={classes.actions}>
          {helpUrl && (
            <IconTextButton
              data-test="viewHelpGuide"
              component={Link}
              variant="text"
              onClick={handleHelpUrlClick}
              color="primary">
              <HelpIcon />
              View help guide
            </IconTextButton>
          )}
          {_connectorId && (
          <IconTextButton
            data-test="uninstall"
            component={Link}
            variant="text"
            onClick={handleUninstall}
            color="primary">
            <CloseIcon />
            Uninstall
          </IconTextButton>
          )}

        </div>
      </CeligoPageBar>
      {connection &&
        (connection._connectionId ? (
          <ResourceSetupDrawer
            resourceId={connection._connectionId}
            onClose={handleClose}
            onSubmitComplete={handleSubmitComplete}
          />
        ) : (
          <ResourceSetupDrawer
            resourceId={connection.newId}
            resource={connection.doc}
            resourceType="connections"
            connectionType={connection.doc.type}
            onClose={handleClose}
            onSubmitComplete={handleSubmitComplete}
            addOrSelect={!_connectorId}
          />
        ))}
      {currentStep && currentStep.formMeta && (
        <FormStepDrawer
          integrationId={integrationId}
          formMeta={currentStep.formMeta}
          title={currentStep.name}
          index={currStepIndex + 1}
        />
      )}
      <div className={classes.installIntegrationWrapper}>
        <div className={classes.installIntegrationWrapperContent}>
          {helpUrl ? (
            <RawHtml
              className={classes.message}
              html={` Complete the below steps to install your integration app.<br /> 
            Need more help? <a href="${helpUrl}" target="_blank">Check out our help guide</a>`} />
          ) : (
            <Typography className={classes.message}>Complete the below steps to install your integration app.</Typography>
          )}
          <div className={classes.installIntegrationSteps}>
            {installSteps.map((step, index) => (
              <InstallationStep
                key={step.name}
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
