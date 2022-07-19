import { generatePath } from 'react-router-dom';
import { UNASSIGNED_SECTION_ID } from '../constants';

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

    if (!isMatchingAValidSection && flowGroupings.length) {
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

export const redirectToFirstFlowGrouping = (flowGroupingsSections, match, hasUnassignedSection) => {
  const flowGroupingsWithUnassignedSec = hasUnassignedSection ? [...flowGroupingsSections, {sectionId: UNASSIGNED_SECTION_ID}] : flowGroupingsSections;

  const firstFlowGroupingSectionId = flowGroupingsWithUnassignedSec?.[0]?.sectionId;

  // if there is no unassigned sectionId and the user has provided invalid section id then
  // the first sectionId of the flowGrouping is considered the defaultSectionId
  return flowgroupingsRedirectTo(match, flowGroupingsWithUnassignedSec, firstFlowGroupingSectionId);
};
