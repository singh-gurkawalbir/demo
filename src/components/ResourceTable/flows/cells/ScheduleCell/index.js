import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Chip, makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import CalendarIcon from '../../../../icons/CalendarIcon';
import RemoveMargin from '../RemoveMargin';
import { selectors } from '../../../../../reducers';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';
import { buildDrawerUrl, drawerPaths } from '../../../../../utils/rightDrawer';
import messageStore from '../../../../../utils/messageStore';

const useStyles = makeStyles(() => ({
  disabled: {
    opacity: 0.5,
  },
}));

export default function ScheduleCell({flowId, name, actionProps}) {
  const history = useHistory();
  const classes = useStyles();
  const { allowSchedule, type } = (actionProps.flowAttributes[flowId] || {});
  const isSetupInProgress = useSelector(state => selectors.isFlowSetupInProgress(state, flowId));

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
          title: isSetupInProgress ? messageStore('INCOMPLETE_FLOW_SCHEDULE_TOOLTIP') : 'Change schedule',
          placement: 'bottom',
        }}
        className={{[classes.disabled]: isSetupInProgress}}
        disabled={isSetupInProgress}
        component={Link}
        data-test={`flowSchedule-${name}`}
        // TODO @Raghu: Why are we using location.pathname? Doesn't match.url help like we do at other places?
        to={buildDrawerUrl({
          path: drawerPaths.FLOW_BUILDER.FLOW_SCHEDULE,
          baseUrl: history.location.pathname,
          params: { flowId },
        })}>
        <CalendarIcon color="secondary" />
      </IconButtonWithTooltip>
    </RemoveMargin>
  );
}
