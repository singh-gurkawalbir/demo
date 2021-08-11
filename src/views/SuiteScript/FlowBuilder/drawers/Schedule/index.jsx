import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
import RightDrawer from '../../../../../components/drawer/Right';
import DrawerHeader from '../../../../../components/drawer/Right/DrawerHeader';
import FlowSchedule from '../../../../../components/SuiteScript/FlowSchedule';

function RoutingWrapper(props) {
  const history = useHistory();
  const match = useRouteMatch();
  const flowId = props.flowId || match.params.flowId;
  const { ssLinkedConnectionId } = props;
  const flow = useSelector(state =>
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
    />
  );
}

export default function ScheduleDrawer(props) {
  return (
    <RightDrawer
      path={[':flowId/schedule', 'schedule']}
      width="medium"
    >
      <DrawerHeader title="Flow schedule" />
      <RoutingWrapper {...props} />
    </RightDrawer>
  );
}
