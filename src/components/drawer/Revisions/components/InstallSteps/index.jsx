import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import InstallationStep from '../../../../InstallStep';
import ResourceSetupDrawer from '../../../../ResourceSetup/Drawer';
import { generateNewId } from '../../../../../utils/resource';
import jsonUtil from '../../../../../utils/json';
import openExternalUrl from '../../../../../utils/window';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import { INSTALL_STEP_TYPES, REVISION_TYPES } from '../../../../../constants';
import { message } from '../../../../../utils/messageStore';
import { buildDrawerUrl, drawerPaths } from '../../../../../utils/rightDrawer';

const useStyles = makeStyles(theme => ({
  installStepsWrapper: {
    maxWidth: 750,
  },
  message: {
    marginBottom: theme.spacing(2),
  },
  installSteps: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default function InstallSteps({ integrationId, revisionId, onClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const history = useHistory();
  const [enqueueSnackbar] = useEnqueueSnackbar();

  const installSteps = useSelector(state =>
    selectors.currentRevisionInstallSteps(state, integrationId, revisionId)
  );
  const areAllRevisionInstallStepsCompleted = useSelector(state =>
    selectors.areAllRevisionInstallStepsCompleted(state, integrationId, revisionId)
  );

  const revisionStatus = useSelector(
    state => selectors.revisionStatus(state, integrationId, revisionId)
  );

  const revisionType = useSelector(state =>
    selectors.revisionType(state, integrationId, revisionId)
  );

  const oAuthConnectionId = useSelector(state =>
    selectors.revisionInstallStepOAuthConnectionId(state, revisionId)
  );
  const hasOpenedOAuthConnection = useSelector(state =>
    selectors.hasOpenedOAuthRevisionInstallStep(state, revisionId)
  );

  const oAuthConnection = useSelectorMemo(selectors.makeResourceSelector, 'connections', oAuthConnectionId);

  useEffect(() => {
    if (hasOpenedOAuthConnection && oAuthConnection) {
      dispatch(actions.integrationLCM.installSteps.setOauthConnectionMode({
        connectionId: oAuthConnectionId,
        revisionId,
        openOauthConnection: false,
      }));
      history.push(buildDrawerUrl({
        path: drawerPaths.INSTALL.CONFIGURE_RESOURCE_SETUP,
        baseUrl: match.url,
        params: { resourceType: 'connections', resourceId: oAuthConnectionId },
      }));
    }
  }, [
    hasOpenedOAuthConnection,
    oAuthConnection,
    oAuthConnectionId,
    dispatch,
    history,
    match.url,
    revisionId]);

  useEffect(() => {
    if (areAllRevisionInstallStepsCompleted) {
      if (revisionStatus !== 'failed') {
        enqueueSnackbar({ message: revisionType === REVISION_TYPES.PULL ? message.LCM.PULL_MERGE_SUCCESS : message.LCM.REVERT_SUCCESS });
      } else {
        enqueueSnackbar({ message: revisionType === REVISION_TYPES.PULL ? message.LCM.PULL_MERGE_ERROR : message.LCM.REVERT_ERROR, variant: 'error' });
      }
      onClose();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areAllRevisionInstallStepsCompleted, revisionStatus]);

  const handleStepClick = step => {
    const { type, completed, isTriggered, _connectionId, sourceConnection, url } = step;
    let netsuitePackageType = null;

    if (step?.name.startsWith('Integrator Bundle')) {
      netsuitePackageType = 'suitebundle';
    } else if (step?.name.startsWith('Integrator SuiteApp')) {
      netsuitePackageType = 'suiteapp';
    }

    if (completed) {
      return false;
    }

    if (type === 'connection') {
      if (isTriggered) {
        return false;
      }
      const newId = generateNewId();

      if (!_connectionId) {
        dispatch(
          actions.resource.patchStaged(
            newId,
            jsonUtil.objectToPatchSet({
              ...sourceConnection,
              _id: newId,
              _integrationId: integrationId,
              installStepConnection: true,
              newIA: true, // this prop is used to stop from saving the connection in resourceForm saga
              // TODO @Raghu: refactor this and rename this prop to make it more generic
            }),
          )
        );
      }
      history.push(buildDrawerUrl({
        path: drawerPaths.INSTALL.CONFIGURE_RESOURCE_SETUP,
        baseUrl: match.url,
        params: { resourceType: 'connections', resourceId: _connectionId || newId },
      }));
    } else if (type === INSTALL_STEP_TYPES.URL) {
      if (!step.isTriggered) {
        dispatch(actions.integrationLCM.installSteps.updateStep(revisionId, 'inProgress'));
        // If user hits url step for the first time, redirect him to the url to let him login and install
        openExternalUrl({ url });
      } else {
        if (step.verifying) {
          return false;
        }

        dispatch(actions.integrationLCM.installSteps.updateStep(revisionId, 'verify')); // status changes to verifying
        if (step.connectionId) {
          // Incase of url step, step is expected to have a linked connectionId for which the bundle install is verified
          // If step is already triggered, first verify if package is installed and further install the step else show error
          dispatch(actions.integrationLCM.installSteps.verifyBundleOrPackageInstall({
            integrationId,
            connectionId: step.connectionId,
            revisionId,
            variant: netsuitePackageType,
            isManualVerification: true,                     // true here sets the isManualVerification flag to true which means the user has triggered the verification
          }));
        }
      }
    } else if (!step.isTriggered) {
      // For Merge and Revert steps
      dispatch(actions.integrationLCM.installSteps.updateStep(revisionId, 'inProgress'));
      dispatch(actions.integrationLCM.installSteps.installStep(integrationId, revisionId));
    }
  };

  const handleSubmitComplete = useCallback((connId, _, connectionDoc) => {
    dispatch(actions.integrationLCM.installSteps.updateStep(revisionId, 'inProgress'));
    const stepInfo = connId ? {
      _connectionId: connId, // Incase user selects existing connections
    } : {
      connection: connectionDoc, // Incase user configures a new connection
    };

    dispatch(actions.integrationLCM.installSteps.installStep(integrationId, revisionId, stepInfo));
  }, [dispatch, revisionId, integrationId]);

  return (
    <div className={classes.installStepsWrapper}>
      <Typography className={classes.message}>
        {`Complete the steps below to ${revisionType === REVISION_TYPES.PULL ? 'merge' : 'revert'} your changes.`}
      </Typography>
      <div className={classes.installSteps}>
        {installSteps.map((step, index) => (
          <InstallationStep
            key={step.name}
            handleStepClick={handleStepClick}
            index={index + 1}
            step={step}
            integrationId={integrationId}
            revisionId={revisionId} />
        ))}
      </div>
      <ResourceSetupDrawer
        integrationId={integrationId}
        revisionId={revisionId}
        onSubmitComplete={handleSubmitComplete}
        mode="revision"
      />
    </div>
  );
}
