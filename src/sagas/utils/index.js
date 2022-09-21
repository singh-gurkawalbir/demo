import jsonPatch, { deepClone, applyPatch } from 'fast-json-patch';
import * as _ from 'lodash';
import { select, call } from 'redux-saga/effects';
import util from '../../utils/array';
import { isNewId } from '../../utils/resource';
import { selectors } from '../../reducers';
import { createFormValuesPatchSet, SCOPES } from '../resourceForm';
import { createFormValuesPatchSet as createSuiteScriptFormValuesPatchSet } from '../suiteScript/resourceForm';
import { AUTHENTICATION_LABELS, emptyObject } from '../../constants';

export const convertResourceFieldstoSampleData = (resourceFields, dataType = 'object') => {
  if (!resourceFields) {
    return '';
  }
  if (dataType === 'object') {
    const output = {};

    resourceFields.forEach(rf => {
      if (rf.resourceFields) {
        output[rf.id] = convertResourceFieldstoSampleData(rf.resourceFields, rf.dataType);
      } else { output[rf.id] = rf.id; }
    });

    return output;
  }
  if (dataType === 'objectarray') {
    const tempOutput = {};

    resourceFields.forEach(rf => {
      if (rf.resourceFields) {
        tempOutput[rf.id] = convertResourceFieldstoSampleData(rf.resourceFields, rf.dataType);
      } else { tempOutput[rf.id] = rf.id; }
    });

    return [tempOutput];
  }
};
export const generateReplaceAndRemoveLastModified = patches =>
  (patches &&
    patches.length &&
    util.removeItem(patches, p => p.path === '/lastModified')) ||
  [];
const hasPatch = patches => patches && patches.length;
const isPathPresentAndValueDiff = patchArr => patch =>
  patchArr.some(p => p.path === patch.path && p.value !== patch.value);

