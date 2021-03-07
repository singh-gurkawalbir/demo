import React, { useEffect, useMemo } from 'react';
import PanelLoader from '../../PanelLoader';
import Templates from '../Templates';
import { getPreviewBodyTemplateType, HTTP_STAGES, getFormattedPreviewData, getBodyHeaderFieldsForPreviewData } from '../../../utils/exportPanel';
import { selectors } from '../../../reducers';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import CeligoTabWrapper from '../../CeligoTabLayout/CeligoTabWrapper';
import CeligoTabs from '../../CeligoTabLayout/CeligoTabs';
import DefaultPanel from '../../CeligoTabLayout/CustomPanels/DefaultPanel';
import RequestResponsePanel from '../../CeligoTabLayout/CustomPanels/RequestResponsePanel';
import CeligoTabPanel from '../../CeligoTabLayout/CeligoTabPanel';

export default function PreviewBody(props) {
  const {
    resourceSampleData,
    handlePanelViewChange,
    panelType,
    defaultPanel,
    availablePreviewStages,
    previewStageDataList,
    resourceId,
    resourceType,
  } = props;
  const resource = useSelectorMemo(selectors.makeResourceDataSelector, resourceType, resourceId)?.merged;

  const previewBodyTemplate = getPreviewBodyTemplateType(resource, panelType);
  const panelContent = useMemo(() => {
    if (previewBodyTemplate === 'default') {
      return getFormattedPreviewData(previewStageDataList[panelType]);
    }
    if (previewBodyTemplate === 'tab') {
      return getBodyHeaderFieldsForPreviewData(
        previewStageDataList[panelType],
        panelType
      );
    }
  }, [panelType, previewStageDataList, previewBodyTemplate]);

  // Always default to defaultPanel whenever sample data is refreshed
  useEffect(() => {
    if (resourceSampleData.status === 'received') {
      handlePanelViewChange(defaultPanel);
    }
    if (resourceSampleData.status === 'error' && availablePreviewStages === HTTP_STAGES) {
      handlePanelViewChange('raw');
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
            <CeligoTabs
              tabs={availablePreviewStages}
              onChange={handlePanelViewChange}
              value={panelType}
            />
            <CeligoTabPanel value={panelType} panelId="preview">
              { resourceSampleData.status === 'error'
                ? <Templates.ErrorPanel resourceSampleData={resourceSampleData} availablePreviewStages={availablePreviewStages} />
                : <DefaultPanel value={panelContent} />}
            </CeligoTabPanel>
            <CeligoTabPanel value={panelType} panelId="request">
              <RequestResponsePanel value={panelContent} />
            </CeligoTabPanel>
            <CeligoTabPanel value={panelType} panelId="raw">
              <RequestResponsePanel value={panelContent} />
            </CeligoTabPanel>
          </CeligoTabWrapper>
        </>
      )}
    </div>
  );
}
