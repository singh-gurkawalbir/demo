import { useCallback, useState, useEffect, Fragment, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CeligPagination from '../../CeligoPagination';
import CeligoTable from '../../CeligoTable';
import { filter } from '../../../reducers';

const useStyles = makeStyles(() => ({
  tablePaginationRoot: { float: 'right' },
  emptyRow: {
    position: 'relative',
    top: 100,
    textAlign: 'center',
  },
}));
const rowsPerPageOptions = [10, 25, 50];

export default function ErrorTable(props) {
  const classes = useStyles();
  const {
    paginationOptions,
    actionProps,
    data = [],
    metadata,
    emptyRowsLabel,
  } = props;
  const { filterKey, defaultFilter } = actionProps;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
  const errorsInCurrentPage = useMemo(
    () => data.slice(page * rowsPerPage, (page + 1) * rowsPerPage),
    [data, page, rowsPerPage]
  );

  useEffect(() => {
    setPage(0);
  }, [dataFilter, rowsPerPage]);

  return (
    <Fragment>
      {data.length ? (
        <Fragment>
          <CeligPagination
            {...paginationOptions}
            rowsPerPageOptions={rowsPerPageOptions}
            className={classes.tablePaginationRoot}
            count={data.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
          <CeligoTable
            data={errorsInCurrentPage}
            filterKey={filterKey}
            {...metadata}
            actionProps={actionProps}
          />
        </Fragment>
      ) : (
        <div className={classes.emptyRow}>{emptyRowsLabel || 'No Rows'} </div>
      )}
    </Fragment>
  );
}
