import jsonPatch, { deepClone, applyPatch } from 'fast-json-patch';
import { select, call } from 'redux-saga/effects';
import { isEmpty, set, unset, get } from 'lodash';
import util from '../../utils/array';
import { getDomainUrl, isNewId } from '../../utils/resource';
import { selectors } from '../../reducers';
import { createFormValuesPatchSet } from '../resourceForm';
import { createFormValuesPatchSet as createSuiteScriptFormValuesPatchSet } from '../suiteScript/resourceForm';
import { AUTHENTICATION_LABELS, emptyObject } from '../../constants';
import customCloneDeep from '../../utils/customCloneDeep';
import { applicationsList, getHttpConnector } from '../../constants/applications';

export const getDataTypeDefaultValue = (dataType = 'string') => {
  const data = {string: 'abc', number: 123, boolean: true, stringarray: ['a', 'b'], numberarray: [1, 2], booleanarray: [true, false], objectarray: [{a: 'b'}, {c: 'd'}], object: {a: 'b'} };

  return data[dataType] || 'abc';
};
export const convertResourceFieldstoSampleData = (resourceFields, dataType = 'object') => {
  if (!resourceFields) {
    return '';
  }
  if (dataType === 'object') {
    const output = {};

    resourceFields.forEach(rf => {
      if (rf.resourceFields) {
        output[rf.id] = convertResourceFieldstoSampleData(rf.resourceFields, rf.dataType);
      } else { output[rf.id] = getDataTypeDefaultValue(rf.dataType); }
    });

    return output;
  }
  if (dataType === 'objectarray') {
    const tempOutput = {};

    resourceFields.forEach(rf => {
      if (rf.resourceFields) {
        tempOutput[rf.id] = convertResourceFieldstoSampleData(rf.resourceFields, rf.dataType);
      } else { tempOutput[rf.id] = getDataTypeDefaultValue(rf.dataType); }
    });

    return [tempOutput];
  }
};
export const getEndpointResourceFields = (endpointFields, resourceFields) => {
  if (!endpointFields || !endpointFields.length || !endpointFields[0].type) {
    return resourceFields;
  }
  let returnData = {};
  const {fields, type} = endpointFields[0];

  if (type === 'inclusion') {
    fields.forEach(field => {
      const tempField = field?.replaceAll('[*]', '[0]');
      const value = get(resourceFields, tempField);

      if (value) {
        returnData = set(returnData, tempField, value);
      }
    });
  } if (type === 'exclusion') {
    returnData = resourceFields;
    fields.forEach(field => {
      if (field.includes('[*]')) {
        unset(returnData, field?.replaceAll('[*]', '[0]'));
      } else {
        unset(returnData, field);
      }
    });
  }

  return returnData;
};
export const generateReplaceAndRemoveLastModified = patches =>
  (patches &&
    patches.length &&
    util.removeItem(patches, p => p.path === '/lastModified')) ||
  [];
const hasPatch = patches => patches && patches.length;
const isPathPresentAndValueDiff = patchArr => patch =>
  patchArr.some(p => p.path === patch.path && p.value !== patch.value);

