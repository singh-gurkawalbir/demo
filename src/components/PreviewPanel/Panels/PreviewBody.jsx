import React, { useEffect, useState, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, shallowEqual } from 'react-redux';
import Templates from '../Templates';
import { HTTP_STAGES, getLatestReqResData } from '../../../utils/exportPanel';
import { wrapExportFileSampleData } from '../../../utils/sampleData';
import { CeligoTabWrapper } from '../../CeligoTabLayout/CeligoTabWrapper';
import CeligoPillTabs from '../../CeligoTabLayout/CeligoPillTabs';
import DefaultPanel from '../../CeligoTabLayout/CustomPanels/DefaultPanel';
import RequestResponsePanel from '../../CeligoTabLayout/CustomPanels/RequestResponsePanel';
import CeligoTabPanel from '../../CeligoTabLayout/CeligoTabPanel';
import Spinner from '../../Spinner';
import {selectors} from '../../../reducers';

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
  const [defaultTab, setDefaultTab] = useState();
  const activeSendOrPreviewTab = useSelector(state => selectors.typeOfSampleData(state, resourceId));
  // Default panel is the panel shown by default when export panel is launched
  // We can configure it in the metadata with 'default' as true
  // Else the last stage is taken as the default stage
  const defaultPanel = useMemo(() => {
    if (!availablePreviewStages.length) return;
    if (resourceType === 'imports') return activeSendOrPreviewTab === 'preview' ? 'request' : 'raw';
    const defaultStage = availablePreviewStages.find(stage => stage.default === true);
    const lastStage = availablePreviewStages[availablePreviewStages.length - 1];

    return defaultStage ? defaultStage.value : lastStage.value;
  }, [activeSendOrPreviewTab, availablePreviewStages, resourceType]);
  const parseAllErrors = useSelector(state => selectors.getAllParsableErrors(state, resourceId), shallowEqual);
  const shouldShowParseTab = !!parseAllErrors;

  // Always default to defaultPanel whenever sample data is refreshed
  useEffect(() => {
    if (resourceSampleData.status === 'received') {
      setDefaultTab(defaultPanel);
    }

    if (resourceSampleData.status === 'error') {
      if (activeSendOrPreviewTab === 'preview') return 'request';
      if (shouldShowParseTab) {
        return setDefaultTab('preview');
      }
      if (availablePreviewStages === HTTP_STAGES) {
        return setDefaultTab('raw');
      }
    }
  }, [resourceSampleData.status, defaultPanel, handlePanelViewChange, availablePreviewStages, shouldShowParseTab, activeSendOrPreviewTab]);

  if (showDefaultPreviewBody) {
    return (
      <>
        <Templates.RequestUrlPanel
          showEmptyPanel
          resourceId={resourceId}
          resourceType={resourceType} />
        <CeligoTabWrapper>
          <CeligoPillTabs tabs={availablePreviewStages} defaultTab={defaultTab} />
          <CeligoTabPanel panelId="preview"> <DefaultPanel isLoggable={false} /> </CeligoTabPanel>
          <CeligoTabPanel panelId="request"> <RequestResponsePanel variant="previewPanel" /> </CeligoTabPanel>
          <CeligoTabPanel panelId="raw"> <RequestResponsePanel variant="previewPanel" /> </CeligoTabPanel>
        </CeligoTabWrapper>
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
          <CeligoTabWrapper>
            <CeligoPillTabs tabs={availablePreviewStages} defaultTab={defaultTab} />
            <CeligoTabPanel panelId="preview">
              { resourceSampleData.status === 'error'
                ? <Templates.ErrorPanel resourceId={resourceId} />
                : <DefaultPanel isLoggable={false} value={wrapExportFileSampleData(previewStageDataList.preview?.data)} /> }
            </CeligoTabPanel>
            <CeligoTabPanel panelId="request">
              <RequestResponsePanel value={getLatestReqResData(previewStageDataList, 'request')} variant="previewPanel" />
            </CeligoTabPanel>
            <CeligoTabPanel panelId="raw">
              <RequestResponsePanel value={getLatestReqResData(previewStageDataList, 'raw')} variant="previewPanel" />
            </CeligoTabPanel>
          </CeligoTabWrapper>
        </>
      )}
    </div>
  );
}
