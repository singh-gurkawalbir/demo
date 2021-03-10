import React, { useEffect, useCallback, useState, useMemo } from 'react';
import PanelLoader from '../../PanelLoader';
import Templates from '../Templates';
import { getPreviewBodyTemplateType, HTTP_STAGES, getFormattedPreviewData, getBodyHeaderFieldsForPreviewData } from '../../../utils/exportPanel';
import { selectors } from '../../../reducers';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { CeligoTabWrapper } from '../../CeligoTabLayout/CeligoTabWrapper';
import CeligoPillTabs from '../../CeligoTabLayout/CeligoPillTabs';
import DefaultPanel from '../../CeligoTabLayout/CustomPanels/DefaultPanel';
import RequestResponsePanel from '../../CeligoTabLayout/CustomPanels/RequestResponsePanel';
import CeligoTabPanel from '../../CeligoTabLayout/CeligoTabPanel';

export default function PreviewBody(props) {
  const {
    resourceSampleData,
    handlePanelViewChange,
    availablePreviewStages,
    previewStageDataList,
    resourceId,
    resourceType,
  } = props;
  // Default panel is the panel shown by default when export panel is launched
  // We can configure it in the metadata with 'default' as true
  // Else the last stage is taken as the default stage
  const defaultPanel = useMemo(() => {
    if (!availablePreviewStages.length) return;
    const defaultStage = availablePreviewStages.find(stage => stage.default === true);
    const lastStage = availablePreviewStages[availablePreviewStages.length - 1];

    return defaultStage ? defaultStage.value : lastStage.value;
  }, [availablePreviewStages]);
  const resource = useSelectorMemo(selectors.makeResourceDataSelector, resourceType, resourceId)?.merged;
  const [defaultTab, setDefaultTab] = useState();
  const panelContent = useCallback(panelType => {
    const previewBodyTemplate = getPreviewBodyTemplateType(resource, panelType);

    if (previewBodyTemplate === 'default') {
      return getFormattedPreviewData(previewStageDataList[panelType]);
    }
    if (previewBodyTemplate === 'tab') {
      return getBodyHeaderFieldsForPreviewData(
        previewStageDataList[panelType],
        panelType
      );
    }
  }, [previewStageDataList, resource]);

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
    <div>
      {resourceSampleData.status === 'requested' && (
        <PanelLoader />
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
                : <DefaultPanel value={panelContent('preview')} />}
            </CeligoTabPanel>
            <CeligoTabPanel panelId="request">
              <RequestResponsePanel value={panelContent('request')} />
            </CeligoTabPanel>
            <CeligoTabPanel panelId="raw">
              <RequestResponsePanel value={panelContent('raw')} />
            </CeligoTabPanel>
          </CeligoTabWrapper>
        </>
      )}
    </div>
  );
}
