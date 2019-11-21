import { getWSRecordId } from '../../../utils/metadata';
import { sortElements } from '../netsuiteUserRoles';

/*
This file consists of filter map which is used to filter netsuite and salesforce metadata
*/

export default {
  'suitescript-recordTypes': data =>
    data.map(item => ({
      label: item.name,
      value: item.scriptId && item.scriptId.toLowerCase(),
    })),
  'suitescript-dateField': data =>
    data
      .filter(item => item.type === 'datetime' || item.type === 'datetimetz')
      .map(item => ({ label: item.name, value: item.id })),
  'suitescript-booleanField': data =>
    data
      .filter(
        item =>
          item.type === 'checkbox' &&
          item.id.match(
            /^(custevent|custentity|custbody|custrecord|custitem)\w*$/
          ) &&
          item.id.indexOf('.') === -1
      )
      .map(item => ({ label: item.name, value: item.id })),
  'webservices-recordTypes': data =>
    data.map(item => ({
      label: item.label,
      value: getWSRecordId(item),
    })),
  'webservices-savedSearches': data =>
    data.map(item => ({
      label: item.name,
      value: item.internalId,
    })),
  'webservices-dateField': data =>
    (data.fields &&
      data.fields
        .filter(item => item.type === 'date')
        .map(item => ({
          label: item.label || item.fieldId,
          value: item.fieldId,
        }))) ||
    [],
  'webservices-booleanField': data =>
    (data.fields &&
      data.fields
        .filter(
          item =>
            item.type === '_checkBox' &&
            item.fieldId.match(
              /^(custevent|custentity|custbody|custitem)\w*$/
            ) &&
            item.fieldId.indexOf('.') === -1
        )
        .map(item => ({
          label: item.label || item.fieldId,
          value: item.fieldId,
        }))) ||
    [],
  'salesforce-sObjects': data =>
    data.map(d => ({
      label: d.label,
      value: d.name,
      custom: d.custom,
      triggerable: d.triggerable,
    })),
  'salesforce-sObjects-triggerable': data =>
    data
      .filter(r => r.triggerable)
      .map(d => ({
        label: d.label,
        value: d.name,
        custom: d.custom,
        triggerable: d.triggerable,
      }))
      .sort(sortElements),

  // check it is referenced to a single table
  'salesforce-sObjects-referenceFields': data =>
    data.fields
      .filter(
        r => r.referenceTo && r.referenceTo.length > 0 && r.relationshipName
      )
      .map(d => ({
        label: d.relationshipName,
        value: d.relationshipName,
        custom: d.custom,
        triggerable: d.triggerable,
        referenceTo: d.referenceTo[0],
      }))
      .sort(sortElements),
  'salesforce-sObjects-nonReferenceFields': data =>
    data.fields
      .filter(r => !r.referenceTo || r.referenceTo.length === 0)
      .map(d => ({
        label: d.label,
        value: d.name,
        custom: d.custom,
        triggerable: d.triggerable,
      }))
      .sort(sortElements),
  'salesforce-sObjects-childReferenceTo': data =>
    data.childRelationships
      .filter(r => !!r.relationshipName)
      .map(d => ({
        label: d.relationshipName,
        value: d.relationshipName,
        name: d.name,
        field: d.field,
        childSObject: d.childSObject,
      }))
      .sort(sortElements),
  'salesforce-recordType': data =>
    data.fields.map(d => ({
      label: d.label,
      value: d.name,
      custom: d.custom,
      triggerable: d.triggerable,
      picklistValues: d.picklistValues,
      type: d.type,
    })),
  default: data =>
    data.map(item => ({
      label: item.name,
      value: item.id,
    })),
};
