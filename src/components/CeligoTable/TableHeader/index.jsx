import {
  makeStyles,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@material-ui/core';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import SelectableCheckBox from './SelectableCheckbox';

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

  actionColHead: {
    width: 125,
  },
});
const emptyObj = {};
export default function TableHeader({
  data,
  onSelectChange,
  selectableRows,
  isSelectableRow,
  useColumns,
  filterKey,
  useRowActions,
  variant,
}) {
  const columns = useColumns();
  const classes = useStyles();
  const dispatch = useDispatch();

  const sort = useSelector(state =>
    selectors.filter(state, filterKey)?.sort
  );
  const { order, orderBy } = sort || emptyObj;

  useEffect(() => {
    if (filterKey && !sort) {
      // when no default order is defined then update lastModified to descending order
      dispatch(actions.patchFilter(filterKey,
        {sort: { order: 'desc', orderBy: 'lastModified' },
          selected: {},
          isAllSelected: false}));
    }
  }, [dispatch, filterKey, sort]);

  // reset selected valued
  useEffect(() => () => {
    if (selectableRows) {
      dispatch(actions.patchFilter(filterKey,
        {
          selected: {},
          isAllSelected: false,
        }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSort = useCallback(
    (order, orderBy) => {
      dispatch(actions.patchFilter(filterKey, { sort: { order, orderBy } }));
    },
    [dispatch, filterKey]
  );

  return (

    <TableHead>
      <TableRow>
        <SelectableCheckBox
          onSelectChange={onSelectChange}
          isSelectableRow={isSelectableRow}
          data={data}
          filterKey={filterKey}
          selectableRows={selectableRows}
        />
        {columns.map(({HeaderValue, ...col}) => {
          const headerValue = HeaderValue
            ? <HeaderValue />
            : col.heading;

          return col.orderBy ? (
            <TableCell
              style={col.width ? { width: col.width } : undefined}
              key={col.key}
              align={col.align || 'left'}
              sortDirection={orderBy === col.orderBy ? order : false}>
              <TableSortLabel
                active={orderBy === col.orderBy}
                direction={order}
                onClick={() =>
                  handleSort(order === 'asc' ? 'desc' : 'asc', col.orderBy)}>
                {headerValue}
                {orderBy === col.orderBy ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ) : (
            <TableCell
              key={col.key}
              style={col.width ? { width: col.width } : undefined}
              align={col.align || 'left'}>
              {headerValue}
            </TableCell>
          );
        }
        )}
        {useRowActions && (
        <TableCell align="center" className={classes.actionColHead}>
          {variant === 'slim' ? '' : 'Actions'}
        </TableCell>
        )}
      </TableRow>
    </TableHead>
  );
}
