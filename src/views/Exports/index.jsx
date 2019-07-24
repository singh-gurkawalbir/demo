import RowDetail from './RowDetail';
import ResourceList from '../../components/ResourceList';
import LoadResources from '../../components/LoadResources';

export default function Exports() {
  return (
    <LoadResources resources={['exports', 'connections']}>
      <ResourceList resourceType="exports" displayName="Exports">
        <RowDetail />
      </ResourceList>
    </LoadResources>
  );
}
