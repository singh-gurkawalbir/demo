import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { FormContext } from 'react-forms-processor/dist';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import { deepClone } from 'fast-json-patch';
import actions from '../../../../actions';
import {
  getResourceSampleDataWithStatus,
  getAvailableResourcePreviewStages,
  isPageGenerator,
  drawerOpened,
  makeResourceDataSelector,
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
    paddingBottom: 20,
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
        stageData[value] = deepClone(
          getResourceSampleDataWithStatus(state, resourceId, value)
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