export const getExportMetadata = (connectorMeta, connectionVersion, connectionAPI) => {
  let connectorMetadata = customCloneDeep(connectorMeta);
  const { httpConnectorEndpoints: httpEndpoints} = connectorMetadata;
  let { httpConnectorResources: httpResources} = connectorMetadata;
  const exportData = {
    labels: {
      version: 'API version',
    },
  };

  if (connectionAPI) {
    connectorMetadata = connectorMetadata?.apis?.find(api => api._id === connectionAPI);
  }
  const versionLocation = connectorMetadata.versioning?.location;

  if (versionLocation === 'uri' && !connectionVersion) {
    exportData.addVersionToUrl = true;
  }

  if (!httpResources || !httpEndpoints) {
    return exportData;
  }
  const exportPreConfiguredFields = connectorMetadata.supportedBy?.export?.preConfiguredFields;

  exportPreConfiguredFields?.forEach(field => {
    exportData[field.path] = field.values?.[0];
  });

  let versions = connectorMetadata.versions?.map(v => ({version: v.name, _id: v._id}));

  if (!versions || !versions.length) {
    versions = [
      {
        version: 'v2',
        _id: '_v2id',
      }];
  }
  if (connectionAPI) {
    httpResources = httpResources.filter(r => r._httpConnectorApiId === connectionAPI);
  }
  if (connectionVersion) {
    versions = versions.filter(v => v._id === connectionVersion);
    httpResources = httpResources.filter(r => r._versionIds?.includes(versions[0]?._id));
  }
  exportData.versions = customCloneDeep(versions);

  exportData.resources = httpResources.map(httpResource => {
    const exportPreConfiguredFields = customCloneDeep(httpResource.supportedBy?.export?.preConfiguredFields);

    return {
      ...httpResource, id: httpResource._id, exportPreConfiguredFields, hidden: !!httpResource.hidden,
    };
  });
  exportData.resources.forEach((r, i) => {
    exportData.resources[i].versions = versions.filter(v => r._versionIds?.includes(v._id));

    const filteredHttpEndpoints = httpEndpoints.filter(e => {
      // TODO: Ashok: Needs to optimise this logic
      let htpEndpointExists = false;

          e._httpConnectorResourceIds?.forEach(eResId => {
            if (r.id.includes(eResId)) {
              htpEndpointExists = true;
            }
          });

          return htpEndpointExists;
    });

    if (filteredHttpEndpoints.length) {
      exportData.resources[i].endpoints = [];
      filteredHttpEndpoints.forEach(httpEndpoint => {
        if (httpEndpoint.supportedBy?.type === 'export') {
          const {fieldsUserMustSet} = httpEndpoint.supportedBy;
          const supportedExportTypes = fieldsUserMustSet?.find(f => f.path === 'type')?.values;

          const queryParameters = httpEndpoint.queryParameters?.map(qp => ({name: qp.name, id: qp.name, description: qp.description, required: qp.required, fieldType: qp.dataType || qp.fieldType || 'textarea', defaultValue: qp.defaultValue, readOnly: qp.readOnly, options: qp.values }));
          const pathParameters = httpEndpoint.pathParameters?.map(pp => ({name: pp.label, id: pp.name, description: pp.description, required: pp.required !== false, fieldType: pp.dataType || pp.fieldType || 'input', suggestions: pp.values, config: pp.config }));
          let doesNotSupportPaging = false;

          if (httpEndpoint.supportedBy.fieldsToUnset?.includes('paging')) {
            doesNotSupportPaging = true;
          }
          const supportsAsyncHelper = !!fieldsUserMustSet?.find(f => f.path === 'http._asyncHelperId');

          const ep = {
            id: httpEndpoint._id, name: httpEndpoint.name, url: httpEndpoint.relativeURI, supportedExportTypes, queryParameters, pathParameters, doesNotSupportPaging, method: httpEndpoint.method, hidden: !!httpEndpoint.hidden, _httpConnectorResourceIds: httpEndpoint._httpConnectorResourceIds, supportsAsyncHelper,
          };

                r.exportPreConfiguredFields?.forEach(field => {
                  ep[field.path] = field.values?.[0];
                });

                httpEndpoint.supportedBy.preConfiguredFields?.forEach(field => {
                  ep[field.path] = field.values?.[0];
                });
                httpEndpoint.supportedBy.fieldsToUnset?.forEach(field => {
                  if (ep[field.path]) {
                    ep[field.path] = undefined;
                    delete ep[field.path];
                  }
                });
                exportData.resources[i].endpoints.push(deepClone(ep));
        }
      });
    }
    delete exportData.resources[i].exportPreConfiguredFields;
  });
  exportData.resources = deepClone(exportData.resources.filter(r => r.endpoints?.length));

  return exportData;
};
export const getImportMetadata = (connectorMeta, connectionVersion, connectionAPI) => {
  let connectorMetadata = customCloneDeep(connectorMeta);
  const { httpConnectorEndpoints: httpEndpoints} = connectorMetadata;
  let { httpConnectorResources: httpResources } = connectorMetadata;
  const importData = {
    labels: {
      version: 'API version',
    },
  };

  if (connectionAPI) {
    connectorMetadata = connectorMetadata?.apis?.find(api => api._id === connectionAPI);
  }
  const versionLocation = connectorMetadata.versioning?.location;

  if (versionLocation === 'uri' && !connectionVersion) {
    importData.addVersionToUrl = true;
  }

  if (!httpResources || !httpEndpoints) {
    return importData;
  }
  const importPreConfiguredFields = connectorMetadata.supportedBy?.import?.preConfiguredFields;

  importPreConfiguredFields?.forEach(field => {
    importData[field.path] = field.values?.[0];
  });
  let versions = connectorMetadata.versions?.map(v => ({version: v.name, _id: v._id}));

  if (!versions || !versions.length) {
    versions = [
      {
        version: 'v2',
        _id: '_v2id',
      }];
  }
  if (connectionAPI) {
    httpResources = httpResources.filter(r => r._httpConnectorApiId === connectionAPI);
  }

  if (connectionVersion) {
    versions = versions.filter(v => v._id === connectionVersion);
    httpResources = httpResources.filter(r => r._versionIds?.includes(versions[0]?._id));
  }

  importData.versions = customCloneDeep(versions);
  importData.resources = httpResources.map(httpResource => {
    const resourcePreConfiguredFields = customCloneDeep(httpResource.supportedBy?.import?.preConfiguredFields);
    const resourceFieldsUserMustSet = customCloneDeep(httpResource.supportedBy?.import?.fieldsUserMustSet);

    const sampleData = httpResource.resourceFields && convertResourceFieldstoSampleData(httpResource.resourceFields);

    return {
      ...httpResource, id: httpResource._id, name: httpResource.name, resourcePreConfiguredFields, sampleData, resourceFieldsUserMustSet, hidden: !!httpResource.hidden,
    };
  });

  importData.resources.forEach((r, i) => {
    importData.resources[i].versions = versions.filter(v => r._versionIds?.includes(v._id));
    const filteredHttpEndpoints = httpEndpoints.filter(e => {
      let htpEndpointExists = false;

            e._httpConnectorResourceIds?.forEach(eResId => {
              if (r.id.includes(eResId)) {
                htpEndpointExists = true;
              }
            });

            return htpEndpointExists;
    });

    if (filteredHttpEndpoints.length) {
      importData.resources[i].operations = [];

      filteredHttpEndpoints.forEach(httpEndpoint => {
        if (httpEndpoint?.supportedBy?.type === 'import') {
          const requiredMappings = [];
          const parameters = [];
          let howToFindIdentifier;

          if (httpEndpoint.pathParameters) {
                  httpEndpoint.pathParameters?.forEach(pp => {
                    parameters.push({
                      id: pp.name,
                      name: pp.label,
                      in: 'path',
                      required: true,
                      config: pp.config,
                      suggestions: pp.values,
                    });
                  });
          }
          if (httpEndpoint.supportedBy.pathParameterToIdentifyExisting) {
            parameters.push({
              id: httpEndpoint.supportedBy.pathParameterToIdentifyExisting,
              in: 'path',
              required: true,
              isIdentifier: true,
            });
          }

          if (httpEndpoint.supportedBy?.lookupToIdentifyExisting) {
            const lookup = httpEndpoint.supportedBy.lookupToIdentifyExisting;
            const endpoint = lookup?._httpConnectorEndpointId;
            const lookupEndpoint = httpEndpoints.find(ep => ep._id === endpoint);

            if (!howToFindIdentifier) {
              howToFindIdentifier = {};
            }
            if (lookupEndpoint) {
              howToFindIdentifier.lookup = {url: lookupEndpoint.relativeURI, id: lookupEndpoint._id, extract: lookup?.extract};
            }
          }
          const supportsAsyncHelper = !!httpEndpoint.supportedBy.fieldsUserMustSet?.find(f => f.path === 'http._asyncHelperId');

          const ep = {
            id: httpEndpoint._id, name: httpEndpoint.name, url: httpEndpoint.relativeURI, method: httpEndpoint.method, howToFindIdentifier, hidden: !!httpEndpoint.hidden, _httpConnectorResourceIds: httpEndpoint._httpConnectorResourceIds, supportsAsyncHelper,
          };

          if (httpEndpoint.resourceFields) {
            ep.sampleData = getEndpointResourceFields(httpEndpoint.resourceFields, deepClone(r.sampleData));
          }

                r?.resourceFieldsUserMustSet?.forEach(f => {
                  ep[f.path] = f.values?.[0] || true;
                });
                r?.resourcePreConfiguredFields?.forEach(f => {
                  ep[f.path] = f.values?.[0] || true;
                });

                httpEndpoint.supportedBy.fieldsUserMustSet?.forEach(f => {
                  if (f.path.includes('mapping.fields.generate.')) {
                    requiredMappings.push(f.path?.replace('mapping.fields.generate.', ''));
                  } else {
                    ep[f.path] = f.values?.[0] || true;
                  }
                });
                httpEndpoint.supportedBy.preConfiguredFields?.forEach(f => {
                  ep[f.path] = f.values?.[0];
                });
                httpEndpoint.supportedBy.fieldsToUnset?.forEach(f => {
                  ep[f.path] = undefined;
                  delete ep[f.path];
                });
                if (ep.ignoreExisting) {
                  ep.supportIgnoreExisting = true;
                }
                if (ep.ignoreMissing) {
                  ep.supportIgnoreMissing = true;
                }
                if (requiredMappings) {
                  ep.requiredMappings = requiredMappings;
                }
                if (parameters.length) {
                  ep.parameters = parameters;
                }

                importData.resources[i].operations.push(deepClone(ep));
        }
      });
    }
    delete importData.resources[i].resourcePreConfiguredFields;
    delete importData.resources[i].resourceFieldsUserMustSet;
  });
  importData.resources = deepClone(importData.resources.filter(r => r.operations?.length));

  return importData;
};
export const getHTTPConnectorMetadata = (connectorMetadata, connectionVersion, connectionAPI) => {
  const { httpConnectorResources, httpConnectorEndpoints} = connectorMetadata;

  const resourceNames = {};
  const newResources = [];
  let modifiedHttpConnectorResources = httpConnectorResources.map(res => {
    const filteredHttpResources = httpConnectorResources.filter(hRes => res.name === hRes.name);

    if (filteredHttpResources.length > 1 && !connectionVersion) {
      if (!resourceNames[res.name]) {
        resourceNames[res.name] = true;
        const ids = filteredHttpResources.map(fRes => fRes._id);
        let versionIds = filteredHttpResources.map(fRes => fRes._versionIds)?.flat(1);

        versionIds = [...new Set(versionIds)];
        const newId = ids.join('+');

        newResources.push({...filteredHttpResources[0], _id: newId, _versionIds: versionIds});
      }

      return {...res, hidden: true};
    }

    return {...res};
  });

  modifiedHttpConnectorResources = [...modifiedHttpConnectorResources, ...newResources];

  const endpointNames = {};
  const newEndpoints = [];

  let modifiedHttpConnectorEndpoints = httpConnectorEndpoints.map(res => {
    const filteredHttpEndpoints = httpConnectorEndpoints.filter(hRes => res.name === hRes.name);

    if (filteredHttpEndpoints.length > 1 && !connectionVersion) {
      if (!endpointNames[res.name]) {
        endpointNames[res.name] = true;
        const ids = filteredHttpEndpoints.map(fRes => fRes._id);
        const newId = ids.join('+');

        newEndpoints.push({...filteredHttpEndpoints[0], _id: newId});
      }

      return {...res, hidden: true};
    }

    return {...res};
  });

  modifiedHttpConnectorEndpoints = [...modifiedHttpConnectorEndpoints, ...newEndpoints];

  const exportData = getExportMetadata({...connectorMetadata, httpConnectorResources: modifiedHttpConnectorResources, httpConnectorEndpoints: modifiedHttpConnectorEndpoints }, connectionVersion, connectionAPI);
  const importData = getImportMetadata({...connectorMetadata, httpConnectorResources: modifiedHttpConnectorResources, httpConnectorEndpoints: modifiedHttpConnectorEndpoints }, connectionVersion, connectionAPI);

  return {export: exportData, import: importData};
};
export const updateFinalMetadataWithHttpFramework = (finalFieldMeta, httpConnector, resource, isGenericHTTP, apiChange) => {
  let connector = httpConnector;
  const resetToDefaultValue = isNewId(resource?._id) || apiChange;

  if (!connector) {
    return finalFieldMeta;
  }
  if (connector.apis?.length) {
    if (!resource?.http?._httpConnectorApiId) {
      if (isGenericHTTP) { return finalFieldMeta; }

      const tempFieldMap = Object.keys(finalFieldMeta.fieldMap).reduce((acc, field) => {
        if (field === 'http._httpConnectorApiId') {
          return ({...acc, [field]: {...finalFieldMeta.fieldMap[field], required: true}});
        }

        return ({...acc, [field]: {...finalFieldMeta.fieldMap[field], visible: field === 'name'}});
      },

      {});

      return {...finalFieldMeta, fieldMap: tempFieldMap};
    }
    connector = httpConnector.apis.find(api => api._id === resource?.http?._httpConnectorApiId);
  }
  if (!connector.supportedBy) {
    return null;
  }

  const connectionTemplate = connector.supportedBy.connection;
  const tempFiledMeta = customCloneDeep(finalFieldMeta);
  let resourceVersion = resource?.http?.unencrypted?.version;

  if (!resourceVersion && resource?.http?._httpConnectorVersionId) {
    resourceVersion = connector.versions?.find(ver => ver._id === resource.http._httpConnectorVersionId)?.name;
  }

  if (!isGenericHTTP) {
    Object.keys(tempFiledMeta.fieldMap).map(key => {
      const preConfiguredField = connectionTemplate.preConfiguredFields?.find(field => key === field.path);
      const fieldUserMustSet = connectionTemplate.fieldsUserMustSet?.find(field => key === field.path);
      const preConfiguredFieldLists = connectionTemplate.preConfiguredFields?.filter(field => key === field.path);
      const _conditionIdValuesMap = [];

      preConfiguredFieldLists.forEach(field => {
        if (field._conditionIds?.length && field.values) { _conditionIdValuesMap.push({_conditionIds: field._conditionIds, values: field.values}); }
      });
      if (preConfiguredField) {
        if (_conditionIdValuesMap.length) {
          tempFiledMeta.fieldMap[key]._conditionIdValuesMap = _conditionIdValuesMap;
          tempFiledMeta.fieldMap[key].conditions = connectionTemplate?.conditions;
        }
      }
      if (fieldUserMustSet) {
        if (fieldUserMustSet._conditionIds?.length > 0) {
          tempFiledMeta.fieldMap[key]._conditionIds = fieldUserMustSet?._conditionIds;
          tempFiledMeta.fieldMap[key].conditions = connectionTemplate?.conditions;
        }
        if (fieldUserMustSet.inputType) {
          tempFiledMeta.fieldMap[key].inputType = fieldUserMustSet?.inputType;
        }
      }

      if (resource?.http?._httpConnectorApiId && key === 'http._httpConnectorApiId') {
        tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], required: true};
      } else if (key === 'http.ping.relativeURI') {
        if (!tempFiledMeta.fieldMap[key].defaultValue || apiChange) {
          tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], defaultValue: preConfiguredField?.values?.[0]};
        } else if (connector.versioning?.location === 'uri' && connector?.baseURIs?.[0]?.includes('/:_version')) {
          if (resourceVersion) {
            tempFiledMeta.fieldMap[key].defaultValue = tempFiledMeta.fieldMap[key].defaultValue.replace(`/${resourceVersion}`, '');
          } else if (connector.versions?.[0]?.name) {
            tempFiledMeta.fieldMap[key].defaultValue = tempFiledMeta.fieldMap[key].defaultValue.replace(`/${connector.versions?.[0]?.name}`, '');
          }
        }
        if (preConfiguredField?.values?.length > 1) {
          const options = [
            {
              items: preConfiguredField.values.map(opt => ({
                label: AUTHENTICATION_LABELS[opt] || opt,
                value: opt,
              })),
            },
          ];

          tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], type: 'select', options};
        } else {
          tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], visible: false};
        }
      } else if (key === 'http.auth.oauth.scope') {
        const field = preConfiguredField || fieldUserMustSet;
        const scopes = field?.values?.map(f => {
          if (f.name) {
            return {subHeader: f.name, scopes: f.scopes};
          }

          return f;
        }) || emptyObject;

        if (!isEmpty(scopes)) {
          tempFiledMeta.fieldMap[key].type = 'selectscopes';
          tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], scopes};
        } else {
          tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], visible: false};
        }
      } else if (fieldUserMustSet) {
        if (resetToDefaultValue) {
          tempFiledMeta.fieldMap[key].defaultValue = fieldUserMustSet?.values?.[0];
        }
        tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], required: true, visible: true};
        if (fieldUserMustSet.values?.length > 1) {
          const options = [
            {
              items: fieldUserMustSet.values.map(opt => ({
                label: AUTHENTICATION_LABELS[opt] || opt,
                value: opt,
              })),
            },
          ];

          if (!tempFiledMeta.fieldMap[key].defaultValue) { tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], defaultValue: fieldUserMustSet.values?.[0]}; }

          tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], options};
        }
        if (fieldUserMustSet?.labelOverride) {
          tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], label: fieldUserMustSet?.labelOverride};
        }
      } else if (preConfiguredField) {
        if (resetToDefaultValue) {
          tempFiledMeta.fieldMap[key].defaultValue = preConfiguredField?.values?.[0];
        }
        if (preConfiguredField.values?.length > 1) {
          const options = [
            {
              items: preConfiguredField.values.map(opt => ({
                label: AUTHENTICATION_LABELS[opt] || opt,
                value: opt,
              })),
            },
          ];

          tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], options};
        } else {
          tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], visible: false};
        }
        if (!tempFiledMeta.fieldMap[key].defaultValue) {
          tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], defaultValue: preConfiguredField.values?.[0]};
        }
      } else if (!tempFiledMeta.fieldMap[key].required && key !== 'settings') {
        tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], visible: isGenericHTTP || false};
        if (apiChange) {
          tempFiledMeta.fieldMap[key].defaultValue = undefined;
        }
      } else if (key === 'http._iClientId') {
        tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], required: !!fieldUserMustSet};
      } else if (key === 'http.auth.token.token' || key === 'http.auth.token.refreshToken') {
        tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], visible: false};
      } else if (key === 'http.baseURI') {
        if (!tempFiledMeta.fieldMap[key].defaultValue || resetToDefaultValue) { tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], defaultValue: connector?.baseURIs?.[0]?.replace('/:_version', '') }; } else if (resourceVersion) {
          tempFiledMeta.fieldMap[key].defaultValue = tempFiledMeta.fieldMap[key].defaultValue.replace(`/${resourceVersion}`, '');
        }
        if (connector?.baseURIs?.length > 1) {
          const options = [
            {
              items: connector?.baseURIs?.map(opt => ({
                label: AUTHENTICATION_LABELS[opt] || opt,
                value: opt,
              })),
            },
          ];

          tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], options, type: 'select'};
        }
      }

      return tempFiledMeta.fieldMap[key];
    }
    );
  }

  const unEncryptedFields = [];
  const versions = connector.versions?.map(v => v.name);
  const versionOptions = [
    {
      items: versions.map(opt => ({
        label: AUTHENTICATION_LABELS[opt] || opt,
        value: opt,
      })),
    },
  ];

  if (versionOptions?.length) {
    unEncryptedFields.push({
      field: {
        label: 'API version',
        name: '/http/unencrypted/version',
        id: 'http.unencrypted.version',
        fieldId: 'http.unencrypted.version',
        type: 'select',
        visible: !(versions && versions.length <= 1),
        options: versionOptions,
        defaultValue: resetToDefaultValue ? versions?.[0] : resourceVersion,
      },
    });
  }
  const preConfiguredUnEncryptedFields = connectionTemplate.preConfiguredFields.find(field => field.path === 'http.unencryptedFields');

  if (preConfiguredUnEncryptedFields?.values?.length > 0) {
    preConfiguredUnEncryptedFields.values.forEach(fld => {
      const _conditionIdValuesMap = [];
      let _conditionIds = [];

      const preConfiguredField = connectionTemplate.preConfiguredFields?.find(field => `http.unencrypted.${fld.id}` === field.path);
      const fieldUserMustSet = connectionTemplate.fieldsUserMustSet?.find(field => `http.unencrypted.${fld.id}` === field.path);
      let {inputType} = fld;

      if (preConfiguredField) {
        const fieldLists = connectionTemplate.preConfiguredFields?.filter(field => `http.unencrypted.${fld.id}` === field.path);

        fieldLists.forEach(field => {
          if (field._conditionIds?.length) { _conditionIdValuesMap.push({_conditionIds: field._conditionIds, values: field.values}); }
        });
      } else if (fieldUserMustSet) {
        if (fieldUserMustSet._conditionIds && fieldUserMustSet._conditionIds.length > 0) {
          _conditionIds = fieldUserMustSet?._conditionIds;
        }
        if (fieldUserMustSet.inputType) {
          inputType = fieldUserMustSet?.inputType;
        }
      }
      unEncryptedFields.push({
        position: 1,
        field: {
          ...fld,
          name: `/http/unencrypted/${fld.id}`,
          id: `http.unencrypted.${fld.id}`,
          fieldId: `http.unencrypted.${fld.id}`,
          type: fld.type || 'text',
          defaultValue: resetToDefaultValue ? fld.defaultValue : (resource?.http?.unencrypted?.[fld.id] || fld.defaultValue),
          conditions: connectionTemplate?.conditions,
          _conditionIdValuesMap,
          helpLink: fld.helpURL,
          _conditionIds,
          inputType,
        },
      });
    });
  }
  const preConfiguredEncryptedFields = connectionTemplate.preConfiguredFields.find(field => field.path === 'http.encryptedFields');

  if (preConfiguredEncryptedFields?.values?.length > 0) {
    preConfiguredEncryptedFields.values.forEach(fld => {
      const _conditionIdValuesMap = [];
      let _conditionIds = [];

      const preConfiguredField = connectionTemplate.preConfiguredFields?.find(field => `http.encrypted.${fld.id}` === field.path);
      const fieldUserMustSet = connectionTemplate.fieldsUserMustSet?.find(field => `http.encrypted.${fld.id}` === field.path);

      if (preConfiguredField) {
        const fieldLists = connectionTemplate.preConfiguredFields?.filter(field => `http.encrypted.${fld.id}` === field.path);

        fieldLists.forEach(field => {
          if (field._conditionIds?.length) { _conditionIdValuesMap.push({_conditionIds: field._conditionIds, values: field.values}); }
        });
      } else if (fieldUserMustSet && fieldUserMustSet?._conditionIds && fieldUserMustSet?._conditionIds.length > 0) {
        _conditionIds = fieldUserMustSet?._conditionIds;
      }

      unEncryptedFields.push({
        position: 2,
        field: {
          ...fld,
          name: `/http/encrypted/${fld.id}`,
          id: `http.encrypted.${fld.id}`,
          fieldId: `http.encrypted.${fld.id}`,
          inputType: 'password',
          type: fld.type || 'text',
          defaultValue: !resetToDefaultValue ? resource?.http?.encrypted?.[fld.id] : '',
          conditions: connectionTemplate?.conditions,
          helpLink: fld.helpURL,
          _conditionIdValuesMap,
          _conditionIds,
        },
      });
    });
  }

  if (unEncryptedFields && !isGenericHTTP) {
    for (let i = 0; i < unEncryptedFields.length; i += 1) {
      unEncryptedFields[i] = unEncryptedFields[i].field;
      tempFiledMeta.fieldMap[unEncryptedFields[i].id] = unEncryptedFields[i];
      if (unEncryptedFields[i].id === 'http.unencrypted.version') {
        tempFiledMeta?.layout?.containers[0]?.fields.push(unEncryptedFields[i].id);
      } else if (unEncryptedFields[i].id.includes('http.unencrypted')) {
        tempFiledMeta?.layout?.containers?.push({fields: [unEncryptedFields[i].id]});
      } else if (unEncryptedFields[i].id.includes('http.encrypted')) {
        tempFiledMeta?.layout?.containers?.push({fields: [unEncryptedFields[i].id]});
      } else if (tempFiledMeta?.layout?.containers?.[0]?.containers?.[1]?.fields) {
        tempFiledMeta.layout.containers[0].containers[1]?.fields.push(unEncryptedFields[i].id);
      } else if (tempFiledMeta?.layout?.containers[2]?.fields) { tempFiledMeta.layout.containers[2].fields.push(unEncryptedFields[i].id); }
    }
  }

  const settingFields = connectionTemplate.preConfiguredFields?.find(field => field.path === 'settingsForm');

  if (settingFields) {
    const fieldMap = settingFields.values?.[0].fieldMap;
    const fields = [];

    Object.entries(fieldMap).forEach(([, value]) => {
      const _conditionIdValuesMap = [];
      let {inputType} = value;

      let _conditionIds = [];

      if (!isGenericHTTP) {
        const preConfiguredField = connectionTemplate.preConfiguredFields?.find(field => `settings.${value.id}` === field.path);
        const fieldUserMustSet = connectionTemplate.fieldsUserMustSet?.find(field => `settings.${value.id}` === field.path);

        if (preConfiguredField) {
          const fieldLists = preConfiguredField ? connectionTemplate.preConfiguredFields?.filter(field => `settings.${value.id}` === field.path) : connectionTemplate.fieldsUserMustSet?.filter(field => `settings.${value.id}` === field.path);

          fieldLists.forEach(field => {
            if (field._conditionIds?.length) { _conditionIdValuesMap.push({_conditionIds: field._conditionIds, values: field.values}); }
          });
        } else if (fieldUserMustSet) {
          if (fieldUserMustSet?._conditionIds && fieldUserMustSet?._conditionIds.length > 0) {
            _conditionIds = fieldUserMustSet?._conditionIds;
          }
          if (fieldUserMustSet.inputType) {
            inputType = fieldUserMustSet?.inputType;
          }
        }
      }

      fields.push({
        field: {
          ...value,
          name: `/settings/${value.id}`,
          id: `settings.${value.id}`,
          fieldId: `settings.${value.id}`,
          type: value.type || 'text',
          defaultValue: resetToDefaultValue ? value.defaultValue : (resource?.settings?.[value.id] || value.defaultValue),
          conditions: connectionTemplate?.conditions,
          helpLink: value.helpURL,
          _conditionIdValuesMap,
          _conditionIds,
          inputType,
        },
      });
    });

    if (fields) {
      const fieldIds = [];
      const preConfiguredField = connectionTemplate.preConfiguredFields?.filter(field => field.path === 'http.baseURI');

      for (let i = 0; i < fields.length; i += 1) {
        fields[i] = fields[i].field;
        tempFiledMeta.fieldMap[fields[i].id] = fields[i];
        fieldIds.push(fields[i].id);
      }
      if (isGenericHTTP && resetToDefaultValue) {
          tempFiledMeta.layout?.containers?.push({fields: fieldIds, label: 'Custom settings'});
      } else if (!isGenericHTTP) {
        const baseURIFields = []; const authFields = [];
        const baseURIValue = tempFiledMeta?.fieldMap['http.baseURI']?.defaultValue;

        fieldIds.forEach(field => {
          (new RegExp(`{{(.)*(${field})(.)*}}`)).test(baseURIValue) ? baseURIFields.push(field) : authFields.push(field);
        });
        if (baseURIFields.length > 0) {
              tempFiledMeta?.layout?.containers[1]?.containers[1]?.containers?.splice(0, 1, {fields: baseURIFields});
        } else if (preConfiguredField) {
          preConfiguredField.forEach(field => {
            if (field._conditionIds?.length) {
              const conditionFields = connectionTemplate?.conditions?.filter(field1 => field1._id === field?._conditionIds[0]);
              const dependentField = conditionFields[0]?.condition?.rules[1][1][1];

              tempFiledMeta?.layout?.containers[1]?.containers[1]?.containers?.splice(0, 1, {fields: [dependentField]});
            }
          });
        } else {
              tempFiledMeta?.layout?.containers[1]?.containers?.splice(1, 1);
        }
        if (tempFiledMeta?.fieldMap['http.auth.type']?.visible === false) {
          delete tempFiledMeta?.layout?.containers[3]?.containers[1]?.type;
        }
        if (tempFiledMeta?.layout?.containers[1]?.containers[1]?.containers[0]?.fields?.length > 0) {
          const baseurlDependentFields = tempFiledMeta?.layout?.containers[1]?.containers[1]?.containers[0]?.fields;

          baseurlDependentFields.forEach(field => {
            const indexcheck = fieldIds.indexOf(field);

            delete fieldIds[indexcheck];
          });
        }
        tempFiledMeta?.layout?.containers[7]?.containers?.push({fields: fieldIds});
          tempFiledMeta?.layout?.containers[7]?.containers?.splice(0, 1);
          Object.keys(tempFiledMeta.fieldMap).map(key => {
            const fieldUserMustSet = connectionTemplate.fieldsUserMustSet?.find(field => key === field.path);

            if (fieldUserMustSet && fieldUserMustSet.helpURL) {
              tempFiledMeta.fieldMap[key].helpLink = `${fieldUserMustSet.helpURL}`;
            }

            return tempFiledMeta.fieldMap[key];
          }

          );
      }
    }
  } else if (!isGenericHTTP) {
  // when there is only one authentication type then side bar is not required for authentication related fields
    if (tempFiledMeta?.fieldMap['http.auth.type']?.visible === false) {
      delete tempFiledMeta?.layout?.containers[3]?.containers[1]?.type;
    }
    tempFiledMeta?.layout?.containers[1]?.containers?.splice(1, 1);
    Object.keys(tempFiledMeta.fieldMap).map(key => {
      const fieldUserMustSet = connectionTemplate.fieldsUserMustSet?.find(field => key === field.path);

      if (fieldUserMustSet && fieldUserMustSet.helpURL) {
        tempFiledMeta.fieldMap[key].helpLink = `${fieldUserMustSet.helpURL}`;
      }

      return tempFiledMeta.fieldMap[key];
    }
    );
  }

  return tempFiledMeta;
};

