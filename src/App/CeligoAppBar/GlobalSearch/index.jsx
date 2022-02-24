import React, { useCallback, useMemo } from 'react';
import Search from '../../../components/GlobalSearch';
import LoadResources from '../../../components/LoadResources';
import { selectors } from '../../../reducers/index';
import {getReduxState} from '../../../store';
import useResourceListItems from '../../../hooks/useSidebarListItems';
import {getResourceItems, getResourcesToLoad, getFilterBlacklist} from './utils';
import useSyncedRef from '../../../hooks/useSyncedRef';

export default function GlobalSearch() {
  const sidebarListItems = useResourceListItems();
  const resourceItems = useMemo(() => getResourceItems(sidebarListItems), [sidebarListItems]);
  const resourcesToLoad = useMemo(() => getResourcesToLoad(resourceItems), [resourceItems]);
  const filterBlacklist = useMemo(() => getFilterBlacklist(resourceItems), [resourceItems]);
  const filterBlackListRef = useSyncedRef(filterBlacklist);
  const getResults = useCallback((searchKeyword, filters) => {
    const filterBlacklist = filterBlackListRef.current;
    const state = getReduxState();
    const globalSearchResults = selectors.globalSearchResults(state, searchKeyword, filters, filterBlacklist);

    return globalSearchResults;
  }, [filterBlackListRef]);

  return (
    <LoadResources required resources={resourcesToLoad}>
      <Search filterBlacklist={filterBlacklist} getResults={getResults} />
    </LoadResources>
  );
}
