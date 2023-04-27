import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import FormLabel from '@mui/material/FormLabel';
import { IconButton } from '@mui/material';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import RefreshIcon from '../../../../icons/RefreshIcon';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';

export default function RefreshSearchFilters({ editorId }) {
  const dispatch = useDispatch();
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const {resourceType, formKey, resourceId, fieldId, editorType} = useSelector(state => {
    const e = selectors.editor(state, editorId);

    return {resourceType: e.resourceType,
      formKey: e.formKey,
      resourceId: e.resourceId,
      flowId: e.flowId,
      fieldId: e.fieldId,
      editorType: e.editorType,
    };
  }, shallowEqual);
  const customOptions = useSelector(state => selectors.editor(state, editorId).customOptions, shallowEqual);

  const connectionId = useSelector(state => {
    const { merged: resourceData} = selectors.resourceData(state, resourceType, resourceId);

    return resourceData?._connectionId;
  });

  const fieldState = useSelector(state => selectors.fieldState(state, formKey, fieldId));
  const {required, options = {}} = fieldState || {};

  // for IAs, options are passed via component and not stored in field state
  const { disableFetch, commMetaPath } = customOptions || options;
  let filterKey;

  if (editorType === 'salesforceLookupFilter' || editorType === 'salesforceQualificationCriteria') {
    filterKey = 'salesforce-recordType';
  } else if (editorType === 'netsuiteQualificationCriteria') {
    filterKey = 'suitescript-bodyField';
  }

  const filters = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId, commMetaPath, filterKey)?.data;

  useEffect(() => {
    if (!disableFetch && commMetaPath) {
      dispatch(actions.metadata.request(connectionId, commMetaPath));
    }
  }, [commMetaPath, connectionId, disableFetch, dispatch]);
  useEffect(() => {
    if (filters) {
      dispatch(actions.editor.patchFeatures(editorId, { filters }));
    }
  }, [dispatch, editorId, filters]);

  const handleRefreshFiltersClick = useCallback(() => {
    if (!disableFetch && commMetaPath) {
      dispatch(
        actions.metadata.request(connectionId, commMetaPath, {
          refreshCache: true,
        })
      );
    }
  }, [commMetaPath, connectionId, disableFetch, dispatch]);

  if (!filters) {
    return (
      <Spinner />
    );
  }

  return (
    <>
      <div>
        <FormLabel disabled={disabled} required={required} >
          Refresh  search filters
        </FormLabel>
        <IconButton
          disabled={disabled}
          data-test="refreshLookupFilters"
          onClick={handleRefreshFiltersClick}
          size="small"
          color="inherit">
          <RefreshIcon />
        </IconButton>
      </div>
    </>
  );
}
