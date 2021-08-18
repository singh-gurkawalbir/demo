import jsonPatch, { deepClone, applyPatch } from 'fast-json-patch';
import { select, call } from 'redux-saga/effects';
import util from '../../utils/array';
import { selectors } from '../../reducers';
import { createFormValuesPatchSet, SCOPES } from '../resourceForm';

const generateReplaceAndRemoveLastModified = patches =>
  (patches &&
    patches.length &&
    util.removeItem(patches, p => p.path === '/lastModified')) ||
  [];
const hasPatch = patches => patches && patches.length;
const isPathPresentAndValueDiff = patchArr => patch =>
  patchArr.some(p => p.path === patch.path && p.value !== patch.value);

export function resourceConflictResolution({ merged, master, origin }) {
  if (origin?.lastModified === master?.lastModified) {
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
  // then with use origin directly

  if (!hasPatch(masterVsMerged)) {
    const updatedMerged = origin;

    return { merged: updatedMerged, conflict: null };
  }
  // there is a conflict here

  const conflictPatches = masterVsMerged.filter(
    isPathPresentAndValueDiff(masterVsOrigin)
  );

  if (conflictPatches && conflictPatches.length) {
    // in fact if there is any conflict then there is no point resolving it

    return { conflict: conflictPatches, merged: null };
  }

  // resolution required
  // apply the staged patches over origin
  // mutate document set to false
  let updatedMerged;

  try {
    updatedMerged = applyPatch(origin, masterVsMerged, false, false)
      .newDocument;
  } catch (e) {
    console.warn('cannot apply resolution patches doc = ', origin, 'patches = ', masterVsMerged);

    return { conflict: masterVsMerged, merged: null };
  }

  return { conflict: null, merged: updatedMerged };
}

export function* constructResourceFromFormValues({
  formValues = {},
  resourceId,
  resourceType,
}) {
  const { patchSet } = yield call(createFormValuesPatchSet, {
    resourceType,
    resourceId,
    values: formValues,
    scope: SCOPES.VALUE,
  });

  const { merged } = yield select(
    selectors.resourceData,
    resourceType,
    resourceId,
    SCOPES.VALUE
  );

  try {
    return applyPatch(merged ? deepClone(merged) : {}, deepClone(patchSet))
      .newDocument;
  } catch (e) {
    return {};
  }
}
