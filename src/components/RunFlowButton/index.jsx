import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { Spinner, TextButton } from '@celigo/fuse-ui';
import { generateId } from '../../utils/string';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import RunIcon from '../icons/RunIcon';
import { selectors } from '../../reducers';
import actions from '../../actions';
import FlowStartDateDialog from './FlowStartDateDialog';
import IconButtonWithTooltip from '../IconButtonWithTooltip';
import {
  EMPTY_RAW_DATA,
  MAX_DATA_LOADER_FILE_SIZE,
} from '../../constants';
import { message } from '../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  fileInput: {
    display: 'none',
  },
  blockButton: {
    marginRight: theme.spacing(2),
  },
  runNowIcon: {
    '&:hover': {
      background: 'none',
      color: theme.palette.primary.main,
    },
  },
}));

function RunFlowLabel({ isRequested, disabled, onRunClick, variant, label, isSetupInProgress}) {
  const classes = useStyles();

  if (isRequested) return <Spinner />;

  if (variant === 'icon') {
    if (disabled) {
      return (
        <IconButtonWithTooltip
          data-test="runFlow"
          tooltipProps={{title: isSetupInProgress ? message.FLOWS.INCOMPLETE_FLOW_TOOLTIP : '', placement: 'bottom'}}
          className={classes.runNowIcon}
          disabled>
          <RunIcon />
        </IconButtonWithTooltip>
      );
    }

    return (
      <IconButtonWithTooltip
        className={classes.runNowIcon}
        tooltipProps={{
          title: 'Run now',
          placement: 'bottom',
        }}
        disabled={disabled}
        data-test="runFlow"
        onClick={onRunClick}>
        <RunIcon color="secondary" />
      </IconButtonWithTooltip>
    );
  }

  if (variant === 'iconText') {
    return (
      <TextButton
        disabled={disabled}
        startIcon={<RunIcon />}
        data-test="runFlow"
        onClick={onRunClick}>
        {label}
      </TextButton>
    );
  }

  return (
    <span onClick={onRunClick} data-test="runFlow">
      Run flow
    </span>
  );
}

export default function RunFlowButton({
  flowId,
  onRunStart,
  runOnMount,
  variant = 'icon',
  label = 'Run now',
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const fileInput = useRef(null);
  const [showDeltaStartDateDialog, setShowDeltaStartDateDialog] = useState(
    false
  );
  const isSetupInProgress = useSelector(state => selectors.isFlowSetupInProgress(state, flowId));
  const [fileId] = useState(`${flowId}-${generateId()}`);
  const flowDetails = useSelector(
    state => selectors.flowDetails(state, flowId),
    shallowEqual
  );

  const runStatus = useSelector(state =>
    selectors.flowRunStatus(state, flowId)
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
  const uploadedFile = useSelector(
    state => selectors.getUploadedFile(state, fileId),
    shallowEqual
  );
  const handleRunFlow = useCallback(
    customStartDate => {
      if (isDataLoaderFlow) {
        dispatch(actions.flow.runDataLoader({ flowId }));
      } else {
        dispatch(actions.flow.run({ flowId, customStartDate }));
      }
    },
    [dispatch, flowId, isDataLoaderFlow]
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
  }, [flowDetails._connectorId, flowDetails.isDeltaFlow, flowDetails.showStartDateDialog, handleRunFlow, hasRunKey, isDataLoaderFlow]);
  const handleFileChange = useCallback(
    e => {
      const file = e.target.files[0];

      if (!file) return;

      dispatch(
        actions.file.processFile({
          fileId,
          file,
          fileType: dataLoaderFileType,
          fileProps: { maxSize: MAX_DATA_LOADER_FILE_SIZE },
        })
      );
      // eslint-disable-next-line no-param-reassign
      e.target.value = null;
    },
    [dataLoaderFileType, dispatch, fileId]
  );
  const handleCloseDeltaDialog = useCallback(() => {
    setShowDeltaStartDateDialog(false);
  }, []);
  const disabled = isNewFlow || !flowDetails?.isRunnable || flowDetails?.disableRunFlow;

  useEffect(() => {
    if (runStatus === 'Started' && onRunStart) {
      onRunStart();
      dispatch(actions.flow.runActionStatus('Done', flowId));
    }
  }, [dispatch, flowId, onRunStart, runStatus]);

  useEffect(() => {
    const { status, file, error, rawFile } = uploadedFile || {};

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
            fileName: rawFile.name,
            fileContent: file,
            fileType: rawFile.type || dataLoaderFileType,
          })
        );
        // Removes uploaded file from session as it is no longer needed once triggered flow run
        dispatch(actions.file.reset(fileId));

        break;
      default:
    }
  }, [
    dataLoaderFileType,
    dispatch,
    enqueueSnackbar,
    flowId,
    onRunStart,
    uploadedFile,
    fileId,
  ]);
  const isDataLoaderFileProcessRequested =
    isDataLoaderFlow && uploadedFile && uploadedFile.status !== 'error';

  useEffect(() => {
    if (runOnMount) {
      handleClick();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {showDeltaStartDateDialog && flowDetails.isDeltaFlow && (
        <FlowStartDateDialog
          flowId={flowId}
          onClose={handleCloseDeltaDialog}
          onRun={handleRunFlow}
        />
      )}
      {!runOnMount
        ? (
          <RunFlowLabel
            isRequested={isDataLoaderFileProcessRequested}
            onRunClick={handleClick}
            variant={variant}
            isSetupInProgress={isSetupInProgress}
            disabled={disabled}
            label={label}
      />
        ) : ''}

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
    </>
  );
}
