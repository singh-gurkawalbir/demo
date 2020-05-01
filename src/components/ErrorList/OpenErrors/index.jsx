import { useCallback, useState, useEffect, Fragment, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TablePagination from '@material-ui/core/TablePagination';
import actions from '../../../actions';
import { resourceErrors, filter } from '../../../reducers';
import CeligoTable from '../../CeligoTable';
import metadata from './metadata';
import KeywordSearch from '../../KeywordSearch';

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

export default function OpenErrors({ flowId, resourceId }) {
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
    resourceErrors(state, {
      flowId,
      resourceId,
      options: { ...errorFilter },
    })
  );

  useEffect(() => {
    if (!status) {
      dispatch(
        actions.errorManager.flowErrorDetails.request({
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
      actions.errorManager.flowErrorDetails.request({
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
        <div className={classes.loadMore}>
          <Button class="primary" onClick={fetchMoreData}>
            Load more
          </Button>
        </div>
      )}
      <div className={classes.search}>
        <KeywordSearch filterKey={filterKey} defaultFilter={defaultFilter} />
      </div>
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
