import { Fragment, useCallback, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
// import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import RunIcon from '../icons/RunIcon';
import * as selectors from '../../reducers';
import actions from '../../actions';
import FlowStartDateDialog from './FlowStartDateDialog';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  blockButton: {
    marginRight: theme.spacing(2),
  },
}));

export default function RunFlowIconButton({ flowId, onRunStart }) {
  // eslint-disable-next-line no-unused-vars
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showDeltaStartDateDialog, setShowDeltaStartDateDialog] = useState(
    false
  );
  const flowDetails = useSelector(
    state => selectors.flowDetails(state, flowId),
    shallowEqual
  );
  const isNewFlow = !flowId || flowId.startsWith('new');
  // const isDataLoaderFlow = flowDetails.isSimpleImport;
  const isMonitorLevelAccess = useSelector(state =>
    selectors.isFormAMonitorLevelAccess(state, flowDetails.integrationId)
  );
  const handleRunFlow = useCallback(
    customStartDate => {
      dispatch(actions.flow.run({ flowId, customStartDate }));

      if (onRunStart) onRunStart();
    },
    [dispatch, flowId, onRunStart]
  );
  const handleClick = useCallback(() => {
    if (
      flowDetails.isDeltaFlow &&
      (!flowDetails._connectorId || !!flowDetails.showStartDateDialog)
    ) {
      setShowDeltaStartDateDialog(true);
    } else {
      handleRunFlow();
    }
  }, [
    flowDetails._connectorId,
    flowDetails.isDeltaFlow,
    flowDetails.showStartDateDialog,
    handleRunFlow,
  ]);
  const handleCloseDeltaDialog = useCallback(() => {
    setShowDeltaStartDateDialog(false);
  }, []);

  return (
    <Fragment>
      {showDeltaStartDateDialog && flowDetails.isDeltaFlow && (
        <FlowStartDateDialog
          flowId={flowId}
          onClose={handleCloseDeltaDialog}
          onRun={handleRunFlow}
        />
      )}
      <IconButton
        disabled={
          isNewFlow ||
          !(flowDetails && flowDetails.isRunnable) ||
          isMonitorLevelAccess
        }
        data-test="runFlow"
        onClick={handleClick}>
        <RunIcon />
      </IconButton>
    </Fragment>
  );
}
