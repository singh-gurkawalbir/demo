import React from 'react';
import {Box} from '@celigo/fuse-ui';
import Templates from '../Templates';
import Spinner from '../../Spinner';
import PreviewBodyTabs from './PreviewBodyTabs';

export default function PreviewBody(props) {
  const {
    resourceSampleData,
    handlePanelViewChange,
    availablePreviewStages,
    previewStageDataList,
    resourceId,
    resourceType,
    showDefaultPreviewBody = false,
  } = props;

  if (showDefaultPreviewBody) {
    return (
      <>
        <Templates.RequestUrlPanel
          showEmptyPanel
          resourceId={resourceId}
          resourceType={resourceType}
        />
        <PreviewBodyTabs
          resourceSampleData={resourceSampleData}
          handlePanelViewChange={handlePanelViewChange}
          availablePreviewStages={availablePreviewStages}
          previewStageDataList={previewStageDataList}
          resourceId={resourceId}
          resourceType={resourceType}
          showDefaultPreviewBody={showDefaultPreviewBody}
        />
      </>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        position: 'relative',
      }}>
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
          <PreviewBodyTabs
            resourceSampleData={resourceSampleData}
            handlePanelViewChange={handlePanelViewChange}
            availablePreviewStages={availablePreviewStages}
            previewStageDataList={previewStageDataList}
            resourceId={resourceId}
            resourceType={resourceType}
          />
        </>
      )}
    </Box>
  );
}
