import RowDetail from './RowDetail';
import ResourceList from '../../components/ResourceList';
import LoadResources from '../../components/LoadResources';

export default function Stacks() {
  return (
    <LoadResources resources={['stacks']}>
      <ResourceList resourceType="stacks" displayName="Stacks">
        <RowDetail />
      </ResourceList>
    </LoadResources>
  );
}
