import { filterMap } from '../../../stories/lab/globalSearch/Prototype/filterMeta';

export function getResourcesToLoad(resourceItems) {
  const mandatoryResources = ['published', 'integrations', 'flows'];
  const resourcesToLoad = resourceItems?.reduce((res, item) => {
    if (filterMap[item]?.resourceURL && !mandatoryResources?.includes(filterMap[item]?.resourceURL)) {
      res.push(filterMap[item]?.resourceURL);
    }

    return res;
  }, mandatoryResources)?.join(',');

  return resourcesToLoad;
}

const getResourcesMeta = () => Object.values(filterMap)?.filter(item => item?.isResource)?.map(item => item?.type);
export function getFilterBlacklist(resourceItems, resourcesMeta = getResourcesMeta()) {
  const filterBlackList = resourcesMeta?.reduce((acc, item) => {
    const mandatoryFilters = ['integrations', 'flows', 'marketplaceTemplates', 'marketplaceConnectors'];

    if (!mandatoryFilters.includes(item) && !resourceItems.some(res => res?.toLowerCase() === item?.toLowerCase())) {
      acc.push(item);
    }

    return acc;
  }, []);

  return filterBlackList;
}
export function getResourceItems(sidebarListItems) {
  const resourceItems = sidebarListItems?.reduce((acc, item) => {
    if (item?.label === 'Resources') {
      const resourceItems = item?.children?.map(item => item?.path?.replaceAll('/', ''));

      acc.push(...resourceItems);
    }

    return acc;
  }, []);

  return resourceItems;
}

