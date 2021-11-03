import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors } from '../../../reducers';
import TileView from './TileView';
import ListView from './ListView';
import actions from '../../../actions';
import LoadResources from '../../../components/LoadResources';
import { FILTER_KEY, LIST_VIEW, DEFAULT_FILTERS } from '../../../utils/home';

export default function HomeView() {
  const dispatch = useDispatch();

  const viewType = useSelector(state => selectors.userPreferences(state).dashboard?.view);
  const searchInput = useSelector(state => selectors.filter(state, FILTER_KEY)?.keyword);

  // lazily load flows, only if search input is entered
  // todo: ashu consider adding this inside each view instead
  const resourcesToLoad = searchInput ? 'published,integrations,connections,marketplacetemplates,flows'
    : 'published,integrations,connections,marketplacetemplates';

  useEffect(() => {
    dispatch(actions.patchFilter(FILTER_KEY, DEFAULT_FILTERS));

    return () => dispatch(actions.clearFilter(FILTER_KEY));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LoadResources required resources={resourcesToLoad}>
      {viewType === LIST_VIEW
        ? <ListView />
        : <TileView />}
    </LoadResources>
  );
}
