import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import { selectors } from '../../../../reducers';
import RightDrawer from '../../../../components/drawer/Right';
import DrawerHeader from '../../../../components/drawer/Right/DrawerHeader';
import DrawerContent from '../../../../components/drawer/Right/DrawerContent';
import DrawerFooter from '../../../../components/drawer/Right/DrawerFooter';
import FlowScheduleForm from '../../../../components/FlowSchedule/Form';
import FlowScheduleButtons from '../../../../components/FlowSchedule/Buttons';
import LoadResources from '../../../../components/LoadResources';

const useStyle = makeStyles(theme => ({
  scheduleContainer: {
    width: '100%',
    // overflowX: 'hidden',
    '& > div:first-child': {
      marginLeft: theme.spacing(-1),
      paddingRight: 0,
    },
  },
  paperDefault: {
    padding: theme.spacing(2),
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
}));

function DrawerForm(props) {
  const classes = useStyle();
  const history = useHistory();
  const match = useRouteMatch();
  const flowId = props.flowId || match.params.flowId;
  const flow = useSelector(state =>
    selectors.resource(state, 'flows', flowId)
  );

  const formKey = 'flow-schedule';

  // TODO: Ashok: Connector specific things to be added for schedule drawer
  // incase of !isViewMode && isIntegrationApp
  return (
    <LoadResources required resources="flows">
      <DrawerContent className={classes.scheduleContainer}>
        <Paper elevation={0} className={classes.paperDefault}>
          <FlowScheduleForm formKey={formKey} flow={flow} />
        </Paper>
      </DrawerContent>

      <DrawerFooter>
        <FlowScheduleButtons
          formKey={formKey}
          flow={flow}
          // eslint-disable-next-line react/jsx-handler-names
          onClose={history.goBack} />
      </DrawerFooter>
    </LoadResources>
  );
}

export default function ScheduleDrawer({flowId}) {
  return (
    <RightDrawer path={[':flowId/schedule', 'schedule']}>
      <DrawerHeader title="Flow schedule" />
      <DrawerForm flowId={flowId} />
    </RightDrawer>
  );
}
