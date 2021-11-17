import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors } from '../../../reducers';
import TileView from './TileView';
import ListView from './ListView';
import actions from '../../../actions';
import LoadResources from '../../../components/LoadResources';
import { FILTER_KEY } from '../../../utils/home';

const DEFAULT_FILTERS = {
  sort: { order: 'asc', orderBy: 'name' },
  searchBy: ['name', 'description', 'flowsNameAndDescription'],
  take: parseInt(process.env.DEFAULT_TABLE_ROW_COUNT, 10) || 10,
};

export default function HomeView() {
  const dispatch = useDispatch();
  const isListView = useSelector(state => selectors.isHomeListView(state));
  const searchInput = useSelector(state => selectors.filter(state, FILTER_KEY)?.keyword);

  // lazily load flows, only if search input is entered
  const resourcesToLoad = searchInput ? 'published,integrations,connections,marketplacetemplates,flows'
    : 'published,integrations,connections,marketplacetemplates';

  useEffect(() => {
    dispatch(actions.patchFilter(FILTER_KEY, DEFAULT_FILTERS));

    return () => dispatch(actions.clearFilter(FILTER_KEY));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LoadResources required resources={resourcesToLoad}>
      {isListView
        ? <ListView />
        : <TileView />}
    </LoadResources>
  );
}
