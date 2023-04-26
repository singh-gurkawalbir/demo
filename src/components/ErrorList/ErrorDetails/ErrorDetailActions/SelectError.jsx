import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Checkbox, FormControlLabel, Tooltip } from '@mui/material';
import CheckboxUnselectedIcon from '../../../icons/CheckboxUnselectedIcon';
import CheckboxSelectedIcon from '../../../icons/CheckboxSelectedIcon';
import actions from '../../../../actions';
import { message } from '../../../../utils/messageStore';

export default function SelectError({
  flowId,
  resourceId,
  error,
  isResolved,
  actionInProgress,
  label,
  tooltip,
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
      <Tooltip title={tooltip || message.ERROR_MANAGEMENT_2.SELECT_ERROR_HOVER_MESSAGE}>
        <FormControlLabel
          control={(
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
          )}
          label={label}
        />
      </Tooltip>
    ), [error.selected, handleChange, isDisabled, label, tooltip])
  );
}
