import React, { useMemo, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {Box} from '@celigo/fuse-ui';
import isEmpty from 'lodash/isEmpty';
import ArrowRightIcon from '../../icons/ArrowRightIcon';
import { getPreviewDataPageSizeInfo } from '../../../utils/exportPanel';
import FieldMessage from '../../DynaForm/fields/FieldMessage';
import SelectPreviewRecordsSize from '../SelectPreviewRecordsSize';
import { selectors } from '../../../reducers';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import {OutlinedButton} from '../../Buttons';
import { capitalizeFirstLetter } from '../../../utils/string';
import { MOCK_INPUT_RECORD_ABSENT } from '../../../utils/errorStore';
import { sampleDataStage } from '../../../utils/flowData';

const useStyles = makeStyles(theme => ({
  previewBtn: {
    minHeight: theme.spacing(5),
  },
  error: {
    color: 'red',
    marginRight: theme.spacing(0.5),
    marginTop: theme.spacing(-0.5),
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
  const [isValidRecordSize, setIsValidRecordSize] = useState(true);
  const [enquesnackbar] = useEnqueueSnackbar();
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
      } else {
        fetchExportPreviewData();
      }
    },
    [fetchExportPreviewData, isValidRecordSize, enquesnackbar],
  );
  const disablePreview = isPreviewDisabled || (showPreviewData && resourceSampleData.status === 'requested');

  return (
    <Box
      sx={{
        minHeight: 10,
        position: 'relative',
        justifyContent: 'space-between',
        flexDirection: 'row',
        p: 1,
        mb: 4,
        borderRadius: 0.5,
        border: theme => `1px solid ${theme.palette.secondary.lightest}`,
        '&:before': {
          content: '""',
          width: 5,
          height: '100%',
          backgroundColor: theme => (showPreviewData && resourceSampleData.status === 'error')
            ? theme.palette.error.main
            : theme.palette.success.main,
          position: 'absolute',
          left: 0,
          top: 0,
          borderRadius: theme => theme.spacing(0.5, 0, 0, 0.5),
        },
      }}>
      <Box
        sx={{
          display: 'flex',
          height: '100%',
        }}>
        <Box
          sx={{
            display: 'flex',
            borderRight: theme => `1px solid ${theme.palette.secondary.lightest}`,
            alignItems: 'center',
            p: 2,
          }}>
          <OutlinedButton
            color="secondary"
            className={classes.previewBtn}
            onClick={handlePreview}
            disabled={disablePreview}
            data-test="fetch-preview">
            {capitalizeFirstLetter(toggleValue)}
            <ArrowRightIcon />
          </OutlinedButton>
        </Box>
        { canSelectRecords &&
          (
            <Box
              sx={{
                p: theme => theme.spacing(0, 1, 0, 1),
                width: theme => theme.spacing(22),
                minWidth: theme => theme.spacing(22),
              }}>
              <SelectPreviewRecordsSize
                isValidRecordSize={isValidRecordSize}
                setIsValidRecordSize={setIsValidRecordSize}
                resourceId={resourceId}
              />
            </Box>
          )}
        {
          showPreviewData &&
          (
            <Box
              sx={[{
                display: 'flex',
                justifyContent: 'space-between',
                pl: 1,
                flexDirection: 'column',
                position: 'relative',
                width: '100%',
                borderLeft: theme => `1px solid ${theme.palette.secondary.lightest}`,
              }, resourceSampleData?.message ? {
                justifyContent: 'center',
              } : '']}
              >
              {sampleDataStatus && <div> {sampleDataStatus}</div>}
              {sampleDataOverview && (
              <Box sx={{ml: 4}}>{sampleDataOverview} </Box>
              )}
            </Box>
          )
        }
      </Box>
    </Box>
  );
}
