import React, { useMemo, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import IconTextButton from '../../IconTextButton';
import ArrowRightIcon from '../../icons/ArrowRightIcon';
import { getPreviewDataPageSizeInfo } from '../../../utils/exportPanel';
import ErroredMessageComponent from '../../DynaForm/fields/ErroredMessageComponent';
import SelectRecords from '../SelectRecords';
import { selectors } from '../../../reducers';

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
      backgroundColor: props => props.resourceSampleData.status === 'error' ? theme.palette.error.main : theme.palette.success.main,
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
  },

  previewBtn: {
    minHeight: theme.spacing(5),
    color: theme.palette.primary.main,
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
    width: theme.spacing(20),
    minWidth: theme.spacing(20),
  },
}));

export default function PreviewInfo(props) {
  const {
    fetchExportPreviewData,
    resourceSampleData,
    previewStageDataList,
    panelType,
    disabled,
    resourceId,
    resourceType,
  } = props;
  const classes = useStyles(props);
  const [recordSize, setRecordSize] = useState('10');
  const [isValidRecordSize, setIsValidRecordSize] = useState(true);

  const canSelectRecords = useSelector(state =>
    selectors.canSelectRecordsToPreviewInPreviewPanel(state, resourceId, resourceType)
  );
  const sampleDataStatus = useMemo(() => {
    const { status, error } = resourceSampleData;

    if (status === 'requested') return <Typography variant="body2"> Testing </Typography>;

    if (status === 'received') return <Typography variant="body2"> Success! </Typography>;

    if (status === 'error') {
      const errorCount = error?.length || 0;

      return (
        <ErroredMessageComponent
          errorMessages={`${errorCount} ${errorCount === 1 ? 'error' : 'errors'}`}
        />
      );
    }
  }, [resourceSampleData]);

  const sampleDataOverview = useMemo(() => {
    if (resourceSampleData.status === 'error') {
      return (
        <Typography variant="body2">
          0 Pages, 0 Records
        </Typography>
      );
    }

    if (resourceSampleData.status === 'received') {
      // TODO @Raghu:  Needs to be updated when number of records are handled
      return (
        <Typography variant="body2">
          {getPreviewDataPageSizeInfo(previewStageDataList[panelType])}
        </Typography>
      );
    }
  }, [panelType, previewStageDataList, resourceSampleData.status]);

  const handlePreview = useCallback(
    () => {
      if (!isValidRecordSize) {
        // show alert
        // console.log('enter a valid record size');
      } else {
        fetchExportPreviewData(parseInt(recordSize, 10));
      }
    },
    [fetchExportPreviewData, isValidRecordSize, recordSize],
  );

  return (
    <div className={classes.previewContainer}>
      <div className={classes.previewData}>
        <div className={classes.previewDataLeft}>
          <IconTextButton
            variant="outlined"
            color="secondary"
            className={classes.previewBtn}
            onClick={handlePreview}
            disabled={disabled || resourceSampleData.status === 'requested'}
            data-test="fetch-preview">
            Preview <ArrowRightIcon />
          </IconTextButton>
        </div>
        { canSelectRecords &&
        (
        <div className={classes.recordSize}>
          <SelectRecords
            recordSize={recordSize}
            isValidRecordSize={isValidRecordSize}
            setIsValidRecordSize={setIsValidRecordSize}
            setRecordSize={setRecordSize}
           />
        </div>
        ) }
        <div className={classes.previewDataRight}>
          {sampleDataStatus && <div> {sampleDataStatus}</div>}
          {sampleDataOverview && (
            <div className={classes.msgSuccess}>{sampleDataOverview} </div>
          )}
        </div>
      </div>
    </div>
  );
}
