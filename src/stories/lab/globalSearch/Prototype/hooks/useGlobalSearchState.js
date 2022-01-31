import {isEqual} from 'lodash';
import { buildSearchString, getFilters, getKeyword } from '../utils';
import { createSharedState } from '../GlobalSearchContext/createSharedState';

const initialState = {
  keyword: '',
  filters: [],
  open: false,
};
const stateUpdaters = ({get, set}) => ({
  changeKeyword: newSearchString => {
    let newKeyword = getKeyword(newSearchString);
    const {filters} = get();
    let newFilters = filters;

    if (newSearchString?.includes(':')) {
      newKeyword = buildSearchString(filters, newSearchString);
      newFilters = getFilters(newSearchString);
    }
    if (!isEqual(filters, newFilters)) {
      set(state => ({...state, keyword: newKeyword, filters: newFilters}));
    } else {
      set(state => ({...state, keyword: newKeyword}));
    }
  },
  clearSearch: () => set(state => ({...state, keyword: ''})),
  changeFilters: type => {
    let newFilters = [];
    const {filters} = get();

    if (type === 'all') {
      newFilters = [];
    } else if (filters?.includes(type)) {
      newFilters = filters.filter(i => i !== type);
    } else {
      // last case is type not present, so add it.
      newFilters = [...filters, type];
    }
    set(state => ({...state, filters: newFilters}));
  },
  changeOpen: value => {
    if (!value) {
      return set(state => ({...state, ...initialState}));
    }

    return set(state => ({...state, open: value}));
  },
});

export const useGlobalSearchState = createSharedState(({get, set}) => ({
  ...initialState,
  ...stateUpdaters({get, set}),
}));
