import { Fragment, useCallback, useState, useRef } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
// import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import RunIcon from '../icons/RunIcon';
import * as selectors from '../../reducers';
import actions from '../../actions';
import FlowStartDateDialog from './FlowStartDateDialog';

const useStyles = makeStyles(theme => ({
  fileInput: {
    display: 'none',
  },
  blockButton: {
    marginRight: theme.spacing(2),
  },
}));

export default function RunFlowButton({
  flowId,
  onRunStart,
  variant = 'icon',
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const fileInput = useRef(null);
  const [showDeltaStartDateDialog, setShowDeltaStartDateDialog] = useState(
    false
  );
  const flowDetails = useSelector(
    state => selectors.flowDetails(state, flowId),
    shallowEqual
  );
  const isNewFlow = !flowId || flowId.startsWith('new');
  const isDataLoaderFlow = flowDetails.isSimpleImport;
  const hasRunKey = useSelector(state => {
    if (!isDataLoaderFlow) return false;

    if (
      !flowDetails.pageGenerators ||
      flowDetails.pageGenerators.length === 0
    ) {
      return false;
    }

    const exportId = flowDetails.pageGenerators[0]._exportId;
    const exp = selectors.resource(state, 'exports', exportId);

    return exp && !!exp.rawData;
  });
  // console.log('Does DL export have run key?', hasRunKey);
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
    if (isDataLoaderFlow && !hasRunKey) {
      fileInput.current.click();

      return;
    }

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
    hasRunKey,
    isDataLoaderFlow,
  ]);
  const handleFileChange = useCallback(e => {
    // eslint-disable-next-line
    console.log('user selected a file', e.target.files[0]);

    // TODO: Raghu: We need to save this file, get a runKey and set the
    // export.rawData value to equal the runKey value. What is the best way
    // to do this?
  }, []);
  const handleCloseDeltaDialog = useCallback(() => {
    setShowDeltaStartDateDialog(false);
  }, []);
  const disabled =
    isNewFlow ||
    !(flowDetails && flowDetails.isRunnable) ||
    isMonitorLevelAccess;

  return (
    <Fragment>
      {showDeltaStartDateDialog && flowDetails.isDeltaFlow && (
        <FlowStartDateDialog
          flowId={flowId}
          onClose={handleCloseDeltaDialog}
          onRun={handleRunFlow}
        />
      )}

      {variant === 'icon' ? (
        <IconButton
          disabled={disabled}
          data-test={`runFlow-${flowDetails.name}`}
          onClick={handleClick}>
          <RunIcon />
        </IconButton>
      ) : (
        <span onClick={handleClick} data-test={`runFlow-${flowDetails.name}`}>
          Run flow
        </span>
      )}

      {isDataLoaderFlow && !hasRunKey && (
        <input
          data-test="uploadFile"
          id="fileUpload"
          type="file"
          ref={fileInput}
          accept="txt/csv"
          className={classes.fileInput}
          onChange={handleFileChange}
        />
      )}
    </Fragment>
  );
}
