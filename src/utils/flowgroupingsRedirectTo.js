import { generatePath } from 'react-router-dom';
import { MISCELLANEOUS_SECTION_ID } from './constants';
import { shouldHaveMiscellaneousSection } from './resource';

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

export const redirectToFirstFlowGrouping = (flows, flowGroupingsSections, match) => {
  const firstFlowGroupingSectionId = flowGroupingsSections?.[0]?.sectionId;

  const flowGroupingsWithMiscSec = shouldHaveMiscellaneousSection(flowGroupingsSections, flows)
    ? [...flowGroupingsSections, {sectionId: MISCELLANEOUS_SECTION_ID}] : flowGroupingsSections;

  // if there is no miscellaneous sectionId and the user has provided invalid section id then
  // the first sectionId of the flowGrouping is considered the defaultSectionId
  return flowgroupingsRedirectTo(match, flowGroupingsWithMiscSec, firstFlowGroupingSectionId);
};
