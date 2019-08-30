// import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
// import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  // Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import metadata from './metadata';
import actions from '../../../actions';
// import getRoutePath from '../../../utils/routePaths';

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
  },
  resultContainer: {
    padding: theme.spacing(3, 3, 12, 3),
  },
}));

export default function ResourceTable({ resourceType, resources }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const handleSort = (field, order) => {
    dispatch(actions.patchFilter(resourceType, { sort: { field, order } }));
  };

  const columns = metadata[resourceType] || metadata.default;

  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          {columns.map(col => (
            <TableCell
              key={col.heading}
              align={col.align || 'left'}
              onClick={col.sortBy ? () => handleSort(col.sortBy) : undefined}>
              {col.heading}
            </TableCell>
          ))}
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
