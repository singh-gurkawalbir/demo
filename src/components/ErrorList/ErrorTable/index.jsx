import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CeligPagination from '../../CeligoPagination';
import CeligoTable from '../../CeligoTable';
import { selectors } from '../../../reducers';
import metadata from './metadata';

const useStyles = makeStyles(() => ({
  tablePaginationRoot: {
    float: 'right',
    display: 'flex',
    alignItems: 'center',
    paddingBottom: 18,
  },
  emptyRow: {
    position: 'relative',
    top: 100,
    textAlign: 'center',
  },
  errorDetailsTable: {
    wordBreak: 'break-word',
  },
}));
const rowsPerPageOptions = [10, 25, 50];
const DEFAULT_ROWS_PER_PAGE = 50;

export default function ErrorTable(props) {
  const classes = useStyles();
  const {
    paginationOptions,
    actionProps,
    data = [],
    errorType,
    emptyRowsLabel,
  } = props;
  const { filterKey, defaultFilter } = actionProps;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const handleChangeRowsPerPage = useCallback(event => {
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);
  const handleChangePage = useCallback(
    (event, newPage) => setPage(newPage),
    []
  );
  const dataFilter = useSelector(
    state => selectors.filter(state, filterKey) || defaultFilter
  );
  const errorsInCurrentPage = useMemo(
    () => data.slice(page * rowsPerPage, (page + 1) * rowsPerPage),
    [data, page, rowsPerPage]
  );

  useEffect(() => {
    setPage(0);
  }, [dataFilter, rowsPerPage]);

  return (
    <>
      {data.length ? (
        <>
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
            className={classes.errorDetailsTable}
            filterKey={filterKey}
            {...metadata[errorType]}
            actionProps={actionProps}
          />
        </>
      ) : (
        <div className={classes.emptyRow}>{emptyRowsLabel || 'No Rows'} </div>
      )}
    </>
  );
}
