import { useCallback, useState, useEffect, Fragment, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CeligPagination from '../../CeligoPaginatedTable/Pagination';
import actions from '../../../actions';
import { resourceErrors, filter } from '../../../reducers';
import CeligoTable from '../../CeligoTable';
import metadata from './metadata';
import KeywordSearch from '../../../components/KeywordSearch';

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
  const errorFilter = useSelector(
    state => filter(state, filterKey) || defaultFilter
  );
  const actionProps = { filterKey, defaultFilter, resourceId, flowId };
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [errorsInCurrentPage, setErrorsInCurrentPage] = useState([]);
  const { status, errors: resolvedErrors = [], nextPageURL } = useSelector(
    state =>
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
  const handleChangePage = useCallback(
    (event, newPage) => setPage(newPage),
    []
  );
  const handleChangeRowsPerPage = useCallback(event => {
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);

  useEffect(() => {
    if (!status) {
      fetchResolvedData();
    }
  }, [dispatch, fetchResolvedData, flowId, resourceId, status]);
  useEffect(() => {
    const currentErrorList = resolvedErrors.slice(
      page * rowsPerPage,
      (page + 1) * rowsPerPage
    );

    setErrorsInCurrentPage(currentErrorList);
  }, [resolvedErrors, page, rowsPerPage]);

  useEffect(() => {
    setPage(0);
  }, [errorFilter, rowsPerPage]);

  const paginationOptions = useMemo(
    () => ({
      rowsPerPageOptions: [10, 25, 50, 100],
      loadMoreHandler: fetchMoreData,
      hasMore: !!nextPageURL,
      loading: status === 'requested',
    }),
    [fetchMoreData, nextPageURL, status]
  );

  return (
    <Fragment>
      <div className={classes.search}>
        <KeywordSearch filterKey={filterKey} defaultFilter={defaultFilter} />
      </div>
      <Fragment>
        <CeligPagination
          {...paginationOptions}
          className={classes.tablePaginationRoot}
          count={resolvedErrors.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        <CeligoTable
          data={errorsInCurrentPage}
          filterKey="openErrors"
          {...metadata}
          actionProps={actionProps}
        />
      </Fragment>
    </Fragment>
  );
}
