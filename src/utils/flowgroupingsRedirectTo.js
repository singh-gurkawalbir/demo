import { generatePath } from 'react-router-dom';

const flowgroupingsRedirectTo = (match, flowGroupings, hasMiscellaneousSection, defaultSectionId) => {
  // this component can only enter either with baseroute/sections/:sectionId or just baseroute
  if (!match) return null;
  const {url, path, params} = match;
  const {sectionId} = params;

  const isMatchingAValidSection = flowGroupings?.some(group => group.sectionId === sectionId);

  // if there is no miscellaneous sectionId and the user has provided invalid section id for for the first sectionId of the flowGrouping
  const defaultOrFirstSectionId = hasMiscellaneousSection ? defaultSectionId : flowGroupings?.[0]?.sectionId;

  if (path.endsWith(':sectionId')) {
    if (!flowGroupings) {
      // strip out /sections/:sectionId
      return url.split('/')
        .slice(0, -2)
        .join('/');
    }

    if (!isMatchingAValidSection) {
      return generatePath(path, {
        ...match.params, sectionId: defaultOrFirstSectionId,
      });
    }

    return null;
  }

  // for base route use cases
  if (flowGroupings) {
    return generatePath(`${path}/sections/:sectionId`, {
      ...match.params, sectionId: defaultOrFirstSectionId,
    });
  }

  return null;
};

export default flowgroupingsRedirectTo;
