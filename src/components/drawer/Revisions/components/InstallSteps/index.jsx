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
  installIntegrationWrapperContent: {
    maxWidth: 750,
  },
  message: {
    marginBottom: theme.spacing(2),
  },
  formHead: {
    borderBottom: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    marginBottom: 5,
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

export default function InstallSteps({ integrationId, revisionId, onClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const history = useHistory();
  // const [isSetupComplete, setIsSetupComplete] = useState(false);

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

        dispatch(actions.integrationLCM.installSteps.updateStep(revisionId, 'verify'));
      }
    } else {
      // merge and revert
      // eslint-disable-next-line no-lonely-if
      if (!step.isTriggered) {
        dispatch(actions.integrationLCM.installSteps.updateStep(revisionId, 'inProgress'));
        dispatch(actions.integrationLCM.installSteps.installStep(integrationId, revisionId));
      }
    }
  };

  const handleSubmitComplete = useCallback(connId => {
    // dispatch an action to make status in progress
    dispatch(actions.integrationLCM.installSteps.updateStep(revisionId, 'inProgress'));
    // Done: selected existing connection use case
    const stepInfo = {
      _connectionId: connId,
    };

    // TODO: 1. Creation of a new connection
    // 2. URL type step
    dispatch(actions.integrationLCM.installSteps.installStep(integrationId, revisionId, stepInfo));
  }, [dispatch, revisionId, integrationId]);

  // useEffect(() => {
  //   const allStepsCompleted = !installSteps.reduce((result, step) => result || !step.completed, false);

  //   if (installSteps.length) {
  //     if (allStepsCompleted && !isSetupComplete) {
  //       // dispatch(actions.resource.request('integrations', integrationId));
  //       setIsSetupComplete(true);
  //     } else if (!allStepsCompleted && isSetupComplete) {
  //       // reset local state if some new steps were added
  //       setIsSetupComplete(false);
  //     }
  //   }
  // }, [dispatch, installSteps, integrationId, isSetupComplete]);

  // Consider a conection to be created
  // Consider merge step to be finished
  return (
    <div className={classes.installIntegrationWrapperContent}>
      <RawHtml
        className={classes.message}
        options={{ allowedHtmlTags: ['a', 'br'] }}
        html={' Complete the steps below to merge your changes.Need more help? <a href="" target="_blank">Check out our help guide</a>'} />
      <div className={classes.installIntegrationSteps}>
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
        onClose={() => {}}
        onSubmitComplete={handleSubmitComplete}
        mode="revision"
      />
    </div>
  );
}
