
import {TableCell, Checkbox } from '@mui/material';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import CheckboxSelectedIcon from '../../../icons/CheckboxSelectedIcon';
import CheckboxUnselectedIcon from '../../../icons/CheckboxUnselectedIcon';

export default function SelectableCheckBox({
  onSelectChange,
  isSelectableRow,
  data,
  filterKey,
  selectableRows,
}) {
  const dispatch = useDispatch();
  const isAllSelected = useSelector(state =>
    !!selectors.filter(state, filterKey)?.isAllSelected
  );
  const selectedResources = useSelector(state =>
    selectors.filter(state, filterKey)?.selected
  );

  const isAllSelectableResourcesSelected = useMemo(() => {
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
            return isSelected && !!selectedResources?.[resource._id];
          }

          return true;
        }

        return isSelected && !!selectedResources?.[resource._id];
      }, hasSelectableResources);
    }

    return isAllSelectableResourcesSelected;
  }, [data, isSelectableRow, selectedResources]);

  useEffect(() => {
    if (selectableRows) {
      dispatch(actions.patchFilter(filterKey, {isAllSelected: isAllSelectableResourcesSelected}));
    }
  }, [dispatch, filterKey, isAllSelectableResourcesSelected, selectableRows]);

  const handleSelectAllChange = useCallback(
    event => {
      const { checked } = event.target;
      const selected = data.reduce((acc, r) => {
        if (isSelectableRow) {
          acc[r._id] = isSelectableRow(r) ? checked : false;
        } else {
          acc[r._id] = checked;
        }

        return acc;
      }, {});

      onSelectChange(selected);
      dispatch(actions.patchFilter(filterKey, {selected, isAllSelected: checked}));
    },
    [data, dispatch, filterKey, isSelectableRow, onSelectChange]
  );

  if (!selectableRows) { return null; }

  return (

    <TableCell>
      <Checkbox
        icon={(<span> <CheckboxUnselectedIcon /> </span>)}
        checkedIcon={(<span> <CheckboxSelectedIcon /> </span>)}
        onChange={handleSelectAllChange}
        checked={isAllSelected}
        color="primary"
                />
    </TableCell>

  );
}
