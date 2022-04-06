/* eslint-disable camelcase */
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { FormLabel } from '@material-ui/core';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import FilterPanel from '../../AFE/Editor/panels/SalesforceLookupFilter';
import Spinner from '../../Spinner';
import RefreshIcon from '../../icons/RefreshIcon';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { TextButton } from '../../Buttons';

const useStyles = makeStyles(theme => ({
  refreshFilters: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: 'inline-block !important',
  },
  refreshFiltersButton: {
    minWidth: 0,
    padding: theme.spacing(0, 1),
  },

}));

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
  } = props;
  const editorId = 'sf-mappingLookupFilter';
  const { disableFetch, commMetaPath } = options;
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
        <FormLabel required>
          Refresh search filters
        </FormLabel>
        <TextButton
          startIcon={<RefreshIcon />}
          data-test="refreshLookupFilters"
          className={classes.refreshFiltersButton}
          onClick={handleRefreshFiltersClick} />
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
