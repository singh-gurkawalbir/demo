/*
 TODO:
 This file needs to be re-implemented as a stepper functionality drawer as per new mocks.
 As of now this is not a drawer, but a standalone page.
*/
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Link } from '@material-ui/core';
import differenceBy from 'lodash/differenceBy';
import isEmpty from 'lodash/isEmpty';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import LoadResources from '../../../../../components/LoadResources';
import openExternalUrl from '../../../../../utils/window';
import ResourceSetupDrawer from '../../../../../components/ResourceSetup';
import InstallationStep from '../../../../../components/InstallStep';
import { getResourceSubType } from '../../../../../utils/resource';
import resourceConstants from '../../../../../forms/constants/connection';
import Spinner from '../../../../../components/Spinner';
import Loader from '../../../../../components/Loader';
import getRoutePath from '../../../../../utils/routePaths';
import { getIntegrationAppUrlName } from '../../../../../utils/integrationApps';
import IconTextButton from '../../../../../components/IconTextButton';
import FormStepDrawer from '../../../../../components/InstallStep/FormStep';
import CloseIcon from '../../../../../components/icons/CloseIcon';
import CeligoPageBar from '../../../../../components/CeligoPageBar';
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
    borderBottom: `solid 1px ${theme.palette.secondary.lightest}`,
    marginBottom: '29px',
  },
  innerContent: {
    width: '80vw',
  },
  stepTable: { position: 'relative', marginTop: '-20px' },
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
const getConnectionType = resource => {
  const { assistant, type } = getResourceSubType(resource);

  if (assistant) return assistant;

  return type;
};

