import { useCallback, useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TablePagination from '@material-ui/core/TablePagination';
import list from './list';
import actions from '../../actions';
import { getSampleDataWrapper } from '../../reducers';
import CeligoTable from '../CeligoTable';
import metadata from './metadata';

const useStyles = makeStyles(() => ({
  tablePaginationRoot: { float: 'right' },
}));

export default function ErrorList() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const size = 100;
  const [errorList, setErrorList] = useState(list.errors.slice(0, size));
  const rowsPerPage = 20;
  const [page, setPage] = useState(0);
  const [errorsInCurrentPage, setErrorsInCurrentPage] = useState([]);
  const exportId = '5cb5b1f108eac23dd4ebe62c';
  const flowId = '5e0995566672d67d7a952eb1';
  const { status: sampleDataStatus } = useSelector(state =>
    getSampleDataWrapper(state, {
      flowId,
      resourceId: exportId,
      resourceType: 'exports',
      stage: 'transform',
    })
  );

  useEffect(() => {
    if (sampleDataStatus === 'received') {
      const newErrorList = [...errorList, ...list.errors.slice(size, size * 2)];

      setErrorList(newErrorList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, sampleDataStatus]);

  useEffect(() => {
    const currentErrorList = errorList.slice(
      page * rowsPerPage,
      (page + 1) * rowsPerPage
    );

    setErrorsInCurrentPage(currentErrorList);
  }, [errorList, page]);

  const fetchMoreData = useCallback(() => {
    dispatch(
      actions.flowData.requestSampleData(
        flowId,
        exportId,
        'exports',
        'transform'
      )
    );
  }, [dispatch]);
  const handleChangePage = useCallback(
    (event, newPage) => setPage(newPage),
    []
  );

  return (
    <Fragment>
      <Button class="primary" onClick={fetchMoreData}>
        Load more
      </Button>
      <TablePagination
        className={classes.tablePaginationRoot}
        component="div"
        count={errorList.length}
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
        filterKey="errorList"
        {...metadata}
      />
    </Fragment>
  );
}
