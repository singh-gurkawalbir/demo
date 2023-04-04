import { getWSRecordId } from '../../../utils/metadata';
import { stringCompare } from '../../../utils/sort';

/*
This file consists of filter map which is used to filter netsuite and salesforce metadata
*/

const emptySet = [];

export default {
  // raw stage is to retrieve the actual data stored  in the state without filters
  raw: data => data,
  'suitescript-settings-options': data => data?.options?.map(([value, label]) => ({value, label})),
  'suitescript-recordTypes': data =>
    Array.isArray(data) &&
    data.map(item => ({
      label: item.name,
      value: item.scriptId && item.scriptId.toLowerCase(),
      url: item.url,
      hasSubRecord: item.hasSubRecord,
      subRecordConfig: item.subRecordConfig,
      doesNotSupportUpdate: item.doesNotSupportUpdate,
      doesNotSupportCreate: item.doesNotSupportCreate,
      doesNotSupportSearch: item.doesNotSupportSearch,
      doesNotSupportDelete: item.doesNotSupportDelete,
    })),
  'restlet-recordTypes': data =>
    Array.isArray(data) &&
    data
      .filter(item => !item.doesNotSupportSearch)
      .map(item => ({
        label: item.name,
        value: item.scriptId && item.scriptId.toLowerCase(),
        url: item.url,
        hasSubRecord: item.hasSubRecord,
        subRecordConfig: item.subRecordConfig,
        doesNotSupportUpdate: item.doesNotSupportUpdate,
        doesNotSupportCreate: item.doesNotSupportCreate,
        doesNotSupportSearch: item.doesNotSupportSearch,
        doesNotSupportDelete: item.doesNotSupportDelete,
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
      .sort(stringCompare('label')),
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
  'suitescript-salesforce-id-field': data =>
    data
      .filter(
        item => item.type === 'text' && !item.sublist && !item.id.startsWith('celigo_')
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
  'suitescript-searchFilters': data =>
    data.map(item => ({
      label: item.name,
      value: item.id,
      type: item.type,
    })),
  'suitescript-itemCustomNumberColumn': data =>
    data
      .filter(
        item =>
          ['float', 'integer'].includes(item.type) &&
          item.id.indexOf('item[*].custcol') === 0
      )
      .map(item => ({ label: item.name, value: item.id })),
  'suitescript-subrecord-referenceFields': data =>
    data
      .filter(item => item.type === 'select' && !item.id.includes('.internalid') && !item.id.includes('[*].'))
      .map(item => ({ label: item.name.replace(' (Name)', ''), value: item.id })),
  'webservices-searchFilters': data =>
    data.fields &&
    data.fields.map(item => ({
      label: item.fieldId,
      value: item.fieldId,
    })),

  'webservices-recordTypes': data =>
    data
      .filter(
        item => !item.doesNotSupportSearch,
      )
      .map(item => ({
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
  'salesforce-sObject-layout': data => data,
  'suitescript-salesforce-sObject-layout': data => (data && data.layouts && Array.isArray(data.layouts) && data.layouts.length && data.layouts[0]) || emptySet,
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
      .sort(stringCompare('label')),

  // check it is referenced to a single table
  'salesforce-sObjects-referenceFields': data =>
    data.fields &&
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
      .sort(stringCompare('label')),
  'salesforce-sObjects-nonReferenceFields': data =>
    data.fields &&
    data.fields
      .filter(r => !r.referenceTo || r.referenceTo.length === 0)
      .map(d => ({
        label: d.label,
        value: d.name,
        custom: d.custom,
        triggerable: d.triggerable,
        type: d.type,
        picklistValues: d.picklistValues,
      }))
      .sort(stringCompare('label')),
  'salesforce-sObjects-childReferenceTo': data =>
    data.childRelationships &&
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
      .sort(stringCompare('label')),
  'salesforce-recordType': data =>
    (data.fields || []).map(d => ({
      label: d.label,
      value: d.name,
      custom: d.custom,
      triggerable: d.triggerable,
      picklistValues: d.picklistValues,
      type: d.type,
      updateable: d.updateable,
    })),
  'salesforce-recordType-boolean': data =>
    data.fields &&
    data.fields
      .filter(f => f.type === 'boolean')
      .map(d => ({
        label: d.label,
        value: d.name,
      })),
  'salesforce-soqlQuery': data => data,
  'salesforce-textFields': data =>
    data.fields &&
    data.fields
      .filter(f => ['string', 'textarea'].includes(f.type))
      .map(d => ({
        label: d.label,
        value: d.name,
      })),
  'salesforce-externalIdFields': data =>
    data.fields &&
    data.fields
      .filter(f => f.externalId || f.name === 'Id')
      .map(d => ({
        label: d.label,
        value: d.name,
      })),
  'suiteScript-sObjects': data =>
    data.fields &&
    data.fields.map(({label, name, picklistValues}) =>
      ({label, name, options: picklistValues && picklistValues.map(({label, value}) => ({label, value}))})
    ),
  'suiteScript-sObjects-field-options-extracts': data => (
    data?.extracts?.map(({text, id}) =>
      ({label: text, value: id})
    )),
  'suiteScript-sObjects-field-options-generates': data => (
      data?.generates?.map(({text, id}) =>
        ({label: text, value: id})
      )),

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

          if (childSObject?.fields?.length) {
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
  'salesforce-masterRecordTypeInfo': data => {
    const { searchLayoutable, recordTypeInfos = [] } = data || {};
    const returnVal = {};
    const masterRecordTypeInfo = recordTypeInfos.find(
      recordTypeInfo => recordTypeInfo.master === true
    );

    returnVal.recordTypeId =
      masterRecordTypeInfo && masterRecordTypeInfo.recordTypeId;
    returnVal.searchLayoutable = searchLayoutable;

    return returnVal;
  },
  'suiteScriptSalesforce-sObjectCompositeMetadata': (data, options = {}) => {
    const { applicationResource, connectionId, commMetaPath } = options;
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
          const sObjectMetadataPath = `${commMetaPath.substring(0, commMetaPath.lastIndexOf('/'))}/${child.childSObject}`;
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
  'suiteScriptSalesforce-sObjectMetadata': (data, options = {}) => {
    const { applicationResource, connectionId, commMetaPath } = options;
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
        if (field.referenceTo?.length) {
          _data.push({
            value: `_child_${field.relationshipName}`,
            label: `${field.relationshipName} : Fields...`,
            type: 'childFieldRelationship',
            childSObject: field.referenceTo[0],
            relationshipName: field.relationshipName,
          });
        }
      });
    }

    if (data.childRelationships && data.childRelationships.length) {
      data.childRelationships.forEach(child => {
        if (child.relationshipName) {
          const sObjectMetadataPath = `${commMetaPath.substring(0, commMetaPath.lastIndexOf('/'))}/${child.childSObject}`;
          const { data: childSObject } =
            (applicationResource &&
              applicationResource[connectionId] &&
              applicationResource[connectionId][sObjectMetadataPath]) ||
            {};

          if (childSObject?.fields?.length) {
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
          }
          _data.push({
            value: `_child_${child.relationshipName}`,
            label: `${child.relationshipName} : Fields...`,
            type: 'childRelationship',
            childSObject: child.childSObject,
            relationshipName: child.relationshipName,
          });
        }
      });
    }

    return _data;
  },
  'suitescript-bundle-status': data => data,
  default: data =>
    data &&
    Array.isArray(data) &&
    data.map(item => ({
      label: item.name,
      value: item.id,
      type: item.type,
    })),
};
