import RowDetail from './RowDetail';
import ResourceList from '../../components/ResourceList';
import LoadResources from '../../components/LoadResources';

export default function Templates() {
  return (
    <LoadResources resources={['templates']}>
      <ResourceList resourceType="templates" displayName="Templates">
        <RowDetail />
      </ResourceList>
    </LoadResources>
  );
}
