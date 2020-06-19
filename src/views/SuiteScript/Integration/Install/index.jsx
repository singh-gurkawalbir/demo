import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isEqual } from 'lodash';
import {
  Typography,
  IconButton,
  Grid,
  Paper,
  Breadcrumbs,
} from '@material-ui/core';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import ArrowBackIcon from '../../../../components/icons/ArrowLeftIcon';
import ArrowRightIcon from '../../../../components/icons/ArrowRightIcon';
import InstallationStep from '../../../../components/InstallStep';
import {SUITESCRIPT_CONNECTORS } from '../../../../utils/constants';
import openExternalUrl from '../../../../utils/window';
import ResourceSetupDrawer from '../../../../components/ResourceSetup';
import RightDrawer from '../../../../components/drawer/Right';
import {
  generateNewId,
} from '../../../../utils/resource';
import jsonUtil from '../../../../utils/json';
import { SCOPES } from '../../../../sagas/resourceForm';
import ResourceForm from '../../../../components/SuiteScript/ResourceFormFactory';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';
import { COMM_STATES } from '../../../../reducers/comms/networkComms';
import Spinner from '../../../../components/Spinner';
import SpinnerWrapper from '../../../../components/SpinnerWrapper';

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

const { _id: connectorId, name, urlName, ssName } = SUITESCRIPT_CONNECTORS.find(s => s._id === 'suitescript-salesforce-netsuite');
export default function SalesforceV2Installation() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const [connection, setConnection] = useState(null);
  const [ssConnection, setSSConnection] = useState(null);
  const history = useHistory();
  // using isEqual as shallowEqual doesn't do nested equality checks
  const { steps: installSteps, ssLinkedConnectionId, error, NETSUITE_CONNECTION, SALESFORCE_CONNECTION, ssIntegrationId } = useSelector(state =>
    selectors.salesforceV2Data(state, connectorId), isEqual
  );
  const packageCommStatus = useSelector(state => selectors.commStatusPerPath(state, `/suitescript/connections/${ssLinkedConnectionId}/installer/getPackageURLs`, 'GET'));
  const currentStep = useMemo(() => installSteps.find(s => s.isCurrentStep), [
    installSteps,
  ]);
  const isInstallComplete = useSelector(state =>
    selectors.isSalesforceV2InstallComplete(state, connectorId)
  );

  useEffect(() => {
    if (!installSteps || installSteps.length === 0) {
      dispatch(actions.suiteScript.installer.initSteps(
        connectorId,
      ));
    }
  }, [dispatch, installSteps]);

  useEffect(() => {
    if (isInstallComplete) {
      enqueueSnackbar({
        message: 'Please wait... configuring connector...',
        variant: 'success',
      });
      dispatch(actions.resource.requestCollection(`suitescript/connections/${ssLinkedConnectionId}/tiles`));
      history.replace(
        `/pg/suitescript/${ssLinkedConnectionId}/integrationapps/${urlName}/${ssIntegrationId}/flows`
      );
      dispatch(actions.suiteScript.installer.clearSteps(
        connectorId,
      ));
    }
  }, [dispatch, enqueueSnackbar, history, isInstallComplete, ssIntegrationId, ssLinkedConnectionId]);

  const verifySFBundle = useCallback((connectionId) => {
    if (!currentStep.isTriggered && !connectionId) {
      dispatch(
        actions.suiteScript.installer.updateStep(
          connectorId,
          'inProgress'
        )
      );
      openExternalUrl({ url: currentStep.installURL });
    } else {
      if (currentStep.verifying) {
        return false;
      }

      dispatch(
        actions.suiteScript.installer.updateStep(
          connectorId,
          'verify'
        )
      );
      dispatch(
        actions.suiteScript.installer.verifySFBundle(
          connectorId,
          connectionId || ssLinkedConnectionId,
          ssName
        )
      );
    }
  }, [currentStep, dispatch, ssLinkedConnectionId]);

  const verifyNSBundle = useCallback((connectionId) => {
    if (!currentStep.isTriggered && !connectionId) {
      dispatch(
        actions.suiteScript.installer.updateStep(
          connectorId,
          'inProgress'
        )
      );
      openExternalUrl({ url: currentStep.installURL });
    } else {
      if (currentStep.verifying) {
        return false;
      }

      dispatch(
        actions.suiteScript.installer.updateStep(
          connectorId,
          'verify'
        )
      );
      dispatch(
        actions.suiteScript.installer.verifyNSBundle(
          connectorId,
          connectionId || ssLinkedConnectionId,
          !!connectionId,
          ssName
        )
      );
    }
  }, [currentStep, dispatch, ssLinkedConnectionId]);

  const handleStepClick = useCallback((step) => {
    const {
      connectionType,
      installURL,
      installerFunction,
      type,
      completed,
    } = step;

    if (completed) {
      return false;
    }

    if (type === 'connection') {
      if (step.isTriggered) {
        return false;
      }

      const newId = generateNewId();
      const conn = {
        type: connectionType,
        [connectionType]: { type: connectionType},
      };

      dispatch(
        actions.resource.patchStaged(
          newId,
          jsonUtil.objectToPatchSet(conn),
          SCOPES.VALUE
        )
      );
      setConnection({
        newId,
        doc: conn,
      });
    } else if (type === 'integrator-bundle') {
      verifyNSBundle();
    } else if (type === 'connector-bundle') {
      verifySFBundle();
    } else if (type === 'ssConnection') {
      if (step.isTriggered) {
        return false;
      }

      const doc = connectionType === 'netsuite' ? NETSUITE_CONNECTION : SALESFORCE_CONNECTION;
      if (doc) {
        dispatch(
          actions.suiteScript.resource.patchStaged(
            doc._id,
            jsonUtil.objectToPatchSet(doc),
            SCOPES.VALUE,
            ssLinkedConnectionId,
            connectorId,
            'connections'
          )
        );
        setSSConnection({
          _id: doc._id,
          doc,
        });
        history.push(`${match.url}/editConnection`);
      }
    } else if (installURL) {
      if (!step.isTriggered) {
        dispatch(
          actions.suiteScript.installer.updateStep(
            connectorId,
            'inProgress'
          )
        );
        openExternalUrl({ url: installURL });
      } else {
        if (step.verifying) {
          return false;
        }

        dispatch(
          actions.suiteScript.installer.updateStep(
            connectorId,
            'verify'
          )
        );
        dispatch(
          actions.suiteScript.installer.verifyPackage(
            connectorId,
            ssLinkedConnectionId,
            installerFunction
          )
        );
      }
      // handle Action step click
    } else if (!step.isTriggered && !installURL) {
      dispatch(
        actions.suiteScript.installer.updateStep(
          connectorId,
          'completed'
        )
      );
    }
  }, [NETSUITE_CONNECTION, SALESFORCE_CONNECTION, dispatch, history, match.url, ssLinkedConnectionId, verifyNSBundle, verifySFBundle]);

  const handleBackClick = useCallback(e => {
    e.preventDefault();
    history.push('/pg/marketplace');
  }, [history]);

  const handleConnectionClose = useCallback(() => {
    setConnection(null);
  }, []);

  const handleSubmitComplete = useCallback((connectionId) => {
    dispatch(
      actions.suiteScript.installer.updateSSLinkedConnectionId(
        connectorId,
        connectionId
      )
    );
    dispatch(
      actions.suiteScript.installer.updateStep(
        connectorId,
        'completed'
      )
    );
    verifyNSBundle(connectionId);
    setConnection(null);
  }, [dispatch, verifyNSBundle]);

  const onSSConnSubmitComplete = useCallback(() => {
    if (currentStep.connectionType === 'salesforce') {
      dispatch(
        actions.suiteScript.installer.requestPackages(
          connectorId,
          ssLinkedConnectionId
        )
      );
    }
    dispatch(
      actions.suiteScript.installer.updateStep(
        connectorId,
        'completed'
      )
    );
    setSSConnection(null);
    history.goBack();
  }, [currentStep, dispatch, history, ssLinkedConnectionId]);

  if (error) {
    enqueueSnackbar({
      message: error,
      variant: 'error'
    });
  }

  return (
    <div className={classes.root}>
      <div className={classes.innerContent}>
        { packageCommStatus === COMM_STATES.LOADING &&
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>}
        {connection && (
        <ResourceSetupDrawer
          resourceId={connection.newId}
          resource={connection.doc}
          resourceType="connections"
          onClose={handleConnectionClose}
          onSubmitComplete={handleSubmitComplete}
          addOrSelect
        />
        )}
        {ssConnection && (
          <RightDrawer
            path="editConnection"
            type="legacy"
            title="Setup connection"
            height="tall"
            width="medium">
            <ResourceForm
              ssLinkedConnectionId={ssLinkedConnectionId}
              resourceId={ssConnection._id}
              resourceType="connections"
              onSubmitComplete={onSSConnSubmitComplete}
        />
          </RightDrawer>
        )}
        <Grid container className={classes.formHead}>
          <Grid item xs={1}>
            <IconButton
              data-test="back"
              onClick={handleBackClick}
              size="medium">
              <ArrowBackIcon fontSize="inherit" />
            </IconButton>
          </Grid>
          <Grid item xs>
            <Paper elevation={0} className={classes.paper}>
              <Breadcrumbs
                separator={<ArrowRightIcon />}
                aria-label="breadcrumb">
                <Typography color="textPrimary">Setup</Typography>
                <Typography color="textPrimary">
                  {name}
                </Typography>
              </Breadcrumbs>
            </Paper>
          </Grid>
        </Grid>
        <Grid container spacing={3} className={classes.stepTable}>
          {installSteps.map((step, index) => (
            <InstallationStep
              key={step.__index}
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
