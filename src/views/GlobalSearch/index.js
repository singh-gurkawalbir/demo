import React from 'react';
import GlobalSearch from '../../stories/lab/globalSearch/Prototype';
import LoadResources from '../../components/LoadResources';
import { filterMap } from '../../stories/lab/globalSearch/Prototype/filterMeta';
import { selectors } from '../../reducers/index';
import {getReduxState} from '../../index';

export default function GSearch() {
  const resourcesToLoad = Object.values(filterMap)?.map(filter => filter?.resourceURL)?.join(',');
  const getResults = (searchKeyword, filters) => {
    const state = getReduxState();
    const globalSearchResults = selectors.globalSearchResults(state, searchKeyword, filters);

    return globalSearchResults;
  };

  return (
    <LoadResources required={false} resources={resourcesToLoad}>
      <GlobalSearch getResults={getResults} />
    </LoadResources>
  );
}
