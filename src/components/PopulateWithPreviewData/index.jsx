import React, { useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { Spinner } from '@celigo/fuse-ui';
import actions from '../../actions';
import { selectors } from '../../reducers';
import FieldHelp from '../DynaForm/FieldHelp';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import { getAsyncKey } from '../../utils/saveAndCloseButtons';
import { DEFAULT_RECORD_SIZE, getParsedData } from '../../utils/exportPanel';
import messageStore, { message } from '../../utils/messageStore';
import ButtonWithTooltip from '../Buttons/ButtonWithTooltip';
import useClearAsyncStateOnUnmount from '../SaveAndCloseButtonGroup/hooks/useClearAsyncStateOnUnmount';
import useResourceFormSampleData from '../../hooks/useResourceFormSampleData';
import TextButton from '../Buttons/TextButton';
import responseMappingUtil from '../../utils/responseMapping';
import { emptyObject } from '../../constants';

const useStyles = makeStyles(() => ({
  previewButton: {
    padding: 0,
  },
}));

export default function PopulateWithPreviewData({
  formKey,
  resourceId,
  flowId,
  resourceType,
  updateMockDataContent,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [enquesnackbar] = useEnqueueSnackbar();
  const isImport = resourceType === 'imports';

  const fieldId = isImport ? 'mockResponse' : 'mockOutput';

  const isPreviewDisabled = useSelector(state =>
    selectors.isExportPreviewDisabled(state, formKey));

  const isPreviewPanelAvailableForResource = useSelector(state =>
  // Returns a bool whether the resource has a preview panel or not
    selectors.isPreviewPanelAvailableForResource(
      state,
      resourceId,
      resourceType,
      flowId
    )
  );

  let helpKey = 'populateMockOutput';

  if (isImport && isPreviewPanelAvailableForResource) {
    helpKey = 'populateMockResponse';
  } else if (isImport) {
    helpKey = 'populateMockResponseWithSampleData';
  }

  const buttonLabel = (isImport && !isPreviewPanelAvailableForResource) ? 'Populate with sample response data' : 'Populate with preview data';

  const { previewStageDataList, resourceSampleData } = useResourceFormSampleData(resourceType, resourceId, flowId);
  const {status: resourceSampleDataStatus} = resourceSampleData;
  const adaptorType = useSelector(state => {
    const resource = selectors.resourceData(state, resourceType, resourceId)?.merged || emptyObject;

    return resource.adaptorType;
  });
  const [isPreviewRequested, setIsPreviewRequested] = useState(false);
  const asyncKey = getAsyncKey(resourceType, resourceId);
  const fieldName = useSelector(state => selectors.fieldState(state, formKey, fieldId))?.label;

  const handlePopulateMockResponseWithSampleData = useCallback(() => {
    setIsPreviewRequested(false);
    // response mapping default input is used as sample response for imports
    // hence using the same to populate the mock response field
    const previewData = [responseMappingUtil.getResponseMappingDefaultInput(resourceType, {}, adaptorType)];

    dispatch(actions.form.fieldChange(formKey)(fieldId, previewData));
    enquesnackbar({message: messageStore('POPULATE_WITH_PREVIEW_DATA.SUCCESS', {fieldName, dataType: 'sample data'})});
  }, [adaptorType, dispatch, enquesnackbar, fieldId, fieldName, formKey, resourceType]);

  const handleClick = useCallback(e => {
    e.stopPropagation();
    setIsPreviewRequested(true);

    if (isImport) { dispatch(actions.resourceFormSampleData.updateType(resourceId, 'send')); }

    if (!isPreviewPanelAvailableForResource && isImport) {
      handlePopulateMockResponseWithSampleData();

      return;
    }

    dispatch(actions.resourceFormSampleData.request(formKey, { refreshCache: true, asyncKey }));
  }, [asyncKey, dispatch, formKey, handlePopulateMockResponseWithSampleData, isImport, isPreviewPanelAvailableForResource, resourceId]);

  useClearAsyncStateOnUnmount(asyncKey);

  useEffect(() => {
    if (isPreviewRequested && resourceSampleDataStatus === 'error') {
      setIsPreviewRequested(false);
      enquesnackbar({message: messageStore('POPULATE_WITH_PREVIEW_DATA.FAILED', {fieldName: fieldName?.toLowerCase()}), variant: 'error'});
    }
  }, [enquesnackbar, fieldName, isPreviewRequested, resourceSampleDataStatus]);

  useEffect(() => {
    if (isPreviewRequested && resourceSampleDataStatus === 'received') {
      setIsPreviewRequested(false);
      // get first 10 records from preview data
      const previewData = getParsedData(resourceType, previewStageDataList, DEFAULT_RECORD_SIZE);

      // updateMockDataContent updates the content of mock data drawer
      // when populate with preview data is requested
      if (typeof updateMockDataContent === 'function') {
        updateMockDataContent(previewData);
      } else {
        dispatch(actions.form.fieldChange(formKey)(fieldId, previewData));
      }
      enquesnackbar({message: messageStore('POPULATE_WITH_PREVIEW_DATA.SUCCESS', {fieldName, dataType: 'preview data'})});
    }
  }, [dispatch, enquesnackbar, fieldId, fieldName, formKey, isImport, isPreviewRequested, previewStageDataList, resourceSampleDataStatus, resourceType, updateMockDataContent]);

  // if preview panel is not supported for export, populate with preview cannot be supported
  if (!isImport && !isPreviewPanelAvailableForResource) return null;

  const disablePreview = isPreviewDisabled || isPreviewRequested || resourceSampleDataStatus === 'requested';

  return (
    <div>
      <ButtonWithTooltip
        tooltipProps={{
          title: isPreviewDisabled ? message.POPULATE_WITH_PREVIEW_DATA.DISABLED : '',
          placement: 'bottom-start'}}>
        <TextButton
          startIcon={isPreviewRequested ? (
            <Spinner size="small" />
          ) : null}
          className={classes.previewButton}
          data-test={helpKey}
          disabled={disablePreview}
          onClick={handleClick}
          size="small">
          {buttonLabel}
        </TextButton>
      </ButtonWithTooltip>
      <FieldHelp
        helpKey={helpKey}
        label={buttonLabel}
        noApi
      />
    </div>
  );
}
