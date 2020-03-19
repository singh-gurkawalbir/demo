import jsonPatch, { deepClone, applyPatch } from 'fast-json-patch';
import util from '../../utils/array';

const generateReplaceAndRemoveLastModified = patches =>
  (patches &&
    patches.length &&
    util
      .removeItem(patches, p => p.path === '/lastModified')
      .filter(patch => patch.op === 'replace')) ||
  [];
const hasPatch = patches => patches && patches.length;
const isPathPresentAndValueDiff = patchArr => patch =>
  patchArr.some(p => p.path === patch.path && p.value !== patch.value);

// eslint-disable-next-line import/prefer-default-export
export function resourceConflictResolution({ merged, master, origin }) {
  if (origin.lastModified === master.lastModified) {
    // no conflict here
    return { merged, conflict: null };
  }

  let masterVsOrigin = jsonPatch.compare(master, origin);

  masterVsOrigin = generateReplaceAndRemoveLastModified(masterVsOrigin);

  let masterVsMerged = jsonPatch.compare(master, merged);

  masterVsMerged = generateReplaceAndRemoveLastModified(masterVsMerged);

  if (!hasPatch(masterVsOrigin)) {
    // if no value has changed
    // no resolution is required
    return { merged, conflict: null };
  }

  // if there is no difference between merged vs master
  // then with origin changes we auto merge

  if (!hasPatch(masterVsMerged)) {
    const updatedMerged = applyPatch(deepClone(merged), masterVsOrigin)
      .newDocument;

    return { merged: updatedMerged, conflict: null };
  }
  // there is a conflict here
  // resolution required

  const resolutionPatches = masterVsOrigin.filter(
    patch => !isPathPresentAndValueDiff(masterVsMerged)(patch)
  );
  const conflictPatches = masterVsOrigin.filter(
    isPathPresentAndValueDiff(masterVsMerged)
  );
  // apply the resolution patches to merged
  const updatedMerged = applyPatch(deepClone(merged), resolutionPatches)
    .newDocument;

  if (conflictPatches && conflictPatches.length) {
    // in fact if there is any conflict then there is no point resolving it

    return { conflict: conflictPatches, merged: updatedMerged };
  }

  return { conflict: null, merged: updatedMerged };
}
