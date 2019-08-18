import { useState } from 'react';
import RowDetail from './RowDetail';
import ResourceList from '../../components/ResourceList';
import LoadResources from '../../components/LoadResources';
import ResourceReferences from '../../components/ResourceReferences';

export default function Stacks() {
  const [stackId, setStackId] = useState(null);

  function handleReferencesClick(id) {
    setStackId(id);
  }

  function handleReferencesClose() {
    setStackId(null);
  }

  return (
    <LoadResources resources={['stacks']}>
      {stackId && (
        <ResourceReferences
          type="stacks"
          id={stackId}
          onClose={handleReferencesClose}
        />
      )}
      <ResourceList resourceType="stacks" displayName="Stacks">
        <RowDetail onReferencesClick={handleReferencesClick} />
      </ResourceList>
    </LoadResources>
  );
}
