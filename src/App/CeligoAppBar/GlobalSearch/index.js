import React, { useCallback, useMemo } from 'react';
import GlobalSearch from '../../../stories/lab/globalSearch/Prototype';
import LoadResources from '../../../components/LoadResources';
import { selectors } from '../../../reducers/index';
import {getReduxState} from '../../../index';
import useResourceListItems from '../../../hooks/useSidebarListItems';
import {getResourceItems, getResourcesToLoad, getFilterBlacklist} from './utils';
import useAreResourcesLoaded from '../../../hooks/useAreResourcesLoaded';

export default function GSearch() {
  const sidebarListItems = useResourceListItems();
  const resourceItems = useMemo(() => getResourceItems(sidebarListItems), [sidebarListItems]);
  const resourcesToLoad = useMemo(() => getResourcesToLoad(resourceItems), [resourceItems]);
  const filterBlacklist = useMemo(() => getFilterBlacklist(resourceItems), [resourceItems]);
  const {isAllDataReady} = useAreResourcesLoaded(resourcesToLoad);
  const getResults = useCallback((searchKeyword, filters) => {
    const state = getReduxState();
    const globalSearchResults = selectors.globalSearchResults(state, searchKeyword, filters);

    return globalSearchResults;
  }, []);

  return (
    <LoadResources required={false} resources={resourcesToLoad}>
      <GlobalSearch areAllResourcesLoaded={isAllDataReady} filterBlacklist={filterBlacklist} getResults={getResults} />
    </LoadResources>
  );
}
