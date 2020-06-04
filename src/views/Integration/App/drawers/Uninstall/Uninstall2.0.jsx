import React, { useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, useHistory, useRouteMatch } from 'react-router-dom';
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
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const mode = integration && integration.mode;
  const { steps: uninstallSteps, isFetched, error } = useSelector(state =>
    selectors.integrationUninstallSteps(state, { integrationId, isFrameWork2: true })
  );

  useEffect(() => {
    // we only want to do init, if mode is yet not uninstall
    if (mode !== 'uninstall') {
      dispatch(
        actions.integrationApp.uninstaller2.init(integrationId)
      );
    }
  }, [dispatch, mode, integrationId]);
  const currentStep = useMemo(() => uninstallSteps && uninstallSteps.find(s => s.isCurrentStep), [
    uninstallSteps,
  ]);
  const currStepIndex = useMemo(() => uninstallSteps && uninstallSteps.indexOf(currentStep), [
    currentStep,
    uninstallSteps,
  ]);

  useEffect(() => {
    // request steps should be triggered only if session state is empty
    // isUninstallTriggered check is added to stop this from running when state is cleared after uninstall is complete
    // REVIEW: better way to do this?
    if (mode === 'uninstall' && !integration.isUninstallTriggered && !isFetched && (!uninstallSteps || uninstallSteps.length === 0)) {
      dispatch(
        actions.integrationApp.uninstaller2.requestSteps(integrationId)
      );
    }
  }, [dispatch, mode, integrationId, uninstallSteps, isFetched, integration.isUninstallTriggered]);

  useEffect(() => {
    // if there are 0 uninstall steps, simply call uninstall route and BE will take care of rest
    if (isFetched && (!uninstallSteps || uninstallSteps.length === 0)) {
      dispatch(
        actions.integrationApp.uninstaller2.uninstallStep(
          integrationId,
        )
      );
    }
  }, [dispatch, integrationId, isFetched, uninstallSteps])

  const handleStepClick = useCallback((step, connection, index) => {
    const { type, isTriggered, form } = step;

    if (!isTriggered) {
      dispatch(
        actions.integrationApp.uninstaller2.updateStep(
          integrationId,
          'inProgress',
        )
      );
      if (type === UNINSTALL_STEP_TYPES.FORM && form) {
        // TODO: ask Dave about this hack
        history.push(`${match.url}/form/${index}`);
      } else {
        dispatch(
          actions.integrationApp.uninstaller2.uninstallStep(
            integrationId,
          )
        );
      }
    }
  }, [dispatch, history, integrationId, match.url]);

  const formCloseHandler = useCallback(() => {
    history.goBack();
    dispatch(
      actions.integrationApp.installer.updateStep(integrationId, 'reset')
    );
  }, [dispatch, history, integrationId]);
  const formSubmitHandler = useCallback(
    formVal => {
      dispatch(
        actions.integrationApp.uninstaller2.uninstallStep(
          integrationId,
          formVal
        )
      );
      history.goBack();
    },
    [dispatch, history, integrationId]
  );

  const handleBackClick = () => {
    history.replace(getRoutePath('dashboard'));
  };

  if (!uninstallSteps || uninstallSteps.length === 0) {
    return (
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
    );
  }
  if (error) {
    return <Redirect push={false} to={getRoutePath('dashboard')} />;
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
                <Typography color="textPrimary">{integration.name}</Typography>
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
            index={currStepIndex + 1}
            formCloseHandler={formCloseHandler}
            formSubmitHandler={formSubmitHandler}
            path={currStepIndex + 1}
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
