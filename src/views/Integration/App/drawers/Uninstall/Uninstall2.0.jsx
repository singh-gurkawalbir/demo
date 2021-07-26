import React, { useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import getRoutePath from '../../../../../utils/routePaths';
import InstallationStep from '../../../../../components/InstallStep';
import { HOME_PAGE_PATH, UNINSTALL_STEP_TYPES } from '../../../../../utils/constants';
import FormStepDrawer from '../../../../../components/InstallStep/FormStep';
import Spinner from '../../../../../components/Spinner';
import CeligoPageBar from '../../../../../components/CeligoPageBar';
import openExternalUrl from '../../../../../utils/window';

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
  installIntegrationSteps: {
    display: 'flex',
    flexDirection: 'column',
  },
  noIntegrationMsg: {
    padding: theme.spacing(3),
  },
}));

export default function Uninstaller2({ integration, integrationId }) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const {mode, name} = integration;
  const { steps: uninstallSteps, isFetched, error, isComplete } = useSelector(state =>
    selectors.integrationUninstallSteps(state, { integrationId, isFrameWork2: true }), shallowEqual
  );

  const isIAUninstallComplete = useSelector(state =>
    selectors.isIAV2UninstallComplete(state, { integrationId })
  );
  const currentStep = useMemo(() => uninstallSteps && uninstallSteps.find(s => s.isCurrentStep), [
    uninstallSteps,
  ]);

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
      history.replace(getRoutePath(HOME_PAGE_PATH));
    }
  }, [dispatch, history, integrationId, isComplete]);

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
      }
    }
  }, [dispatch, integrationId]);

  const formCloseHandler = useCallback(() => {
    // history.goBack();
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
      // history.goBack();
    },
    [dispatch, integrationId]
  );

  if (error) {
    return <Redirect push={false} to={getRoutePath(HOME_PAGE_PATH)} />;
  }
  if (!uninstallSteps || uninstallSteps.length === 0) {
    return (
      <Spinner centerAll />
    );
  }

  return (
    <div>
      <CeligoPageBar
        title={`Uninstall app: ${name}`}
        // Todo: (Mounika) please add the helpText
        // infoText="we need to have the help text for the following."
         />
      {currentStep && currentStep.isTriggered && currentStep.form && (
      <FormStepDrawer
        integrationId={integrationId}
        formMeta={currentStep.form}
        title={currentStep.name}
            // index={currStepIndex + 1}
        formCloseHandler={formCloseHandler}
        formSubmitHandler={formSubmitHandler}
            // path={`form/${currStepIndex + 1}`}
        />
      )}
      <div className={classes.installIntegrationWrapper}>
        <div className={classes.installIntegrationWrapperContent}>
          <Typography className={classes.message}>
            Complete the below steps to uninstall your integration app.
          </Typography>

          <div className={classes.installIntegrationSteps}>
            {(uninstallSteps || []).map((step, index) => (
              <InstallationStep
                key={step.name}
                mode={mode}
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
