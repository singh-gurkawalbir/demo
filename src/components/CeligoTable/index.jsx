import {
  Table,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import produce from 'immer';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import { selectors } from '../../reducers';
import TableBodyContent from './TableBodyContent';
import { TableContextWrapper } from './TableContext';
import TableHeader from './TableHeader';

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
  useColumns,
  onRowOver,
  onRowOut,
  useRowActions,
  data = emptySet,
  onSelectChange,
  selectableRows,
  isSelectableRow,
  filterKey,
  className,
  actionProps = emptyObj,
  variant = 'standard',  // slim | standard
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { sort } = useSelector(state =>
    selectors.filter(state, filterKey)
  );

  const [selectedResources, setSelectedResources] = useState({});
  const [isAllSelected, setIsAllSelected] = useState(false);

  useEffect(() => {
    if (filterKey && !sort) {
      // when no default order is defined then update lastModified to descending order
      dispatch(actions.patchFilter(filterKey, {sort: { order: 'desc', orderBy: 'lastModified' }}));
    }
  }, [dispatch, filterKey, sort]);
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

  console.log('see here', data, useColumns);

  return (
    <div className={clsx(className)}>
      <TableContextWrapper value={actionProps}>
        <Table data-public className={classes.table}>
          <TableHeader
            selectableRows={selectableRows}
            handleSelectAllChange={handleSelectAllChange}
            isAllSelected={isAllSelected}
            useColumns={useColumns}
            filterKey={filterKey}
            useRowActions={useRowActions}
            variant={variant}
  />

          <TableBodyContent
            data={data}
            onRowOver={onRowOver}
            onRowOut={onRowOut}
            selectableRows={selectableRows}
            isSelectableRow={isSelectableRow}
            selectedResources={selectedResources}
            handleSelectChange={handleSelectChange}
            useColumns={useColumns}
            useRowActions={useRowActions}
            variant={variant}
          />
        </Table>
      </TableContextWrapper>
    </div>
  );
}
