import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';
import actions from '../../actions';
import CeligoSwitch from '../CeligoSwitch';
import useConfirmDialog from '../ConfirmDialog';
import { selectors } from '../../reducers';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import Spinner from '../Spinner';

const useStyles = makeStyles({
  spinnerFlowToggle: {
    padding: '0 !important',
  },
});
export default function FlowToggle({
  resource: flow,
  disabled,
  storeId,
  integrationId,
}) {
  // TODO: Connector specific things to be added for schedule drawer incase of !isDisabled && isIntegrationApp
  const { confirmDialog } = useConfirmDialog();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [onOffInProgressStatus, setOnOffInProgressStatus] = useState(false);
  const { onOffInProgress } = useSelector(
    state => selectors.isOnOffInProgress(state, flow._id),
    (left, right) => left.onOffInProgress === right.onOffInProgress
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
        {
          label: 'Cancel',
          color: 'secondary',
        },
      ],
    });
  };

  if (flow.disableSlider) return null;

  return onOffInProgressStatus ? (
    <Spinner size={20} color="primary" className={classes.spinnerFlowToggle} />
  ) : (
    <Tooltip data-public title="Off/On" placement="bottom">
      <div>
        <CeligoSwitch
          disabled={disabled}
          on={!flow.disabled ? 'true' : 'false'}
          onChange={enableOrDisableFlow}
          data-test="switchFlowOnOff"
          checked={!flow.disabled}
      />
      </div>
    </Tooltip>
  );
}
