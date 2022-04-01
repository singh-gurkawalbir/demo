import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Chip } from '@material-ui/core';
import CalendarIcon from '../../../../icons/CalendarIcon';
import RemoveMargin from '../RemoveMargin';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';
import { DRAWER_URL_PREFIX } from '../../../../../utils/rightDrawer';

export default function ScheduleCell({flowId, name, actionProps}) {
  const history = useHistory();
  const { allowSchedule, type } = (actionProps.flowAttributes[flowId] || {});

  if (!allowSchedule) {
    if (type !== 'Scheduled') {
      return <Chip size="small" label={type} />;
    }

    return null;
  }

  return (
    <RemoveMargin>
      <IconButtonWithTooltip
        tooltipProps={{
          title: 'Change schedule',
          placement: 'bottom',
        }}
        // disabled={!allowSchedule}
        component={Link}
        data-test={`flowSchedule-${name}`}
        // TODO @Raghu: Why are we using location.pathname? Doesn't match.url help like we do at other places?
        to={`${history.location.pathname}/${DRAWER_URL_PREFIX}/${flowId}/schedule`}>
        <CalendarIcon color="secondary" />
      </IconButtonWithTooltip>
    </RemoveMargin>
  );
}
