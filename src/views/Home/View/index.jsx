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

  useEffect(() => {
    dispatch(actions.patchFilter(FILTER_KEY, DEFAULT_FILTERS));

    return () => dispatch(actions.clearFilter(FILTER_KEY));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LoadResources required resources="published,connections,marketplacetemplates" lazyResources="flows">
      {isListView
        ? <ListView />
        : <TileView />}
    </LoadResources>
  );
}
