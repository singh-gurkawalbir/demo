import { filterMap } from '../../../components/GlobalSearch/filterMeta';

/**
 * Returns resources to be loaded string
 * @param {Object[]} resourceItems
 * @returns a string
 */
export function getResourcesToLoad(resourceItems) {
  const mandatoryResources = ['published', 'marketplacetemplates', 'integrations', 'flows'];
  const resourcesToLoad = resourceItems?.reduce((res, item) => {
    const resourceURL = filterMap[item]?.resourceURL;

    if (resourceURL && !mandatoryResources?.includes(resourceURL)) {
      res.push(resourceURL);
    }

    return res;
  }, [...mandatoryResources])?.join(',');

  return resourcesToLoad;
}
/**
 * Returns types of resources from filterMap
 * @returns {string[]}
 */
const getResourcesMeta = () => Object.values(filterMap)?.filter(item => item.isResource)?.map(item => item.type);
/**
 * Returns filter black list based on sidebar list items
 * @param {Object[]} resourceItems
 * @param {string[]} resourcesMeta
 * @returns {string[]}
 */
export function getFilterBlacklist(resourceItems, resourcesMeta = getResourcesMeta()) {
  const filterBlackList = resourcesMeta?.reduce((acc, item) => {
    const mandatoryFilters = ['integrations', 'flows', 'marketplaceTemplates', 'marketplaceConnectors'];

    if (!mandatoryFilters.includes(item) && !resourceItems?.some(res => res.toLowerCase() === item.toLowerCase())) {
      acc.push(item);
    }

    return acc;
  }, []);

  return filterBlackList;
}
/**
 * Gets only resources item from the sidebar Items
 * @param {Object[]} sidebarListItems
 * @returns {Object[]}
 */
export function getResourceItems(sidebarListItems) {
  const resourceItems = sidebarListItems?.reduce((acc, item) => {
    if (item.label === 'Resources') {
      const resourceItems = item.children.map(item => item.path.replaceAll('/', ''));

      acc.push(...resourceItems);
    }

    return acc;
  }, []);

  return resourceItems;
}

