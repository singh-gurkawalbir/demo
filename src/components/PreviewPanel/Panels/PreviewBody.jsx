import React from 'react';
import {Box, Spinner } from '@celigo/fuse-ui';
import Templates from '../Templates';
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
        <Spinner center="screen" />
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
