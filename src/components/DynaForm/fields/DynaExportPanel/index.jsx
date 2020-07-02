import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { FormContext } from 'react-forms-processor/dist';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { deepClone } from 'fast-json-patch';
import actions from '../../../../actions';
import {
  getResourceSampleDataWithStatus,
  getAvailableResourcePreviewStages,
  isPageGenerator,
  drawerOpened,
  makeResourceDataSelector,
  isExportPreviewDisabled,
} from '../../../../reducers';
import { isNewId } from '../../../../utils/resource';
import Panels from './Panels';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';

const useStyles = makeStyles(theme => ({
  container: {
    paddingLeft: theme.spacing(3),
    width: 600,
    float: 'left',
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('xl')]: {
      width: `calc(100% - ${theme.spacing(3)}px)`,
    },
    [theme.breakpoints.up('xxl')]: {
      width: 880,
    },
  },
  previewDataHeading: {
    fontSize: 18,
  },
  drawerShift: {
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.down('lg')]: {
      maxWidth: 600,
    },
    [theme.breakpoints.down('md')]: {
      width: `calc(100% - ${theme.spacing(3)}px)`,
    },
  },
}));

function DynaExportPanel(props) {
  const { resourceId, formContext, resourceType, flowId } = props;
  const [isPreviewDataFetched, setIsPreviewDataFetched] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  const { merged: resource = {} } = useSelectorMemo(
    makeResourceDataSelector,
    resourceType,
    resourceId
  );
  const isPageGeneratorExport = useSelector(state =>
    isPageGenerator(state, flowId, resourceId)
  );
  const isPreviewDisabled = useSelector(state =>
    isExportPreviewDisabled(state, resourceId, resourceType));
  const availablePreviewStages = useSelector(state =>
    getAvailableResourcePreviewStages(state, resourceId, resourceType, flowId),
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
  // set the panel type with the default panel
  const [panelType, setPanelType] = useState(defaultPanel);
  // get the map of all the stages with their respective sampleData for the stages
  const previewStageDataList = useSelector(state => {
    const stageData = [];

    availablePreviewStages.length &&
      availablePreviewStages.forEach(({ value }) => {
        stageData[value] = deepClone(
          getResourceSampleDataWithStatus(state, resourceId, value)
        );
      });

    return stageData;
  }, shallowEqual);
  // get the default raw stage sampleData to track the status of the request
  // As the status is same for all the stages
  // TODO @Raghu : what if later on there is a need of individual status for each stage?
  const resourceSampleData = useSelector(state =>
    getResourceSampleDataWithStatus(state, resourceId, 'raw'),
  shallowEqual
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
    // Not fetched for online connections
    // TODO @Raghu: should we make a offline preview call though connection is offline ?
    // Needs a refactor to preview saga for that
    if (!isPreviewDisabled && !isPreviewDataFetched && !isNewId(resourceId)) {
      setIsPreviewDataFetched(true);
      fetchExportPreviewData();
    }
  }, [resourceId, isPreviewDataFetched, fetchExportPreviewData, isPreviewDisabled]);

  const handlePanelViewChange = useCallback(panelType => {
    setPanelType(panelType);
  }, []);
  const isDrawerOpened = useSelector(state => drawerOpened(state));

  return (
    <div
      className={clsx(classes.container, {
        [classes.drawerShift]: isDrawerOpened,
      })}>
      <Typography className={classes.previewDataHeading}>
        Preview data
      </Typography>
      <Panels.PreviewInfo
        fetchExportPreviewData={fetchExportPreviewData}
        resourceSampleData={resourceSampleData}
        previewStageDataList={previewStageDataList}
        panelType={panelType}
        disabled={isPreviewDisabled}
      />
      <Panels.PreviewBody
        resourceSampleData={resourceSampleData}
        previewStageDataList={previewStageDataList}
        panelType={panelType}
        availablePreviewStages={availablePreviewStages}
        handlePanelViewChange={handlePanelViewChange}
        resource={resource}
      />
    </div>
  );
}

const DynaExportPanelWithFormContext = props => (
  <FormContext.Consumer {...props}>
    {form => <DynaExportPanel {...props} formContext={form} />}
  </FormContext.Consumer>
);

export default DynaExportPanelWithFormContext;
