import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { FormContext } from 'react-forms-processor/dist';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import actions from '../../../actions';
import {
  getResourceSampleDataWithStatus,
  getAvailableResourcePreviewStages,
  isPageGenerator,
} from '../../../reducers';
import { isNewId } from '../../../utils/resource';
import TextToggle from '../../../components/TextToggle';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import CopyIcon from '../../icons/CopyIcon';
import Spinner from '../../Spinner';
import IconTextButton from '../../IconTextButton';
import ArrowRightIcon from '../../icons/ArrowRightIcon';
import ErrorIcon from '../../icons/ErrorIcon';

const useStyles = makeStyles(theme => ({
  container: {
    paddingLeft: theme.spacing(3),
  },
  sampleDataWrapper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    background: theme.palette.background.paper,
    padding: theme.spacing(1),
  },
  sampleDataWrapperAlign: {
    marginTop: -18,
  },
  error: {
    color: 'red',
    marginRight: theme.spacing(0.5),
  },
  textToggleContainer: {
    textAlign: 'center',
    position: 'relative',
    zIndex: 2,
  },
  sampleDataContainer: {
    width: '100%',
    minHeight: theme.spacing(20),
    position: 'relative',
    backgroundColor: 'white',
    maxHeight: 400,
    maxWidth: 570,
    overflow: 'scroll',
    color: theme.palette.text.hint,
  },
  sampleDataContainerAlign: {
    marginTop: theme.spacing(2),
  },
  clipBoardContainer: {
    borderTop: `1px solid ${theme.palette.background.paper2}`,
    minHeight: theme.spacing(6),
    position: 'relative',
    padding: theme.spacing(1),
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  clipBoard: {
    float: 'right',
  },
  errorMessage: {
    display: 'flex',
    alignItems: 'center',
  },
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
  },

  previewBtn: {
    minHeight: theme.spacing(5),
    color: theme.palette.primary.main,
  },
  textToggle: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    '& > button': {
      height: 30,
      minWidth: 150,
      '&.Mui-selected': {
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: theme.palette.primary.light,
        },
      },
    },
  },
}));

function DynaExportPanel(props) {
  const { resourceId, formContext, resourceType, flowId } = props;
  const [isPreviewDataFetched, setIsPreviewDataFetched] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const isPageGeneratorExport = useSelector(state =>
    isPageGenerator(state, flowId, resourceId)
  );
  const availablePreviewStages = useSelector(state =>
    getAvailableResourcePreviewStages(state, resourceId, resourceType)
  );
  const [panelType, setPanelType] = useState(
    availablePreviewStages.length && availablePreviewStages[0].value
  );
  const previewStageDataList = useSelector(state => {
    const stageData = [];

    availablePreviewStages.length &&
      availablePreviewStages.forEach(({ value }) => {
        stageData[value] = getResourceSampleDataWithStatus(
          state,
          resourceId,
          value
        );
      });

    return stageData;
  });
  const resourceSampleData = useSelector(state =>
    getResourceSampleDataWithStatus(state, resourceId, 'raw')
  );
  const fetchExportPreviewData = useCallback(() => {
    // Just a fail safe condition not to request for sample data incase of not exports
    if (resourceType !== 'exports') return;

    // Note: If there is no flowId , it is a Standalone export as the resource type other than exports are restricted above
    if (!flowId || isPageGeneratorExport) {
      dispatch(
        actions.sampleData.request(resourceId, resourceType, formContext.value)
      );
    } else {
      dispatch(
        actions.sampleData.requestLookupPreview(
          resourceId,
          flowId,
          formContext.value
        )
      );
    }
  }, [
    isPageGeneratorExport,
    dispatch,
    resourceId,
    resourceType,
    formContext.value,
    flowId,
  ]);

  useEffect(() => {
    // Fetches preview data incase of initial load of an edit export mode
    if (!isPreviewDataFetched && !isNewId(resourceId)) {
      setIsPreviewDataFetched(true);
      fetchExportPreviewData();
    }
  }, [resourceId, isPreviewDataFetched, fetchExportPreviewData]);

  const handlePanelViewChange = useCallback(panelType => {
    setPanelType(panelType);
  }, []);
  const handleOnCopy = () =>
    enqueueSnackbar({
      message: 'Data copied to clipboard.',
      variant: 'success',
    });
  const ShowSampleDataStatus = () => {
    const { status } = resourceSampleData;

    if (status === 'requested')
      return <Typography variant="body2"> Testing </Typography>;

    if (status === 'received')
      return <Typography variant="body2"> Success </Typography>;
  };

  const showSampleDataOverview = () => {
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
      return <Typography variant="body2">1 Page 1 Record</Typography>;
    }
  };

  return (
    <div className={classes.container}>
      <Typography> Preview Data </Typography>
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
            <div>{showSampleDataOverview()}</div>
          </div>
        </div>
      </div>
      {resourceSampleData.status === 'requested' && <Spinner />}
      {resourceSampleData.status === 'error' && (
        <div>
          <div className={classes.textToggleContainer}>
            <TextToggle
              value={panelType}
              className={classes.textToggle}
              onChange={handlePanelViewChange}
              exclusive
              options={availablePreviewStages}
            />
          </div>
          <div
            className={clsx(
              classes.sampleDataWrapper,
              classes.sampleDataWrapperAlign
            )}>
            <div
              className={clsx(
                classes.sampleDataContainer,
                classes.sampleDataContainerAlign
              )}>
              <pre>
                {JSON.stringify(
                  previewStageDataList[panelType] &&
                    previewStageDataList[panelType].data,
                  null,
                  2
                )}
              </pre>
            </div>
            <div className={classes.clipBoardContainer}>
              <CopyToClipboard
                text={JSON.stringify(
                  previewStageDataList[panelType] &&
                    previewStageDataList[panelType].data
                )}
                onCopy={handleOnCopy}
                className={classes.clipBoard}>
                <IconTextButton
                  data-test="copyToClipboard"
                  title="Copy to clipboard"
                  variant="text"
                  color="primary">
                  <CopyIcon />
                  Copy
                </IconTextButton>
              </CopyToClipboard>
            </div>
          </div>
        </div>
      )}
      {resourceSampleData.status === 'received' && (
        <div className={classes.sampleDataWrapper}>
          <div className={classes.sampleDataContainer}>
            <pre>{JSON.stringify(resourceSampleData.error, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

const DynaExportPanelWithFormContext = props => (
  <FormContext.Consumer {...props}>
    {form => <DynaExportPanel {...props} formContext={form} />}
  </FormContext.Consumer>
);

export default DynaExportPanelWithFormContext;
