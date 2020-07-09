import React, { useMemo, useEffect } from 'react';
import PanelLoader from '../../../../PanelLoader';
import Templates from '../Templates';
import { getPreviewBodyTemplateType } from '../../../../../utils/exportPanel';

export default function PreviewBody(props) {
  const {
    resourceSampleData,
    handlePanelViewChange,
    panelType,
    defaultPanel,
    availablePreviewStages,
    previewStageDataList,
    resource,
  } = props;
  const previewBodyTemplate = useMemo(
    () => getPreviewBodyTemplateType(resource, panelType),
    [panelType, resource]
  );

  // Always default to defaultPanel whenever sample data is refreshed
  useEffect(() => {
    if (resourceSampleData.status === 'received') {
      handlePanelViewChange(defaultPanel);
    }
  }, [resourceSampleData.status, defaultPanel, handlePanelViewChange]);

  return (
    <div>
      {resourceSampleData.status === 'requested' && (
        <PanelLoader />
      )}
      {resourceSampleData.status === 'received' && (
        <div>
          <Templates.HeaderPanel
            handlePanelViewChange={handlePanelViewChange}
            availablePreviewStages={availablePreviewStages}
            panelType={panelType}
          />
          {previewBodyTemplate === 'default' && (
            <Templates.DefaultPanel
              previewStageDataList={previewStageDataList}
              panelType={panelType}
            />
          )}
          {previewBodyTemplate === 'tab' && (
            <Templates.TabbedPanel
              previewStageDataList={previewStageDataList}
              panelType={panelType}
              key={panelType}
            />
          )}
        </div>
      )}
      {resourceSampleData.status === 'error' && (
        <Templates.ErrorPanel resourceSampleData={resourceSampleData} />
      )}
    </div>
  );
}
