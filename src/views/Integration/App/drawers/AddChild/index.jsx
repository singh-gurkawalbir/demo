/*
 TODO:
 This file needs to be re-implemented as a stepper functionality drawer as per new mocks.
 As of now this is not a drawer, but a standalone page.
*/
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { Typography, Link } from '@mui/material';
import differenceBy from 'lodash/differenceBy';
import isEmpty from 'lodash/isEmpty';
import { Spinner, TextButton } from '@celigo/fuse-ui';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import LoadResources from '../../../../../components/LoadResources';
import openExternalUrl from '../../../../../utils/window';
import ResourceSetupDrawer from '../../../../../components/ResourceSetup/Drawer';
import InstallationStep from '../../../../../components/InstallStep';
import Loader from '../../../../../components/Loader';
import getRoutePath from '../../../../../utils/routePaths';
import { getIntegrationAppUrlName } from '../../../../../utils/integrationApps';
import FormStepDrawer from '../../../../../components/InstallStep/FormStep';
import CloseIcon from '../../../../../components/icons/CloseIcon';
import CeligoPageBar from '../../../../../components/CeligoPageBar';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import { buildDrawerUrl, drawerPaths } from '../../../../../utils/rightDrawer';

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

export default function IntegrationAppAddNewChild() {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const { integrationId } = match.params;
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
      dispatch(actions.resource.requestCollection('exports', undefined, undefined, integrationId));
      dispatch(actions.resource.requestCollection('imports', undefined, undefined, integrationId));
      dispatch(actions.resource.requestCollection('connections', undefined, undefined, integrationId));
      dispatch(actions.resource.requestCollection('asynchelpers', undefined, undefined, integrationId));

      if (integrationChildren && initialChildren && integrationChildren.length > initialChildren.length) {
        const newChild = differenceBy(integrationChildren, initialChildren, 'value');

        childId = newChild?.length && newChild[0].value;
      }
      if (childId) {
        history.push(
          getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/child/${childId}/flows`)
        );
      } else {
        history.push(
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
    history]);

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
        <Typography variant="h5">Loading</Typography>
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

      history.push(buildDrawerUrl({
        path: drawerPaths.INSTALL.CONFIGURE_RESOURCE_SETUP,
        baseUrl: match.url,
        params: { resourceType: 'connections', resourceId: _connectionId },
      }));
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
      history.push(buildDrawerUrl({
        path: drawerPaths.INSTALL.FORM_STEP,
        baseUrl: match.url,
        params: { formType: 'child' },
      }));
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

  const handleSubmitComplete = () => {
    const step = addNewChildSteps.find(s => s.isCurrentStep);

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
  };

  const handleUninstall = () => {
    history.push(
      getRoutePath(
        `integrationapps/${integrationAppName}/${integrationId}/uninstall/child/${integration.settings.defaultSectionId}`
      )
    );
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
            <TextButton
              data-test="uninstall"
              startIcon={<CloseIcon />}
              component={Link}
              onClick={handleUninstall}
              >
              Uninstall
            </TextButton>
          )}
        </div>
      </CeligoPageBar>
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
        <FormStepDrawer
          integrationId={integrationId}
          formCloseHandler={formCloseHandler}
        />
        <ResourceSetupDrawer
          integrationId={integrationId}
          onSubmitComplete={handleSubmitComplete}
          mode="child"
        />
      </div>
    </LoadResources>
  );
}
