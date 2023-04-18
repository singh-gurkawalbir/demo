import { isNewId } from '../../../utils/resource';
import { getFieldIdsInLayoutOrder } from '../../../utils/form/metadata';
import customCloneDeep from '../../../utils/customCloneDeep';

function fetchMetadataFieldList(metadata) {
  // modify
  const { fieldMap, layout } = metadata;

  if (!fieldMap) return [];
  // if no layout, return all keys from field map

  if (!layout) return Object.keys(fieldMap);

  // if layout, go through all containers and accumulate fieldIds

  return getFieldIdsInLayoutOrder(metadata?.layout);
}

export function pushField(layout, refId, fieldId) {
  if (!layout) return;
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

function getUpdatedFormLayoutWithCustomSettings(layout, formFieldId, customSettingsFieldId) {
  const updatedLayout = customCloneDeep(layout);

  pushField(updatedLayout, formFieldId, customSettingsFieldId);

  return updatedLayout;
}

function getUpdatedFieldMetaWithCustomSettings(resourceFieldMetadata, customSettingsMetadata) {
  const updatedFieldMetadata = customCloneDeep(resourceFieldMetadata);
  const { fieldMap: customSettingsFieldMap } = customSettingsMetadata;
  const customSettingsFields = fetchMetadataFieldList(customSettingsMetadata);
  const displayAfterFieldIds = customSettingsFields.reduce((acc, fieldId) => {
    if (customSettingsFieldMap[fieldId]?.displayAfter) {
      return [...acc, fieldId];
    }

    return acc;
  }, []);

  // now 2 things
  // 1. add the cs field in field map with possible visibleWhen rules of ref field
  // 2. for each field, go through the layout and push this cs field beside the ref field in fields array
  displayAfterFieldIds.forEach(fieldId => {
    // fetch cs fieldmap
    const field = customSettingsFieldMap[fieldId];
    // fetch ref
    const index = field.displayAfter?.indexOf('.');
    const displayAfterRef = field.displayAfter?.substr(index + 1);

    // add this cs field in field map
    updatedFieldMetadata.fieldMap[fieldId] = {
      ...field,
      name: `/settings/${fieldId}`,
      id: `settings.${fieldId}`,
      fieldId: `settings.${fieldId}`,
    };
    // find the ref index in fields and push this cs fieldId there
    updatedFieldMetadata.layout = getUpdatedFormLayoutWithCustomSettings(updatedFieldMetadata.layout, displayAfterRef, fieldId);
  });

  return updatedFieldMetadata;
}

export function initializeHttpConnectorExportForm(fieldMeta, resource) {
  // return metadata for new resources
  if (isNewId(resource?._id)) {
    return fieldMeta;
  }
  // fetch fieldMeta and resource custom settings
  const { settingsForm } = resource;

  if (settingsForm?.form) {
    // create stubs for utils to call and update
    return getUpdatedFieldMetaWithCustomSettings(fieldMeta, settingsForm.form);
  }
  // return updated metadata

  return fieldMeta;
}

