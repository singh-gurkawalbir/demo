import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import FormLabel from '@mui/material/FormLabel';
import { IconButton } from '@mui/material';
import {
  isBoolean,
} from 'lodash';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import FilterPanel from '../../AFE/Editor/panels/NetSuiteLookupFilter';
import RefreshIcon from '../../icons/RefreshIcon';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';

const useStyles = makeStyles(theme => ({
  refreshFilters: {
    marginTop: theme.spacing(1),
    flexDirection: 'row !important',
  },
}));

const editorId = 'ns-mappingLookupFilter';

// eslint-disable-next-line camelcase
export default function DynaNetSuiteLookupFilters_afe(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const {
    id,
    value,
    connectionId,
    data,
    options = {},
    recordTypeFieldId,
    formKey,
    onFieldChange,
    required,
    disabled,
  } = props;

  const { disableFetch: optionDisableFetch, commMetaPath: optionCommMetaPath } = options;
  const recordTypeFieldValue = useSelector(state => selectors.formState(state, formKey)?.fields?.[recordTypeFieldId]?.value);
  const disableFetch = isBoolean(optionDisableFetch) ? optionDisableFetch : !recordTypeFieldValue;
  const commMetaPath = optionCommMetaPath || (recordTypeFieldValue ? `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${recordTypeFieldValue}/searchFilters?includeJoinFilters=true` : '');
  const isEditorInitialized = useSelector(state => selectors.editor(state, editorId).fieldId);

  useEffect(() => {
    dispatch(actions.editor.init(editorId, 'netsuiteLookupFilter', {
      fieldId: id,
      rule: value,
      stage: 'importMappingExtract',
      data,
      wrapData: true,
    }));

    return () => dispatch(actions.editor.clear(editorId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filters = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId, commMetaPath)?.data;

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
        <FormLabel disabled={disabled} required={required} >
          Refresh  search filters
        </FormLabel>
        <IconButton
          data-test="refreshLookupFilters"
          onClick={handleRefreshFiltersClick}
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
