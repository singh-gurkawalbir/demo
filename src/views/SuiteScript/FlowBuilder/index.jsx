import { withRouter, useRouteMatch } from 'react-router-dom';

function FlowBuilder() {
  const match = useRouteMatch();
  const {
    ssLinkedConnectionId,
    integrationId,
    flowType,
    flowId,
  } = match.params;

  console.log(`SS FlowBuilder`, {
    ssLinkedConnectionId,
    integrationId,
    flowType,
    flowId,
  });
}

export default withRouter(FlowBuilder);
