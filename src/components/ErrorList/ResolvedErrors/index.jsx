import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import actions from '../../../actions';
import {
  resourceErrors,
  filter,
  isAnyErrorActionInProgress,
} from '../../../reducers';
import metadata from './metadata';
import KeywordSearch from '../../KeywordSearch';
import ErrorTable from '../ErrorTable';
import RefreshCard from '../components/RefreshCard';
import ErrorActions from '../components/ErrorActions';
import Spinner from '../../Spinner';
import SpinnerWrapper from '../../SpinnerWrapper';

const useStyles = makeStyles(theme => ({
  search: {
    width: '300px',
    paddingTop: theme.spacing(1),
    float: 'left',
  },
  hide: {
    display: 'none',
  },
}));
const defaultFilter = {
  searchBy: ['message', 'source', 'code', 'occurredAt', 'resolvedBy'],
};

export default function ResolvedErrors({ flowId, resourceId, show }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const filterKey = `resolvedErrors-${flowId}-${resourceId}`;
  const errorFilter = useSelector(
    state => filter(state, filterKey) || defaultFilter
  );
  const {
    status,
    errors: resolvedErrors = [],
    nextPageURL,
    outdated,
  } = useSelector(state =>
    resourceErrors(state, {
      flowId,
      resourceId,
      options: { ...errorFilter, isResolved: true },
    })
  );
  const isAnyActionInProgress = useSelector(state =>
    isAnyErrorActionInProgress(state, {
      flowId,
      resourceId,
    })
  );
  const isFreshDataLoad = (!status || status === 'requested') && !nextPageURL;
  const actionProps = useMemo(
    () => ({
      filterKey,
      defaultFilter,
      resourceId,
      flowId,
      isResolved: true,
      actionInProgress: isAnyActionInProgress,
    }),
    [filterKey, flowId, isAnyActionInProgress, resourceId]
  );
  const fetchResolvedData = useCallback(
    loadMore => {
      dispatch(
        actions.errorManager.flowErrorDetails.request({
          flowId,
          resourceId,
          isResolved: true,
          loadMore,
        })
      );
    },
    [dispatch, flowId, resourceId]
  );
  const fetchMoreData = useCallback(() => fetchResolvedData(true), [
    fetchResolvedData,
  ]);

  useEffect(() => {
    if (show) {
      if (!status) {
        fetchResolvedData();
      }

      if (status === 'received' && !resolvedErrors.length && outdated) {
        fetchMoreData();
      }
    }
  }, [
    dispatch,
    fetchMoreData,
    fetchResolvedData,
    flowId,
    outdated,
    resolvedErrors.length,
    resourceId,
    show,
    status,
  ]);

  useEffect(
    () => () => {
      dispatch(
        actions.errorManager.flowErrorDetails.clear({
          flowId,
          resourceId,
          isResolved: true,
        })
      );
    },
    [dispatch, flowId, resourceId]
  );

  const paginationOptions = useMemo(
    () => ({
      loadMoreHandler: fetchMoreData,
      hasMore: !!nextPageURL,
      loading: status === 'requested',
    }),
    [fetchMoreData, nextPageURL, status]
  );

  return (
    <div className={clsx({ [classes.hide]: !show })}>
      {!isFreshDataLoad ? <RefreshCard onRefresh={fetchResolvedData} /> : null}
      {resolvedErrors.length ? (
        <ErrorActions flowId={flowId} resourceId={resourceId} isResolved />
      ) : null}
      <div className={classes.search}>
        <KeywordSearch filterKey={filterKey} defaultFilter={defaultFilter} />
      </div>
      {isFreshDataLoad ? (
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      ) : (
        <ErrorTable
          paginationOptions={paginationOptions}
          metadata={metadata}
          data={resolvedErrors}
          actionProps={actionProps}
          emptyRowsLabel="No Resolved errors"
        />
      )}
    </div>
  );
}
