import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../../../../reducers';
import RightDrawer from '../../../../components/drawer/Right';
import FlowSchedule from '../../../../components/FlowSchedule';

const useStyle = makeStyles(theme => ({
  scheduleContainer: {
    width: '100%',
    overflowX: 'hidden',
    marginTop: -1,
    padding: theme.spacing(-1),
  },
}));

function RoutingWrapper(props) {
  const history = useHistory();
  const classes = useStyle();
  const match = useRouteMatch();
  const flowId = props.flowId || match.params.flowId;
  const flow = useSelector(state =>
    selectors.resource(state, 'flows', flowId)
  );

  // TODO: Ashok: Connector specific things to be added for schedule drawer
  // incase of !isViewMode && isIntegrationApp
  return (
    <FlowSchedule
      flow={flow}
      // eslint-disable-next-line react/jsx-handler-names
      onClose={history.goBack}
      className={classes.scheduleContainer}
  />
  );
}

export default function ScheduleDrawer(props) {
  return (
    <RightDrawer
      path={[':flowId/schedule', 'schedule']}
      width="medium"
      title="Flow schedule">
      <RoutingWrapper {...props} />
    </RightDrawer>
  );
}
