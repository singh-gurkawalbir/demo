import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Redirect, useHistory, useRouteMatch } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { Typography, Box } from '@mui/material';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import getRoutePath from '../../../../../utils/routePaths';
import InstallationStep from '../../../../../components/InstallStep';
import { HOME_PAGE_PATH, UNINSTALL_STEP_TYPES, RESOURCE_DEPENDENCIES } from '../../../../../constants';
import FormStepDrawer from '../../../../../components/InstallStep/FormStep';
import CeligoPageBar from '../../../../../components/CeligoPageBar';
import openExternalUrl from '../../../../../utils/window';
import { drawerPaths, buildDrawerUrl } from '../../../../../utils/rightDrawer';
import { message } from '../../../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  formHead: {
    borderBottom: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    marginBottom: 29,
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
  noIntegrationMsg: {
    padding: theme.spacing(3),
  },
}));

export default function Uninstaller2({ integration, integrationId }) {
  // eslint-disable-next-line no-unused-vars
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const {mode, name, _parentId } = integration;
  const { steps: uninstallSteps, isFetched, error, isComplete } = useSelector(state =>
    selectors.integrationUninstallSteps(state, { integrationId, isFrameWork2: true }), shallowEqual
  );

  const isIAUninstallComplete = useSelector(state =>
    selectors.isIAV2UninstallComplete(state, { integrationId })
  );

  useEffect(() => {
    // we only want to do init, if mode is yet not uninstall
    if (mode && mode !== 'uninstall') {
      dispatch(
        actions.integrationApp.uninstaller2.init(integrationId)
      );
    }
  }, [dispatch, mode, integrationId]);

  useEffect(() => {
    // if steps were never fetched , then we request steps
    if (mode === 'uninstall' && !isFetched && !isIAUninstallComplete) {
      dispatch(
        actions.integrationApp.uninstaller2.requestSteps(integrationId)
      );
    }
  }, [dispatch, integrationId, isFetched, isIAUninstallComplete, mode]);

  useEffect(() => {
    if (isComplete) {
      dispatch(
        actions.integrationApp.uninstaller2.clearSteps(
          integrationId
        )
      );
      RESOURCE_DEPENDENCIES.uninstall2.forEach(resourceType => {
        dispatch(actions.resource.clearCollection(resourceType, _parentId || integrationId));
      });
      dispatch(actions.license.refreshCollection());
      history.replace(getRoutePath(HOME_PAGE_PATH));
    }
  }, [_parentId, dispatch, history, integrationId, isComplete]);

  const handleStepClick = useCallback(step => {
    const { type, isTriggered, form, url, verifying } = step;

    if (type === UNINSTALL_STEP_TYPES.URL) {
      if (!isTriggered) {
        dispatch(
          actions.integrationApp.uninstaller2.updateStep(
            integrationId,
            'inProgress',
          )
        );

        openExternalUrl({ url });
      } else {
        if (verifying) {
          return false;
        }

        dispatch(
          actions.integrationApp.uninstaller2.updateStep(
            integrationId,
            'verify'
          )
        );

        dispatch(
          actions.integrationApp.uninstaller2.uninstallStep(
            integrationId,
          )
        );
      }
    } else if (!isTriggered) {
      dispatch(
        actions.integrationApp.uninstaller2.updateStep(
          integrationId,
          'inProgress',
        )
      );
      if ((type !== UNINSTALL_STEP_TYPES.FORM || !form)) {
        dispatch(
          actions.integrationApp.uninstaller2.uninstallStep(
            integrationId,
          )
        );
      } else {
        // when the type is form and step has form, open form step drawer
        history.push(buildDrawerUrl({
          path: drawerPaths.INSTALL.FORM_STEP,
          baseUrl: match.url,
          params: { formType: 'uninstall' },
        }));
      }
    }
  }, [dispatch, integrationId, history, match]);

  const formCloseHandler = useCallback(() => {
    dispatch(
      actions.integrationApp.uninstaller2.updateStep(integrationId, 'reset')
    );
  }, [dispatch, integrationId]);
  const formSubmitHandler = useCallback(
    formVal => {
      dispatch(
        actions.integrationApp.uninstaller2.uninstallStep(
          integrationId,
          formVal
        )
      );
    },
    [dispatch, integrationId]
  );

  if (error) {
    return <Redirect push={false} to={getRoutePath(HOME_PAGE_PATH)} />;
  }
  if (!uninstallSteps || uninstallSteps.length === 0) {
    return (
      <Spinner center="screen" />
    );
  }

  return (
    <div>
      <CeligoPageBar
        title={`Uninstall app: ${name}`}
        // Todo: (Mounika) please add the helpText
        // infoText="we need to have the help text for the following."
         />
      <Box sx={{ padding: theme => theme.spacing(2, 3) }}>
        <Box sx={{ maxWidth: 750 }}>
          <Typography sx={{ marginBottom: theme => theme.spacing(2) }}>
            {message.INTEGRATION.UNINSTALL}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}>
            {(uninstallSteps || []).map((step, index) => (
              <InstallationStep
                key={step.name}
                mode={mode}
                handleStepClick={handleStepClick}
                index={index + 1}
                step={step}
              />
            ))}
          </Box>
        </Box>
      </Box>
      <FormStepDrawer
        integrationId={integrationId}
        formCloseHandler={formCloseHandler}
        formSubmitHandler={formSubmitHandler}
      />
    </div>
  );
}
