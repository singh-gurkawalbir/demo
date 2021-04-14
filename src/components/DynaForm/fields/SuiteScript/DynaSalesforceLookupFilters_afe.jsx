/* eslint-disable camelcase */
import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import FilterPanel from '../../../AFE/Editor/panels/SalesforceLookupFilter';
import Spinner from '../../../Spinner';
import RefreshIcon from '../../../icons/RefreshIcon';

const useStyles = makeStyles(theme => ({
  refreshFilters: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: 'inline-block !important',
  },
  refreshFiltersButton: {
    minWidth: 0,
    padding: 0,
  },
  salesForceLookupFilterIcon: {
    marginLeft: theme.spacing(1),
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
        Refresh search filters
        <Button
          data-test="refreshLookupFilters"
          className={classes.refreshFiltersButton}
          variant="text"
          color="primary"
          onClick={handleRefreshFiltersClick}>
          <RefreshIcon className={classes.salesForceLookupFilterIcon} />
        </Button>

      </div>
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
