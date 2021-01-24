import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../reducers';
import Panels from './Panels';
import { DEFAULT_RECORD_SIZE } from '../../utils/exportPanel';

const useStyles = makeStyles(theme => ({
  previewPanelWrapper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  container: {
    background: theme.palette.common.white,
    padding: theme.spacing(2),
    width: '100%',
    height: `calc(100vh - ${150}px)`,
    overflowY: 'auto',
    float: 'left',
    marginRight: theme.spacing(3),
  },
  previewDataHeading: {
    fontSize: 18,
    padding: theme.spacing(2, 2, 1, 2),
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    background: theme.palette.background.paper,
  },

}));

function PreviewInfo({
  flowId,
  resourceId,
  formKey,
  resourceType,
  resourceSampleData,
  previewStageDataList,
  isPreviewDisabled,
  showPreviewData,
  setShowPreviewData,
}) {
  const value = useSelector(
    state => selectors.formState(state, formKey)?.value,
    shallowEqual
  );
  const dispatch = useDispatch();
  const isPageGeneratorExport = useSelector(state =>
    selectors.isPageGenerator(state, flowId, resourceId)
  );
  // const [isPreviewDataFetched, setIsPreviewDataFetched] = useState(false);

  const fetchExportPreviewData = useCallback(() => {
    // Just a fail safe condition not to request for sample data incase of not exports
    if (resourceType !== 'exports') return;

    // Note: If there is no flowId , it is a Standalone export as the resource type other than exports are restricted above
    if (!flowId || isPageGeneratorExport) {
      dispatch(
        actions.sampleData.request(resourceId, resourceType, value)
      );
    } else {
      dispatch(
        actions.sampleData.requestLookupPreview(resourceId, flowId, value)
      );
    }
  }, [
    isPageGeneratorExport,
    dispatch,
    resourceId,
    resourceType,
    value,
    flowId,
  ]);

  const handlePreview = useCallback(() => {
    fetchExportPreviewData();
    setShowPreviewData(true);
  }, [fetchExportPreviewData, setShowPreviewData]);

  // useEffect(() => {
  //   // Fetches preview data incase of initial load of an edit export mode
  //   // Not fetched for online connections
  //   // TODO @Raghu: should we make a offline preview call though connection is offline ?
  //   // Needs a refactor to preview saga for that
  //   if (!isPreviewDisabled && !isPreviewDataFetched && !isNewId(resourceId)) {
  //     setIsPreviewDataFetched(true);
  //     handlePreview();
  //   }
  // }, [resourceId, isPreviewDataFetched, handlePreview, isPreviewDisabled]);

  // on close of the panel, updates record size to default
  // remove this action, if in future we need to retain record size
  useEffect(() =>
    () => dispatch(actions.sampleData.patch(resourceId, {
      recordSize: DEFAULT_RECORD_SIZE,
    })),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  return (
    <Panels.PreviewInfo
      fetchExportPreviewData={handlePreview}
      resourceSampleData={resourceSampleData}
      previewStageDataList={previewStageDataList}
      disabled={isPreviewDisabled}
      resourceId={resourceId}
      resourceType={resourceType}
      showPreviewData={showPreviewData}
  />
  );
}

function ExportsPreviewPanel({resourceId, formKey, resourceType, flowId }) {
  const classes = useStyles();

  const isPreviewDisabled = useSelector(state =>
    selectors.isExportPreviewDisabled(state, resourceId, resourceType));
  const availablePreviewStages = useSelector(state =>
    selectors.getAvailableResourcePreviewStages(state, resourceId, resourceType, flowId),
  shallowEqual
  );
  // Default panel is the panel shown by default when export panel is launched
  // We can configure it in the metadata with 'default' as true
  // Else the last stage being the Parse stage till now is taken as the default stage
  const defaultPanel = useMemo(() => {
    if (!availablePreviewStages.length) return;
    const defaultStage = availablePreviewStages.find(stage => stage.default === true);
    const lastStage = availablePreviewStages[availablePreviewStages.length - 1];

    return defaultStage ? defaultStage.value : lastStage.value;
  }, [availablePreviewStages]);
  // TODO @Raghu: Refactor preview state as it is currently using sample data state
  // this local state controls view to show sample data only when user requests by clicking preview
  const [showPreviewData, setShowPreviewData] = useState(false);
  // set the panel type with the default panel
  const [panelType, setPanelType] = useState(defaultPanel);
  // get the map of all the stages with their respective sampleData for the stages
  const previewStages = useMemo(() => availablePreviewStages.map(({value}) => value), [availablePreviewStages]);

  const previewStageDataList = useSelectorMemo(selectors.mkPreviewStageDataList, resourceId, previewStages);

  // get the default raw stage sampleData to track the status of the request
  // As the status is same for all the stages
  // TODO @Raghu : what if later on there is a need of individual status for each stage?
  const resourceSampleData = useSelector(state =>
    selectors.getResourceSampleDataWithStatus(state, resourceId, 'raw'),
  shallowEqual
  );

  const handlePanelViewChange = useCallback(panelType => {
    setPanelType(panelType);
  }, []);

  return (
    <div
      className={classes.previewPanelWrapper}>
      <Typography className={classes.previewDataHeading}>
        Preview data
      </Typography>
      <div className={classes.container}>
        <PreviewInfo
          resourceSampleData={resourceSampleData}
          previewStageDataList={previewStageDataList}
          isPreviewDisabled={isPreviewDisabled}
          flowId={flowId}
          resourceId={resourceId}
          formKey={formKey}
          resourceType={resourceType}
          setShowPreviewData={setShowPreviewData}
          showPreviewData={showPreviewData}
      />
        {
        showPreviewData && (
        <Panels.PreviewBody
          resourceSampleData={resourceSampleData}
          previewStageDataList={previewStageDataList}
          panelType={panelType}
          defaultPanel={defaultPanel}
          availablePreviewStages={availablePreviewStages}
          handlePanelViewChange={handlePanelViewChange}
          resourceId={resourceId}
          resourceType={resourceType}
      />
        )
}
      </div>
    </div>
  );
}

export default ExportsPreviewPanel;
