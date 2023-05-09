import { isNewId } from '../../../utils/resource';
import { fetchMetadataFieldList, pushField } from '../../../utils/form/metadata';
import { getMetadataWithFilteredDisplayRef, refineCustomSettings } from '../../../utils/httpConnector';
import customCloneDeep from '../../../utils/customCloneDeep';

export function getUpdatedFormLayoutWithCustomSettings(layout, formFieldId, customSettingsFieldId) {
  const updatedLayout = customCloneDeep(layout);

  pushField(updatedLayout, formFieldId, customSettingsFieldId);

  return updatedLayout;
}

export function getUpdatedFieldMetaWithCustomSettings(resourceFieldMetadata, customSettingsMetadata = {}, customSettings) {
  const updatedFieldMetadata = customCloneDeep(resourceFieldMetadata);
  const { fieldMap: customSettingsFieldMap = {} } = customSettingsMetadata;
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
    // fetch cs field map
    const field = customSettingsFieldMap[fieldId];

    // add this cs field in field map
    const newFieldId = `settings.${fieldId}`;

    updatedFieldMetadata.fieldMap[newFieldId] = {
      ...field,
      name: `/settings/${fieldId}`,
      id: newFieldId,
      fieldId: newFieldId,
      defaultValue: customSettings?.[fieldId],
    };
    // find the ref index in fields and push this cs fieldId there
    updatedFieldMetadata.layout = getUpdatedFormLayoutWithCustomSettings(updatedFieldMetadata.layout, field.displayAfter, newFieldId);
  });

  return updatedFieldMetadata;
}

export function getAttachedCustomSettingsMetadata(metadata, csMetadata, settings) {
  const updatedFieldMetadata = customCloneDeep(metadata);
  const { fieldMap: csFieldMap = {} } = csMetadata || {};

  const fields = fetchMetadataFieldList(csMetadata);

  fields.forEach(fieldId => {
    const field = csFieldMap[fieldId];

    updatedFieldMetadata.fieldMap[fieldId] = {
      ...field,
      name: `/settings/${fieldId}`,
      id: fieldId,
      fieldId,
      defaultValue: settings?.[fieldId],
    };
  });

  if (fields.length) {
    // create a cs container and push the leftover fields
    updatedFieldMetadata.layout?.containers?.push({
      collapsed: true,
      label: 'Custom settings',
      fields,
    });
  }

  return updatedFieldMetadata;
}

export function initializeHttpConnectorForm(fieldMeta, resource, resourceType) {
  // fetch fieldMeta and resource custom settings
  const { settingsForm, settings } = resource;

  if (settingsForm?.form) {
    const settingsFormMetadata = refineCustomSettings(settingsForm.form, resourceType);

    let updatedFieldMetadata = getUpdatedFieldMetaWithCustomSettings(fieldMeta, settingsFormMetadata, settings);

    if (isNewId(resource?._id)) {
      // Incase of new resource, create a cs container
      const leftOverCustomSettings = getMetadataWithFilteredDisplayRef(updatedFieldMetadata, settingsFormMetadata);

      // now fetch the  left over settings fields and create a cs container
      updatedFieldMetadata = getAttachedCustomSettingsMetadata(updatedFieldMetadata, leftOverCustomSettings);
    }

    return updatedFieldMetadata;
  }
  // return updated metadata

  return fieldMeta;
}

export function initializeHttpForm(fieldMeta, resource) {
  if (isNewId(resource?._id)) {
    // Incase of new resource, create a cs container
    return getAttachedCustomSettingsMetadata(fieldMeta, resource?.settingsForm?.form, resource?.settings);
  }

  return fieldMeta;
}
