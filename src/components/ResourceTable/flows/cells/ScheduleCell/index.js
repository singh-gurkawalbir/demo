import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Chip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import CalendarIcon from '../../../../icons/CalendarIcon';
import RemoveMargin from '../RemoveMargin';
import { selectors } from '../../../../../reducers';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';
import { buildDrawerUrl, drawerPaths } from '../../../../../utils/rightDrawer';
import { message } from '../../../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  disabled: {
    opacity: 0.5,
  },
  circle: {
    position: 'relative',
    '& .MuiButtonBase-root': {
      '&:before': {
        content: '""',
        height: theme.spacing(1),
        width: theme.spacing(1),
        borderRadius: '50%',
        backgroundColor: theme.palette.primary.main,
        position: 'absolute',
        top: theme.spacing(1.5),
        right: theme.spacing(1.5),
        display: 'block',
        zIndex: 1,
      },
    },
  },
}));

export default function ScheduleCell({flowId, name, actionProps, schedule}) {
  const history = useHistory();
  const classes = useStyles();
  const { allowSchedule, type } = (actionProps.flowAttributes[flowId] || {});
  const isSetupInProgress = useSelector(state => selectors.isFlowSetupInProgress(state, flowId));
  const tooltipTitle = isSetupInProgress
    ? message.FLOWS.INCOMPLETE_FLOW_SCHEDULE_TOOLTIP
    : `${schedule ? 'Edit' : 'Add'} schedule`;

  if (!allowSchedule) {
    if (type !== 'Scheduled') {
      return <Chip size="small" label={type} />;
    }

    return null;
  }

  return (
    <RemoveMargin>
      <div className={clsx(!!schedule && classes.circle)}>
        <IconButtonWithTooltip
          tooltipProps={{
            title: tooltipTitle,
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
      </div>
    </RemoveMargin>
  );
}
