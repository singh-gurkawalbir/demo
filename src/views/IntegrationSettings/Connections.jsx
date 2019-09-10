import { useSelector } from 'react-redux';
import * as selectors from '../../reducers';
import LoadResources from '../../components/LoadResources';
import ResourceTable from '../ResourceList/ResourceTable';

function Connections(props) {
  const { match } = props;
  const { integrationId } = match.params;
  const connList = useSelector(state =>
    selectors.resourceList(state, {
      type: 'connections',
    })
  );
  const integrationList = useSelector(state =>
    selectors.resourceList(state, {
      type: 'integrations',
    })
  );

  if (integrationId && integrationId !== 'none') {
    const integration =
      integrationList &&
      integrationList.resources &&
      integrationList.resources.find(
        integration => integration._id === integrationId
      );
    const registeredConnections =
      integration && integration._registeredConnectionIds;

    if (registeredConnections) {
      connList.resources =
        connList &&
        connList.resources &&
        connList.resources.filter(
          conn => registeredConnections.indexOf(conn._id) >= 0
        );
    }
  }

  return (
    <LoadResources required resources="connections">
      <ResourceTable
        resourceType="connections"
        resources={connList && connList.resources}
      />
    </LoadResources>
  );
}

export default Connections;
