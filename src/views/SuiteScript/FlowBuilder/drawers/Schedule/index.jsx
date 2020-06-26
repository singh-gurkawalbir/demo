import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../../../../../reducers';
import RightDrawer from '../../../../../components/drawer/Right';
import FlowSchedule from '../../../../../components/SuiteScript/FlowSchedule';

const useStyle = makeStyles((theme) => ({
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
  const { ssLinkedConnectionId } = props;
  const flow = useSelector((state) =>
    selectors.suiteScriptResource(state, {
      resourceType: 'flows',
      id: flowId,
      ssLinkedConnectionId,
    })
  );
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
      title="Flow schedule"
    >
      <RoutingWrapper {...props} />
    </RightDrawer>
  );
}
