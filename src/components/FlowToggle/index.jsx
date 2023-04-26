import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Spinner } from '@celigo/fuse-ui';
import actions from '../../actions';
import useConfirmDialog from '../ConfirmDialog';
import { selectors } from '../../reducers';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import { useSelectorMemo } from '../../hooks';

export default function FlowToggle({
  flowId,
  disabled,
  childId,
  integrationId,
}) {
  // TODO: Connector specific things to be added for schedule drawer incase of !isDisabled && isIntegrationApp
  const { confirmDialog } = useConfirmDialog();
  const dispatch = useDispatch();
  const flow = useSelectorMemo(selectors.mkFlowDetails, flowId, childId);
  const [onOffInProgressStatus, setOnOffInProgressStatus] = useState(false);
  const onOffInProgress = useSelector(
    state => selectors.isOnOffInProgress(state, flow._id),
  );
  const istwoDotZeroFrameWork = useSelector(state => selectors.isIntegrationAppVersion2(state, integrationId, true));

  useEffect(() => {
    if (!onOffInProgress) {
      setOnOffInProgressStatus(false);
    }
  }, [dispatch, onOffInProgress]);
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const isLicenseValidToEnableFlow = useSelector(
    state => selectors.isLicenseValidToEnableFlow(state),
    (left, right) =>
      left.message === right.message && left.enable === right.enable
  );
  const enableOrDisableFlow = () => {
    const enable = flow.disabled;
    const message = `Are you sure you want to ${enable ? 'enable' : 'disable'} this flow?`;

    confirmDialog({
      title: `Confirm ${enable ? 'enable' : 'disable'}`,
      message,
      buttons: [
        {
          label: `${enable ? 'Enable' : 'Disable'}`,
          onClick: () => {
            if (flow._connectorId && !istwoDotZeroFrameWork) {
              dispatch(actions.flow.isOnOffActionInprogress(true, flow._id));
              setOnOffInProgressStatus(true);
              dispatch(
                actions.integrationApp.settings.update(
                  flow._integrationId,
                  flow._id,
                  childId,
                  null,
                  { '/flowId': flow._id, '/disabled': !enable },
                  { action: 'flowEnableDisable' }
                )
              );
            } else {
              if (enable && !flow.free && !flow.isSimpleImport && !istwoDotZeroFrameWork) {
                if (!isLicenseValidToEnableFlow.enable) {
                  return enqueueSnackbar({
                    message: isLicenseValidToEnableFlow.message,
                    variant: 'error',
                  });
                }
              }

              const patchSet = [
                {
                  op: 'replace',
                  path: '/disabled',
                  value: !enable,
                },
              ];

              setOnOffInProgressStatus(true);

              dispatch(actions.flow.isOnOffActionInprogress(true, flow._id));

              dispatch(actions.resource.patchAndCommitStaged('flows', flow?._id, patchSet, {
                options: {
                  action: 'flowEnableDisable',
                },
              }));
            }
          },
        },
        {
          label: 'Cancel',
          variant: 'text',
        },
      ],
    });
  };

  if (flow.disableSlider) return null;

  return onOffInProgressStatus ? (
    <Spinner sx={{padding: '0 !important'}} />
  ) : (
    <Switch
      disabled={disabled}
      onChange={enableOrDisableFlow}
      data-test="switchFlowOnOff"
      checked={flow.disabled === false}
      tooltip="Off / On"
      />
  );
}
