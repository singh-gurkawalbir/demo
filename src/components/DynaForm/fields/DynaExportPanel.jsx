import { Typography, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FormContext } from 'react-forms-processor/dist';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useCallback, Fragment } from 'react';
import actions from '../../../actions';
import {
  getResourceSampleDataWithStatus,
  getAvailableResourcePreviewStages,
} from '../../../reducers';
import { isNewId } from '../../../utils/resource';
import TextToggle from '../../../components/TextToggle';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import CopyIcon from '../../icons/CopyIcon';
import CodeEditor from '../../CodeEditor';
import Spinner from '../../Spinner';
import IconTextButton from '../../IconTextButton';
import ArrowRightIcon from '../../icons/ArrowRightIcon';

const useStyles = makeStyles(theme => ({
  container: {
    paddingLeft: theme.spacing(1),
  },
  sampleDataContainer: {
    height: '25vh',
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
}));

function DynaExportPanel(props) {
  const { resourceId, formContext, resourceType } = props;
  const [isPreviewDataFetched, setIsPreviewDataFetched] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const availablePreviewStages = useSelector(state =>
    getAvailableResourcePreviewStages(state, resourceId, resourceType)
  );
  const previewStageDataList = useSelector(state => {
    const stageData = [];

    // Expected to have at least one preview stage 'Default Stage is 'Output: parse'
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
  const [panelType, setPanelType] = useState(availablePreviewStages[0].value);
  const fetchExportPreviewData = useCallback(() => {
    dispatch(
      actions.sampleData.request(resourceId, resourceType, formContext.value)
    );
  }, [dispatch, resourceId, resourceType, formContext]);

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

    if (status === 'requested') return 'Testing';

    if (status === 'received') return 'Success';

    if (status === 'error') return 'Error';
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
            <Typography variant="body2"> {ShowSampleDataStatus()} </Typography>
            <Typography variant="body2"> 1 Page , 20 Records </Typography>
          </div>
        </div>
      </div>
      {resourceSampleData.status === 'requested' && <Spinner />}
      {resourceSampleData.status === 'received' && (
        <div>
          <TextToggle
            value={panelType}
            onChange={handlePanelViewChange}
            exclusive
            options={availablePreviewStages}
          />
          <div className={classes.sampleDataContainer}>
            <Fragment>
              <CodeEditor
                name="sampleData"
                value={previewStageDataList[panelType].data}
                mode={panelType === 'parsed' ? 'json' : 'text'}
                readOnly
              />
              <CopyToClipboard
                text={JSON.stringify(previewStageDataList[panelType].data)}
                onCopy={handleOnCopy}>
                <IconButton
                  data-test="copyToClipboard"
                  title="Copy to clipboard"
                  size="small">
                  <CopyIcon />
                </IconButton>
              </CopyToClipboard>
            </Fragment>
          </div>
        </div>
      )}
      {resourceSampleData.status === 'error' && (
        <div className={classes.sampleDataContainer}>
          <CodeEditor
            name="sampleData"
            value={resourceSampleData.error}
            mode="json"
            readOnly
          />
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
