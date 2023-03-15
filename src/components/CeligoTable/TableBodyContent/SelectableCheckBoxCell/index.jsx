
import { TableCell, Checkbox } from '@mui/material';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import CheckboxSelectedIcon from '../../../icons/CheckboxSelectedIcon';
import CheckboxUnselectedIcon from '../../../icons/CheckboxUnselectedIcon';

export default function SelectableCheckBoxCell({
  selectableRows,
  isSelectableRow,
  rowData,
  filterKey,
  onSelectChange,
}) {
  const dispatch = useDispatch();

  const selectedResources = useSelector(state =>
    selectors.filter(state, filterKey)?.selected
  );
  const handleSelectChange = useCallback(
    event => {
      const resourceId = rowData._id;
      const { checked } = event.target;
      const selected = {...selectedResources, [resourceId]: checked};

      onSelectChange(selected);

      if (!checked) {
        dispatch(actions.patchFilter(filterKey, {selected, isAllSelected: false}));

        return;
      }
      dispatch(actions.patchFilter(filterKey, {selected}));
    },
    [dispatch, filterKey, onSelectChange, rowData._id, selectedResources]
  );

  const shouldShowSelectableCheckBox = isSelectableRow ? !!isSelectableRow(rowData) : true;
  const isChecked = !!selectedResources?.[rowData?._id];

  if (!selectableRows) { return null; }

  return (

    <TableCell >
      {shouldShowSelectableCheckBox && (
      <Checkbox
        onChange={handleSelectChange}
        checked={isChecked}
        color="primary"
        icon={(<span><CheckboxUnselectedIcon /></span>)}
        checkedIcon={(<span><CheckboxSelectedIcon /></span>)}
              />
      )}
    </TableCell>
  );
}
