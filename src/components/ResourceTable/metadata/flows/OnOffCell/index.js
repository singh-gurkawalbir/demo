import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../../../../Spinner';
import * as selectors from '../../../../../reducers';
import actions from '../../../../../actions';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import useConfirmDialog from '../../../../ConfirmDialog';
import CeligoSwitch from '../../../../CeligoSwitch';
import RemoveMargin from '../RemoveMargin';

const useStyles = makeStyles((theme) => ({
  celigoSwitchOnOff: {
    marginTop: theme.spacing(1),
  },
  spinnerOnOff: {
    marginLeft: 12,
  },
}));
// TODO: The amount of business logic in this component is unmanageable and
// not testable. A proper implementation with tests should be elevated to the data-layer
// with a saga controlling the async parts, and a simple status selector created
// to use here in this component...
export default function OnOffCell({
  flowId,
  integrationId,
  name,
  disabled,
  isFree,
  isIntegrationApp,
  storeId,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const { confirmDialog } = useConfirmDialog();
  const flowName = name || `Unnamed (id: ${flowId})`;
  const [onOffInProgressStatus, setOnOffInProgressStatus] = useState(false);
  const onOffInProgress = useSelector(
    state => selectors.isOnOffInProgress(state, flowId).onOffInProgress
  );
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );
  const istwoDotZeroFrameWork = integration && integration.installSteps &&
  integration.installSteps.length;

  const isDataLoader = useSelector(state =>
    selectors.isDataLoader(state, flowId)
  );
  const isFlowEnableLocked = useSelector(state =>
    selectors.isFlowEnableLocked(state, flowId)
  );
  const accessLevel = useSelector(
    state =>
      selectors.resourcePermissions(state, 'integrations', integrationId)
        .accessLevel
  );
  const isLicenseValidToEnableFlow = useSelector(
    state => selectors.isLicenseValidToEnableFlow(state),
    (left, right) =>
      left.message === right.message && left.enable === right.enable
  );
  const patchFlow = useCallback(
    (path, value) => {
      const patchSet = [{ op: 'replace', path, value }];

      dispatch(actions.resource.patchStaged(flowId, patchSet, 'value'));
      dispatch(
        actions.resource.commitStaged('flows', flowId, 'value', {
          action: 'flowEnableDisable',
        })
      );
    },
    [dispatch, flowId]
  );
  const handleDisableClick = useCallback(() => {
    confirmDialog({
      title: `Confirm ${disabled ? 'enable' : 'disable'}`,
      message: `Are you sure you want to ${disabled ? 'enable' : 'disable'} this flow?`,
      buttons: [
        {
          label: `${disabled ? 'Enable' : 'Disable'}`,
          onClick: () => {
            if (isIntegrationApp && !istwoDotZeroFrameWork) {
              dispatch(actions.flow.isOnOffActionInprogress(true, flowId));
              setOnOffInProgressStatus(true);
              dispatch(
                actions.integrationApp.settings.update(
                  integrationId,
                  flowId,
                  storeId,
                  null,
                  {
                    '/flowId': flowId,
                    '/disabled': !disabled,
                  },
                  { action: 'flowEnableDisable' }
                )
              );
            } else {
              if (disabled && !isFree && !isDataLoader) {
                if (!isLicenseValidToEnableFlow.enable) {
                  return enqueueSnackbar({
                    message: isLicenseValidToEnableFlow.message,
                    variant: 'error',
                  });
                }
              }

              dispatch(actions.flow.isOnOffActionInprogress(true, flowId));
              setOnOffInProgressStatus(true);

              patchFlow('/disabled', !disabled);
            }
          }
        },
        {
          label: 'Cancel',
          color: 'secondary',
        }]
    });
  }, [
    confirmDialog,
    dispatch,
    disabled,
    enqueueSnackbar,
    flowId,
    integrationId,
    isDataLoader,
    isFree,
    isIntegrationApp,
    isLicenseValidToEnableFlow.enable,
    isLicenseValidToEnableFlow.message,
    patchFlow,
    storeId,
    istwoDotZeroFrameWork,
  ]);

  useEffect(() => {
    if (!onOffInProgress) {
      setOnOffInProgressStatus(false);
    }
  }, [onOffInProgress]);

  if (onOffInProgressStatus) {
    return <Spinner size={24} className={classes.spinnerOnOff} />;
  }

  if (!isFlowEnableLocked) {
    return (
      <RemoveMargin>
        <CeligoSwitch
          className={classes.celigoSwitchOnOff}
          data-test={`toggleOnAndOffFlow${flowName}`}
          disabled={accessLevel === 'monitor'}
          checked={!disabled}
          onChange={handleDisableClick}
      />
      </RemoveMargin>
    );
  }

  return null;
}
