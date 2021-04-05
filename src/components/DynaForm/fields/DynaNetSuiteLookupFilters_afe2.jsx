/* eslint-disable camelcase */
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import FilterPanel from '../../AFE2/Editor/panels/NetSuiteLookupFilter';
import Spinner from '../../Spinner';
import RefreshIcon from '../../icons/RefreshIcon';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';

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
  loading: {
    display: 'flex',
    flexDirection: 'row !important',
    alignItems: 'center',
    padding: theme.spacing(1, 0),
  },
  heading: {
    paddingRight: theme.spacing(1),
  },
}));

export default function DynaNetSuiteLookupFilters_afe2(props) {
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
  const editorId = 'ns-mappingLookupFilter';
  const { disableFetch, commMetaPath } = options;
  const isEditorInitialized = useSelector(state => selectors._editor(state, editorId).fieldId);

  useEffect(() => {
    dispatch(actions._editor.init(editorId, 'netsuiteLookupFilter', {
      fieldId: id,
      rule: value,
      stage: 'importMappingExtract',
      data,
      wrapData: true,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => () => {
      dispatch(actions._editor.clear(editorId));
    },
    [dispatch, editorId]
  );

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
      <Spinner centerAll />
    );
  }

  return (
    <>
      <div className={classes.refreshFilters}>
        <FormLabel disabled={disabled} required={required} >
          Refresh  search filters
        </FormLabel>
        <Button
          data-test="refreshLookupFilters"
          className={classes.refreshFiltersButton}
          variant="text"
          color="primary"
          onClick={handleRefreshFiltersClick}>
          <RefreshIcon />
        </Button>
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
