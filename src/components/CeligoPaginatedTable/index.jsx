import { useState, useCallback, Fragment, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { produce } from 'immer';
// import TablePagination from '@material-ui/core/TablePagination';
import { makeStyles } from '@material-ui/core/styles';
import CeligoTable from './Table';
import Pagination from './Pagination';
import * as selectors from '../../reducers';

const useStyles = makeStyles(() => ({
  tablePaginationRoot: { float: 'right' },
}));

export default function CeligoPaginationTable(props) {
  const { data, paginationOptions, filterKey, ...tableOptions } = props;
  const { onSelectChange, isSelectableRow, resourceKey = '_id' } = tableOptions;
  const classes = useStyles();
  const {
    rowsPerPage: pageSize,
    rowsPerPageOptions,
    // backIconButtonProps,
    // nextIconButtonProps,
    hasMore = false,
    loading = false,
    loadMoreHandler,
  } = paginationOptions;
  // #region state variables
  const [selectedResources, setSelectedResources] = useState({});
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [dataInCurrentPage, setDataInCurrentPage] = useState([]);
  // #endregion state variables
  // #region selectors
  const filter = useSelector(state => selectors.filter(state, filterKey));
  // #endregion selectors
  const handleSelectChange = useCallback(
    (event, resourceId) => {
      const { checked } = event.target;
      const selected = produce(selectedResources, draft => {
        draft[resourceId] = checked;
      });

      setSelectedResources(selected);
      onSelectChange(selected);

      if (!checked) {
        setIsAllSelected(false);
      }
    },
    [onSelectChange, selectedResources]
  );
  const handleSelectAllChange = useCallback(
    event => {
      const { checked } = event.target;
      const selected = produce(selectedResources, draft => {
        const selectedCopy = draft;

        data.forEach(r => {
          if (isSelectableRow) {
            selectedCopy[r[resourceKey]] = isSelectableRow(r) ? checked : false;
          } else {
            selectedCopy[r[resourceKey]] = checked;
          }
        });
      });

      setSelectedResources(selected);
      onSelectChange(selected);
      setIsAllSelected(checked);
    },
    [data, isSelectableRow, onSelectChange, resourceKey, selectedResources]
  );

  // #region effects

  useEffect(() => {
    if (!data.length) {
      // Deselect selectAll incase of no data
      setIsAllSelected(false);
    } else {
      // Check for atleast a row being unselected to update selectAll
      const isAtleastOneRowUnSelected = data.some(r =>
        isSelectableRow
          ? isSelectableRow(r) && !selectedResources[r[resourceKey]]
          : !selectedResources[r[resourceKey]]
      );

      setIsAllSelected(!isAtleastOneRowUnSelected);
    }
  }, [data, isSelectableRow, resourceKey, selectedResources]);

  useEffect(() => {
    setPage(0);
  }, [filter, rowsPerPage]);

  // #endregion effects
  const handleChangePage = useCallback(
    (event, newPage) => setPage(newPage),
    []
  );
  const handleChangeRowsPerPage = useCallback(event => {
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);

  useEffect(() => {
    const currentList = data.slice(
      page * rowsPerPage,
      (page + 1) * rowsPerPage
    );

    setDataInCurrentPage(currentList);
  }, [data, page, rowsPerPage]);

  return (
    <Fragment>
      {data.length ? (
        <Fragment>
          {/* <TablePagination
            className={classes.tablePaginationRoot}
            component="div"
            count={data.length}
            rowsPerPageOptions={rowsPerPageOptions || [rowsPerPage]}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={
              backIconButtonProps || {
                'aria-label': 'Previous Page',
              }
            }
            nextIconButtonProps={
              nextIconButtonProps || {
                'aria-label': 'Next Page',
              }
            }
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          /> */}
          <Pagination
            className={classes.tablePaginationRoot}
            count={data.length}
            rowsPerPageOptions={rowsPerPageOptions || [rowsPerPage]}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            hasMore={hasMore}
            loading={loading}
            loadMoreHandler={loadMoreHandler}
          />
          <CeligoTable
            {...tableOptions}
            data={dataInCurrentPage}
            selectedResources={selectedResources}
            isAllSelected={isAllSelected}
            handleSelectChange={handleSelectChange}
            handleSelectAllChange={handleSelectAllChange}
          />
        </Fragment>
      ) : (
        <div> No Rows</div>
      )}
    </Fragment>
  );
}
