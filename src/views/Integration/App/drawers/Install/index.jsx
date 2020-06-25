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
  Grid,
  Link,
} from '@material-ui/core';
import * as selectors from '../../../../../reducers';
import actions from '../../../../../actions';
import {
  getResourceSubType,
  generateNewId,
} from '../../../../../utils/resource';
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
import HelpIcon from '../../../../../components/icons/HelpIcon';
import IconTextButton from '../../../../../components/IconTextButton';
import RawHtml from '../../../../../components/RawHtml';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2),
    flexGrow: 1,
    width: '100%',
    padding: '10px 25px',
  },
  message: {
    padding: '10px',
  },
  formHead: {
    borderBottom: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    marginBottom: 5,
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
const getConnectionType = (resource = {}) => {
  const { assistant, type } = getResourceSubType(resource);

  if (assistant === 'shopify') {
    if (
      resource.http &&
      resource.http.auth &&
      resource.http.auth.type === 'oauth'
    ) {
      return 'shopify-oauth';
    }

    return '';
  }

  if (assistant) return assistant;

  if (resource && resource.type === 'netsuite') {
    if (resource.netsuite.authType === 'token-auto') {
      return 'netsuite-oauth';
    }
  }

  return type;
};

export default function ConnectorInstallation(props) {
  const classes = useStyles();
  const { integrationId } = props.match.params;
  const history = useHistory();
  const match = useRouteMatch();
  const [connection, setConnection] = useState(null);
  const { confirmDialog } = useConfirmDialog();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const dispatch = useDispatch();
  const {
    name: integrationName,
    install = [],
    integrationInstallSteps = [],
    mode,
    stores,
    supportsMultiStore,
    _connectorId,
    initChild
  } = useSelector(state => {
    const integration = selectors.integrationAppSettings(state, integrationId);
    if (integration) {
      return {
        name: integration.name,
        initChild: integration.initChild,
        install: integration.install,
        mode: integration.mode,
        stores: integration.stores,
        supportsMultiStore: !!(integration.settings && integration.settings.supportsMultiStore),
        _connectorId: integration._connectorId,
        integrationInstallSteps: integration.installSteps,
      };
    }
    return emptyObject;
  }, shallowEqual
  );
  const {
    name: childIntegrationName,
    id: childIntegrationId,
    mode: childIntegrationMode
  } = useSelector(state => {
    const id = selectors.getChildIntegrationId(state, integrationId);

    if (id) {
      const integration = selectors.resource(state, 'integrations', id);
      if (integration) {
        return {
          name: integration.name,
          id: integration._id,
          mode: integration.mode
        };
      }
    }
    return emptyObject;
  }, shallowEqual);
  const helpUrl = useSelector(state => {
    const integrationApp = selectors.resource(state, 'published', _connectorId);
    return integrationApp && integrationApp.helpUrl;
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
            connection && connection._connectionId,
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

      setConnection(false);
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
      dispatch(actions.resource.requestCollection('imports'));

      if (mode === 'settings') {
        if (
          initChild &&
          initChild.function &&
          childIntegrationMode === 'install'
        ) {
          setIsSetupComplete(false);
          props.history.push(
            `/pg/integrationapps/${integrationChildAppName}/${childIntegrationId}/setup`
          );
        } else {
          dispatch(
            actions.resource.clearChildIntegration()
          );
          if (integrationInstallSteps && integrationInstallSteps.length > 0) {
            props.history.push(
              `/pg/integrationapps/${integrationAppName}/${integrationId}`
            );
          } else {
            props.history.push(
              `/pg/integrationapps/${integrationAppName}/${integrationId}/flows`
            );
          }
        }
      }
    }
  }, [dispatch,
    mode,
    integrationAppName,
    integrationId,
    isSetupComplete,
    props.history,
    childIntegrationId,
    childIntegrationMode,
    integrationChildAppName,
    initChild,
    integrationInstallSteps]);

  if (!installSteps || !_connectorId) {
    return <Typography>No Integration Found</Typography>;
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
            const storeId = stores.length
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
                  `/pg/integrationapps/${integrationAppName}/${integrationId}/uninstall`
                );
              } else {
                history.push(
                  `/pg/integrationapps/${integrationAppName}/${integrationId}/uninstall/${urlExtractFields[index + 1]}`
                );
              }
            } else if (supportsMultiStore) {
              history.push(
                `/pg/integrationapps/${integrationAppName}/${integrationId}/uninstall/${storeId}`
              );
            } else {
              history.push(
                `/pg/integrationapps/${integrationAppName}/${integrationId}/uninstall`
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

  const handleStepClick = (step) => {
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
      <div className={classes.root}>
        <div className={classes.innerContent}>
          <Grid container className={classes.formHead}>
            <Grid item xs>
              Install app: {integrationName}
            </Grid>
            {helpUrl && (
            <Grid item>
              <IconTextButton
                data-test="viewHelpGuide"
                component={Link}
                variant="text"
                onClick={handleHelpUrlClick}
                color="primary">
                <HelpIcon />
                View installation guide
              </IconTextButton>
            </Grid>
            )}
            <Grid item xs={1}>
              <IconTextButton
                data-test="uninstall"
                component={Link}
                variant="text"
                onClick={handleUninstall}
                color="primary">
                <HelpIcon />
                Uninstall
              </IconTextButton>
            </Grid>
          </Grid>
          {helpUrl && (
          <RawHtml
            className={classes.message}
            html={`Complete the below steps to install your integration app.
              Need more help? Check out our <a href="${helpUrl}" target="_blank">help guide.</a> `} />
          )}
          <Grid container spacing={3} className={classes.stepTable}>
            {installSteps.map((step, index) => (
              <InstallationStep
                key={step.name}
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
