import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { makeStyles, IconButton } from '@material-ui/core';
import shortid from 'shortid';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import RunIcon from '../icons/RunIcon';
import { selectors } from '../../reducers';
import actions from '../../actions';
import FlowStartDateDialog from './FlowStartDateDialog';
import IconButtonWithTooltip from '../IconButtonWithTooltip';
import IconTextButton from '../IconTextButton';
import {
  EMPTY_RAW_DATA,
  MAX_DATA_LOADER_FILE_SIZE,
} from '../../utils/constants';
import Spinner from '../Spinner';

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

function RunFlowLabel({ isRequested, disabled, onRunClick, variant, label}) {
  const classes = useStyles();

  if (isRequested) return <Spinner />;

  if (variant === 'icon') {
    if (disabled) {
      return (
        <IconButton
          data-test="runFlow"
          className={classes.runNowIcon}
          disabled>
          <RunIcon />
        </IconButton>
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
      <IconTextButton
        disabled={disabled}
        variant="text"
        data-test="runFlow"
        onClick={onRunClick}>
        <RunIcon /> {label}
      </IconTextButton>
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
  const [fileId] = useState(`${flowId}-${shortid.generate()}`);
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

        if (onRunStart) onRunStart();
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

  return (
    <>
      {showDeltaStartDateDialog && flowDetails.isDeltaFlow && (
        <FlowStartDateDialog
          flowId={flowId}
          onClose={handleCloseDeltaDialog}
          onRun={handleRunFlow}
        />
      )}
      <RunFlowLabel
        isRequested={isDataLoaderFileProcessRequested}
        onRunClick={handleClick}
        variant={variant}
        disabled={disabled}
        label={label}
      />

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
