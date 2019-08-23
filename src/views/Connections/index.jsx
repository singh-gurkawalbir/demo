import { useState } from 'react';
import RowDetail from './RowDetail';
import ResourceList from '../../components/ResourceList';
import LoadResources from '../../components/LoadResources';
import ResourceReferences from '../../components/ResourceReferences';
import ConfigureDebugger from '../../components/ConfigureDebugger';

export default function Connections() {
  const [id, setId] = useState(null);
  const [debugId, setDebugId] = useState(null);

  function handleReferencesClick(id) {
    setId(id);
  }

  function handleReferencesClose() {
    setId(null);
  }

  function handleSetDebugClick(id) {
    setDebugId(id);
  }

  function handleSetDebugClose() {
    setDebugId(null);
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
      {debugId && (
        <ConfigureDebugger id={debugId} onClose={handleSetDebugClose} />
      )}

      <ResourceList resourceType="connections" displayName="Connections">
        <RowDetail
          handleSetDebugClick={handleSetDebugClick}
          handleReferencesClick={handleReferencesClick}
        />
      </ResourceList>
    </LoadResources>
  );
}
