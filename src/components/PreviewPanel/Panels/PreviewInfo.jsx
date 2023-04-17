import React, { useMemo, useCallback, useEffect, useReducer } from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import isEmpty from 'lodash/isEmpty';
import ArrowRightIcon from '../../icons/ArrowRightIcon';
import { getPreviewDataPageSizeInfo, getPreviewDataPageSizeLength } from '../../../utils/exportPanel';
import FieldMessage from '../../DynaForm/fields/FieldMessage';
import SelectPreviewRecordsSize from '../SelectPreviewRecordsSize';
import { selectors } from '../../../reducers';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import {OutlinedButton} from '../../Buttons';
import { capitalizeFirstLetter } from '../../../utils/string';
import { MOCK_INPUT_RECORD_ABSENT } from '../../../utils/errorStore';
import { sampleDataStage } from '../../../utils/flowData';
import FlowStartDateDialog from '../PreviewDateDialog';
import actions from '../../../actions';
import { convertUtcToTimezone } from '../../../utils/date';
import reducer from './stateReducer';

const useStyles = makeStyles(theme => ({
  previewContainer: {
    minHeight: theme.spacing(10),
    position: 'relative',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: theme.spacing(1),
    marginBottom: theme.spacing(4),
    borderRadius: theme.spacing(0.5),
    border: `1px solid ${theme.palette.secondary.lightest}`,
    '&:before': {
      content: '""',
      width: 5,
      height: '100%',
      backgroundColor: props =>
        (props.showPreviewData && props.resourceSampleData.status === 'error')
          ? theme.palette.error.main
          : theme.palette.success.main,
      position: 'absolute',
      left: 0,
      top: 0,
      borderRadius: theme.spacing(0.5, 0, 0, 0.5),
    },
  },
  previewData: {
    display: 'flex',
    height: '100%',
  },

  previewDataLeft: {
    display: 'flex',
    borderRight: `1px solid ${theme.palette.secondary.lightest}`,
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  previewDataRight: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(1),
    flexDirection: 'column',
    position: 'relative',
    width: '100%',
    borderLeft: `1px solid ${theme.palette.secondary.lightest}`,
  },
  previewMessage: {
    justifyContent: 'center',
  },
  previewBtn: {
    minHeight: theme.spacing(5),
  },
  error: {
    color: 'red',
    marginRight: theme.spacing(0.5),
    marginTop: theme.spacing(-0.5),
  },
  msgSuccess: {
    marginLeft: 4,
  },
  recordSize: {
    padding: theme.spacing(0, 1, 0, 1),
    width: theme.spacing(22),
    minWidth: theme.spacing(22),
  },
}));

