import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import useConfirmDialog from '../../../../ConfirmDialog';

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
  childId,
  actionProps,
}) {
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const { confirmDialog } = useConfirmDialog();
  const flowName = name || `Unnamed (id: ${flowId})`;
  const [onOffInProgressStatus, setOnOffInProgressStatus] = useState(false);
  const onOffInProgress = useSelector(
    state => selectors.isOnOffInProgress(state, flowId)
  );
  const istwoDotZeroFrameWork = actionProps.integration?.installSteps?.length;
  const isDataLoader = !!actionProps.flowAttributes[flowId]?.isDataLoader;
  const isFlowEnableLocked = !!actionProps.flowAttributes[flowId]?.isFlowEnableLocked;
  const accessLevel = useSelector(
    state =>
      selectors.resourcePermissions(state, 'integrations', integrationId)?.accessLevel
  );
  const isLicenseValidToEnableFlow = useSelector(
    state => selectors.isLicenseValidToEnableFlow(state),
    (left, right) =>
      left.message === right.message && left.enable === right.enable
  );
  const patchFlow = useCallback(
    (path, value) => {
      const patchSet = [{ op: 'replace', path, value }];

      dispatch(actions.resource.patchAndCommitStaged('flows', flowId, patchSet, {
        options: {
          action: 'flowEnableDisable',
        },
      }));
    },
    [dispatch, flowId]
  );
  const handleDisableClick = useCallback(() => {
    confirmDialog({
      title: `Confirm ${disabled ? 'enable' : 'disable'}`,
      message: `Are you sure you want to ${disabled ? 'enable' : 'disable'} this flow? ${!disabled ? 'This will not stop a flow that is already running, but no future scheduled flows will be run.' : ''}`,
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
                  childId,
                  null,
                  {
                    '/flowId': flowId,
                    '/disabled': !disabled,
                  },
                  { action: 'flowEnableDisable' }
                )
              );
            } else {
              if (disabled && !isFree && !isDataLoader && !istwoDotZeroFrameWork) {
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
          },
        },
        {
          label: 'Cancel',
          variant: 'text',
        }],
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
    childId,
    istwoDotZeroFrameWork,
  ]);

  useEffect(() => {
    if (!onOffInProgress) {
      setOnOffInProgressStatus(false);
    }
  }, [onOffInProgress]);

  if (onOffInProgressStatus) {
    return <Spinner sx={{ml: 0.5}} />;
  }

  if (!isFlowEnableLocked) {
    return (
      <Switch
        tooltip="Off / On"
        data-test={`toggleOnAndOffFlow${flowName}`}
        disabled={accessLevel === 'monitor'}
        checked={!disabled}
        onChange={handleDisableClick}
      />
    );
  }

  return null;
}
