import React, { useCallback} from 'react';
import { TableSortLabel } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import { BaseCellWrapper } from '../../TableBodyContent/AllContentCells';

const emptyObj = {};

const useStyles = makeStyles({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
});

const TableHeaderCell = ({filterKey, HeaderValue, heading,
  width,
  align,
  orderBy,
  isLoggable,
}) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const sort = useSelector(state =>
      selectors.filter(state, filterKey)?.sort
  );
  const { order: sortOrder, orderBy: sortOrderBy } = sort || emptyObj;

  const handleSort = useCallback(
    (order, orderBy) => {
      dispatch(actions.patchFilter(filterKey, { sort: { order, orderBy } }));
    },
    [dispatch, filterKey]
  );

  const headerValue = HeaderValue ? HeaderValue() : heading;
  const cellValue = headerValue === undefined ? null : headerValue;

  if (orderBy) {
    return (
      <BaseCellWrapper
        isLoggable={isLoggable}
        style={width ? { width } : undefined}
        align={align || 'left'}
        sortDirection={sortOrderBy === orderBy ? sortOrder : false}>
        <TableSortLabel
          active={sortOrderBy === orderBy}
          direction={sortOrder}
          onClick={() =>
            handleSort(sortOrder === 'asc' ? 'desc' : 'asc', orderBy)}>
          {cellValue}
          {sortOrderBy === orderBy ? (
            <span className={classes.visuallyHidden}>
              {sortOrder === 'desc'
                ? 'sorted descending'
                : 'sorted ascending'}
            </span>
          ) : null}
        </TableSortLabel>
      </BaseCellWrapper>

    );
  }

  return (
    <BaseCellWrapper
      isLoggable={isLoggable}
      style={width ? { width } : undefined}
      align={align || 'left'}
    >
      {headerValue}
    </BaseCellWrapper>
  );
};
export default function AllTableHeaderCells({useColumns, filterKey}) {
  const columns = useColumns();

  return columns.map(col => (
    <TableHeaderCell
      filterKey={filterKey}
      key={col.key}
      {...col}
         />
  ));
}
