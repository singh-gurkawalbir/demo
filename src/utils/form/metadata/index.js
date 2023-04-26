import customCloneDeep from '../../customCloneDeep';

export function getFieldIdsInLayoutOrder(layout) {
  const fields = [];

  if (!layout) return fields;
  if (layout.fields?.length) {
    // add the fields in this layout to the list
    fields.push(...layout.fields);
  }
  if (layout.containers?.length) {
    // traverse through each container and fetch the fields
    layout.containers.forEach(container => {
      fields.push(...getFieldIdsInLayoutOrder(container));
    });
  }

  return fields;
}

export function pushField(layout, refId, fieldId) {
  if (!layout || !refId || !fieldId) return;
  if (layout.fields?.length) {
    if (layout.fields.includes(refId)) {
      const refIndex = layout.fields.indexOf(refId);

      layout.fields.splice(refIndex + 1, 0, fieldId);
    }
  }
  if (layout.containers?.length) {
    layout.containers.forEach(container => pushField(container, refId, fieldId));
  }
}

export function removeFieldFromLayout(layout, fieldId) {
  if (!layout || !fieldId) return;
  if (layout.fields?.length) {
    if (layout.fields.includes(fieldId)) {
      const fieldIndex = layout.fields.indexOf(fieldId);

      layout.fields.splice(fieldIndex, 1);
    }
  }
  if (layout.containers?.length) {
    layout.containers.forEach(container => removeFieldFromLayout(container, fieldId));
  }
}

export function layoutHasField(layout, fieldId) {
  if (!layout || !fieldId) return false;
  if (layout.containers?.length) {
    return layout.containers.some(container => layoutHasField(container, fieldId));
  }
  if (layout.fields?.length) {
    return layout.fields.includes(fieldId);
  }
}

export function fetchMetadataFieldList(metadata) {
  const { fieldMap, layout } = metadata || {};

  if (!fieldMap) return [];

  // if no layout, return all keys from field map
  if (!layout) return Object.keys(fieldMap);

  // if layout, go through all containers and accumulate fieldIds
  return getFieldIdsInLayoutOrder(layout);
}

export function mergeMetadata(src, toMerge) {
  if (!src && !toMerge) return;
  if (!src || !toMerge) return src || toMerge;

  const srcFieldIds = fetchMetadataFieldList(src);
  const toMergeFieldIds = fetchMetadataFieldList(toMerge);

  const mergedMetadata = customCloneDeep(src);

  const newFieldIds = [];

  toMergeFieldIds.forEach(fieldId => {
    // over ride field definition with toMerge's field definition
    mergedMetadata.fieldMap[fieldId] = toMerge.fieldMap[fieldId];
    if (!srcFieldIds.includes(fieldId) && mergedMetadata.layout) {
      // if the mergedMetadata does not have this field add to the list
      newFieldIds.push(fieldId);
    }
  });

  if (newFieldIds.length) {
    // If it is just a single container with list of fields, directly push the new fields to that list
    if (mergedMetadata.layout.containers?.length === 1 && mergedMetadata.layout.containers[0].fields?.length) {
      mergedMetadata.layout.containers[0].fields.push(...newFieldIds);
    } else {
        // push all new fieldIds into a new container in mergedMetadata
        mergedMetadata.layout.containers?.push({
          fields: newFieldIds,
        });
    }
  }

  return mergedMetadata;
}
