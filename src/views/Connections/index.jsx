import { useState } from 'react';
import RowDetail from './RowDetail';
import ResourceList from '../../components/ResourceList';
import LoadResources from '../../components/LoadResources';
import ResourceReferences from '../../components/ResourceReferences';

export default function Exports() {
  const [showReferences, setShowReferences] = useState(false);
  const [id, setId] = useState(null);

  function handleReferencesClick(id) {
    setShowReferences(true);
    setId(id);
  }

  function handleReferencesClose() {
    setShowReferences(false);
    setId(null);
  }

  return (
    <LoadResources resources={['connections']}>
      {showReferences && id && (
        <ResourceReferences
          type="connections"
          id={id}
          onReferencesClose={handleReferencesClose}
        />
      )}
      <ResourceList resourceType="connections" displayName="Connections">
        <RowDetail handleReferencesClick={handleReferencesClick} />
      </ResourceList>
    </LoadResources>
  );
}
