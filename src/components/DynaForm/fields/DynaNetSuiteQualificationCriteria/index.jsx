import React, { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import FilterPanel from './FilterPanel';
import Spinner from '../../../Spinner';
import SpinnerWrapper from '../../../SpinnerWrapper';
import RefreshIcon from '../../../icons/RefreshIcon';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';

/**
 * TODO: Azhar to check and update the button styles
 */
const useStyles = makeStyles(theme => ({
  refreshFilters: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  refreshFiltersButton: {
    minWidth: 0,
    padding: 0,
  },
  netsuiteQualificationFilterIcon: {
    marginLeft: theme.spacing(1),
  },
}));

export default function DynaNetSuiteQualificationCriteria(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const {
    id,
    value,
    connectionId,
    data,
    options = {},
    onFieldChange,
    editorId,
  } = props;
  const { disableFetch, commMetaPath } = options;
  const handleEditorInit = useCallback(() => {
    dispatch(
      actions.editor.init(editorId, 'netsuiteQualificationCriteria', {
        data,
        rule: value,
        _init_rule: value,
      })
    );
  }, [data, dispatch, editorId, value]);

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

  const filters = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId, commMetaPath, 'suitescript-bodyField')?.data;

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
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
    );
  }

  if (Array.isArray(filters) && !filters.length) {
    return <Typography>Failed to load record metadata</Typography>;
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
          <RefreshIcon className={classes.netsuiteQualificationFilterIcon} />

        </Button>{' '}

      </div>
      <FilterPanel
        id={id}
        editorId={editorId}
        rule={value}
        filters={filters}
        onFieldChange={onFieldChange}
      />
    </>
  );
}
