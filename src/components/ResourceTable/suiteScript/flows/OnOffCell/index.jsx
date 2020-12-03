import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CeligoSwitch from '../../../../CeligoSwitch';
import Spinner from '../../../../Spinner';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import useConfirmDialog from '../../../../ConfirmDialog';
import RemoveMargin from '../RemoveMargin';

const useStyles = makeStyles(theme => ({
  celigoSwitchOnOff: {
    marginTop: theme.spacing(1),
  },
  spinnerOnOff: {
    marginLeft: 12,
  },
}));

export default function OnOffCell({ ssLinkedConnectionId, flow }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { defaultConfirmDialog } = useConfirmDialog();
  const flowName = flow.ioFlowName || flow.name || `Unnamed (id: ${flow._id})`;
  const [onOffInProgressStatus, setOnOffInProgressStatus] = useState(false);
  const onOffInProgress = useSelector(
    state =>
      selectors.isSuiteScriptFlowOnOffInProgress(state, {
        ssLinkedConnectionId,
        _id: flow._id,
      })
  );
  const isManageLevelUser = useSelector(state => selectors.userHasManageAccessOnSuiteScriptAccount(state, ssLinkedConnectionId));
  const handleDisableClick = useCallback(() => {
    defaultConfirmDialog(
      `${flow.disabled ? 'enable' : 'disable'} ${flowName}?`,
      () => {
        dispatch(actions.suiteScript.flow.isOnOffActionInprogress({onOffInProgress: true, ssLinkedConnectionId, _id: flow._id}));
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
    return <Spinner size={24} className={classes.spinnerOnOff} />;
  }

  return (
    <RemoveMargin>
      <CeligoSwitch
        className={classes.celigoSwitchOnOff}
        data-test={`toggleOnAndOffFlow${flowName}`}
        disabled={!isManageLevelUser}
        checked={!flow.disabled}
        onChange={handleDisableClick}
    />
    </RemoveMargin>
  );
}
