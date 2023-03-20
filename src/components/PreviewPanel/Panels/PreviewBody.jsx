import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Templates from '../Templates';
import Spinner from '../../Spinner';
import PreviewBodyTabs from './PreviewBodyTabs';

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
    showDefaultPreviewBody = false,
  } = props;

  const classes = useStyles(props);

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
    </div>
  );
}
