import React, { useMemo, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowRightIcon from '../../icons/ArrowRightIcon';
import { getPreviewDataPageSizeInfo } from '../../../utils/exportPanel';
import FieldMessage from '../../DynaForm/fields/FieldMessage';
import SelectPreviewRecordsSize from '../SelectPreviewRecordsSize';
import { selectors } from '../../../reducers';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import OutlinedButton from '../../Buttons/index';

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
    width: theme.spacing(22),
    minWidth: theme.spacing(22),
  },
}));

export default function PreviewInfo(props) {
  const {
    fetchExportPreviewData,
    resourceSampleData,
    previewStageDataList,
    disabled,
    resourceId,
    resourceType,
    showPreviewData,
  } = props;
  const classes = useStyles(props);
  const [isValidRecordSize, setIsValidRecordSize] = useState(true);
  const [enquesnackbar] = useEnqueueSnackbar();
  const canSelectRecords = useSelector(state =>
    selectors.canSelectRecordsInPreviewPanel(state, resourceId, resourceType)
  );
  const sampleDataStatus = useMemo(() => {
    const { status, error } = resourceSampleData;

    if (status === 'requested') return <Typography data-public variant="body2"> Testing </Typography>;

    if (status === 'received') return <Typography data-public variant="body2"> Success! </Typography>;

    if (status === 'error') {
      const errorCount = error?.length || 0;

      return (
        <FieldMessage
          dataPublic
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
      const records =
        Object.prototype.hasOwnProperty.call(previewStageDataList, 'preview')
          ? previewStageDataList.preview
          : previewStageDataList.parse;

      return (
        <Typography variant="body2">
          {getPreviewDataPageSizeInfo(records)}
        </Typography>
      );
    }
  }, [previewStageDataList, resourceSampleData.status]);

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
  const disablePreview = showPreviewData &&
    (disabled || resourceSampleData.status === 'requested');

  return (
    <div className={classes.previewContainer}>
      <div className={classes.previewData}>
        <div className={classes.previewDataLeft}>
          <OutlinedButton
            color="secondary"
            className={classes.previewBtn}
            onClick={handlePreview}
            disabled={disablePreview}
            data-test="fetch-preview">
            Preview <ArrowRightIcon />
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
            <div className={classes.previewDataRight}>
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
