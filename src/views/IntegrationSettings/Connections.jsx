import { useSelector } from 'react-redux';
import * as selectors from '../../reducers';
import LoadResources from '../../components/LoadResources';
import ResourceTable from '../ResourceList/ResourceTable';

function Connections(props) {
  const { match } = props;
  const { integrationId } = match.params;
  const list = useSelector(state =>
    selectors.integrationConnectionList(state, integrationId)
  );

  return (
    <LoadResources required resources="connections">
      <ResourceTable
        resourceType="connections"
        resources={list && list.resources}
      />
    </LoadResources>
  );
}

export default Connections;
