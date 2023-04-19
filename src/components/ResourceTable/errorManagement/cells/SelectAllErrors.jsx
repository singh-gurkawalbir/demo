import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Checkbox from '@mui/material/Checkbox';
import CheckboxUnselectedIcon from '../../../icons/CheckboxUnselectedIcon';
import CheckboxSelectedIcon from '../../../icons/CheckboxSelectedIcon';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';

export default function SelectAllErrors({
  flowId,
  resourceId,
  isResolved,
  actionInProgress,
}) {
  const dispatch = useDispatch();

  const isAllSelected = useSelector(state =>
    selectors.isAllErrorsSelectedInCurrPage(state, {
      flowId,
      resourceId,
      isResolved,
    })
  );
  const handleChange = useCallback(event => {
    const { checked } = event.target;

    dispatch(
      actions.errorManager.flowErrorDetails.selectAllInCurrPage({
        flowId,
        resourceId,
        checked,
        isResolved,
      })
    );
  }, [dispatch, flowId, isResolved, resourceId]);

  return (
    useMemo(() => (
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
        onChange={handleChange}
        checked={isAllSelected}
        disabled={!!actionInProgress}
        color="primary"
    />
    ), [actionInProgress, handleChange, isAllSelected]));
}
