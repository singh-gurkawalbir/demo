import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Box } from '@celigo/fuse-ui';
import Templates from '../Templates';
import { HTTP_STAGES, getLatestReqResData, getParsedData } from '../../../utils/exportPanel';
import { CeligoTabWrapper } from '../../CeligoTabLayout/CeligoTabWrapper';
import CeligoPillTabs from '../../CeligoTabLayout/CeligoPillTabs';
import DefaultPanel from '../../CeligoTabLayout/CustomPanels/DefaultPanel';
import RequestResponsePanel from '../../CeligoTabLayout/CustomPanels/RequestResponsePanel';
import CeligoTabPanel from '../../CeligoTabLayout/CeligoTabPanel';
import {selectors} from '../../../reducers';

export default function PreviewBodyTabs({
  resourceSampleData,
  handlePanelViewChange,
  availablePreviewStages,
  previewStageDataList,
  resourceId,
  resourceType,
  showDefaultPreviewBody = false,
}) {
  const [defaultTab, setDefaultTab] = useState();
  const activeSendOrPreviewTab = useSelector(state => selectors.typeOfSampleData(state, resourceId));
  // Default panel is the panel shown by default when export panel is launched
  // We can configure it in the metadata with 'default' as true
  // Else the last stage is taken as the default stage
  const defaultPanel = useMemo(() => {
    if (!availablePreviewStages.length) return;
    if (resourceType === 'imports') return activeSendOrPreviewTab === 'preview' ? 'request' : 'raw';
    const defaultStage = availablePreviewStages.find(stage => stage.default === true);
    const lastStage = availablePreviewStages[availablePreviewStages.length - 1];

    return defaultStage ? defaultStage.value : lastStage.value;
  }, [activeSendOrPreviewTab, availablePreviewStages, resourceType]);

  const parseAllErrors = useSelector(state => selectors.getAllParsableErrors(state, resourceId), shallowEqual);

  const shouldShowParseTab = !!parseAllErrors;

  // Always default to defaultPanel whenever sample data is refreshed
  useEffect(() => {
    if (resourceSampleData.status === 'received') {
      setDefaultTab(defaultPanel);
    }

    if (resourceSampleData.status === 'error') {
      if (shouldShowParseTab) {
        return setDefaultTab('preview');
      }
      if (resourceType === 'imports' && activeSendOrPreviewTab === 'preview') {
        return setDefaultTab('request');
      }
      if (availablePreviewStages === HTTP_STAGES) {
        return setDefaultTab('raw');
      }
    }
  }, [resourceSampleData.status, defaultPanel, handlePanelViewChange, availablePreviewStages, shouldShowParseTab, activeSendOrPreviewTab, resourceType]);

  if (showDefaultPreviewBody) {
    return (
      <CeligoTabWrapper>
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}>
          <CeligoPillTabs tabs={availablePreviewStages} defaultTab={defaultTab} />
          <CeligoTabPanel panelId="preview"> <DefaultPanel isLoggable={false} /> </CeligoTabPanel>
          <CeligoTabPanel panelId="request"> <RequestResponsePanel variant="previewPanel" /> </CeligoTabPanel>
          <CeligoTabPanel panelId="raw"> <RequestResponsePanel variant="previewPanel" /> </CeligoTabPanel>
        </Box>
      </CeligoTabWrapper>
    );
  }

  return (
    <CeligoTabWrapper>
      <CeligoPillTabs tabs={availablePreviewStages} defaultTab={defaultTab} />
      <CeligoTabPanel panelId="preview">
        { resourceSampleData.status === 'error'
          ? <Templates.ErrorPanel resourceId={resourceId} />
          : <DefaultPanel isLoggable={false} value={getParsedData(resourceType, previewStageDataList)} /> }
      </CeligoTabPanel>
      <CeligoTabPanel panelId="request">
        <RequestResponsePanel value={getLatestReqResData(previewStageDataList, 'request')} variant="previewPanel" />
      </CeligoTabPanel>
      <CeligoTabPanel panelId="raw">
        <RequestResponsePanel value={getLatestReqResData(previewStageDataList, 'raw')} variant="previewPanel" />
      </CeligoTabPanel>
    </CeligoTabWrapper>
  );
}
