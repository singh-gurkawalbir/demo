import React, { useCallback, useMemo } from 'react';
import { useSelector, useStore } from 'react-redux';
import Search from '../../../components/GlobalSearch';
import LoadResources from '../../../components/LoadResources';
import { selectors } from '../../../reducers/index';
import useResourceListItems from '../../../hooks/useSidebarListItems';
import {getResourceItems, getResourcesToLoad, getFilterBlacklist} from './utils';
import useSyncedRef from '../../../hooks/useSyncedRef';

export default function GlobalSearch() {
  const sidebarListItems = useResourceListItems();
  const resourceItems = useMemo(() => getResourceItems(sidebarListItems), [sidebarListItems]);
  const accessLevel = useSelector(
    state => selectors.resourcePermissions(state).accessLevel
  );
  const resourcesToLoad = useMemo(() => getResourcesToLoad(resourceItems, accessLevel), [resourceItems, accessLevel]);
  const filterBlacklist = useMemo(() => getFilterBlacklist(resourceItems), [resourceItems]);
  const filterBlackListRef = useSyncedRef(filterBlacklist);
  // During tests, we will be creating a new store for every test
  // The single store that we use for Provider
  //  cannot be used here directly ,hence useStore hook was used
  const storeRef = useSyncedRef(useStore());

  const getResults = useCallback((searchKeyword, filters) => {
    const store = storeRef.current;
    const filterBlacklist = filterBlackListRef.current;
    const state = store?.getState();
    const globalSearchResults = selectors.globalSearchResults(state, searchKeyword, filters, filterBlacklist);

    return globalSearchResults;
  }, [filterBlackListRef, storeRef]);

  return (
    <LoadResources required resources={resourcesToLoad}>
      <Search filterBlacklist={filterBlacklist} getResults={getResults} />
    </LoadResources>
  );
}
