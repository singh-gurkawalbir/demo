import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import GlobalSearch from '../../stories/lab/globalSearch/Prototype';
import LoadResources from '../../components/LoadResources';
import { filterMap } from '../../stories/lab/globalSearch/Prototype/filterMeta';
import { selectors } from '../../reducers/index';

export default function GSearch() {
  const [searchString, setSearchString] = useState('');
  const resources = useSelector(state =>
    selectors.globalSearchResults(state, searchString)
  );

  const handleKeywordChange = useCallback(keyword => setSearchString(keyword), []);

  const resourcesToLoad = Object.values(filterMap)?.map(filter => filter?.resourceURL)?.join(',');

  return (
    <LoadResources required={false} resources={resourcesToLoad}>
      <GlobalSearch results={resources} onKeywordChange={handleKeywordChange} />
    </LoadResources>
  );
}
