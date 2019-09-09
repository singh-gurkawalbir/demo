import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
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
import ActionMenu from './ActionMenu';

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
    '& > td:last-child > div': {
      display: 'none',
    },
    '&:hover > td:last-child > div': {
      display: 'flex',
    },
  },
  actionCell: {
    padding: 0,
  },
  actionContainer: {
    position: 'sticky',
    display: 'flex',
  },
  action: {
    padding: theme.spacing(0, 0),
  },
  actionColHead: {
    width: 100,
  },
}));

export default function ResourceTable({
  resourceType,
  resources,
  isRegConnDialog,
  selectConn,
}) {
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
  const [selectedConnections, setSelectedConnections] = useState({});
  const handleSelectConnChange = (event, connectionId) => {
    const { checked } = event.target;
    const connections = { ...selectedConnections };

    connections[connectionId] = checked;
    setSelectedConnections(connections);
    selectConn(connections);
  };

  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          {isRegConnDialog && <TableCell padding="checkbox" />}
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
          {!isRegConnDialog && rowActions && (
            <TableCell className={classes.actionColHead} />
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {resources.map(r => (
          <TableRow hover key={r._id} className={classes.row}>
            {isRegConnDialog && (
              <TableCell padding="checkbox">
                <Checkbox
                  onChange={event => handleSelectConnChange(event, r._id)}
                />
              </TableCell>
            )}
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
            {!isRegConnDialog && rowActions && (
              <TableCell className={classes.actionCell}>
                <ActionMenu
                  actions={rowActions.map((Action, i) => (
                    // TECH DEBT:
                    // using index as key is not good enough when we have dynamic
                    // actions... only fixed lists are safe to use index.
                    // the actions metadata will need to change to support a
                    // unique key
                    // eslint-disable-next-line react/no-array-index-key
                    <Action key={i} resourceType={resourceType} resource={r} />
                  ))}
                />
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
