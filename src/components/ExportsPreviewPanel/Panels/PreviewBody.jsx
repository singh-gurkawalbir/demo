import React, { useEffect } from 'react';
import PanelLoader from '../../PanelLoader';
import Templates from '../Templates';
import { getPreviewBodyTemplateType, HTTP_STAGES } from '../../../utils/exportPanel';
import { selectors } from '../../../reducers';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';

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
          <Templates.HeaderPanel
            handlePanelViewChange={handlePanelViewChange}
            availablePreviewStages={availablePreviewStages}
            panelType={panelType}
          />
          {previewBodyTemplate === 'default' && (
            <>
                { resourceSampleData.status === 'error'
                  ? <Templates.ErrorPanel resourceSampleData={resourceSampleData} availablePreviewStages={availablePreviewStages} />
                  : <Templates.DefaultPanel previewStageDataList={previewStageDataList} panelType={panelType} />}
            </>
          )}
          {previewBodyTemplate === 'tab' && (
            <Templates.TabbedPanel
              previewStageDataList={previewStageDataList}
              panelType={panelType}
              key={panelType}
            />
          )}
        </>
      )}
    </div>
  );
}
