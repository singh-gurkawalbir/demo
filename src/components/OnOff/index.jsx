import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from '@material-ui/core';
import actions from '../../actions';
import SwitchOnOff from '../SwitchToggle';
import useConfirmDialog from '../ConfirmDialog';
import * as selectors from '../../reducers';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import Spinner from '../Spinner';

export default {
  label: 'Off/On',
  component: function EnableOrDisableFlow({
    resource: flow,
    disabled,
    storeId,
  }) {
    // TODO: Connector specific things to be added for schedule drawer incase of !isDisabled && isIntegrationApp
    const { confirmDialog } = useConfirmDialog();
    const dispatch = useDispatch();
    const [onOffInProgressStatus, setOnOffInProgressStatus] = useState(false);
    const { onOffInProgress } = useSelector(
      state => selectors.isOnOffInProgress(state, flow._id),
      (left, right) => left.onOffInProgress === right.onOffInProgress
    );

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
      const message = [
        'Are you sure you want to ',
        enable ? 'enable' : 'disable',
        flow.name || flow._id,
        'flow?',
      ].join(' ');

      confirmDialog({
        title: 'Confirm',
        message,
        buttons: [
          {
            label: 'Cancel',
          },
          {
            label: 'Yes',
            onClick: () => {
              if (flow._connectorId) {
                dispatch(actions.flow.isOnOffActionInprogress(true, flow._id));
                setOnOffInProgressStatus(true);
                dispatch(
                  actions.integrationApp.settings.update(
                    flow._integrationId,
                    flow._id,
                    storeId,
                    null,
                    { '/flowId': flow._id, '/disabled': !enable },
                    { action: 'flowEnableDisable' }
                  )
                );
              } else {
                if (enable && !flow.free && !flow.isSimpleImport) {
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

                dispatch(
                  actions.resource.patchStaged(flow._id, patchSet, 'value')
                );
                dispatch(
                  actions.resource.commitStaged('flows', flow._id, 'value', {
                    action: 'flowEnableDisable',
                  })
                );
              }
            },
          },
        ],
      });
    };

    return onOffInProgressStatus ? (
      <Spinner size={20} />
    ) : (
      <Tooltip title="Off/On" placement="bottom">
        <div>
          <SwitchOnOff
            disabled={disabled}
            on={!flow.disabled}
            onClick={enableOrDisableFlow}
            data-test="switchFlowOnOff"
          />
        </div>
      </Tooltip>
    );
  },
};
