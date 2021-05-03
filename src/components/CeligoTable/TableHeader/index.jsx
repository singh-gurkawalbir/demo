import {
  makeStyles,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import React, {useCallback } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import CheckboxSelectedIcon from '../../icons/CheckboxSelectedIcon';
import CheckboxUnselectedIcon from '../../icons/CheckboxUnselectedIcon';

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
  selectableRows,
  handleSelectAllChange,
  isAllSelected,
  columns,
  filterKey,
  useRowActions,
  variant,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const sort = useSelector(state =>
    selectors.filter(state, filterKey)?.sort
  );
  const { order, orderBy } = sort || emptyObj;

  const handleSort = useCallback(
    (order, orderBy) => {
      dispatch(actions.patchFilter(filterKey, { sort: { order, orderBy } }));
    },
    [dispatch, filterKey]
  );

  return (

    <TableHead>
      <TableRow>
        {selectableRows && (
        <TableCell>
          <Checkbox
            icon={(<span> <CheckboxUnselectedIcon /> </span>)}
            checkedIcon={(<span> <CheckboxSelectedIcon /> </span>)}
            onChange={handleSelectAllChange}
            checked={isAllSelected}
            color="primary"
            />
        </TableCell>
        )}
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
              key={col.heading}
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
