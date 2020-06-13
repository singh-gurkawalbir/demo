import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TrashIcon from '../../../../../icons/TrashIcon';
import IconButtonWithTooltip from '../../../../../IconButtonWithTooltip';
import { flowAllowsScheduling } from '../../../../../../utils/suiteScript'
import * as selectors from '../../../../../../reducers';


export default function DeleteCell({ssLinkedConnectionId, flow}) {
  const history = useHistory();
  const handleClick = useCallback(() => {
    history.push(`flows/${flow._id}/schedule`);
  }, [flow._id, history]);
  const allowSchedule = flowAllowsScheduling(flow);

  const hasManagePermissions = useSelector(
    state =>
      selectors.resourcePermissions(state, 'connections', ssLinkedConnectionId)
        .edit
  );

  if (!allowSchedule) return null;

  return (
    <IconButtonWithTooltip
      tooltipProps={{title: 'Delete', placement: 'bottom'}}
      onClick={handleClick}
      disabled={!hasManagePermissions}>
      <TrashIcon />
    </IconButtonWithTooltip>
  );
}
