import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { IconButton } from '@mui/material';
import RunIcon from '../../icons/RunIcon';
import actions from '../../../actions';
import IconButtonWithTooltip from '../../IconButtonWithTooltip';
import {isFlowRunnable} from '../../../utils/suiteScript';

function RunFlowLabel({ disabled, onRunClick, variant }) {
  if (variant === 'icon') {
    if (disabled) {
      return (
        <IconButton data-test="runFlow" disabled size="large">
          <RunIcon />
        </IconButton>
      );
    }

    return (
      <IconButtonWithTooltip
        tooltipProps={{
          title: 'Run now',
          placement: 'bottom',
        }}
        disabled={disabled}
        data-test="runFlow"
        onClick={onRunClick}>
        <RunIcon color="secondary" />
      </IconButtonWithTooltip>
    );
  }

  return (
    <span onClick={onRunClick} data-test="runFlow">
      Run flow
    </span>
  );
}

export default function RunFlowButton({
  ssLinkedConnectionId,
  flow,
  onRunStart,
  variant = 'icon',
}) {
  const dispatch = useDispatch();
  const handleClick = useCallback(() => {
    dispatch(
      actions.suiteScript.flow.run({
        ssLinkedConnectionId,
        integrationId: flow._integrationId,
        flowId: flow._flowId,
        _id: flow._id,
      })
    );
    if (onRunStart) onRunStart();
  }, [dispatch, flow._flowId, flow._id, flow._integrationId, onRunStart, ssLinkedConnectionId]);
  const disabled = !isFlowRunnable(flow);

  return (
    <>
      <RunFlowLabel
        onRunClick={handleClick}
        variant={variant}
        disabled={disabled}
      />
    </>
  );
}
