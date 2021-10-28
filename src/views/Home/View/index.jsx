import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../reducers';
import TileView from './TileView';
import ListView from './ListView';
import LoadResources from '../../../components/LoadResources';
import { FILTER_KEY, LIST_VIEW } from '../util';

export default function HomeView() {
  const viewType = useSelector(state => selectors.userPreferences(state).dashboard?.view);
  const searchInput = useSelector(state => selectors.filter(state, FILTER_KEY)?.keyword);

  // lazily load flows, only if search input is entered
  // todo: ashu consider adding this inside each view instead
  const resourcesToLoad = searchInput ? 'published,integrations,connections,marketplacetemplates,flows'
    : 'published,integrations,connections,marketplacetemplates';

  return (
    <LoadResources
      required
      resources={resourcesToLoad}>
      {viewType === LIST_VIEW
        ? <ListView />
        : <TileView />}
    </LoadResources>
  );
}
