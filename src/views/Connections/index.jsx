import RowDetail from './RowDetail';
import ResourceList from '../../components/ResourceList';
import LoadResources from '../../components/LoadResources';

export default function Exports() {
  return (
    <LoadResources resources={['connections']}>
      <ResourceList resourceType="connections" displayName="Connections">
        <RowDetail />
      </ResourceList>
    </LoadResources>
  );
}
