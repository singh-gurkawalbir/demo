import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../reducers';

export default function useMarketPlaceConnectors(application, sandbox) {
  // allResources must be memoized or else it does not cache the result
  const makeMarketPlaceConnectorsSelector = useMemo(
    () => selectors.makeMarketPlaceConnectorsSelector(),
    []
  );

  return useSelector(state =>
    makeMarketPlaceConnectorsSelector(state, application, sandbox)
  );
}
