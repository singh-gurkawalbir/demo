import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { FormLabel, IconButton } from '@mui/material';
import { isBoolean } from 'lodash';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import FilterPanel from '../../AFE/Editor/panels/SalesforceLookupFilter';
import RefreshIcon from '../../icons/RefreshIcon';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';

const useStyles = makeStyles(theme => ({
  refreshFilters: {
    marginTop: theme.spacing(1),
    display: 'inline-block !important',
  },
}));

// eslint-disable-next-line camelcase
export default function DynaSalesforceLookupFilters_afe(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const {
    id,
    value,
    connectionId,
    data,
    options = {},
    onFieldChange,
    formKey,
    sObjectTypeFieldId,
  } = props;
  const editorId = 'sf-mappingLookupFilter';
  const { disableFetch: optionDisableFetch, commMetaPath: optionCommMetaData } = options;
  const sObjectTypeFieldValue = useSelector(state => selectors.formState(state, formKey)?.fields?.[sObjectTypeFieldId]?.value);
  const disableFetch = isBoolean(optionDisableFetch) ? optionDisableFetch : !sObjectTypeFieldValue;
  const commMetaPath = optionCommMetaData || (sObjectTypeFieldValue ? `salesforce/metadata/connections/${connectionId}/sObjectTypes/${sObjectTypeFieldValue}` : '');
  const isEditorInitialized = useSelector(state => selectors.editor(state, editorId).fieldId);

  useEffect(() => {
    dispatch(actions.editor.init(editorId, 'salesforceLookupFilter', {
      fieldId: id,
      rule: value,
      stage: 'importMappingExtract',
      data,
      wrapData: true,
    }));

    return () => dispatch(actions.editor.clear(editorId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filters = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId, commMetaPath, 'salesforce-recordType')?.data;

  useEffect(() => {
    if (!disableFetch && commMetaPath) {
      dispatch(actions.metadata.request(connectionId, commMetaPath));
    }
  }, [commMetaPath, connectionId, disableFetch, dispatch]);

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
      <div className={classes.refreshFilters}>
        <FormLabel required>Refresh search filters</FormLabel>
        <IconButton
          onClick={handleRefreshFiltersClick}
          data-test="refreshLookupFilters"
          size="small"
          color="inherit">
          <RefreshIcon />
        </IconButton>
      </div>
      {isEditorInitialized && (
      <FilterPanel
        id={id}
        editorId={editorId}
        filters={filters}
        onFieldChange={onFieldChange}
      />
      )}
    </>
  );
}
