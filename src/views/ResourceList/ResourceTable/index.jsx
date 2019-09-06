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

const useStyles = makeStyles(theme => ({
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

  row: {
    '& > td:last-child': {
      display: 'none',
    },
    '&:hover > td:last-child': {
      display: 'flex',
    },
  },

  actionCell: {
    position: 'sticky',
    right: 0,
    padding: theme.spacing(1),
    marginTop: 1,
    marginLeft: -92,
    backgroundColor: '#eee',
    border: 0,
  },
  action: {
    padding: theme.spacing(0, 0),
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

  const { columns = [], actions: rowActions } = metadata(resourceType);

  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          {columns.map(col =>
            col.orderBy ? (
              <TableCell
                style={col.width ? { width: col.width } : undefined}
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
              <TableCell
                key={col.heading}
                style={col.width ? { width: col.width } : undefined}
                align={col.align || 'left'}>
                {col.heading}
              </TableCell>
            )
          )}
          {
            // rowActions && <TableCell className={classes.actionColHead} />
          }
        </TableRow>
      </TableHead>
      <TableBody>
        {resources.map(r => (
          <TableRow hover key={r._id} className={classes.row}>
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
            {!r.shared && rowActions && (
              <TableCell className={classes.actionCell}>
                {rowActions.map((Action, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={index} className={classes.action}>
                    <Action resourceType={resourceType} resource={r} />
                  </div>
                ))}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
