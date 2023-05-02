/* eslint-disable camelcase */
import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { FormLabel, IconButton } from '@mui/material';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import FilterPanel from '../../../AFE/Editor/panels/SalesforceLookupFilter';
import RefreshIcon from '../../../icons/RefreshIcon';

const useStyles = makeStyles(theme => ({
  refreshFilters: {
    marginTop: theme.spacing(1),
    display: 'inline-block !important',
  },
}));

export default function DynaSalesforceLookupFilters_afe(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const {
    id,
    data,
    value,
    connectionId,
    options = {},
    editorId,
    opts,
    onFieldChange,
  } = props;
  const newEditorId = editorId || 'ss-sfLookupFilter';

  const { disableFetch, commMetaPath } = options;

  useEffect(() => {
    dispatch(actions.editor.init(newEditorId, 'salesforceLookupFilter', {
      fieldId: id,
      data,
      rule: value,
      stage: 'importMappingExtract',
      ssLinkedConnectionId: connectionId,
      isGroupedSampleData: opts.isGroupedSampleData,
    }));

    return () => dispatch(actions.editor.clear(newEditorId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filters = useSelector(
    state =>
      selectors.metadataOptionsAndResources(state, {
        connectionId,
        commMetaPath,
        filterKey: 'salesforce-recordType',
      }).data,
    (left, right) => left.length === right.length
  );

  useEffect(() => {
    if (!disableFetch && commMetaPath) {
      dispatch(actions.metadata.request(connectionId, commMetaPath, {ignoreCache: true}));
    }
  }, [commMetaPath, connectionId, disableFetch, dispatch]);

  const handleRefreshFiltersClick = useCallback(() => {
    if (!disableFetch && commMetaPath) {
      dispatch(
        actions.metadata.request(connectionId, commMetaPath, {
          ignoreCache: true,
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
          data-test="refreshLookupFilters"
          onClick={handleRefreshFiltersClick}
          size="small"
          color="inherit">
          <RefreshIcon />
        </IconButton>
      </div>
      {/* query expressions can be loggable */}
      <FilterPanel
        id={id}
        editorId={newEditorId}
        onFieldChange={onFieldChange}
        ssLinkedConnectionId={connectionId}
        filters={filters}
      />
    </>
  );
}
