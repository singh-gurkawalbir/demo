import { useRouteMatch } from 'react-router-dom';
import RightDrawer from '../../../../components/drawer/Right';
import FlowConnections from '../../../../components/FlowConnections';
import LoadResources from '../../../../components/LoadResources';

export default function ConnectionsDrawer() {
  const match = useRouteMatch();
  const { flowId } = match.params;

  return (
    <RightDrawer
      path="connections"
      width="medium"
      title="Connections used by this flow ">
      <LoadResources resources="connections">
        <FlowConnections flowId={flowId} />
      </LoadResources>
    </RightDrawer>
  );
}
