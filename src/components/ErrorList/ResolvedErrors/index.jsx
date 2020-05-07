import { useCallback, useEffect, Fragment, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../../actions';
import { resourceErrors, filter } from '../../../reducers';
import metadata from './metadata';
import IconTextButton from '../../IconTextButton';
import KeywordSearch from '../../../components/KeywordSearch';
import ErrorTable from '../ErrorTable';

const useStyles = makeStyles(theme => ({
  tablePaginationRoot: { float: 'right' },
  search: {
    width: '300px',
    paddingTop: theme.spacing(1),
    float: 'left',
  },
  loadMore: {
    float: 'right',
    paddingTop: theme.spacing(2),
  },
}));

export default function ResolvedErrors({ flowId, resourceId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const defaultFilter = useMemo(
    () => ({
      searchBy: ['message', 'source', 'code', 'occurredAt', 'resolvedBy'],
    }),
    []
  );
  const filterKey = `resolvedErrors-${flowId}-${resourceId}`;
  const actionProps = useMemo(
    () => ({
      filterKey,
      defaultFilter,
      resourceId,
      flowId,
    }),
    [defaultFilter, filterKey, flowId, resourceId]
  );
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
    if (!status) {
      fetchResolvedData();
    }

    if (status === 'received' && !resolvedErrors.length && outdated) {
      fetchMoreData();
    }
  }, [
    dispatch,
    fetchMoreData,
    fetchResolvedData,
    flowId,
    outdated,
    resolvedErrors.length,
    resourceId,
    status,
  ]);

  const paginationOptions = useMemo(
    () => ({
      loadMoreHandler: fetchMoreData,
      hasMore: !!nextPageURL,
      loading: status === 'requested',
    }),
    [fetchMoreData, nextPageURL, status]
  );

  return (
    <Fragment>
      {outdated && (
        <div>
          <IconTextButton onClick={() => fetchResolvedData()}>
            Refresh
          </IconTextButton>
        </div>
      )}
      <div className={classes.search}>
        <KeywordSearch filterKey={filterKey} defaultFilter={defaultFilter} />
      </div>
      <ErrorTable
        paginationOptions={paginationOptions}
        metadata={metadata}
        data={resolvedErrors}
        actionProps={actionProps}
      />
    </Fragment>
  );
}
