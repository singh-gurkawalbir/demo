import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  // Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@material-ui/core';
import metadata from './metadata';
import actions from '../../../actions';
import * as selectors from '../../../reducers';

const useStyles = makeStyles(() => ({
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
}));

export default function ResourceTable({ resourceType, resources }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { sort = {} } = useSelector(state =>
    selectors.filter(state, resourceType)
  );
  const { order = 'desc', orderBy = 'lastModified' } = sort;
  const handleSort = (order, orderBy) => {
    dispatch(actions.patchFilter(resourceType, { sort: { order, orderBy } }));
  };

  const columns = metadata[resourceType] || metadata.default;

  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          {columns.map(col =>
            col.orderBy ? (
              <TableCell
                key={col.heading}
                align={col.align || 'left'}
                sortDirection={orderBy === col.orderBy ? order : false}>
                <TableSortLabel
                  active={orderBy === col.orderBy}
                  direction={order}
                  onClick={() =>
                    handleSort(order === 'asc' ? 'desc' : 'asc', col.orderBy)
                  }>
                  {col.heading}
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
              <TableCell key={col.heading} align={col.align || 'left'}>
                {col.heading}
              </TableCell>
            )
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {resources.map(r => (
          <TableRow key={r._id}>
            {columns.map((col, index) =>
              index === 0 ? (
                <TableCell
                  component="th"
                  scope="row"
                  key={col.heading}
                  align={col.align || 'left'}>
                  {col.value(r)}
                </TableCell>
              ) : (
                <TableCell key={col.heading} align={col.align || 'left'}>
                  {col.value(r)}
                </TableCell>
              )
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
