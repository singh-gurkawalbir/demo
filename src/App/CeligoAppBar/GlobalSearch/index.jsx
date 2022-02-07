import React, { useCallback, useMemo } from 'react';
import Search from '../../../components/GlobalSearch';
import LoadResources from '../../../components/LoadResources';
import { selectors } from '../../../reducers/index';
import {getReduxState} from '../../../store';
import useResourceListItems from '../../../hooks/useSidebarListItems';
import {getResourceItems, getResourcesToLoad, getFilterBlacklist} from './utils';

export default function GlobalSearch() {
  const sidebarListItems = useResourceListItems();
  const resourceItems = useMemo(() => getResourceItems(sidebarListItems), [sidebarListItems]);
  const resourcesToLoad = useMemo(() => getResourcesToLoad(resourceItems), [resourceItems]);
  const filterBlacklist = useMemo(() => getFilterBlacklist(resourceItems), [resourceItems]);
  const getResults = useCallback((searchKeyword, filters) => {
    const state = getReduxState();
    const globalSearchResults = selectors.globalSearchResults(state, searchKeyword, filters);

    return globalSearchResults;
  }, []);

  return (
    <LoadResources required resources={resourcesToLoad}>
      <Search filterBlacklist={filterBlacklist} getResults={getResults} />
    </LoadResources>
  );
}
