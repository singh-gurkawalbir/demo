import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { selectors } from '../../../../reducers';
import LoadResources from '../../../../components/LoadResources';

export default function ConnectorCrumb({ connectorId }) {
  const history = useHistory();
  const connector = useSelector(state =>
    selectors.resource(state, 'connectors', connectorId)
  );

  const handleClick = useCallback(e => {
    e.preventDefault();
    history.push('/connectors');
  }, [history]);

  return (
    <LoadResources resources="connectors">
      <span onClick={handleClick} >
        {connector?.name || 'Integration app'}
      </span>
    </LoadResources>
  );
}
