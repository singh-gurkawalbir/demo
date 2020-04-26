import { useCallback, useState, useEffect, Fragment, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TablePagination from '@material-ui/core/TablePagination';
import actions from '../../actions';
import { resourceOpenErrors, filter } from '../../reducers';
import CeligoTable from '../CeligoTable';
import metadata from './metadata';
import KeywordSearch from '../../components/KeywordSearch';

const useStyles = makeStyles(() => ({
  tablePaginationRoot: { float: 'right' },
}));

export default function ErrorList({ flowId, resourceId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const rowsPerPage = 20;
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
  const [page, setPage] = useState(0);
  const [errorsInCurrentPage, setErrorsInCurrentPage] = useState([]);
  const { status, errors: openErrors = [], nextPageURL } = useSelector(state =>
    resourceOpenErrors(state, {
      flowId,
      resourceId,
      options: { ...errorFilter },
    })
  );

  useEffect(() => {
    if (!status) {
      dispatch(
        actions.errorManager.flowErrorDetails.open.request({
          flowId,
          resourceId,
        })
      );
    }
  }, [dispatch, flowId, resourceId, status]);
  useEffect(() => {
    const currentErrorList = openErrors.slice(
      page * rowsPerPage,
      (page + 1) * rowsPerPage
    );

    setErrorsInCurrentPage(currentErrorList);
  }, [openErrors, page]);

  useEffect(() => {
    setPage(0);
  }, [errorFilter]);
  const fetchMoreData = useCallback(() => {
    dispatch(
      actions.errorManager.flowErrorDetails.open.request({
        flowId,
        resourceId,
        loadMore: true,
      })
    );
  }, [dispatch, flowId, resourceId]);
  const handleChangePage = useCallback(
    (event, newPage) => setPage(newPage),
    []
  );

  return (
    <Fragment>
      {nextPageURL && (
        <Button class="primary" onClick={fetchMoreData}>
          Load more
        </Button>
      )}
      <KeywordSearch filterKey={filterKey} defaultFilter={defaultFilter} />
      <Fragment>
        <TablePagination
          className={classes.tablePaginationRoot}
          component="div"
          count={openErrors.length}
          rowsPerPageOptions={[rowsPerPage]}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={handleChangePage}
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
