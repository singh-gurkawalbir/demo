import RowDetail from './RowDetail';
import ResourceList from '../../components/ResourceList';
import LoadResources from '../../components/LoadResources';

export default function Scripts() {
  return (
    <LoadResources resources={['scripts']}>
      <ResourceList resourceType="scripts" displayName="Scripts">
        <RowDetail />
      </ResourceList>
    </LoadResources>
  );
}
