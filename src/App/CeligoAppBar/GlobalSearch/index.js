import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import GlobalSearch from '../../../stories/lab/globalSearch/Prototype';
import LoadResources from '../../../components/LoadResources';
import { selectors } from '../../../reducers/index';
import {getReduxState} from '../../../index';
import useResourceListItems from '../../../hooks/useSidebarListItems';
import {getResourceItems, getResourcesToLoad, getFilterBlacklist} from './utils';

export default function GSearch() {
  const defaultShareID = useSelector(state => state?.user?.preferences?.defaultAShareId);
  const sidebarListItems = useResourceListItems();
  const resourceItems = useMemo(() => getResourceItems(sidebarListItems), [sidebarListItems]);
  const resourcesToLoad = useMemo(() => getResourcesToLoad(resourceItems), [resourceItems]);
  const filterBlacklist = useMemo(() => getFilterBlacklist(resourceItems), [resourceItems]);

  const getResults = useCallback((searchKeyword, filters) => {
    const state = getReduxState();
    const globalSearchResults = selectors.globalSearchResults(state, searchKeyword, filters);

    return globalSearchResults;
  }, []);

  return defaultShareID ? (
    <LoadResources required={false} resources={resourcesToLoad}>
      <GlobalSearch filterBlacklist={filterBlacklist} getResults={getResults} />
    </LoadResources>
  ) : null;
}
