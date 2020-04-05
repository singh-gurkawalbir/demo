import { Fragment, useCallback, useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import RunIcon from '../icons/RunIcon';
import * as selectors from '../../reducers';
import actions from '../../actions';
import FlowStartDateDialog from './FlowStartDateDialog';
import { EMPTY_RAW_DATA } from '../../utils/constants';
import { generateNewId } from '../../utils/resource';

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
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const fileInput = useRef(null);
  const [fileId] = useState(generateNewId());
  const [showDeltaStartDateDialog, setShowDeltaStartDateDialog] = useState(
    false
  );
  const flowDetails = useSelector(
    state => selectors.flowDetails(state, flowId),
    shallowEqual
  );
  const isNewFlow = !flowId || flowId.startsWith('new');
  const isDataLoaderFlow = flowDetails.isSimpleImport;
  const dataLoaderFileType = useSelector(state => {
    if (!isDataLoaderFlow) return;

    if (
      !flowDetails.pageGenerators ||
      flowDetails.pageGenerators.length === 0
    ) {
      return;
    }

    const exportId = flowDetails.pageGenerators[0]._exportId;
    const exp = selectors.resource(state, 'exports', exportId);

    return exp && exp.file && exp.file.type;
  });
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

    // TODO @Raghu Change it to !!(exp && exp.rawData) once BE fix is done
    return !!(exp && exp.rawData && exp.rawData !== EMPTY_RAW_DATA);
  });
  // console.log('Does DL export have run key?', hasRunKey);
  const isMonitorLevelAccess = useSelector(state =>
    selectors.isFormAMonitorLevelAccess(state, flowDetails.integrationId)
  );
  const uploadedFile = useSelector(
    state => selectors.getUploadedFile(state, fileId) || {},
    shallowEqual
  );
  const handleRunFlow = useCallback(
    customStartDate => {
      if (isDataLoaderFlow) {
        dispatch(actions.flow.runDataLoader({ flowId }));
      } else {
        dispatch(actions.flow.run({ flowId, customStartDate }));
      }

      if (onRunStart) onRunStart();
    },
    [dispatch, flowId, isDataLoaderFlow, onRunStart]
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
  const handleFileChange = useCallback(
    e => {
      const file = e.target.files[0];

      if (!file) return;

      dispatch(
        actions.file.processFile({ fileId, file, fileType: dataLoaderFileType })
      );
    },
    [dataLoaderFileType, dispatch, fileId]
  );
  const handleCloseDeltaDialog = useCallback(() => {
    setShowDeltaStartDateDialog(false);
  }, []);
  const disabled =
    isNewFlow ||
    !(flowDetails && flowDetails.isRunnable) ||
    isMonitorLevelAccess;

  useEffect(() => {
    const { status, file, error } = uploadedFile || {};

    switch (status) {
      case 'error':
        enqueueSnackbar({
          message: error,
          variant: 'error',
        });
        break;

      case 'received':
        dispatch(
          actions.flow.runDataLoader({
            flowId,
            fileContent: file,
            fileType: dataLoaderFileType,
          })
        );
        enqueueSnackbar({
          message: `${flowDetails.name} has been added to your queue.`,
        });

        if (onRunStart) onRunStart();
        break;
      default:
    }
  }, [
    dataLoaderFileType,
    dispatch,
    enqueueSnackbar,
    flowDetails.name,
    flowId,
    onRunStart,
    uploadedFile,
  ]);

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
          data-test="runFlow"
          onClick={handleClick}>
          <RunIcon />
        </IconButton>
      ) : (
        <span onClick={handleClick} data-test="runFlow">
          Run flow
        </span>
      )}

      {isDataLoaderFlow && !hasRunKey && (
        <input
          data-test="uploadFile"
          id="fileUpload"
          type="file"
          ref={fileInput}
          className={classes.fileInput}
          onChange={handleFileChange}
        />
      )}
    </Fragment>
  );
}
