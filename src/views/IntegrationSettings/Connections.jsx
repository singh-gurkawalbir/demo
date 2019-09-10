import { useSelector } from 'react-redux';
import * as selectors from '../../reducers';
import LoadResources from '../../components/LoadResources';
import ResourceTable from '../ResourceList/ResourceTable';

function Connections(props) {
  const { match } = props;
  const { integrationId } = match.params;
  const list = useSelector(state =>
    selectors.resourceList(state, {
      type: 'connections',
      integrationId,
    })
  );

  return (
    <LoadResources required resources="connections">
      <ResourceTable resourceType="connections" resources={list.resources} />
    </LoadResources>
  );
}

export default Connections;
