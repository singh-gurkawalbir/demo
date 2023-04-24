import { layoutHasField, removeFieldFromLayout, fetchMetadataFieldList } from '../form/metadata';
import customCloneDeep from '../customCloneDeep';

export const DISPLAY_REF_SUPPORTED_RESOURCE_TYPES = ['exports', 'imports'];

export const isDisplayRefSupportedType = resourceType => DISPLAY_REF_SUPPORTED_RESOURCE_TYPES.includes(resourceType);
export function isValidDisplayAfterRef(refId, refMetadata) {
  const { layout, fieldMap } = refMetadata;

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

    if (!field.displayAfter) return false;

    const index = field.displayAfter?.indexOf('.');
    const displayAfterRef = field.displayAfter?.substr(index + 1);

    return isValidDisplayAfterRef(displayAfterRef, resourceMetadata);
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
  return `${resourceType}.${id}`;
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

export function getConnectorCustomSettings(resourceFormMetadata, csMetadata) {
  // Incase the resource is new or user changed endpoint, we show all custom settings
  return getMetadataWithFilteredDisplayRef(resourceFormMetadata, csMetadata);
}
