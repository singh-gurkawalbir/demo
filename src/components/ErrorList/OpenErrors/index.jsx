import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../../actions';
import { resourceErrors, filter } from '../../../reducers';
import metadata from './metadata';
import KeywordSearch from '../../KeywordSearch';
import ErrorTable from '../ErrorTable';
import RefreshCard from '../components/RefreshCard';
import ErrorActions from '../components/ErrorActions';
import Spinner from '../../Spinner';

const useStyles = makeStyles(theme => ({
  tablePaginationRoot: {
    float: 'right',
  },
  search: {
    width: '300px',
    paddingTop: theme.spacing(1),
    float: 'left',
  },
  hide: {
    display: 'none',
  },
  loading: {
    textAlign: 'center',
    position: 'relative',
    top: 100,
    width: '100%',
  },
}));

export default function OpenErrors({ flowId, resourceId, show }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const defaultFilter = useMemo(
    () => ({
      searchBy: ['message', 'source', 'code', 'occurredAt'],
    }),
    []
  );
  const filterKey = `openErrors-${flowId}-${resourceId}`;
  const errorFilter = useSelector(
    state => filter(state, filterKey) || defaultFilter
  );
  const {
    status,
    errors: openErrors = [],
    nextPageURL,
    actionInProgress = false,
    outdated = false,
  } = useSelector(state =>
    resourceErrors(state, {
      flowId,
      resourceId,
      options: { ...errorFilter },
    })
  );
  const actionProps = useMemo(
    () => ({
      filterKey,
      defaultFilter,
      resourceId,
      flowId,
      actionInProgress,
    }),
    [actionInProgress, defaultFilter, filterKey, flowId, resourceId]
  );
  const requestOpenErrors = useCallback(
    loadMore =>
      dispatch(
        actions.errorManager.flowErrorDetails.request({
          flowId,
          resourceId,
          loadMore,
        })
      ),
    [dispatch, flowId, resourceId]
  );
  const fetchMoreData = useCallback(() => requestOpenErrors(true), [
    requestOpenErrors,
  ]);
  const paginationOptions = useMemo(
    () => ({
      loadMoreHandler: fetchMoreData,
      hasMore: !!nextPageURL,
      loading: status === 'requested',
    }),
    [fetchMoreData, nextPageURL, status]
  );

  useEffect(() => {
    if (show) {
      if (!status) {
        requestOpenErrors();
      }

      if (
        status === 'received' &&
        !openErrors.length &&
        outdated &&
        nextPageURL
      ) {
        fetchMoreData();
      }
    }
  }, [
    dispatch,
    fetchMoreData,
    flowId,
    nextPageURL,
    openErrors.length,
    outdated,
    requestOpenErrors,
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
        })
      );
    },
    [dispatch, flowId, resourceId]
  );

  return (
    <div className={clsx({ [classes.hide]: !show })}>
      <RefreshCard onRefresh={requestOpenErrors} />
      {openErrors.length ? (
        <ErrorActions flowId={flowId} resourceId={resourceId} />
      ) : null}
      <div className={classes.search}>
        <KeywordSearch filterKey={filterKey} defaultFilter={defaultFilter} />
      </div>
      {(!status || status === 'requested') && !nextPageURL ? (
        <div className={classes.loading}>
          Loading Errors <Spinner size={20} />
        </div>
      ) : (
        <ErrorTable
          paginationOptions={paginationOptions}
          metadata={metadata}
          data={openErrors}
          actionProps={actionProps}
          emptyRowsLabel="No Open errors"
        />
      )}
    </div>
  );
}
