import { useState } from 'react';
import RowDetail from './RowDetail';
import ResourceList from '../../components/ResourceList';
import LoadResources from '../../components/LoadResources';
import ResourceReferences from '../../components/ResourceReferences';

export default function Connections() {
  const [id, setId] = useState(null);

  function handleReferencesClick(id) {
    setId(id);
  }

  function handleReferencesClose() {
    setId(null);
  }

  return (
    <LoadResources resources={['connections']}>
      {id && (
        <ResourceReferences
          type="connections"
          id={id}
          onClose={handleReferencesClose}
        />
      )}
      <ResourceList resourceType="connections" displayName="Connections">
        <RowDetail handleReferencesClick={handleReferencesClick} />
      </ResourceList>
    </LoadResources>
  );
}
