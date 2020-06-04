import React, { useMemo } from 'react';
import Spinner from '../../../../Spinner';
import Templates from '../Templates';
import { getPreviewBodyTemplateType } from '../../../../../utils/exportPanel';

export default function PreviewBody(props) {
  const {
    resourceSampleData,
    handlePanelViewChange,
    panelType,
    availablePreviewStages,
    previewStageDataList,
    resource,
  } = props;
  const previewBodyTemplate = useMemo(
    () => getPreviewBodyTemplateType(resource, panelType),
    [panelType, resource]
  );

  return (
    <div>
      {resourceSampleData.status === 'requested' && <Spinner />}
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
