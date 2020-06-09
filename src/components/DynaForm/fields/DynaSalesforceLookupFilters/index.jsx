import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import FilterPanel from './FilterPanel';
import Spinner from '../../../Spinner';
import { wrapSpecialChars } from '../../../../utils/jsonPaths';
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
  loaderSObject: {
    flexDirection: 'row !important',
  },
  loaderSObjectText: {
    marginRight: theme.spacing(2),
  },
  salesForceLookupFilterIcon: {
    marginLeft: theme.spacing(1),
  },
}));

export default function DynaSalesforceLookupFilters(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const {
    id,
    value,
    connectionId,
    data,
    options = {},
    opts = {},
    onFieldChange,
    editorId,
  } = props;
  let modifiedData = Array.isArray(data) ? data.map(wrapSpecialChars) : data;

  if (opts.isGroupedSampleData && Array.isArray(data)) {
    modifiedData = modifiedData.concat(
      modifiedData.map(i => ({ name: `*.${i.name}`, id: `*.${i.id}` }))
    );
  }

  const { disableFetch, commMetaPath } = options;
  const handleEditorInit = useCallback(() => {
    dispatch(
      actions.editor.init(editorId, 'salesforceLookupFilter', {
        modifiedData,
        rule: value,
      })
    );
  }, [dispatch, editorId, modifiedData, value]);

  useEffect(() => {
    if (editorId) {
      handleEditorInit();
    }
    /**
     * TODO: fix dependencies
     * If we add editorId and handleEditorInit as dependencies this is causing re-render infinitely.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const filters = useSelector(
    state =>
      selectors.metadataOptionsAndResources({
        state,
        connectionId,
        commMetaPath,
        filterKey: 'salesforce-recordType',
      }).data,
    (left, right) => left.length === right.length
  );

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
      <div className={classes.loaderSObject}>
        <Typography className={classes.loaderSObjectText}>
          Loading SObject fields.
        </Typography>
        <Spinner size={24} />
      </div>

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
        editorId={editorId}
        rule={value}
        data={modifiedData}
        filters={filters}
        onFieldChange={onFieldChange}
      />
    </>
  );
}