export default function IntegrationAppAddNewChild(props) {
  const classes = useStyles();
  const history = useHistory();
  const { integrationId } = props.match.params;
  const [selectedConnectionId, setSelectedConnectionId] = useState(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [requestedSteps, setRequestedSteps] = useState(false);
  const dispatch = useDispatch();

  const integration = useSelectorMemo(selectors.mkIntegrationAppSettings, integrationId) || {};

  const [initialChildren] = useState(integration.children);
  const showUninstall = !!(
    integration &&
    integration.settings &&
    integration.settings.defaultSectionId
  );
  const integrationChildren = integration?.children;
  const integrationAppName = getIntegrationAppUrlName(integration.name);
  const { steps: addNewChildSteps, error } = useSelector(state =>
    selectors.addNewChildSteps(state, integrationId)
  );
  const currentStep = useMemo(() => (addNewChildSteps || []).find(s => s.isCurrentStep), [
    addNewChildSteps,
  ]);

  const currStepIndex = addNewChildSteps?.indexOf(currentStep);
  const selectedConnection = useSelector(state =>
    selectors.resource(state, 'connections', selectedConnectionId)
  );

  useEffect(() => {
    if ((!addNewChildSteps || !addNewChildSteps.length) && !requestedSteps) {
      dispatch(actions.integrationApp.child.addNew(integrationId));
      setRequestedSteps(true);
    }
  }, [addNewChildSteps, requestedSteps, dispatch, integrationId]);
  useEffect(() => {
    if (
      addNewChildSteps?.length &&
      !addNewChildSteps.reduce(
        (result, step) => result || !step.completed,
        false
      )
    ) {
      setIsSetupComplete(true);
    }
  }, [addNewChildSteps]);

  useEffect(() => {
    if (isSetupComplete) {
      // redirect to integration Settings
      let childId;

      dispatch(actions.integrationApp.child.clearSteps(integrationId));
      dispatch(actions.resource.request('integrations', integrationId));
      dispatch(actions.resource.requestCollection('flows'));
      dispatch(actions.resource.requestCollection('exports'));
      dispatch(actions.resource.requestCollection('imports'));
      dispatch(actions.resource.requestCollection('connections'));
      if (integrationChildren && initialChildren && integrationChildren.length > initialChildren.length) {
        const newChild = differenceBy(integrationChildren, initialChildren, 'value');

        childId = newChild?.length && newChild[0].value;
      }
      if (childId) {
        props.history.push(
          getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/child/${childId}/flows`)
        );
      } else {
        props.history.push(
          getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/flows`)
        );
      }
    }
  }, [dispatch,
    initialChildren,
    integrationChildren,
    integrationAppName,
    integrationId,
    isSetupComplete,
    props.history]);

  const formCloseHandler = useCallback(() => {
    dispatch(actions.integrationApp.child.updateStep(
      integrationId,
      currentStep.installerFunction,
      'reset'
    ));
  }, [currentStep?.installerFunction, dispatch, integrationId]);

  if (error) {
    history.push(
      getRoutePath(
        `integrationapps/${integrationAppName}/${integrationId}/flows`
      )
    );

    return null;
  }

  if (!addNewChildSteps || !addNewChildSteps.length) {
    return (
      <Loader open>
        <Spinner />
        <Typography data-public variant="h5">Loading</Typography>
      </Loader>
    );
  }

  const handleStepClick = step => {
    const { _connectionId, installURL, installerFunction, form } = step;

    // handle connection step click
    if (_connectionId) {
      if (step.isTriggered) {
        return false;
      }

      setSelectedConnectionId(_connectionId);
      // handle Installation step click
    } else if (installURL) {
      if (!step.isTriggered) {
        dispatch(
          actions.integrationApp.child.updateStep(
            integrationId,
            installerFunction,
            'inProgress'
          )
        );
        openExternalUrl({ url: installURL });
      } else {
        if (step.verifying) {
          return false;
        }

        dispatch(
          actions.integrationApp.child.updateStep(
            integrationId,
            installerFunction,
            'verify'
          )
        );
        dispatch(
          actions.integrationApp.child.installStep(
            integrationId,
            installerFunction
          )
        );
      }
      // handle Action step click
    } else if (!isEmpty(form)) {
      dispatch(actions.integrationApp.child.updateStep(
        integrationId,
        installerFunction,
        'inProgress',
        true
      ));
    } else if (!step.isTriggered) {
      dispatch(
        actions.integrationApp.child.updateStep(
          integrationId,
          installerFunction,
          'inProgress'
        )
      );
      dispatch(
        actions.integrationApp.child.installStep(
          integrationId,
          installerFunction
        )
      );
    }
  };

  const handleSubmitComplete = (connId, isAuthorized) => {
    const step = addNewChildSteps.find(s => s.isCurrentStep);

    if (
      resourceConstants.OAUTH_APPLICATIONS.includes(
        getConnectionType(selectedConnection)
      ) &&
      !isAuthorized
    ) {
      return;
    }

    dispatch(
      actions.integrationApp.child.updateStep(
        integrationId,
        (step || {}).installerFunction,
        'inProgress'
      )
    );
    dispatch(
      actions.integrationApp.child.installStep(
        integrationId,
        (step || {}).installerFunction
      )
    );
    setSelectedConnectionId(false);
  };

  const handleUninstall = () => {
    history.push(
      getRoutePath(
        `integrationapps/${integrationAppName}/${integrationId}/uninstall/${integration.settings.defaultSectionId}`
      )
    );
  };

  const handleClose = () => {
    setSelectedConnectionId(false);
  };

  return (
    <LoadResources required resources={['integrations', 'connections']}>
      <CeligoPageBar
        title={`Add new ${integration?.settings?.storeLabel || 'child'}`}
        // Todo: (Mounika) please add the helpText
        // infoText="we need to have the help text for the following."
        >
        <div className={classes.actions}>
          {showUninstall && (
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
      {selectedConnectionId && (
        <ResourceSetupDrawer
          resourceId={selectedConnectionId}
          resourceType="connections"
          onClose={handleClose}
          onSubmitComplete={handleSubmitComplete}
        />
      )}
      {currentStep && currentStep.showForm && (
        <FormStepDrawer
          integrationId={integrationId}
          formMeta={currentStep.form}
          addChild
          installerFunction={currentStep.installerFunction}
          title={currentStep.name}
          formCloseHandler={formCloseHandler}
          index={currStepIndex + 1}
        />
      )}
      <div className={classes.installIntegrationWrapper}>
        <div className={classes.installIntegrationWrapperContent}>

          <Typography className={classes.message}>
            {`Complete the below steps to add new ${integration?.settings?.storeLabel || 'child'}.`}
          </Typography>

          <div className={classes.installIntegrationSteps}>
            {addNewChildSteps.map((step, index) => (
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
