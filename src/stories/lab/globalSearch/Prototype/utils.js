import { filterMap } from './filterMeta';

export function buildSearchString(filters, keyword) {
  if (!filters?.length) {
    return keyword;
  }
  const filterPrefix = filters.map(f => filterMap[f]?.shortcut).filter(s => s).join(',');

  return `${filterPrefix}: ${keyword}`;
}

export function getFilters(searchString) {
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
      const filter = filterMap[f].resourceURL;

      if (label.startsWith(shortcut) && !selectedFilters.includes(filter)) {
        selectedFilters.push(filter);
      }
    });
  });

  return selectedFilters;
}

export function getKeyword(searchString) {
  const parts = searchString.split(':');

  if (parts.length > 1) {
    return parts[1].trim();
  }

  return searchString;
}

export function getTabResults(results) {
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
export function getResourceFilters(filterBlacklist) {
  const resultsObject = Object.keys(filterMap).reduce((acc, key) => {
    const item = filterMap[key];

    if (item?.isResource) {
      if (!filterBlacklist.includes(item.type)) {
        acc?.resourceFilters?.push(item);
      }
    } else {
      acc.marketplaceFilters.push(item);
    }

    return acc;
  }, {resourceFilters: [], marketplaceFilters: []});

  return resultsObject;
}

export const getResultsLength = results => results?.reduce((oldState, action) => oldState + action?.results?.length, 0);

export function getResourceURL(type, result) {
  let url = result?.resourceURL;

  if (type === 'integrations') {
    url = `/${type}/${result?._id}`;

    return url;
  }
  if (type === 'flows') {
    url = `/integrations/${result?._integrationId}/flowBuilder/${result?._id}`;

    return url;
  }
  url = `/${type}/edit/${type}/${result?._id}`;

  return url;
}
