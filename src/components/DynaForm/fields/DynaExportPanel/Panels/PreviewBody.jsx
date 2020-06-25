import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Spinner from '../../../../Spinner';
import Templates from '../Templates';
import { getPreviewBodyTemplateType } from '../../../../../utils/exportPanel';

const useStyles = makeStyles({
  spinnerWrapper: {
    display: 'flex',
    height: '100%',
    '&> div:first-child': {
      margin: 'auto',
    },
  },
});
export default function PreviewBody(props) {
  const {
    resourceSampleData,
    handlePanelViewChange,
    panelType,
    availablePreviewStages,
    previewStageDataList,
    resource,
  } = props;
  const classes = useStyles();
  const previewBodyTemplate = useMemo(
    () => getPreviewBodyTemplateType(resource, panelType),
    [panelType, resource]
  );

  return (
    <div>
      {resourceSampleData.status === 'requested' && (
        <div className={classes.spinnerWrapper}>
          <Spinner size={48} color="primary" />
        </div>
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
