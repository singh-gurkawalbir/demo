import { useCallback } from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import IconTextButton from '../../../../IconTextButton';
import ArrowRightIcon from '../../../../icons/ArrowRightIcon';
import ErrorIcon from '../../../../icons/ErrorIcon';
import { getPreviewDataPageSizeInfo } from '../../../../../utils/exportPanel';

const useStyles = makeStyles(theme => ({
  previewContainer: {
    minHeight: theme.spacing(10),
    position: 'relative',
    padding: theme.spacing(1),
    marginBottom: theme.spacing(4),
    borderRadius: theme.spacing(0.5),
    border: `1px solid ${theme.palette.secondary.lightest}`,
    '&:before': {
      content: '""',
      width: 5,
      height: '100%',
      backgroundColor: theme.palette.success.main,
      position: 'absolute',
      left: 0,
      top: 0,
      border: '1px solid',
      borderColor: theme.palette.secondary.contrastText,
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
    flexDirection: 'column',
    paddingLeft: theme.spacing(1),
    justifyContent: 'space-between',
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
}));

export default function PreviewInfo(props) {
  const {
    fetchExportPreviewData,
    resourceSampleData,
    previewStageDataList,
    panelType,
  } = props;
  const classes = useStyles();
  // ShowSampleDataStatus Fn shows Preview Status
  const ShowSampleDataStatus = useCallback(() => {
    if (resourceSampleData.status === 'requested')
      return <Typography variant="body2"> Testing </Typography>;

    if (resourceSampleData.status === 'received')
      return <Typography variant="body2"> Success </Typography>;
  }, [resourceSampleData.status]);
  // showSampleDataOverview Fn Used to show Preview Info
  const showSampleDataOverview = useCallback(() => {
    const { status, error } = resourceSampleData;

    if (status === 'error') {
      const errorCount = error.errors && error.errors.length;

      return (
        <div className={classes.errorMessage}>
          <ErrorIcon className={classes.error} />
          <Typography variant="body1">
            You have {errorCount} {errorCount > 1 ? 'errors' : 'error'}
          </Typography>
        </div>
      );
    }

    if (status === 'received') {
      // TODO @Raghu:  Needs to be updated when number of records are handled
      return (
        <Typography variant="body2">
          {getPreviewDataPageSizeInfo(previewStageDataList[panelType])}
        </Typography>
      );
    }
  }, [
    classes.error,
    classes.errorMessage,
    panelType,
    previewStageDataList,
    resourceSampleData,
  ]);

  return (
    <div className={classes.previewContainer}>
      <div className={classes.previewData}>
        <div className={classes.previewDataLeft}>
          <IconTextButton
            variant="outlined"
            color="secondary"
            className={classes.previewBtn}
            onClick={fetchExportPreviewData}
            disabled={resourceSampleData.status === 'requested'}
            data-test="fetch-preview">
            Preview <ArrowRightIcon />
          </IconTextButton>
        </div>

        <div className={classes.previewDataRight}>
          <div> {ShowSampleDataStatus()}</div>
          {showSampleDataOverview()}
        </div>
      </div>
    </div>
  );
}
