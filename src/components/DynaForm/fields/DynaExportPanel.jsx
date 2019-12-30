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

const useStyles = makeStyles(() => ({
  container: {
    height: '25vh',
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

    availablePreviewStages.forEach(({ value }) => {
      stageData[value] = getResourceSampleDataWithStatus(
        state,
        resourceId,
        value
      );
    });

    return stageData;
  });
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

  return (
    <div>
      <Typography> Preview Data </Typography>

      <div>
        <TextToggle
          value={panelType}
          onChange={handlePanelViewChange}
          exclusive
          options={availablePreviewStages}
        />
        <div className={classes.container}>
          {previewStageDataList[panelType] &&
            previewStageDataList[panelType].status === 'requested' && (
              <Spinner />
            )}
          {previewStageDataList[panelType] &&
            previewStageDataList[panelType].status === 'received' && (
              <Fragment>
                <CodeEditor
                  name="sampleData"
                  value={previewStageDataList[panelType].data}
                  mode={panelType === 'parsed' ? 'json' : 'text'}
                  readOnly
                />
                <CopyToClipboard
                  text={previewStageDataList[panelType].data}
                  onCopy={handleOnCopy}>
                  <IconButton
                    data-test="copyToClipboard"
                    title="Copy to clipboard"
                    size="small">
                    <CopyIcon />
                  </IconButton>
                </CopyToClipboard>
              </Fragment>
            )}
          {previewStageDataList[panelType] &&
            previewStageDataList[panelType].status === 'error' && (
              <CodeEditor
                name="sampleDataError"
                value={previewStageDataList[panelType].error}
                mode="text"
                readOnly
              />
            )}
        </div>
      </div>
    </div>
  );
}

const DynaExportPanelWithFormContext = props => (
  <FormContext.Consumer {...props}>
    {form => <DynaExportPanel {...props} formContext={form} />}
  </FormContext.Consumer>
);

export default DynaExportPanelWithFormContext;
