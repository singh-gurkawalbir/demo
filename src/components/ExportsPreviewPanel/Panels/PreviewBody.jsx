import React, { useEffect, useState, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Templates from '../Templates';
import { HTTP_STAGES } from '../../../utils/exportPanel';
import { wrapExportFileSampleData } from '../../../utils/sampleData';
import { CeligoTabWrapper } from '../../CeligoTabLayout/CeligoTabWrapper';
import CeligoPillTabs from '../../CeligoTabLayout/CeligoPillTabs';
import DefaultPanel from '../../CeligoTabLayout/CustomPanels/DefaultPanel';
import RequestResponsePanel from '../../CeligoTabLayout/CustomPanels/RequestResponsePanel';
import CeligoTabPanel from '../../CeligoTabLayout/CeligoTabPanel';
import Spinner from '../../Spinner';

const useStyles = makeStyles({
  previewBodyContainer: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    position: 'relative',
  },
});

export default function PreviewBody(props) {
  const {
    resourceSampleData,
    handlePanelViewChange,
    availablePreviewStages,
    previewStageDataList,
    resourceId,
    resourceType,
  } = props;

  const classes = useStyles(props);
  const [defaultTab, setDefaultTab] = useState();

  // Default panel is the panel shown by default when export panel is launched
  // We can configure it in the metadata with 'default' as true
  // Else the last stage is taken as the default stage
  const defaultPanel = useMemo(() => {
    if (!availablePreviewStages.length) return;
    const defaultStage = availablePreviewStages.find(stage => stage.default === true);
    const lastStage = availablePreviewStages[availablePreviewStages.length - 1];

    return defaultStage ? defaultStage.value : lastStage.value;
  }, [availablePreviewStages]);

  // Always default to defaultPanel whenever sample data is refreshed
  useEffect(() => {
    if (resourceSampleData.status === 'received') {
      setDefaultTab(defaultPanel);
    }
    if (resourceSampleData.status === 'error' && availablePreviewStages === HTTP_STAGES) {
      setDefaultTab('raw');
    }
  }, [resourceSampleData.status, defaultPanel, handlePanelViewChange, availablePreviewStages]);

  return (
    <div className={classes.previewBodyContainer}>
      {resourceSampleData.status === 'requested' && (
        <Spinner centerAll />
      )}
      {['received', 'error'].includes(resourceSampleData.status) && (
        <>
          <Templates.RequestUrlPanel
            previewStageDataList={previewStageDataList}
            resourceId={resourceId}
            resourceType={resourceType}
          />
          <CeligoTabWrapper>
            <CeligoPillTabs tabs={availablePreviewStages} defaultTab={defaultTab} />
            <CeligoTabPanel panelId="preview">
              { resourceSampleData.status === 'error'
                ? <Templates.ErrorPanel resourceSampleData={resourceSampleData} availablePreviewStages={availablePreviewStages} />
                : <DefaultPanel value={wrapExportFileSampleData(previewStageDataList.preview?.data)} /> }
            </CeligoTabPanel>
            <CeligoTabPanel panelId="request">
              <RequestResponsePanel value={previewStageDataList.request?.data?.[0]} variant="previewPanel" />
            </CeligoTabPanel>
            <CeligoTabPanel panelId="raw">
              <RequestResponsePanel value={previewStageDataList.raw?.data?.[0]} variant="previewPanel" />
            </CeligoTabPanel>
          </CeligoTabWrapper>
        </>
      )}
    </div>
  );
}
