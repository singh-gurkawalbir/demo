import { layoutHasField, removeFieldFromLayout, fetchMetadataFieldList, mergeMetadata } from '../form/metadata';
import customCloneDeep from '../customCloneDeep';

export const DISPLAY_REF_SUPPORTED_RESOURCE_TYPES = ['exports', 'imports'];

export const HTTP_CONNECTOR_DISPLAY_REF_MAP = {
  'http._httpConnectorResourceId': 'assistantMetadata.resource',
  'http._httpConnectorEndpointId': 'assistantMetadata.operation',
  'http._httpConnectorVersionId': 'assistantMetadata.version',
  type: 'assistantMetadata.exportType',
};

export function getDisplayRef(field, resourceType) {
  const displayAfter = field?.displayAfter;

  if (!displayAfter) return;
  const index = displayAfter.indexOf('.');

  if (resourceType && DISPLAY_REF_SUPPORTED_RESOURCE_TYPES.includes(resourceType)) {
    const type = resourceType === 'exports' ? 'export' : 'import';

    if (displayAfter.substr(0, index) !== type) return;
  }

  const displayAfterRef = displayAfter.substr(index + 1);

  // If it matches any of the mentioned assistant metadata ids, should not consider as a valid displayRef
  if (Object.values(HTTP_CONNECTOR_DISPLAY_REF_MAP).includes(displayAfterRef)) return;

  // In cases where displayRef should point to another value from the given refMap, we use this map
  // Ex: end point field help text is 'http._httpConnectorEndpointId' but the fieldId to look for is 'assistantMetadata.operation'.
  // hence, we use this map to fetch the same
  return HTTP_CONNECTOR_DISPLAY_REF_MAP[displayAfterRef] || displayAfterRef;
}

export function refineCustomSettings(settingsFormMetadata, resourceType) {
  const updatedFieldMetadata = customCloneDeep(settingsFormMetadata) || {};
  const fieldIds = Object.keys(updatedFieldMetadata.fieldMap);

  fieldIds.forEach(fieldId => {
    const displayAfterRef = getDisplayRef(updatedFieldMetadata.fieldMap[fieldId], resourceType);

    updatedFieldMetadata.fieldMap[fieldId].displayAfter = displayAfterRef;
  });

  return updatedFieldMetadata;
}

export const isDisplayRefSupportedType = resourceType => DISPLAY_REF_SUPPORTED_RESOURCE_TYPES.includes(resourceType);
export function isValidDisplayAfterRef(refId, refMetadata) {
  const { layout, fieldMap } = refMetadata;

  if (!refId) return false;

  if (!layout) {
    return !!fieldMap[refId];
  }

  return layoutHasField(layout, refId);
}

export function getMetadataWithFilteredDisplayRef(resourceMetadata, csMetadata) {
  const { fieldMap = {} } = csMetadata || {};
  const fieldList = fetchMetadataFieldList(csMetadata);

  // if the metadata has displayAfter and ref is valid , remove from cs fields
  const validDisplayAfterFieldIds = fieldList.filter(fieldId => {
    const field = fieldMap[fieldId];

    return isValidDisplayAfterRef(field.displayAfter, resourceMetadata);
  });

  const updatedFieldMetadata = customCloneDeep(csMetadata);

  validDisplayAfterFieldIds.forEach(fieldId => {
    if (!updatedFieldMetadata.layout) {
      delete updatedFieldMetadata.fieldMap[fieldId];
    } else {
      removeFieldFromLayout(updatedFieldMetadata.layout, fieldId);
    }
  });

  return updatedFieldMetadata;
}

export function fetchOnlyRequiredFieldMetadata(fieldMetadata) {
  if (!fieldMetadata || !fieldMetadata.fieldMap) return fieldMetadata;

  const updatedFieldMetadata = customCloneDeep(fieldMetadata);
  const { fieldMap } = updatedFieldMetadata || {};

  const fieldList = fetchMetadataFieldList(updatedFieldMetadata);

  const nonMandatoryFields = fieldList.filter(fieldId => !fieldMap[fieldId].required);

  nonMandatoryFields.forEach(fieldId => {
    if (!updatedFieldMetadata.layout) {
      delete updatedFieldMetadata.fieldMap[fieldId];
    } else {
      removeFieldFromLayout(updatedFieldMetadata.layout, fieldId);
    }
  });

  return updatedFieldMetadata;
}

export function fetchMetadataWithDefinedFields(fieldMetadata, values = {}) {
  if (!fieldMetadata || !fieldMetadata.fieldMap) return fieldMetadata;

  const updatedFieldMetadata = customCloneDeep(fieldMetadata);

  const fieldList = fetchMetadataFieldList(updatedFieldMetadata);

  const fieldsWithoutValue = fieldList.filter(fieldId => !Object.hasOwnProperty.call(values, fieldId));

  fieldsWithoutValue.forEach(fieldId => {
    if (!updatedFieldMetadata.layout) {
      delete updatedFieldMetadata.fieldMap[fieldId];
    } else {
      removeFieldFromLayout(updatedFieldMetadata.layout, fieldId);
    }
  });

  return updatedFieldMetadata;
}

export function getHelpKey(resourceType, id) {
  const type = resourceType === 'exports' ? 'export' : 'import';

  return `${type}.${id}`;
}

export function getEndPointMetadata(connectorMetadata = {}, resourceId, operationId) {
  if (!resourceId || !operationId) return;

  const resourceMetadata = connectorMetadata.resources?.find(resource => resource._id === resourceId);

  if (!resourceMetadata) return;

  return resourceMetadata.endpoints?.find(operation => operation.id === operationId);
}

export function getEndPointCustomSettings(connectorMetadata = {}, resourceId, operationId) {
  const endPointMetadata = getEndPointMetadata(connectorMetadata, resourceId, operationId);

  return endPointMetadata?.settingsForm;
}

export function getConnectorCustomSettings(resourceFormMetadata, settingsFormMetadata, resourceType) {
  const csMetadata = refineCustomSettings(settingsFormMetadata, resourceType);

  return getMetadataWithFilteredDisplayRef(resourceFormMetadata, csMetadata);
}

export function getUserDefinedWithEndPointCustomSettingsPatch(endpointCustomSettings, userDefinedCustomSettings) {
  const mergedMetadata = mergeMetadata(userDefinedCustomSettings, endpointCustomSettings);

  if (mergedMetadata) {
    return [{
      op: 'replace',
      path: '/settingsForm',
      value: { form: mergedMetadata },
    }];
  }

  const emptySettingsFormPatch = {
    op: 'replace',
    path: '/settingsForm',
    value: {},
  };

  return [emptySettingsFormPatch];
}