export default function PreviewInfo(props) {
  const {
    fetchExportPreviewData,
    resourceSampleData,
    previewStageDataList,
    resourceId,
    showPreviewData,
    formKey,
    resourceType,
    flowId,
  } = props;
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const [enquesnackbar] = useEnqueueSnackbar();
  const [previewState, dispatchLocalAction] = useReducer(reducer,
    {
      defaultDate: new Date(),
      showDeltaStartDateDialog: false,
      clickOnPreview: false,
      showWarning: !!flowId,
      isValidRecordSize: true,
      dateSelected: '',
    });
  const {defaultDate, showDeltaStartDateDialog, clickOnPreview, showWarning, isValidRecordSize, dateSelected } = previewState;

  const preferences = useSelector(state => selectors.userOwnPreferences(state));
  const timeZone = useSelector(state => selectors.userTimezone(state));
  const origLastExportDateTime = useSelector(state =>
    selectors.getLastExportDateTime(state, flowId)
  ).data;
  const isDeltaSupported = useSelector(
    state => {
      let isDelta = false;
      let isPG;

      if (flowId) {
        isPG = selectors.isPageGenerator(state, flowId, resourceId, resourceType);
      }
      if (isPG || !flowId) {
        const formValue = selectors.createFormValuesPatchSet(state, formKey, resourceType, resourceId);
        const formType = formValue?.finalValues?.['/type'];

        isDelta = formType === 'delta';
      }

      return isDelta;
    }
  );
  const canSelectRecords = useSelector(state =>
    selectors.canSelectRecordsInPreviewPanel(state, formKey)
  );
  const toggleValue = useSelector(state =>
    selectors.typeOfSampleData(state, resourceId)
  );
  const isPreviewDisabled = useSelector(state =>
    selectors.isExportPreviewDisabled(state, formKey));
  const {data: resourceDefaultMockData} = useSelector(state => selectors.getSampleDataContext(state, {
    flowId,
    resourceId,
    resourceType,
    stage: sampleDataStage.imports.processedFlowInput,
  }));
  const resourceMockData = useSelector(state => selectors.userMockInput(state, resourceId));
  const isMockInputDataAbsent = resourceType === 'imports' &&
                              isEmpty(resourceMockData) &&
                              isEmpty(resourceDefaultMockData);

  useEffect(() => {
    if (flowId) {
      dispatch(actions.flow.requestLastExportDateTime({ flowId }));
    }
  }, [dispatch, flowId]);

  useEffect(() => {
    if (resourceSampleData.status === 'received' && clickOnPreview) {
      const records = Object.prototype.hasOwnProperty.call(previewStageDataList, 'preview')
        ? previewStageDataList.preview
        : previewStageDataList.parse;

      if (isDeltaSupported && getPreviewDataPageSizeLength(records, resourceType) === 0) {
        dispatchLocalAction({ payload: { showDeltaStartDateDialog: true, showWarning: true }});
      } else {
        dispatchLocalAction({ payload: { clickOnPreview: false }});
      }
    }
  }, [clickOnPreview, flowId, isDeltaSupported, previewStageDataList, resourceSampleData.status, resourceType]);

  const lastExportDateTime = useMemo(() =>
    convertUtcToTimezone(origLastExportDateTime || defaultDate, preferences.dateFormat, preferences.timeFormat, timeZone, {skipFormatting: true}
    ), [defaultDate, origLastExportDateTime, preferences.dateFormat, preferences.timeFormat, timeZone]);

  const sampleDataStatus = useMemo(() => {
    const { status, error, message } = resourceSampleData;

    if (status === 'requested') return <Typography variant="body2"> Testing </Typography>;

    if (status === 'received') {
      if (isMockInputDataAbsent) {
        return (
          <>
            <FieldMessage
              errorMessages="1 error"
            />
            <Typography variant="body2">{MOCK_INPUT_RECORD_ABSENT}</Typography>
          </>
        );
      } if (message) {
        return <Typography variant="body2"> {message} </Typography>;
      }

      return <Typography variant="body2"> Success! </Typography>;
    }

    if (status === 'error') {
      const errorCount = error?.length || 0;

      return (
        <FieldMessage
          errorMessages={`${errorCount} ${errorCount === 1 ? 'error' : 'errors'}`}
        />
      );
    }
  }, [isMockInputDataAbsent, resourceSampleData]);

  const sampleDataOverview = useMemo(() => {
    if (resourceSampleData.status === 'error') {
      return (
        <Typography variant="body2">
          0 Pages, 0 Records
        </Typography>
      );
    }

    if (resourceSampleData.status === 'received') {
      const records = Object.prototype.hasOwnProperty.call(previewStageDataList, 'preview')
        ? previewStageDataList.preview
        : previewStageDataList.parse;

      return !isMockInputDataAbsent && !resourceSampleData.message && (
        <Typography variant="body2">
          {getPreviewDataPageSizeInfo(records, resourceType)}
        </Typography>
      );
    }
  }, [isMockInputDataAbsent, previewStageDataList, resourceSampleData.message, resourceSampleData.status, resourceType]);

  const handlePreview = useCallback(
    () => {
      if (!isValidRecordSize) {
        enquesnackbar({
          message: 'Enter a valid record size',
          variant: 'error',
        });
      } else if (isDeltaSupported) { // flow builder delta exports
        dispatchLocalAction({ payload: { clickOnPreview: true }});
        flowId ? fetchExportPreviewData(lastExportDateTime) : dispatchLocalAction({ payload: { showDeltaStartDateDialog: true }});
      } else {
        fetchExportPreviewData();
      }
    },
    [isValidRecordSize, flowId, isDeltaSupported, enquesnackbar, fetchExportPreviewData, lastExportDateTime],
  );
  const handleCloseDeltaDialog = useCallback((userAction = true) => {
    dispatchLocalAction({ payload: { showDeltaStartDateDialog: false }});
    userAction && dispatchLocalAction({ payload: { showWarning: flowId ? !!flowId : false, dateSelected: ''}});
  }, [flowId]);

  const handleRunPreview = useCallback(
    customStartDate => {
      const lastExportDate = customStartDate || lastExportDateTime;

      fetchExportPreviewData(lastExportDate);
      dispatchLocalAction({payload: {dateSelected: lastExportDate}});
    },
    [fetchExportPreviewData, lastExportDateTime]
  );
  const setIsValidRecordSize = useCallback(isValid => {
    dispatchLocalAction({payload: { isValidRecordSize: isValid }});
  }, []);
  const disablePreview = isPreviewDisabled || (showPreviewData && resourceSampleData.status === 'requested');

  return (
    <div className={classes.previewContainer}>
      <div className={classes.previewData}>
        {
          showDeltaStartDateDialog && (
            <FlowStartDateDialog
              flowId={flowId}
              onClose={handleCloseDeltaDialog}
              onRun={handleRunPreview}
              showWarning={showWarning}
              dateSelected={dateSelected}
            />
          )
        }
        <div className={classes.previewDataLeft}>
          <OutlinedButton
            color="secondary"
            className={classes.previewBtn}
            onClick={handlePreview}
            disabled={disablePreview}
            data-test="fetch-preview">
            {capitalizeFirstLetter(toggleValue)}
            <ArrowRightIcon />
          </OutlinedButton>
        </div>
        { canSelectRecords &&
          (
            <div className={classes.recordSize}>
              <SelectPreviewRecordsSize
                isValidRecordSize={isValidRecordSize}
                setIsValidRecordSize={setIsValidRecordSize}
                resourceId={resourceId}
              />
            </div>
          )}
        {
          showPreviewData &&
          (
            <div
              className={clsx(classes.previewDataRight, {
                [classes.previewMessage]: resourceSampleData?.message,
              })}>

              {sampleDataStatus && <div> {sampleDataStatus}</div>}
              {sampleDataOverview && (
              <div className={classes.msgSuccess}>{sampleDataOverview} </div>
              )}
            </div>
          )
        }
      </div>
    </div>
  );
}
