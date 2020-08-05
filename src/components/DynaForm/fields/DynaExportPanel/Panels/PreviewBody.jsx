import React, { useMemo, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import PanelLoader from '../../../../PanelLoader';
import Templates from '../Templates';
import { getPreviewBodyTemplateType } from '../../../../../utils/exportPanel';
import { resourceData } from '../../../../../reducers';

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
  const resource = useSelector(state =>
    resourceData(state, resourceType, resourceId).merged, shallowEqual
  );
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
        </>
      )}
      {resourceSampleData.status === 'error' && (
        <Templates.ErrorPanel resourceSampleData={resourceSampleData} />
      )}
    </div>
  );
}
