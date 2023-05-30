import { Typography, FormLabel } from '@mui/material';
import { useRouteMatch, useHistory } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Box, TextButton, TextToggle } from '@celigo/fuse-ui';
import actions from '../../actions';
import { selectors } from '../../reducers';
import Panels from './Panels';
import { DEFAULT_RECORD_SIZE, IMPORT_PREVIEW_ERROR_TYPES } from '../../utils/exportPanel';
import ActionGroup from '../ActionGroup';

import EditIcon from '../icons/EditIcon';
import CeligoDivider from '../CeligoDivider';
import FieldHelp from '../DynaForm/FieldHelp';
import MockInput from './MockInput';
import {drawerPaths, buildDrawerUrl} from '../../utils/rightDrawer';
import { adaptorTypeMap } from '../../utils/resource';
import { HTTP_BASED_ADAPTORS } from '../../utils/http';
import { getAsyncKey } from '../../utils/saveAndCloseButtons';
import { FORM_SAVE_STATUS } from '../../constants';
import useResourceFormSampleData from '../../hooks/useResourceFormSampleData';

function PreviewInfo({
  resourceId,
  formKey,
  resourceSampleData,
  previewStageDataList,
  showPreviewData,
  setShowPreviewData,
  resourceType,
  toggleValue,
  flowId,
}) {
  const dispatch = useDispatch();

  const fetchExportPreviewData = useCallback(customStartDate => {
    dispatch(actions.resourceFormSampleData.request(formKey, { refreshCache: true, customStartDate }));
  }, [
    dispatch,
    formKey,
  ]);

  const handlePreview = useCallback(customStartDate => {
    fetchExportPreviewData(customStartDate);
    setShowPreviewData(showPreviewData => ({...showPreviewData, [toggleValue]: true}));
  }, [fetchExportPreviewData, setShowPreviewData, toggleValue]);

  // on close of the panel, updates record size to default
  // remove this action, if in future we need to retain record size
  useEffect(() =>
    () => {
      dispatch(actions.resourceFormSampleData.updateRecordSize(resourceId, DEFAULT_RECORD_SIZE));
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  return (
    <Panels.PreviewInfo
      fetchExportPreviewData={handlePreview}
      resourceSampleData={resourceSampleData}
      previewStageDataList={previewStageDataList}
      formKey={formKey}
      resourceId={resourceId}
      showPreviewData={showPreviewData[toggleValue]}
      resourceType={resourceType}
      flowId={flowId}
  />
  );
}

export default function PreviewPanel({resourceId, formKey, resourceType, flowId }) {
  const match = useRouteMatch();
  const history = useHistory();
  const resource = useSelector(state => selectors.resourceData(state, resourceType, resourceId)?.merged);
  const {adaptorType, isLookup} = resource || {};
  const appType = adaptorTypeMap[adaptorType];
  const isBlobImport = resource?.resourceType === 'transferFiles' || resource?.type === 'blob' || resource?.blob;
  const isSendVisible = resourceType === 'imports' && !isBlobImport;
  const dispatch = useDispatch();
  const toggleValue = useSelector(state =>
    selectors.typeOfSampleData(state, resourceId)
  );
  const asyncTaskStatus = useSelector(state => selectors.asyncTaskStatus(state, getAsyncKey(resourceType, resourceId)));
  const [showPreviewData, setShowPreviewData] = useState({preview: false, send: false});

  const { availablePreviewStages, previewStageDataList, resourceSampleData } = useResourceFormSampleData(resourceType, resourceId, flowId);

  useEffect(() => {
    if (asyncTaskStatus === FORM_SAVE_STATUS.LOADING && !showPreviewData[toggleValue]) {
      setShowPreviewData(showPreviewData => ({...showPreviewData, [toggleValue]: true}));
    }
  }, [asyncTaskStatus, showPreviewData, toggleValue]);

  const onChange = useCallback((event, value) => {
    dispatch(actions.resourceFormSampleData.updateType(resourceId, value));
  }, [dispatch, resourceId]);

  const onEditorClick = useCallback(() => {
    history.push(buildDrawerUrl({path: drawerPaths.PREVIEW_PANEL_MOCK_INPUT, baseUrl: match.url}));
  }, [match.url, history]);

  const isEditMockInputAvailable = resourceType === 'imports' || (isLookup && HTTP_BASED_ADAPTORS.includes(appType));

  return (
    <div>
      <MockInput
        formKey={formKey}
        resourceId={resourceId}
        resourceType={resourceType}
        flowId={flowId}
      />
      <Box sx={{border: '1px solid', borderColor: theme => theme.palette.secondary.lightest, mb: 2 }}>
        <Typography sx={{fontSize: 18, p: 2, borderBottom: theme => `1px solid ${theme.palette.secondary.lightest}`, background: theme => theme.palette.background.paper}} >
          {isSendVisible ? (
            <Box sx={{display: 'flex', alignItems: 'flex-start'}}>
              <FormLabel sx={{mb: '6px', fontSize: 18 }}>Preview &amp; send</FormLabel>
              <FieldHelp
                id="previewandsend"
                helpKey="import.previewAndSend"
                label="Preview &amp; send" />
            </Box>
          ) : 'Preview data'}
        </Typography>

        <Box
          sx={{background: theme => theme.palette.background.paper,
            p: 2,
            height: theme => `calc((100vh - ${250}px) - ${theme.spacing(2)})`,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }} >
          {isEditMockInputAvailable ? (
            <Box sx={{display: 'flex', mb: 2}}>
              <ActionGroup position="right">
                <TextButton onClick={onEditorClick} startIcon={<EditIcon />}>
                  Edit mock input
                </TextButton>
                {isSendVisible ? (
                  <>
                    <CeligoDivider position="right" />
                    <TextToggle
                      value={toggleValue}
                      onChange={onChange}
                      options={IMPORT_PREVIEW_ERROR_TYPES}
                />
                  </>
                ) : ''}
              </ActionGroup>
            </Box>
          ) : ''}
          <PreviewInfo
            resourceSampleData={resourceSampleData}
            previewStageDataList={previewStageDataList}
            resourceId={resourceId}
            formKey={formKey}
            setShowPreviewData={setShowPreviewData}
            showPreviewData={showPreviewData}
            resourceType={resourceType}
            toggleValue={toggleValue}
            flowId={flowId}
          />

          <Panels.PreviewBody
            resourceSampleData={resourceSampleData}
            previewStageDataList={previewStageDataList}
            availablePreviewStages={availablePreviewStages}
            resourceId={resourceId}
            showDefaultPreviewBody={!showPreviewData[toggleValue]}
            resourceType={resourceType}
          />
        </Box>
      </Box>
    </div>
  );
}
