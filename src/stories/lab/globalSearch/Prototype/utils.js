import { filterMap } from './filterMeta';

function buildSearchString(filters, keyword) {
  if (!filters?.length) {
    return keyword;
  }
  const filterPrefix = filters.map(f => filterMap[f]?.shortcut).filter(s => s).join(',');

  return `${filterPrefix}: ${keyword}`;
}

function getFilters(searchString) {
  if (!searchString?.length) return [];

  const parts = searchString.split(':');

  if (parts.length === 1) return [];

  const filterShortcuts = parts[0].split(',');

  const selectedFilters = [];
  const allFilters = Object.keys(filterMap);

  filterShortcuts.forEach(s => {
    const shortcut = s.trim().toLowerCase();

    if (shortcut.length === 0) return;

    allFilters.forEach(f => {
      const label = filterMap[f].label.toLowerCase();
      const filter = filterMap[f].type;

      if (label.startsWith(shortcut) && !selectedFilters.includes(filter)) {
        selectedFilters.push(filter);
      }
    });
  });

  // console.log(filterShortcuts, selectedFilters);

  return selectedFilters;
}

function getKeyword(searchString) {
  const parts = searchString.split(':');

  if (parts.length > 1) {
    return parts[1].trim();
  }

  return searchString;
}

function getTabResults(results) {
  const resultsObject = Object.keys(filterMap).reduce((acc, key) => {
    if (!results[key]) return acc;
    const item = {type: key, results: results[key]};

    if (filterMap?.[key]?.isResource) {
      acc.resourceResultCount += item.results?.length;
      acc?.resourceResults?.push(item);
    } else {
      acc.marketplaceResultCount += item.results?.length;
      acc.marketplaceResults.push(item);
    }

    return acc;
  }, {resourceResults: [], marketplaceResults: [], marketplaceResultCount: 0, resourceResultCount: 0});

  return resultsObject;
}

export { getFilters, getKeyword, getTabResults, buildSearchString};
