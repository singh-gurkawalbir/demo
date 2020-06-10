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
import actions from '../../actions';
import * as selectors from '../../reducers';
import ActionMenu from './ActionMenu';
import CheckboxUnselectedIcon from '../icons/CheckboxUnselectedIcon';
import CheckboxSelectedIcon from '../icons/CheckboxSelectedIcon';

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
    '& > td:last-child > div': {
      display: 'none',
    },
    '&:hover > td:last-child > div': {
      display: 'flex',
      justifyContent: 'center',
    },
    '&:hover > td:last-child > svg': {
      display: 'none',
    },
  },
  actionCell: {
    padding: '0 !important',
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
    textAlign: 'center',
  },
}));

export default function CeligoTable({
  columns,
  rowActions,
  data = [],
  onSelectChange,
  selectableRows,
  isSelectableRow,
  filterKey,
  actionProps = {},
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
    <div>
      {selectedAction}
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {selectableRows && (
              <TableCell>
                <Checkbox
                  icon={
                    <span>
                      <CheckboxUnselectedIcon />
                    </span>
                  }
                  checkedIcon={
                    <span>
                      <CheckboxSelectedIcon />
                    </span>
                  }
                  onChange={event => handleSelectAllChange(event)}
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
              <TableCell className={classes.actionColHead}>Actions</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(rowData => (
            <TableRow hover key={rowData._id} className={classes.row}>
              {selectableRows && (
                <TableCell>
                  {(isSelectableRow ? !!isSelectableRow(rowData) : true) && (
                    <Checkbox
                      onChange={event => handleSelectChange(event, rowData._id)}
                      checked={!!selectedResources[rowData._id]}
                      color="primary"
                      icon={
                        <span>
                          <CheckboxUnselectedIcon />
                        </span>
                      }
                      checkedIcon={
                        <span>
                          <CheckboxSelectedIcon />
                        </span>
                      }
                    />
                  )}
                </TableCell>
              )}
              {(typeof columns === 'function'
                ? columns(rowData, actionProps)
                : columns
              ).map((col, index) =>
                index === 0 ? (
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
                )
              )}
              {rowActions && (
                <TableCell className={classes.actionCell}>
                  <ActionMenu
                    selectAction={handleActionSelected}
                    // rowActions may or may not be a fn. Sometimes
                    // the actions are static, other times they are
                    // determinant on the resource they apply to.
                    // Check on this later for the scope of refactor
                    actions={(typeof rowActions === 'function'
                      ? rowActions(rowData, actionProps)
                      : rowActions
                    ).map(({ icon, label, hasAccess, component: Action }) => ({
                      icon:
                        // TODO: @Adi, we can not use this same pattern for Icon as we do for label.
                        // remember that an Icon is a component, which is a function. So the typeof
                        // will always be true. here we this inject the Icon component with rowData
                        // and cause runtime warnings in the console...
                        // do we need this feature at all? do we have icons that change for some actions?
                        typeof icon === 'function'
                          ? icon(rowData, actionProps)
                          : icon,
                      hasAccess,
                      rowData,
                      actionProps,
                      label:
                        typeof label === 'function'
                          ? label(rowData, actionProps)
                          : label,
                      component: <Action {...actionProps} rowData={rowData} />,
                    }))}
                  />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
