import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import RawHtml from '../../../../RawHtml';
import InstallationStep from '../../../../InstallStep';
import ResourceSetupDrawer from '../../../../ResourceSetup/Drawer';
import { generateNewId } from '../../../../../utils/resource';
import jsonUtil from '../../../../../utils/json';
import { SCOPES } from '../../../../../sagas/resourceForm';
import openExternalUrl from '../../../../../utils/window';
import { INSTALL_STEP_TYPES } from '../../../../../utils/constants';

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

  const installSteps = useSelector(state =>
    selectors.currentRevisionInstallSteps(state, integrationId, revisionId)
  );
  const areAllRevisionInstallStepsCompleted = useSelector(state =>
    selectors.areAllRevisionInstallStepsCompleted(state, integrationId, revisionId)
  );

  useEffect(() => {
    if (areAllRevisionInstallStepsCompleted) {
      onClose();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areAllRevisionInstallStepsCompleted]);

  const handleStepClick = step => {
    const { type, completed, isTriggered, _connectionId, sourceConnection, url } = step;

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
              // TODO: refactor this and rename this prop to make it more generic
            }),
            SCOPES.VALUE
          )
        );
      }
      history.push(`${match.url}/configure/connections/${_connectionId || newId}`);
    } else if (type === INSTALL_STEP_TYPES.URL) {
      if (!step.isTriggered) {
        dispatch(actions.integrationLCM.installSteps.updateStep(revisionId, 'inProgress'));
        openExternalUrl({ url });
      } else {
        if (step.verifying) {
          return false;
        }

        dispatch(actions.integrationLCM.installSteps.updateStep(revisionId, 'verify')); // status changes to verifying
        dispatch(actions.integrationLCM.installSteps.installStep(integrationId, revisionId)); // makes api call to update steps
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
      <RawHtml
        className={classes.message}
        options={{ allowedHtmlTags: ['a', 'br'] }}
        html={' Complete the steps below to merge your changes.Need more help? <a href="" target="_blank">Check out our help guide</a>'} />
      <div className={classes.installSteps}>
        {installSteps.map((step, index) => (
          <InstallationStep
            key={step.name}
            handleStepClick={handleStepClick}
            index={index + 1}
            step={step}
            integrationId={integrationId}
          />
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