export const getExportMetadata = (connectorMetadata, connectionVersion) => {
  const { httpConnectorResources: httpResources, httpConnectorEndpoints: httpEndpoints} = connectorMetadata;
  const versionLocation = connectorMetadata.versioning?.location;

  const exportData = {
    labels: {
      version: 'API Version',
    },
  };

  if (!httpResources || !httpEndpoints) {
    return exportData;
  }
  const exportPreConfiguredFields = connectorMetadata.supportedBy?.export?.preConfiguredFields;

  exportPreConfiguredFields.forEach(field => {
    exportData[field.path] = field.values?.[0];
  });

  let versions = connectorMetadata.versions?.map(v => ({version: v.name, _id: v._id}));

  if (connectionVersion) {
    versions = versions.filter(v => v.version === connectionVersion);
  }
  exportData.versions = _.cloneDeep(versions);

  if (!versions || !versions.length) {
    versions = [
      {
        version: 'v2',
        _id: '_v2id',
      }];
  }

  exportData.resources = httpResources.map(httpResource => {
    const exportPreConfiguredFields = _.cloneDeep(httpResource.supportedBy?.export?.preConfiguredFields);

    return {
      ...httpResource, id: httpResource._id, exportPreConfiguredFields,
    };
  });
  exportData.resources.forEach((r, i) => {
    exportData.resources[i].versions = versions.filter(v => r._versionIds?.includes(v._id));

    if (exportData.resources[i].versions.length) {
      exportData.resources[i].versions.forEach((v, j) => {
        const filteredHttpEndpoints = httpEndpoints.filter(e => e._httpConnectorResourceIds?.includes(r.id));

        if (filteredHttpEndpoints.length) {
          exportData.resources[i].versions[j].endpoints = [];
          filteredHttpEndpoints.forEach(httpEndpoint => {
            if (httpEndpoint.supportedBy?.type === 'export') {
              const {fieldsUserMustSet} = httpEndpoint.supportedBy;
              const supportedExportTypes = fieldsUserMustSet?.find(f => f.path === 'type')?.values;

              const queryParameters = httpEndpoint.queryParameters?.map(qp => ({name: qp.name, id: qp.name, description: qp.description, required: qp.required, fieldType: qp.fieldType || 'textarea', defaultValue: qp.defaultValue, readOnly: qp.readOnly }));
              const pathParameters = httpEndpoint.pathParameters?.map(pp => ({name: pp.name, id: pp.name, description: pp.description, required: pp.required !== false, fieldType: pp.fieldType || 'input' }));
              let doesNotSupportPaging = false;

              if (httpEndpoint.supportedBy.fieldsToUnset?.includes('paging')) {
                doesNotSupportPaging = true;
              }

              const ep = {
                id: httpEndpoint._id, name: httpEndpoint.name, url: httpEndpoint.relativeURI, supportedExportTypes, queryParameters, pathParameters, doesNotSupportPaging,
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

                if (versionLocation === 'uri' && !connectionVersion) {
                  ep.url = `/${v.version}${httpEndpoint.relativeURI}`;
                }

                exportData.resources[i].versions[j].endpoints.push(deepClone(ep));
            }
          });
        }
        delete exportData.resources[i].versions[j].exportPreConfiguredFields;
      });
    }
    exportData.resources[i].versions = deepClone(exportData.resources[i].versions.filter(r => r.endpoints?.length));
  });
  exportData.resources = deepClone(exportData.resources.filter(r => r.versions?.length));

  return exportData;
};
export const getImportMetadata = (connectorMetadata, connectionVersion) => {
  const versionLocation = connectorMetadata.versioning?.location;
  const { httpConnectorResources: httpResources, httpConnectorEndpoints: httpEndpoints} = connectorMetadata;
  const importData = {
    labels: {
      version: 'API Version',
    },

  };
  const importPreConfiguredFields = connectorMetadata.supportedBy?.import?.preConfiguredFields;

  importPreConfiguredFields.forEach(field => {
    importData[field.path] = field.values?.[0];
  });
  let versions = connectorMetadata.versions?.map(v => ({version: v.name, _id: v._id}));

  if (connectionVersion) {
    versions = versions.filter(v => v.version === connectionVersion);
  }
  if (!versions || !versions.length) {
    versions = [
      {
        version: 'v2',
        _id: '_v2id',
      }];
  }

  importData.versions = _.cloneDeep(versions);
  importData.resources = httpResources.map(httpResource => {
    const resourcePreConfiguredFields = _.cloneDeep(httpResource.supportedBy?.import?.preConfiguredFields);
    const resourceFieldsUserMustSet = _.cloneDeep(httpResource.supportedBy?.import?.fieldsUserMustSet);

    const sampleData = httpResource.resourceFields && convertResourceFieldstoSampleData(httpResource.resourceFields);

    return {
      ...httpResource, id: httpResource._id, name: httpResource.name, resourcePreConfiguredFields, sampleData, resourceFieldsUserMustSet,
    };
  });

  importData.resources.forEach((r, i) => {
    importData.resources[i].versions = versions.filter(v => r._versionIds?.includes(v._id));

    if (importData.resources[i].versions.length) {
      importData.resources[i].versions.forEach((v, j) => {
        const filteredHttpEndpoints = httpEndpoints.filter(e => e._httpConnectorResourceIds?.includes(r.id));

        if (filteredHttpEndpoints.length) {
          importData.resources[i].versions[j].operations = [];

          filteredHttpEndpoints.forEach(httpEndpoint => {
            if (httpEndpoint?.supportedBy?.type === 'import') {
              const requiredMappings = [];
              const parameters = [];
              let howToFindIdentifier;

              if (httpEndpoint.pathParameters) {
                  httpEndpoint.pathParameters?.forEach(pp => {
                    parameters.push({
                      id: pp.name,
                      name: pp.name,
                      in: 'path',
                      required: true,
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

              const ep = {
                id: httpEndpoint._id, name: httpEndpoint.name, url: httpEndpoint.relativeURI, method: httpEndpoint.method, howToFindIdentifier,
              };

              if (httpEndpoint.resourceFields) {
                ep.sampleData = convertResourceFieldstoSampleData(httpEndpoint.resourceFields);
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

                if (versionLocation === 'uri' && !connectionVersion) {
                  ep.url = `/${v.version}${httpEndpoint.relativeURI}`;
                }
                if (ep.ignoreExisting) {
                  ep.supportIgnoreExisting = true;
                }
                if (ep.ignoreMissing) {
                  ep.supportIgnoreMissing = true;
                }
                if (requiredMappings) {
                  ep.requiredMappings = requiredMappings;
                }
                // isIdentifier should be always set on last path parameters
                if (parameters.length && (ep.ignoreExisting || ep.ignoreMissing || ep.askForHowToGetIdentifier)) {
                  parameters[parameters.length - 1].isIdentifier = true;
                }
                if (parameters.length) {
                  ep.parameters = parameters;
                }

                importData.resources[i].versions[j].operations.push(deepClone(ep));
            }
          });
        }
        delete importData.resources[i].versions[j].resourcePreConfiguredFields;
        delete importData.resources[i].versions[j].resourceFieldsUserMustSet;
      });
    }
    importData.resources[i].versions = deepClone(importData.resources[i].versions.filter(r => r.operations?.length));
  });
  importData.resources = deepClone(importData.resources.filter(r => r.versions?.length));

  return importData;
};
export const getHTTPConnectorMetadata = (connectorMetadata, connectionVersion) => {
  const exportData = getExportMetadata(connectorMetadata, connectionVersion);
  const importData = getImportMetadata(connectorMetadata, connectionVersion);

  return {export: exportData, import: importData};
};
export const updateFinalMetadataWithHttpFramework = (finalFieldMeta, connector, resource, isGenericHTTP) => {
  if (!connector || !connector.supportedBy) {
    return finalFieldMeta;
  }
  const connectionTemplate = connector.supportedBy.connection;
  const tempFiledMeta = _.cloneDeep(finalFieldMeta);

  if (!isGenericHTTP) {
    Object.keys(tempFiledMeta.fieldMap).map(key => {
      const preConfiguredField = connectionTemplate.preConfiguredFields?.find(field => key === field.path);
      const fieldUserMustSet = connectionTemplate.fieldsUserMustSet?.find(field => key === field.path);

      if (isNewId(resource?._id) && preConfiguredField) {
        tempFiledMeta.fieldMap[key].defaultValue = preConfiguredField?.values?.[0];
      }

      if (key === 'http.ping.relativeURI') {
        if (!tempFiledMeta.fieldMap[key].defaultValue) {
          tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], defaultValue: preConfiguredField?.values?.[0]};
        } else if (connector.versioning?.location === 'uri') {
          if (resource.http?.unencrypted?.version) {
            tempFiledMeta.fieldMap[key].defaultValue = tempFiledMeta.fieldMap[key].defaultValue.replace(`/${resource.http.unencrypted.version}`, '');
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

        if (scopes) {
          tempFiledMeta.fieldMap[key].type = 'selectscopes';
        }

        tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], scopes};
      } else if (fieldUserMustSet) {
        tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], required: true};
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
        if (!tempFiledMeta.fieldMap[key].defaultValue) { tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], defaultValue: preConfiguredField.values?.[0]}; }
      } else if (!tempFiledMeta.fieldMap[key].required && key !== 'settings') {
        tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], visible: isGenericHTTP || false};
      } else if (key === 'http._iClientId') {
        tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], required: false};
      } else if (key === 'http.baseURI') {
        if (!tempFiledMeta.fieldMap[key].defaultValue) { tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], defaultValue: connector?.baseURIs?.[0]?.replace('/:_version', '') }; } else if (resource.http?.unencrypted?.version) {
          tempFiledMeta.fieldMap[key].defaultValue = tempFiledMeta.fieldMap[key].defaultValue.replace(`/${resource.http?.unencrypted?.version}`, '');
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
        if (!tempFiledMeta.fieldMap[key].defaultValue.includes('{{')) {
          tempFiledMeta.fieldMap[key].visible = false;
        }
        tempFiledMeta.fieldMap['http.updateBaseURI'].defaultValue = tempFiledMeta.fieldMap[key].defaultValue;
      }
      if (tempFiledMeta?.fieldMap['name']) {
        const application = resource?.assistant;

        tempFiledMeta.fieldMap.name.placeholder = `${application} connection`;
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
        label: 'API Version',
        name: '/http/unencrypted/version',
        id: 'http.unencrypted.version',
        fieldId: 'http.unencrypted.version',
        type: 'select',
        visible: !(versions && versions.length <= 1),
        options: versionOptions,
        defaultValue: isNewId(resource._id) ? versions?.[0] : resource?.http?.unencrypted?.version,
      },
    });
  }
  const preConfiguredUnencryptedFields = connectionTemplate.preConfiguredFields.find(field => field.path === 'http.unencryptedFields');

  if (preConfiguredUnencryptedFields?.values?.length > 0) {
    preConfiguredUnencryptedFields.values.forEach(fld => {
      unEncryptedFields.push({
        position: 1,
        field: {
          label: fld.label,
          name: `/http/unencrypted/${fld.id}`,
          id: `http.unencrypted.${fld.id}`,
          fieldId: `http.unencrypted.${fld.id}`,
          helpText: fld.helpText,
          type: fld.type || 'text',
          required: !!fld.required,
          options: fld.options,
          validWhen: fld.validWhen,
          defaultValue: resource?.http?.unencrypted?.[fld.id] || fld.defaultValue,
        },
      });
    });
  }
  const preConfiguredencryptedFields = connectionTemplate.preConfiguredFields.find(field => field.path === 'http.encryptedFields');

  if (preConfiguredencryptedFields?.values?.length > 0) {
    preConfiguredencryptedFields.values.forEach(fld => {
      unEncryptedFields.push({
        position: 2,
        field: {
          label: fld.label,
          name: `/http/encrypted/${fld.id}`,
          id: `http.encrypted.${fld.id}`,
          fieldId: `http.encrypted.${fld.id}`,
          helpText: fld.helpText,
          inputType: 'password',
          type: fld.type || 'text',
          required: !!fld.required,
          options: fld.options,
          validWhen: fld.validWhen,
          defaultValue: resource?.http?.encrypted?.[fld.id],
        },
      });
    });
  }

  if (unEncryptedFields) {
    for (let i = 0; i < unEncryptedFields.length; i += 1) {
      unEncryptedFields[i] = unEncryptedFields[i].field;
      tempFiledMeta.fieldMap[unEncryptedFields[i].id] = unEncryptedFields[i];
      if (!isGenericHTTP && unEncryptedFields[i].id === 'http.unencrypted.version') {
        tempFiledMeta?.layout?.containers[0]?.fields.push(unEncryptedFields[i].id);
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
      fields.push({
        field: {
          label: value.label,
          name: `/settings/${value.id}`,
          id: `settings.${value.id}`,
          fieldId: `settings.${value.id}`,
          helpText: value.helpText,
          type: value.type || 'text',
          defaultValue: resource?.settings?.[value.id] || value.defaultValue,
          required: !!value.required,
          options: value.options,
          validWhen: value.validWhen,
        },
      });
    });

    if (fields) {
      const fieldIds = [];

      for (let i = 0; i < fields.length; i += 1) {
        fields[i] = fields[i].field;
        tempFiledMeta.fieldMap[fields[i].id] = fields[i];
        fieldIds.push(fields[i].id);
      }
      if (isGenericHTTP && isNewId(resource._id)) {
          tempFiledMeta.layout?.containers?.push({fields: fieldIds, label: 'Custom settings'});
      } else if (!isGenericHTTP) {
        const baseURIFields = []; const authFields = [];
        const baseURIValue = tempFiledMeta?.fieldMap['http.baseURI']?.defaultValue;

        fieldIds.forEach(field => {
          (new RegExp(`{{{(.)*(${field})(.)*}}}`)).test(baseURIValue) ? baseURIFields.push(field) : authFields.push(field);
        });
        if (baseURIFields.length > 0) {
              tempFiledMeta?.fieldMap['http.baseURI']?.refreshOptionsOnChangesTo.push(...baseURIFields);
              tempFiledMeta?.layout?.containers[1]?.containers[1].containers.splice(0, 1, {fields: baseURIFields});
        } else {
              tempFiledMeta?.layout?.containers[1]?.containers?.splice(1, 1);
        }
        if (authFields.length > 0) {
          // when there is only one authentication type then side bar is not required for authentication related fields which are coming from custom setting
          if (tempFiledMeta?.fieldMap['http.auth.type']?.visible === false) {
            delete tempFiledMeta?.layout?.containers[3]?.containers[1]?.type;
          }

          tempFiledMeta?.layout?.containers[3]?.containers[1]?.containers[0]?.fields.push(...authFields);
        }
      }
    }
  } else if (!isGenericHTTP) {
  // when there is only one authentication type then side bar is not required for authentication related fields
    if (tempFiledMeta?.fieldMap['http.auth.type']?.visible === false) {
      delete tempFiledMeta?.layout?.containers[3]?.containers[1]?.type;
    }
    tempFiledMeta?.layout?.containers[1]?.containers?.splice(1, 1);
  }

  return tempFiledMeta;
};
export const updateExportAndImportFinalMetadata = (finalFieldMeta, connector, resource, isGenericHTTP) => {
  const tempFiledMeta = _.cloneDeep(finalFieldMeta);

  if (!isGenericHTTP && tempFiledMeta?.fieldMap['name']) {
    const dataResourceType = (resource?.isLookup === true) ? 'lookup' : tempFiledMeta?.fieldMap['name']?.resourceType.slice(0, 6);
    const application = resource?.assistant;

    tempFiledMeta.fieldMap.name.label = `Name your ${dataResourceType}`;
    tempFiledMeta.fieldMap.name.placeholder = `${application} ${dataResourceType}`;
  }

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
    scope: SCOPES.VALUE,
  });

  const { merged } = yield select(
    selectors.resourceData,
    resourceType,
    resourceId,
    SCOPES.VALUE
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
    scope: SCOPES.VALUE,
    ssLinkedConnectionId,
    integrationId,
  });

  const { merged } = yield select(selectors.suiteScriptResourceData, {
    resourceType,
    id: resourceId,
    ssLinkedConnectionId,
    integrationId,
    scope: SCOPES.VALUE,
  });

  try {
    return applyPatch(merged ? deepClone(merged) : {}, deepClone(patchSet))
      .newDocument;
  } catch (e) {
    return {};
  }
}
