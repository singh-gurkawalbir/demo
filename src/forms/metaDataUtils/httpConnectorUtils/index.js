import { isNewId } from '../../../utils/resource';
import { fetchMetadataFieldList } from '../../../utils/form/metadata';
import { getMetadataWithFilteredDisplayRef, fetchOnlyRequiredFieldMetadata } from '../../../utils/httpConnector';
import customCloneDeep from '../../../utils/customCloneDeep';

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

function getUpdatedFieldMetaWithCustomSettings(resourceFieldMetadata, customSettingsMetadata = {}, customSettings) {
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
    // fetch cs fieldmap
    const field = customSettingsFieldMap[fieldId];
    // fetch ref
    const index = field.displayAfter?.indexOf('.');
    const displayAfterRef = field.displayAfter?.substr(index + 1);

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
    updatedFieldMetadata.layout = getUpdatedFormLayoutWithCustomSettings(updatedFieldMetadata.layout, displayAfterRef, newFieldId);
  });

  return updatedFieldMetadata;
}

function getAttachedCustomSettingsMetadata(metadata, csMetadata, settings) {
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

  // create a cs container and push the leftover fields
    updatedFieldMetadata.layout?.containers?.push({
      collapsed: true,
      label: 'Custom settings',
      fields,
    });

    return updatedFieldMetadata;
}

export function initializeHttpConnectorForm(fieldMeta, resource) {
  // fetch fieldMeta and resource custom settings
  const { settingsForm, settings } = resource;

  if (settingsForm?.form) {
    const settingsFormMetadata = fetchOnlyRequiredFieldMetadata(settingsForm.form);
    // create stubs for utils to call and update
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
