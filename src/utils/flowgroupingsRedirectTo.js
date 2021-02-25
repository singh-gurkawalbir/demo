import { generatePath } from 'react-router-dom';

export default function flowgroupingsRedirectTo(match, flowGroupings, defaultSectionId) {
  // this component can only enter either with baseroute/sections/:sectionId or just baseroute
  if (!match) return null;
  const {url, path, params} = match;
  const {sectionId} = params;
  const isMatchingAValidSection = flowGroupings?.some(group => group.sectionId === sectionId);

  if (path.endsWith(':sectionId')) {
    if (!flowGroupings) {
      // strip out /sections/:sectionId
      return url.split('/')
        .slice(0, -2)
        .join('/');
    }

    if (!isMatchingAValidSection) {
      return generatePath(path, {
        ...match.params, sectionId: defaultSectionId,
      });
    }

    return null;
  }

  // for base route use cases
  if (flowGroupings) {
    return generatePath(`${path}/sections/:sectionId`, {
      ...match.params, sectionId: defaultSectionId,
    });
  }

  return null;
}

