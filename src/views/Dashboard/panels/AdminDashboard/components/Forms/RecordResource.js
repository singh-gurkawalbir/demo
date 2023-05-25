
import React from 'react';
import SelectResource from '../../../../../../components/LineGraph/SelectResource';

function RecordResource({integrationId, selectedResources, filteredFlowResources, handleResourcesChange}) {
  return (
    <SelectResource
      integrationId={integrationId}
      selectedResources={selectedResources}
      flowResources={filteredFlowResources}
      onSave={handleResourcesChange}
    />
  );
}

export default RecordResource;
