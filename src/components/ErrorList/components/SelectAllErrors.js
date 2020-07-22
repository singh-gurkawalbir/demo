import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import CheckboxUnselectedIcon from '../../icons/CheckboxUnselectedIcon';
import CheckboxSelectedIcon from '../../icons/CheckboxSelectedIcon';
import actions from '../../../actions';
import { isAllErrorsSelected } from '../../../reducers';

export default function SelectAllErrors({
  flowId,
  resourceId,
  isResolved,
  filterKey,
  defaultFilter,
  actionInProgress,
}) {
  const dispatch = useDispatch();
  const isAllSelected = useSelector(state =>
    isAllErrorsSelected(state, {
      flowId,
      resourceId,
      isResolved,
      filterKey,
      defaultFilter,
    })
  );
  const handleChange = event => {
    const { checked } = event.target;

    dispatch(
      actions.errorManager.flowErrorDetails.selectAll({
        flowId,
        resourceId,
        checked,
        options: {
          filterKey,
          defaultFilter,
          isResolved,
        },
      })
    );
  };

  return (
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
      onChange={event => handleChange(event)}
      checked={isAllSelected}
      disabled={!!actionInProgress}
      color="primary"
    />
  );
}
