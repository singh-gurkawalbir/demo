import {isEqual} from 'lodash';
import { getFilters } from '../utils';
import { createSharedState } from '../../../store/createSharedState';

const initialState = {
  keyword: '',
  filters: [],
  open: false,
  resourceFiltersOpen: false,
};
const stateUpdaters = ({get, set}) => ({
  changeKeyword: newSearchString => {
    const {keyword, filters} = get();
    let newFilters = filters;

    // support string filters
    if (newSearchString?.includes(':')) {
      newFilters = getFilters(newSearchString);
    } else if (keyword?.includes(':') && !newSearchString?.includes(':')) {
      newFilters = [];
    }
    if (!isEqual(filters, newFilters)) {
      set(state => ({...state, keyword: newSearchString, filters: newFilters, resourceFiltersOpen: newFilters?.length > 0}));
    } else {
      set(state => ({...state, keyword: newSearchString}));
    }
  },
  changeResourceFiltersOpen: status => set(state => ({...state, resourceFiltersOpen: status})),
  clearSearch: () => set(state => ({...state, keyword: ''})),
  changeFilters: type => {
    let newFilters = [];
    const {filters, keyword} = get();

    if (type === 'all') {
      newFilters = [];
    } else if (filters?.includes(type)) {
      newFilters = filters.filter(i => i !== type);
    } else {
      // last case is type not present, so add it.
      newFilters = [...filters, type];
    }
    let newKeyword = keyword;

    if (keyword?.includes(':')) {
      const keywordTokens = keyword?.split(':');

      newKeyword = keywordTokens[keywordTokens?.length - 1];
    }
    set(state => ({...state, filters: newFilters, keyword: newKeyword}));
  },
  changeOpen: value => {
    if (!value) {
      return set(state => ({...state, ...initialState}));
    }

    return set(state => ({...state, open: value}));
  },
});

export const {StateProvider: GlobalSearchStateProvider, useSharedStateSelector: useGlobalSearchState} = createSharedState(({get, set}) => ({
  ...initialState,
  ...stateUpdaters({get, set}),
}));
