import jsonPatch, { deepClone, applyPatch } from 'fast-json-patch';
import util from '../utils/array';

const generateReplaceAndRemoveLastModified = patches =>
  (patches &&
    patches.length &&
    util
      .removeItem(patches, p => p.path === '/lastModified')
      .filter(patch => patch.op === 'replace')) ||
  [];
const isAnyPatchThere = patches => patches && patches.length;
const isPatchPresent = patchArr => patch =>
  !!patchArr.find(p => p.path === patch.path);

export default function resourceConflictResolution({ merged, master, origin }) {
  let masterVsOrigin = jsonPatch.compare(master, origin);

  masterVsOrigin = generateReplaceAndRemoveLastModified(masterVsOrigin);

  let masterVsMerged = jsonPatch.compare(master, merged);

  masterVsMerged = generateReplaceAndRemoveLastModified(masterVsMerged);

  if (origin.lastModified !== master.lastModified) {
    // there is a conflict here
    // any resolution required
    if (isAnyPatchThere(masterVsOrigin)) {
      if (isAnyPatchThere(masterVsMerged)) {
        const resolutionPatches = masterVsOrigin.filter(
          patch => !isPatchPresent(masterVsMerged)(patch)
        );
        const conflictPatches = masterVsOrigin.filter(
          isPatchPresent(masterVsMerged)
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

      // if there is no difference between merged vs master
      // then with origin changes we auto merge

      const updatedMerged = applyPatch(deepClone(merged), masterVsOrigin)
        .newDocument;

      return { merged: updatedMerged, conflict: null };
    }

    // if no value has changed
    // no resolution is required
    return { merged, conflict: null };
  }

  // no conflict here
  return { merged, conflict: null };
}
