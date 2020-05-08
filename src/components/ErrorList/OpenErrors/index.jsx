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
import ErrorActions from './ErrorActions';

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
  const actionProps = { filterKey, defaultFilter, resourceId, flowId };
  const {
    status,
    errors: openErrors = [],
    nextPageURL,
    outdated = false,
  } = useSelector(state =>
    resourceErrors(state, {
      flowId,
      resourceId,
      options: { ...errorFilter },
    })
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
      <ErrorTable
        paginationOptions={paginationOptions}
        metadata={metadata}
        data={openErrors}
        actionProps={actionProps}
        emptyRowsLabel="No Open errors"
      />
    </div>
  );
}
