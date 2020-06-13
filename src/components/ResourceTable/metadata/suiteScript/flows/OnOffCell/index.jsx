import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OnOffSwitch from '../../../../../SwitchToggle';
import Spinner from '../../../../../Spinner';
import * as selectors from '../../../../../../reducers';
import actions from '../../../../../../actions';
import useConfirmDialog from '../../../../../ConfirmDialog';

export default function OnOffCell({
  ssLinkedConnectionId,
  flow,
}) {
  const dispatch = useDispatch();
  const { defaultConfirmDialog } = useConfirmDialog();
  const flowName = flow.ioFlowName || flow.name || `Unnamed (id: ${flow._id})`;
  const [onOffInProgressStatus, setOnOffInProgressStatus] = useState(false);
  const onOffInProgress = useSelector(
    state => selectors.isSuiteScriptFlowOnOffInProgress(state, {ssLinkedConnectionId, _id: flow._id}).onOffInProgress
  );
  const hasManagePermissions = useSelector(
    state =>
      selectors.resourcePermissions(state, 'connections', ssLinkedConnectionId)
        .edit
  );
  const handleDisableClick = useCallback(() => {
    defaultConfirmDialog(
      `${flow.disabled ? 'enable' : 'disable'} ${flowName}?`,
      () => {
        dispatch(actions.suiteScript.flow.isOnOffActionInprogress({ onOffInProgress: true, ssLinkedConnectionId, _id: flow._id}));
        setOnOffInProgressStatus(true);
        if (flow.disabled) {
          dispatch(actions.suiteScript.flow.enable({ssLinkedConnectionId, integrationId: flow._integrationId, _id: flow._id}));
        } else {
          dispatch(actions.suiteScript.flow.disable({ssLinkedConnectionId, integrationId: flow._integrationId, _id: flow._id}));
        }
      }
    );
  }, [defaultConfirmDialog, flow.disabled, flow._integrationId, flow._id, flowName, dispatch, ssLinkedConnectionId]);

  useEffect(() => {
    if (!onOffInProgress) {
      setOnOffInProgressStatus(false);
    }
  }, [onOffInProgress]);

  if (onOffInProgressStatus) {
    return <Spinner />;
  }

  return (
    <OnOffSwitch
      data-test={`toggleOnAndOffFlow${flowName}`}
      disabled={!hasManagePermissions}
      on={!flow.disabled}
      onClick={handleDisableClick}
    />
  );
}
