import React, { useCallback, useMemo } from 'react';
import GlobalSearch from '../../../components/globalSearch';
import LoadResources from '../../../components/LoadResources';
import { selectors } from '../../../reducers/index';
import {getReduxState} from '../../../store';
import useResourceListItems from '../../../hooks/useSidebarListItems';
import {getResourceItems, getResourcesToLoad, getFilterBlacklist} from './utils';

export default function GSearch() {
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
      <GlobalSearch filterBlacklist={filterBlacklist} getResults={getResults} />
    </LoadResources>
  );
}
