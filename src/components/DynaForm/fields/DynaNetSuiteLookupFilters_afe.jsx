/* eslint-disable camelcase */
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import FilterPanel from '../../AFE/Editor/panels/NetSuiteLookupFilter';
import Spinner from '../../Spinner';
import RefreshIcon from '../../icons/RefreshIcon';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { TextButton } from '../../Buttons';

const useStyles = makeStyles(theme => ({
  refreshFilters: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    flexDirection: 'row !important',
  },
  refreshFiltersButton: {
    minWidth: 0,
    padding: 0,
    marginLeft: theme.spacing(1),
  },
}));

const editorId = 'ns-mappingLookupFilter';

export default function DynaNetSuiteLookupFilters_afe(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const {
    id,
    value,
    connectionId,
    data,
    options = {},
    onFieldChange,
    required,
    disabled,
  } = props;
  const { disableFetch, commMetaPath } = options;
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
        <TextButton
          data-test="refreshLookupFilters"
          className={classes.refreshFiltersButton}
          onClick={handleRefreshFiltersClick}
          startIcon={<RefreshIcon />} />
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
