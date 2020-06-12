import React, { useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Grid,
  Paper,
  Breadcrumbs,
  IconButton,
} from '@material-ui/core';
import * as selectors from '../../../../../reducers';
import actions from '../../../../../actions';
import getRoutePath from '../../../../../utils/routePaths';
import ArrowRightIcon from '../../../../../components/icons/ArrowRightIcon';
import ArrowBackIcon from '../../../../../components/icons/BackArrowIcon'
import InstallationStep from '../../../../../components/InstallStep';
import { UNINSTALL_STEP_TYPES } from '../../../../../utils/constants';
import FormStepDrawer from '../../../../../components/InstallStep/FormStep';
import Spinner from '../../../../../components/Spinner';
import SpinnerWrapper from '../../../../../components/SpinnerWrapper';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2),
    flexGrow: 1,
    width: '100%',
    padding: '10px 25px',
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
}));

export default function Uninstaller2({ integration, integrationId }) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const {mode, name} = integration;
  const { steps: uninstallSteps, isFetched, error, redirectTo } = useSelector(state =>
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
  }, [dispatch, integrationId, isFetched, isIAUninstallComplete, mode])

  useEffect(() => {
    if (redirectTo) {
      dispatch(
        actions.integrationApp.uninstaller2.clearSteps(
          integrationId
        )
      );
      history.replace(getRoutePath(redirectTo));
    }
  }, [dispatch, history, integrationId, redirectTo])

  const handleStepClick = useCallback((step) => {
    const { type, isTriggered, form } = step;

    if (!isTriggered) {
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

  const handleBackClick = () => {
    history.replace(getRoutePath('dashboard'));
  };

  if (error) {
    return <Redirect push={false} to={getRoutePath('dashboard')} />;
  }
  if (!uninstallSteps || uninstallSteps.length === 0) {
    return (
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
    );
  }

  return (
    <div className={classes.root}>
      <div className={classes.innerContent}>
        <Grid container className={classes.formHead}>
          <Grid item xs={1}>
            <IconButton
              data-test="back"
              onClick={handleBackClick}
              size="medium">
              <ArrowBackIcon fontSize="inherit" />
            </IconButton>
          </Grid>
          <Grid item>
            <Paper elevation={0} className={classes.paper}>
              <Breadcrumbs
                separator={<ArrowRightIcon />}
                aria-label="breadcrumb">
                <Typography color="textPrimary">Uninstall</Typography>
                <Typography color="textPrimary">{name}</Typography>
              </Breadcrumbs>
            </Paper>
          </Grid>
        </Grid>
        <Grid container spacing={3} className={classes.stepTable}>
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
          {(uninstallSteps || []).map((step, index) => (
            <InstallationStep
              key={step.name}
              mode={mode}
              handleStepClick={handleStepClick}
              index={index + 1}
              step={step}
            />
          ))}
        </Grid>
      </div>
    </div>
  );
}
