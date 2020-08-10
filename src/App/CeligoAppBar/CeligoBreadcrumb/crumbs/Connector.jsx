import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import LoadResources from '../../../../components/LoadResources';

export default function ConnectorCrumb({ connectorId }) {
  const connector = useSelector(state =>
    selectors.resource(state, 'connectors', connectorId)
  );

  return (
    <LoadResources resources="connectors">
      {connector?.name || 'Integration app'}
    </LoadResources>
  );
}