export const updateIclientMetadataWithHttpFramework = (fieldMeta, resource, flow, httpConnectorData, isGenericHTTP) => {
  const applications = applicationsList().filter(app => app._httpConnectorId);
  let app;

  if (resource?.application) {
    app = applications.find(a => a.name.toLowerCase().replace(/\.|\s/g, '') === resource?.application) || {};
  } else if (resource?.assistant) {
    app = applications.find(a => a.id === resource?.assistant) || {};
  }
  const tempFiledMeta = customCloneDeep(fieldMeta);

  const iClientPathMap = {
    'oauth2.grantType': 'http.auth.oauth.grantType',
    'oauth2.clientCredentialsLocation': 'http.auth.oauth.clientCredentialsLocation',
    'oauth2.auth.uri': 'http.auth.oauth.authURI',
    'oauth2.callbackURL': 'http.auth.oauth.callbackURL',
    'oauth2.token.uri': 'http.auth.oauth.tokenURI',
    'oauth2.scopeDelimiter': 'http.auth.oauth.scopeDelimiter',
    'oauth2.token.headers': 'http.auth.oauth.accessTokenHeaders',
    'oauth2.token.body': 'http.auth.oauth.accessTokenBody',
    'oauth2.refresh.headers': 'http.auth.oauth.refreshHeaders',
    'oauth2.refresh.body': 'http.auth.oauth.refreshBody',
    'oauth2.accessTokenLocation': 'http.auth.token.location',
    'oauth2.accessTokenHeaderName': 'http.auth.token.headerName',
    'oauth2.scheme': 'http.auth.token.scheme',
    'oauth2.customAuthScheme': 'http.customAuthScheme',
    'oauth2.accessTokenParamName': 'http.auth.token.paramName',
    'oauth2.failStatusCode': 'http.auth.failStatusCode',
    'oauth2.failPath': 'http.auth.failPath',
    'oauth2.failValues': 'http.auth.failValues',
    'oauth2.validDomainNames': 'oauth2.validDomainNames',
  };

  if (!isGenericHTTP) {
    if (!httpConnectorData || !httpConnectorData?.supportedBy) {
      return tempFiledMeta;
    }
  }

  Object.keys(iClientPathMap).forEach(key => {
    const preConfiguredField = httpConnectorData?.supportedBy?.connection?.preConfiguredFields?.find(field => iClientPathMap[key] === field?.path);

    if (isNewId(resource?._id) && preConfiguredField && !resource?.application) {
      // new Iclient
      !tempFiledMeta?.fieldMap[key]?.defaultValue && (tempFiledMeta.fieldMap[key].defaultValue = preConfiguredField?.values[0]);
      if (key === 'oauth2.callbackURL') {
        !tempFiledMeta?.fieldMap[key]?.defaultValue && (tempFiledMeta.fieldMap[key].defaultValue = `${getDomainUrl()}/connection/oauth2callback`);
      }
    } else if (resource?.application && (resource?._httpConnectorId !== httpConnectorData?._id)) {
      // change application in existing iclient should refresh all the preconfigured values
      tempFiledMeta.fieldMap[key].defaultValue = preConfiguredField ? preConfiguredField?.values[0] : '';
      if (key === 'oauth2.callbackURL') {
        !tempFiledMeta?.fieldMap[key]?.defaultValue && (tempFiledMeta.fieldMap[key].defaultValue = `${getDomainUrl()}/connection/oauth2callback`);
      }
    } else if (resource?.application && preConfiguredField && (resource?._httpConnectorId === httpConnectorData?._id)) {
      // If application is not changed in the existing Iclient it should not change preconfigured value
      tempFiledMeta?.fieldMap[key]?.defaultValue;
    } else if (resource?.application === 'custom_oauth2') {
      // when application is not a httpconnector then all preconfigured values should replaces with ''
      tempFiledMeta.fieldMap[key].defaultValue = '';
      tempFiledMeta.fieldMap.application.defaultValue = 'custom_oauth2';
    }
  });
  if (!app?._httpConnectorId) {
    delete tempFiledMeta.layout.containers[0].fields[3];
  }
  const httpApplicaions = applicationsList().filter(a => a._httpConnectorId);
  const items = [];

  httpApplicaions.forEach(app => {
    items.push({label: app?.name, value: app?.name.toLowerCase().replace(/\.|\s/g, '')});
  });
  items.push({label: 'Custom OAuth2.0', value: 'custom_oauth2'});
  // changing the application inside resource -> application

  const connectorData = app?._httpConnectorId ? getHttpConnector(app?._httpConnectorId) : getHttpConnector(resource?._httpConnectorId);

  tempFiledMeta.fieldMap?.application?.options.push({items});
  if (resource?.application === 'custom_oauth2') {
    tempFiledMeta.fieldMap.application.defaultValue = 'custom_oauth2';
  } else if ((resource?.application || resource?.assistant) && resource?.application !== 'custom_oauth2') {
    tempFiledMeta.fieldMap.application.defaultValue = connectorData?.name.toLowerCase().replace(/\.|\s/g, '') || connectorData?.legacyId;
  } else { tempFiledMeta.fieldMap.application && (tempFiledMeta.fieldMap.application.defaultValue = resource?._httpConnectorId ? (connectorData?.name.toLowerCase().replace(/\.|\s/g, '') || connectorData?.legacyId) : 'custom_oauth2'); }

  return tempFiledMeta;
};
export const updateWebhookFinalMetadataWithHttpFramework = (finalFieldMeta, connector, resource) => {
  if (!connector || !connector.supportedBy) {
    return finalFieldMeta;
  }
  const exportTemplate = connector.supportedBy.export;
  const tempFiledMeta = customCloneDeep(finalFieldMeta);

  Object.keys(tempFiledMeta.fieldMap).map(key => {
    const preConfiguredField = exportTemplate.preConfiguredFields?.find(field => key === field.path);
    const fieldUserMustSet = exportTemplate.fieldsUserMustSet?.find(field => key === field.path);

    if (isNewId(resource?._id) && preConfiguredField) {
      tempFiledMeta.fieldMap[key].defaultValue = preConfiguredField?.values?.[0];
    }

    if (fieldUserMustSet) {
      tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], required: true, visible: true};
      if (fieldUserMustSet.values?.length > 1) {
        const options = [
          {
            items: fieldUserMustSet.values.map(opt => ({
              label: AUTHENTICATION_LABELS[opt] || opt,
              value: opt,
            })),
          },
        ];

        if (!tempFiledMeta.fieldMap[key].defaultValue) { tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], defaultValue: fieldUserMustSet.values?.[0]}; }

        tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], options};
      }
    } else if (preConfiguredField) {
      if (preConfiguredField.values?.length > 1) {
        const options = [
          {
            items: preConfiguredField.values.map(opt => ({
              label: AUTHENTICATION_LABELS[opt] || opt,
              value: opt,
            })),
          },
        ];

        tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], options};
      } else {
        tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], visible: false};
      }
      if (!tempFiledMeta.fieldMap[key].defaultValue) {
        tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], defaultValue: preConfiguredField.values?.[0]};
      }
    } else if (key === 'webhook._httpConnectorId') {
      tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], defaultValue: connector._id};
    }

    return tempFiledMeta.fieldMap[key];
  }
  );

  return tempFiledMeta;
};
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
    // eslint-disable-next-line no-console
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
  });

  const { merged } = yield select(
    selectors.resourceData,
    resourceType,
    resourceId,
  );

  try {
    return applyPatch(merged ? deepClone(merged) : {}, deepClone(patchSet))
      .newDocument;
  } catch (e) {
    return {};
  }
}

export function* constructSuiteScriptResourceFromFormValues({
  formValues = {},
  resourceId,
  resourceType,
  ssLinkedConnectionId,
  integrationId,
}) {
  const { patchSet } = yield call(createSuiteScriptFormValuesPatchSet, {
    resourceType,
    resourceId,
    values: formValues,
    ssLinkedConnectionId,
    integrationId,
  });

  const { merged } = yield select(selectors.suiteScriptResourceData, {
    resourceType,
    id: resourceId,
    ssLinkedConnectionId,
    integrationId,
  });

  try {
    return applyPatch(merged ? deepClone(merged) : {}, deepClone(patchSet))
      .newDocument;
  } catch (e) {
    return {};
  }
}

