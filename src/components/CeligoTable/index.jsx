import { useState } from 'react';
import produce from 'immer';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import actions from '../../actions';
import * as selectors from '../../reducers';
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
    padding: `0 !important`,
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

export default function CeligoTable({
  columns,
  rowActions,
  data = [],
  onSelectChange,
  selectableRows,
  filterKey,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { sort = {} } = useSelector(state =>
    selectors.filter(state, filterKey)
  );
  const { order = 'desc', orderBy = 'lastModified' } = sort;
  const handleSort = (order, orderBy) => {
    dispatch(actions.patchFilter(filterKey, { sort: { order, orderBy } }));
  };

  const [selectedResources, setSelectedResources] = useState({});
  const [isAllSelected, setIsAllSelected] = useState(false);
  const handleSelectChange = (event, resourceId) => {
    const { checked } = event.target;
    const selected = produce(selectedResources, draft => {
      draft[resourceId] = checked;
    });

    setSelectedResources(selected);
    onSelectChange(selected);

    if (!checked) {
      setIsAllSelected(false);
    }
  };

  const handleSelectAllChange = event => {
    const { checked } = event.target;
    const selected = produce(selectedResources, draft => {
      const selectedCopy = draft;

      data.forEach(r => (selectedCopy[r._id] = checked));
    });

    setSelectedResources(selected);
    onSelectChange(selected);
    setIsAllSelected(checked);
  };

  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          {selectableRows && (
            <TableCell>
              <Checkbox
                onChange={event => handleSelectAllChange(event)}
                checked={isAllSelected}
              />
            </TableCell>
          )}
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
          {rowActions && <TableCell className={classes.actionColHead} />}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map(r => (
          <TableRow hover key={r._id} className={classes.row}>
            {selectableRows && (
              <TableCell>
                <Checkbox
                  onChange={event => handleSelectChange(event, r._id)}
                  checked={!!selectedResources[r._id]}
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
            {rowActions && (
              <TableCell className={classes.actionCell}>
                <ActionMenu
                  actions={rowActions.map(({ label, component: Action }) => ({
                    label,
                    component: (
                      <Action /* resourceType={resourceType} */ resource={r} />
                    ),
                  }))}
                />
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
