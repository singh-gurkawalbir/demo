import { useCallback, useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CeligPagination from '../../CeligoPaginatedTable/Pagination';
import CeligoTable from '../../CeligoTable';
import { filter } from '../../../reducers';

const useStyles = makeStyles(() => ({
  tablePaginationRoot: { float: 'right' },
}));

export default function ErrorTable(props) {
  const classes = useStyles();
  const { paginationOptions, actionProps, data = [], metadata } = props;
  const { filterKey, defaultFilter } = actionProps;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [errorsInCurrentPage, setErrorsInCurrentPage] = useState([]);
  const handleChangeRowsPerPage = useCallback(event => {
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);
  const handleChangePage = useCallback(
    (event, newPage) => setPage(newPage),
    []
  );
  const dataFilter = useSelector(
    state => filter(state, filterKey) || defaultFilter
  );

  useEffect(() => {
    const currentErrorList = data.slice(
      page * rowsPerPage,
      (page + 1) * rowsPerPage
    );

    setErrorsInCurrentPage(currentErrorList);
  }, [data, page, rowsPerPage]);

  useEffect(() => {
    setPage(0);
  }, [dataFilter, rowsPerPage]);

  return (
    <Fragment>
      {data.length ? (
        <Fragment>
          <CeligPagination
            {...paginationOptions}
            rowsPerPageOptions={[10, 25, 50, 100]}
            className={classes.tablePaginationRoot}
            count={data.length}
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
      ) : (
        <div> No Rows </div>
      )}
    </Fragment>
  );
}
