import React, { useState, useEffect, useCallback } from 'react';
import produce from 'immer';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import clsx from 'clsx';
import actions from '../../actions';
import { selectors } from '../../reducers';
import ActionMenu from './ActionMenu';
import CheckboxUnselectedIcon from '../icons/CheckboxUnselectedIcon';
import CheckboxSelectedIcon from '../icons/CheckboxSelectedIcon';
import DataRow from './DataRow';

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
      minWidth: '125px',
    },
    '&:hover > td:last-child > svg': {
      display: 'none',
    },
  },
  actionCell: {
    padding: '5px !important',
    textAlign: 'center',
  },
  actionContainer: {
    position: 'sticky',
    display: 'flex',
  },
  action: {
    padding: theme.spacing(0, 0),
  },
  actionColHead: {
    width: 125,
  },
}));

const emptyObj = {};
const emptySet = [];

export default function CeligoTable({
  columns,
  onRowOver,
  onRowOut,
  rowActions,
  data = emptySet,
  onSelectChange,
  selectableRows,
  isSelectableRow,
  filterKey,
  className,
  actionProps = emptyObj,
}) {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [selectedAction, setSelectedAction] = useState(undefined);
  const { sort = {} } = useSelector(state =>
    selectors.filter(state, filterKey)
  );
  const { order = 'desc', orderBy = 'lastModified' } = sort;
  const handleSort = useCallback(
    (order, orderBy) => {
      dispatch(actions.patchFilter(filterKey, { sort: { order, orderBy } }));
    },
    [dispatch, filterKey]
  );
  const [selectedResources, setSelectedResources] = useState({});
  const [isAllSelected, setIsAllSelected] = useState(false);

  useEffect(() => {
    if (filterKey) {
      dispatch(actions.patchFilter(filterKey, { sort: { order, orderBy } }));
    }
  }, [dispatch, filterKey, order, orderBy]);
  useEffect(() => {
    const hasSelectableResources =
      !isSelectableRow ||
      data.reduce(
        (isSelected, resource) => isSelected || !!isSelectableRow(resource),
        false
      );
    let isAllSelectableResourcesSelected = hasSelectableResources;

    if (hasSelectableResources) {
      isAllSelectableResourcesSelected = data.reduce((isSelected, resource) => {
        if (isSelectableRow) {
          if (isSelectableRow(resource)) {
            return isSelected && !!selectedResources[resource._id];
          }

          return true;
        }

        return isSelected && !!selectedResources[resource._id];
      }, hasSelectableResources);
    }

    setIsAllSelected(isAllSelectableResourcesSelected);
  }, [isSelectableRow, data, selectedResources]);
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
            selectedCopy[r._id] = isSelectableRow(r) ? checked : false;
          } else {
            selectedCopy[r._id] = checked;
          }
        });
      });

      setSelectedResources(selected);
      onSelectChange(selected);
      setIsAllSelected(checked);
    },
    [data, isSelectableRow, onSelectChange, selectedResources]
  );
  const handleActionSelected = useCallback(component => {
    setSelectedAction(component);
  }, []);

  return (
    <div className={clsx(className)}>
      {selectedAction}
      <Table data-public className={classes.table}>
        <TableHead>
          <TableRow>
            {selectableRows && (
              <TableCell>
                <Checkbox
                  icon={(
                    <span>
                      <CheckboxUnselectedIcon />
                    </span>
                  )}
                  checkedIcon={(
                    <span>
                      <CheckboxSelectedIcon />
                    </span>
                  )}
                  onChange={handleSelectAllChange}
                  checked={isAllSelected}
                  color="primary"
                />
              </TableCell>
            )}
            {(typeof columns === 'function'
              ? columns('', actionProps)
              : columns
            ).map(col =>
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
                      handleSort(order === 'asc' ? 'desc' : 'asc', col.orderBy)}>
                    {col.headerValue
                      ? col.headerValue('', actionProps)
                      : col.heading}
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
                  {col.headerValue
                    ? col.headerValue('', actionProps)
                    : col.heading}
                </TableCell>
              )
            )}
            {rowActions && (
              <TableCell align="center" className={classes.actionColHead}>Actions</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(rowData => (
            <DataRow
              key={rowData.key || rowData._id}
              rowData={rowData}
              onRowOver={onRowOver}
              onRowOut={onRowOut}
              className={classes.row}
            >
              {selectableRows && (
                <TableCell>
                  {(isSelectableRow ? !!isSelectableRow(rowData) : true) && (
                    <Checkbox
                      onChange={event => handleSelectChange(event, rowData._id)}
                      checked={!!selectedResources[rowData._id]}
                      color="primary"
                      icon={(
                        <span>
                          <CheckboxUnselectedIcon />
                        </span>
                      )}
                      checkedIcon={(
                        <span>
                          <CheckboxSelectedIcon />
                        </span>
                      )}
                    />
                  )}
                </TableCell>
              )}
              {(typeof columns === 'function'
                ? columns(rowData, actionProps)
                : columns
              ).map((col, index) => index === 0 ? (
                <TableCell
                  component="th"
                  scope="row"
                  key={col.heading}
                  align={col.align || 'left'}>
                  {col.value(rowData, actionProps, history.location)}
                </TableCell>
              ) : (
                <TableCell key={col.heading} align={col.align || 'left'}>
                  {col.value(rowData, actionProps, history.location)}
                </TableCell>
              ))}
              {rowActions && (
                <TableCell className={classes.actionCell}>
                  <ActionMenu
                    selectAction={handleActionSelected}
                    actionProps={actionProps}
                    rowActions={rowActions}
                    rowData={rowData}
                  />
                </TableCell>
              )}
            </DataRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
