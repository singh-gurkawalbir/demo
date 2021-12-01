import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import Spinner from '../../../../Spinner';
import RefreshIcon from '../../../../icons/RefreshIcon';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import { TextButton } from '../../../../Buttons';

const useStyles = makeStyles(theme => ({
  refreshFiltersButton: {
    minWidth: 0,
    padding: 0,
    marginLeft: theme.spacing(1),
  },
}));

export default function RefreshSearchFilters({ editorId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
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
      <Spinner centerAll />
    );
  }

  return (
    <>
      <div>
        <FormLabel disabled={disabled} required={required} >
          Refresh  search filters
        </FormLabel>
        {/* Todo: (Karthik) please check,there is no text in children in that case we can use the IconButton */}
        <TextButton
          disabled={disabled}
          data-test="refreshLookupFilters"
          className={classes.refreshFiltersButton}
          onClick={handleRefreshFiltersClick}>
          <RefreshIcon />
        </TextButton>
      </div>
    </>
  );
}
