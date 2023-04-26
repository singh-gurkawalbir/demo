/*
 TODO:
 This file needs to be re-implemented as a stepper functionality drawer as per new mocks.
 As of now this is not a drawer, but a standalone page.
*/
import { useHistory, Redirect } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material';
import { Spinner } from '@celigo/fuse-ui';
import CeligoPageBar from '../../../../../components/CeligoPageBar';
import { selectors } from '../../../../../reducers';
import LoadResource from '../../../../../components/LoadResource';
import actions from '../../../../../actions';
import openExternalUrl from '../../../../../utils/window';
import InstallationStep from '../../../../../components/InstallStep';
import getRoutePath from '../../../../../utils/routePaths';
import { getIntegrationAppUrlName } from '../../../../../utils/integrationApps';
import Loader from '../../../../../components/Loader';
import {HOME_PAGE_PATH} from '../../../../../constants';
import messageStore, { message } from '../../../../../utils/messageStore';

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
    marginBottom: 29,
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

export default function Uninstaller1({ integration, integrationId, childId }) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const {_id, mode, name, children, settings} = integration;
  const integrationAppName = getIntegrationAppUrlName(name);
  const isUninstallComplete = useSelector(state =>
    selectors.isUninstallComplete(state, { integrationId, childId })
  );
  const { steps: uninstallSteps, error } = useSelector(state =>
    selectors.integrationUninstallSteps(state, { integrationId }), shallowEqual
  );
  const {defaultSectionId} = settings || {};

  useEffect(() => {
    if (!error && !uninstallSteps) {
      dispatch(
        actions.integrationApp.uninstaller.preUninstall(childId, integrationId)
      );
    }
  }, [_id, dispatch, error, integrationId, childId, uninstallSteps]);

  useEffect(() => {
    if (
      uninstallSteps &&
      uninstallSteps.removeIntegration &&
      mode === 'uninstall'
    ) {
      dispatch(
        actions.integrationApp.uninstaller.uninstallIntegration(integrationId)
      );
      history.push(getRoutePath(HOME_PAGE_PATH));
    }
  }, [dispatch, history, mode, integrationId, uninstallSteps]);

  useEffect(() => {
    if (isUninstallComplete) {
      // redirect to integration Settings
      if (mode !== 'uninstall') {
        dispatch(actions.integrationApp.uninstaller.clearSteps(integrationId));
        history.push(
          getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/flows`)
        );
      } else {
        dispatch(
          actions.integrationApp.uninstaller.uninstallIntegration(integrationId)
        );
        history.push(getRoutePath(HOME_PAGE_PATH));
      }
      if (defaultSectionId === childId) { dispatch(actions.integrationApp.child.clearSteps(integrationId)); }
    }
  }, [dispatch, history, mode, integrationAppName, integrationId, isUninstallComplete, defaultSectionId, childId]);

  if (!integration || !integration._id) {
    return <LoadResource resourceId={integrationId} resourceType="integrations" />;
  }

  if (error) {
    return <Redirect push={false} to={getRoutePath(HOME_PAGE_PATH)} />;
  }

  if (!uninstallSteps) {
    return (
      <Loader open hideBackDrop>
        Loading
        <Spinner />
      </Loader>
    );
  }

  if (uninstallSteps.removeIntegration) {
    return <Loader open>Uninstalling</Loader>;
  }

  const childName = children
    ? (children.find(c => c.value === childId) || {}).label
    : undefined;
  const handleStepClick = step => {
    // TODO: installURL should eventually changed to uninstallURL. Currently it is left as installURL to support shopify uninstall.
    const { installURL, uninstallerFunction } = step;

    // handle connection step click
    if (installURL) {
      if (!step.isTriggered) {
        dispatch(
          actions.integrationApp.uninstaller.updateStep(
            integrationId,
            uninstallerFunction,
            'inProgress'
          )
        );
        openExternalUrl({ url: installURL });
      } else {
        if (step.verifying) {
          return false;
        }

        dispatch(
          actions.integrationApp.uninstaller.updateStep(
            integrationId,
            uninstallerFunction,
            'verify'
          )
        );
        dispatch(
          actions.integrationApp.uninstaller.stepUninstall(
            integrationId,
            uninstallerFunction
          )
        );
      }
      // handle Action step click
    } else if (!step.isTriggered) {
      dispatch(
        actions.integrationApp.uninstaller.updateStep(
          integrationId,
          uninstallerFunction,
          'inProgress'
        )
      );
      dispatch(
        actions.integrationApp.uninstaller.stepUninstall(
          childId,
          integrationId,
          uninstallerFunction
        )
      );
    }
  };

  return (
    <div>
      <CeligoPageBar
        title={`Uninstall app: ${name}${childName ? ` - ${childName}` : ''}`}
        // Todo: (Mounika) please add the helpText
        // infoText="we need to have the help text for the following."
        />
      <div className={classes.installIntegrationWrapper}>
        <div className={classes.installIntegrationWrapperContent}>
          <Typography className={classes.message}>
            {childName
              ? messageStore('INTEGRATION.UNINSTALL_APP_CHILD', {childName})
              : message.INTEGRATION.UNINSTALL}
          </Typography>

          <div className={classes.installIntegrationSteps}>
            {(uninstallSteps || []).map((step, index) => (
              <InstallationStep
                key={step.name}
                mode="uninstall"
                handleStepClick={handleStepClick}
                index={index + 1}
                step={step}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
