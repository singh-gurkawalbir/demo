import { generatePath } from 'react-router-dom';
import { shouldHaveMiscellaneousSection, MISCELLANEOUS_SECTION_ID} from '../views/Integration/DIY/panels/Flows';

const flowgroupingsRedirectTo = (match, flowGroupings, defaultSectionId) => {
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
};

export const redirectToMiscellaneousOrFirstFlowGrouping = (flows, flowGroupingsSections, match) => {
  const firstFlowGroupingSectionId = flowGroupingsSections?.[0]?.sectionId;

  // if there is no miscellaneous sectionId and the user has provided invalid section id then
  // the first sectionId of the flowGrouping is considered the defaultSectionId
  const defaultSectionId = shouldHaveMiscellaneousSection(flows) ? MISCELLANEOUS_SECTION_ID : firstFlowGroupingSectionId;

  return flowgroupingsRedirectTo(match, flowGroupingsSections, defaultSectionId);
};
export default flowgroupingsRedirectTo;
