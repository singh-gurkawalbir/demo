
import {
  TableCell,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import React, { useCallback } from 'react';
import CheckboxSelectedIcon from '../../../icons/CheckboxSelectedIcon';
import CheckboxUnselectedIcon from '../../../icons/CheckboxUnselectedIcon';

export default function SelectableCheckBoxCell({
  selectableRows,
  isSelectableRow,
  rowData,
  handleSelectChange,
  selectedResources,
}) {
  const onChange = useCallback(
    event => handleSelectChange(event, rowData._id),
    [handleSelectChange, rowData._id]);
  const shouldShowSelectableCheckBox = isSelectableRow ? !!isSelectableRow(rowData) : true;
  const isChecked = !!selectedResources[rowData._id];

  if (!selectableRows || !shouldShowSelectableCheckBox) { return null; }

  return (

    <TableCell >
      <Checkbox
        onChange={onChange}
        checked={isChecked}
        color="primary"
        icon={(<span><CheckboxUnselectedIcon /></span>)}
        checkedIcon={(<span><CheckboxSelectedIcon /></span>)}
              />

    </TableCell>
  );
}
