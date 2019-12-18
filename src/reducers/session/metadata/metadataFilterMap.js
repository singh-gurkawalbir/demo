import { getWSRecordId } from '../../../utils/metadata';
import { sortElements } from '../netsuiteUserRoles';

/*
This file consists of filter map which is used to filter netsuite and salesforce metadata
*/

export default {
  // raw stage is to retrieve the actual data stored  in the state without filters
  raw: data => data,
  'suitescript-recordTypes': data =>
    data.map(item => ({
      label: item.name,
      value: item.scriptId && item.scriptId.toLowerCase(),
    })),
  'suitescript-recordTypeDetail': data =>
    data.map(item => ({
      label: item.name,
      value: item.id,
      type: item.type,
      sublist: item.sublist,
    })),
  'suitescript-sublists': data =>
    data
      .map(item => ({
        label: item.name,
        value: item.id,
      }))
      .sort(sortElements),
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
  'suitescript-bodyField': data =>
    data
      .filter(
        item =>
          !item.sublist &&
          !item.id.includes('celigo_replaceAllLines_') &&
          !item.id.includes('celigo_groupLinesBy_')
      )
      .map(item => ({
        label: item.name,
        value: item.id,
        type: item.type,
        options: item.options,
      })),
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
        label: d.label,
        value: d.name,
        relationshipName: d.relationshipName,
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
        relationshipName: d.relationshipName,
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
      updateable: d.updateable,
    })),
  'salesforce-soqlQuery': data => data,
  'salesforce-externalIdFields': data =>
    data.fields
      .filter(f => f.externalId || f.name === 'Id')
      .map(d => ({
        label: d.label,
        value: d.name,
      })),
  'salesforce-sObjectCompositeMetadata': (data, options = {}) => {
    const { applicationResource, connectionId } = options;
    const _data = [];

    if (data && data.fields) {
      data.fields.forEach(field => {
        _data.push({
          value: field.name,
          label: field.label,
          type: field.type,
          custom: field.custom,
          triggerable: field.triggerable,
          picklistValues: field.picklistValues,
          updateable: field.updateable,
        });
      });
    }

    if (data.childRelationships && data.childRelationships.length) {
      data.childRelationships.forEach(child => {
        if (child.relationshipName) {
          const sObjectMetadataPath = `salesforce/metadata/connections/${connectionId}/sObjectTypes/${child.childSObject}`;
          const { data: childSObject } =
            (applicationResource &&
              applicationResource[connectionId] &&
              applicationResource[connectionId][sObjectMetadataPath]) ||
            {};

          if (childSObject && childSObject.fields.length) {
            childSObject.fields.forEach(field => {
              _data.push({
                value: `${child.relationshipName}[*].${field.name}`,
                label: `${child.relationshipName}: ${field.label}`,
                type: field.type,
                custom: field.custom,
                triggerable: field.triggerable,
                picklistValues: field.picklistValues,
                updateable: field.updateable,
              });
            });
          } else {
            _data.push({
              value: `_child_${child.relationshipName}`,
              label: `${child.relationshipName} : Fields...`,
              type: 'childRelationship',
              childSObject: child.childSObject,
              relationshipName: child.relationshipName,
            });
          }
        }
      });
    }

    return _data;
  },
  default: data =>
    data.map(item => ({
      label: item.name,
      value: item.id,
      type: item.type,
    })),
};
