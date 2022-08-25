import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Checkbox, Tooltip } from '@material-ui/core';
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
  }, [dispatch, error, flowId, isResolved, resourceId]);

  const isDisabled = !!actionInProgress;

  // useTraceUpdate({selected: error.selected, handleChange, isDisabled});

  return (
    useMemo(() => (
      <Tooltip title="Selected errors are added to a batch, on which you can perform bulk retry and resolve actions">
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
      </Tooltip>
    ), [error.selected, handleChange, isDisabled])
  );
}
