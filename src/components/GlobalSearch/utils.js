import { filterMap } from './filterMeta';
/**
 * When search string has special characters,
 * We identify the filters from filterMap that starts with these characters
 * separated by commas
 * @param {string} searchString c,s: amazon
 * @returns {String[]} ['connections', 'scripts]
 */
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

/**
 * This util will segregate resource and marketplace results from results object
 * @param {Object} results {connections: [{...result1}], marketplaceTemplates: [{...result1}]}
 * @returns {{resourceResults: Object[], marketPlaceResults: Object[], resourceResultCount: number, marketPlaceResultCount: number}}
 * {resourceResults: [{type: 'connections', results: [{...result1}]}], marketplaceResults: [{type: 'marketplaceTemplates', result: [{...result1}]}], resourceResultCount: 1, marketPlaceResultCount: 1}
 */
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

/**
 * Takes filter blacklist and
 * Segregates resourceFilters and marketplaceFilters
 * from filterMap object
 * @param {string[]} filterBlacklist filters not to be shown in Globalsearch filter
 * @returns {{resourceFilters: string[], marketplaceFilters: string[]}}
 */
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

/**
 * To get the total number of results in all the resources
 * @param {Object[]} results
 * @returns {number} total number of results in all resources
 */
export const getResultsLength = results => results?.reduce((oldState, action) => oldState + action?.results?.length, 0);
