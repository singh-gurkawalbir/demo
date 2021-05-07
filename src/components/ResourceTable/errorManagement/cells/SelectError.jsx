import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import useTraceUpdate from 'use-trace-update';
import CheckboxUnselectedIcon from '../../../icons/CheckboxUnselectedIcon';
import CheckboxSelectedIcon from '../../../icons/CheckboxSelectedIcon';
import actions from '../../../../actions';

export default function SelectError({
  flowId,
  resourceId,
  error,
  isResolved,
  actionInProgress,
}) {
  const dispatch = useDispatch();

  const handleChange = useCallback(event => {
    const { checked } = event.target;

    dispatch(
      actions.errorManager.flowErrorDetails.selectErrors({
        flowId,
        resourceId,
        isResolved,
        errorIds: [error.errorId],
        checked,
      })
    );
  }, [dispatch, error.errorId, flowId, isResolved, resourceId]);

  const isDisabled = !!actionInProgress;

  // useTraceUpdate({selected: error.selected, handleChange, isDisabled});

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
        checked={error.selected || false}
        disabled={isDisabled}
        color="primary"
    />
    ), [error.selected, handleChange, isDisabled])
  );
}
