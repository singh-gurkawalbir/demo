import React, { useEffect } from 'react';
import {
  makeStyles,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import AllTableHeaderCells from './AllTableHeaderCells';
import SelectableCheckBox from './SelectableCheckbox';

const useStyles = makeStyles({

  actionColHead: {
    width: 125,
  },
});
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
  const classes = useStyles();
  const dispatch = useDispatch();

  const sort = useSelector(state =>
    selectors.filter(state, filterKey)?.sort
  );

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
        <AllTableHeaderCells
          filterKey={filterKey}
          useColumns={useColumns}
        />
        {useRowActions && (
        <TableCell align="center" className={classes.actionColHead}>
          {variant === 'slim' ? '' : 'Actions'}
        </TableCell>
        )}
      </TableRow>
    </TableHead>
  );
}
