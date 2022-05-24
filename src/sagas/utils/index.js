import jsonPatch, { deepClone, applyPatch } from 'fast-json-patch';
import * as _ from 'lodash';
import { select, call } from 'redux-saga/effects';
import util from '../../utils/array';
import { isNewId } from '../../utils/resource';
import { selectors } from '../../reducers';
import { createFormValuesPatchSet, SCOPES } from '../resourceForm';
import { createFormValuesPatchSet as createSuiteScriptFormValuesPatchSet } from '../suiteScript/resourceForm';
import { AUTHENTICATION_LABELS} from '../../utils/constants';

const convertResourceFieldstoSampleData = (resourceFields, dataType = 'object') => {
  if (!resourceFields) {
    return 'null';
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
    const output = [];

    resourceFields.forEach(rf => {
      if (rf.resourceFields) {
        tempOutput[rf.id] = convertResourceFieldstoSampleData(rf.resourceFields, rf.dataType);
      } else { tempOutput[rf.id] = rf.id; }
    });

    return output;
  }
};
const generateReplaceAndRemoveLastModified = patches =>
  (patches &&
    patches.length &&
    util.removeItem(patches, p => p.path === '/lastModified')) ||
  [];
const hasPatch = patches => patches && patches.length;
const isPathPresentAndValueDiff = patchArr => patch =>
  patchArr.some(p => p.path === patch.path && p.value !== patch.value);

const getExportMetadata = (httpConnector, httpResources, httpEndpoints) => {
  const exportData = {
    labels: {
      version: 'API Version',
    },
  };

  if (!httpConnector || !httpResources || !httpEndpoints) {
    return exportData;
  }
  const exportPreConfiguredFields = httpConnector.supportedBy?.export?.preConfiguredFields;
  const pagingField = exportPreConfiguredFields?.find(f => f.path === 'paging');
  const pagingValues = pagingField?.values || [];

  // eslint-disable-next-line prefer-destructuring
  exportData.paging = pagingValues?.[0];

  const versions = httpConnector.versions.map(v => ({version: v.name, _id: v._id}));

  exportData.versions = versions;
  exportData.versions.forEach((v, i) => {
    const filteredHttpResources = httpResources.filter(r => r._versionIds?.includes(v._id));

    if (filteredHttpResources.length) {
      if (!exportData.versions[i].resources) {
        exportData.versions[i].resources = [];
      }
      exportData.versions[i].resources = filteredHttpResources.map(httpResource => {
        const resourcePath = httpResource?.supportedBy?.export?.preConfiguredFields?.find(f => f.path === 'resourcePath')?.values?.[0];

        return {
          id: httpResource._id, name: httpResource.name, resourcePath,
        };
      });
      if (exportData.versions[i].resources.length) {
        exportData.versions[i].resources.forEach((r, j) => {
          const filteredHttpEndpoints = httpEndpoints.filter(e => e._httpConnectorResourceIds?.includes(r.id));
          const {resourcePath} = exportData.versions[i].resources[j];

          if (filteredHttpEndpoints.length) {
            if (!exportData.versions[i].resources[j].endpoints) {
              exportData.versions[i].resources[j].endpoints = [];
            }
            filteredHttpEndpoints.forEach(httpEndpoint => {
              if (httpEndpoint?.supportedBy?.type === 'export') {
                const supportedExportTypes = httpEndpoint.supportedBy.fieldsUserMustSet?.find(f => f.path === 'type')?.values;
                const epResourcePath = httpEndpoint.supportedBy.preConfiguredFields?.find(f => f.path === 'resourcePath')?.values?.[0];

                const delta = httpEndpoint.supportedBy.preConfiguredFields?.find(f => f.path === 'delta')?.values?.[0];

                const queryParameters = httpEndpoint.queryParameters?.map(qp => ({name: qp.name, id: qp.name, description: qp.description, required: qp.required, fieldType: qp.fieldType || 'textarea' }));
                const pathParameters = httpEndpoint.pathParameters?.map(pp => ({name: pp.name, id: pp.name, description: pp.description, required: pp.required !== false, fieldType: pp.fieldType || 'input' }));
                let doesNotSupportPaging = false;

                if (httpEndpoint.supportedBy.fieldsToUnset?.includes('paging')) {
                  doesNotSupportPaging = true;
                }

                const ep = {
                  id: httpEndpoint._id, name: httpEndpoint.name, url: httpEndpoint.relativeURI, resourcePath: epResourcePath || resourcePath, supportedExportTypes, delta, queryParameters, pathParameters, doesNotSupportPaging,
                };

                exportData.versions[i].resources[j].endpoints.push(ep);
              }
            });
          }
        });
      }
    }
  });

  return exportData;
};
const getImportMetadata = (httpConnector, httpResources, httpEndpoints) => {
  const importData = {
    labels: {
      version: 'API Version',
    },

  };
  const versions = httpConnector.versions.map(v => ({version: v.name, _id: v._id}));

  importData.versions = versions;
  importData.versions.forEach((v, i) => {
    const filteredHttpResources = httpResources.filter(r => r._versionIds?.includes(v._id));

    if (filteredHttpResources.length) {
      if (!importData.versions[i].resources) {
        importData.versions[i].resources = [];
      }
      importData.versions[i].resources = filteredHttpResources.map(httpResource => {
        const resourcePath = httpResource?.supportedBy?.import?.preConfiguredFields?.find(f => f.path === 'resourcePath')?.values?.[0];
        const sampleData = httpResource?.resourceFields && convertResourceFieldstoSampleData(httpResource.resourceFields);

        return {
          id: httpResource._id, name: httpResource.name, resourcePath, sampleData,
        };
      });
      if (importData.versions[i].resources.length) {
        importData.versions[i].resources.forEach((r, j) => {
          const filteredHttpEndpoints = httpEndpoints.filter(e => e._httpConnectorResourceIds?.includes(r.id));

          if (filteredHttpEndpoints.length) {
            if (!importData.versions[i].resources[j].operations) {
              importData.versions[i].resources[j].operations = [];
            }
            filteredHttpEndpoints.forEach(httpEndpoint => {
              if (httpEndpoint?.supportedBy?.type === 'import') {
                const requiredMappings = [];
                let supportIgnoreExisting;
                let supportIgnoreMissing;
                let parameters = [];
                let howToFindIdentifier;

                httpEndpoint.supportedBy.fieldsUserMustSet?.forEach(f => {
                  if (f.path === 'ignoreExisting') {
                    supportIgnoreExisting = true;
                  } else if (f.path === 'ignoreMissing') {
                    supportIgnoreMissing = true;
                  } else {
                    requiredMappings.push(f.path);
                  }
                });
                if (httpEndpoint.supportedBy.pathParameterToIdentifyExisting) {
                  parameters = [
                    {
                      id: httpEndpoint.supportedBy.pathParameterToIdentifyExisting,
                      in: 'path',
                      required: true,
                      isIdentifier: true,
                    },
                  ];
                }

                if (httpEndpoint?.pathParameters) {
                  httpEndpoint?.pathParameters?.forEach(pp => {
                    parameters.push({
                      id: pp.name,
                      name: pp.name,
                      in: 'path',
                      required: true,
                    });
                  });
                }
                if (httpEndpoint.supportedBy?.lookupToIdentifyExisting) {
                  const lookup = httpEndpoint.supportedBy?.lookupToIdentifyExisting;
                  const endpoint = lookup?._httpConnectorEndpointId;
                  const lookupendpoint = httpEndpoints.find(ep => ep._id === endpoint);

                  if (!howToFindIdentifier) {
                    howToFindIdentifier = {};
                  }
                  if (lookupendpoint) {
                    howToFindIdentifier.lookup = {url: lookupendpoint.relativeURI, id: lookupendpoint._id, extract: lookup?.extract};
                  }
                }

                const ep = {
                  id: httpEndpoint._id, name: httpEndpoint.name, url: httpEndpoint.relativeURI, method: httpEndpoint.method, requiredMappings, parameters, howToFindIdentifier, supportIgnoreExisting, supportIgnoreMissing, askForHowToGetIdentifier: httpEndpoint.askForHowToGetIdentifier,
                };

                importData.versions[i].resources[j].operations.push(ep);
              }
            });
          }
        });
      }
    }
  });

  return importData;
};
export const getHTTPConnectorMetadata = (httpConnector, httpResources, httpEndpoints) => {
  const exportData = getExportMetadata(httpConnector, httpResources, httpEndpoints);
  const importData = getImportMetadata(httpConnector, httpResources, httpEndpoints);

  return {export: exportData, import: importData};
};
export const updateFinalMetadataWithHttpFramework = (finalFieldMeta, connector, resource) => {
  const connectionTemplate = connector.supportedBy.connection;
  const tempFiledMeta = _.cloneDeep(finalFieldMeta);

  Object.keys(tempFiledMeta.fieldMap).map(key => {
    const preConfiguredField = connectionTemplate.preConfiguredFields.find(field => key === field.path);
    const fieldUserMustSet = connectionTemplate.fieldsUserMustSet.find(field => key === field.path);

    if (key === 'http.ping.relativeURI') {
      if (!tempFiledMeta.fieldMap[key].defaultValue) {
        tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], defaultValue: preConfiguredField.values?.[0]};
      } else if (resource.http.unencrypted.version) {
        tempFiledMeta.fieldMap[key].defaultValue = tempFiledMeta.fieldMap[key].defaultValue.replace(`/${resource.http.unencrypted.version}`, '');
      } else if (connector.versions?.[0]?.name) {
        tempFiledMeta.fieldMap[key].defaultValue = tempFiledMeta.fieldMap[key].defaultValue.replace(`/${connector.versions?.[0]?.name}`, '');
      }
    } else if (key === 'http.auth.oauth.scope') {
      const field = preConfiguredField || fieldUserMustSet;
      const scopes = field.values?.map(f => {
        if (f.name) {
          return {subHeader: f.name, scopes: f.scopes};
        }

        return f;
      });

      if (scopes) {
        tempFiledMeta.fieldMap[key].type = 'selectscopes';
      }

      tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], scopes};
    } else if (fieldUserMustSet) {
      tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], required: true};
      if (fieldUserMustSet.values.length > 1) {
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
      if (preConfiguredField.values.length > 1) {
        const options = [
          {
            items: preConfiguredField.values.map(opt => ({
              label: AUTHENTICATION_LABELS[opt] || opt,
              value: opt,
            })),
          },
        ];

        tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], options};
      }
      if (!tempFiledMeta.fieldMap[key].defaultValue) { tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], defaultValue: preConfiguredField.values?.[0]}; }
    } else if (!tempFiledMeta.fieldMap[key].required && key !== 'settings') {
      tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], visible: false};
    } else if (key === 'http._iClientId') {
      tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], visible: false};
    } else if (key === 'http.baseURI') {
      if (!tempFiledMeta.fieldMap[key].defaultValue) { tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], defaultValue: connector?.versions?.[0]?.baseURIs?.[0] }; } else if (resource.http.unencrypted.version) {
        tempFiledMeta.fieldMap[key].defaultValue = tempFiledMeta.fieldMap[key].defaultValue.replace(`/${resource.http.unencrypted.version}`, '');
      }
    }

    return tempFiledMeta.fieldMap[key];
  }
  );
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
        label: 'API Verison',
        name: '/http/unencrypted/version',
        id: 'http.unencrypted.version',
        fieldId: 'http.unencrypted.version',
        type: versions.length > 1 ? 'select' : 'text',
        options: versionOptions,
        defaultValue: () => {
          if (isNewId(resource._id)) {
            return versions?.[0];
          }

          return resource?.http?.unencrypted?.version;
        },

      },
    });
  }
  // const preConfiguredUnencryptedFields = connectionTemplate.preConfiguredFields.find(field => field.path === 'unEncryptedFields');

  // if (preConfiguredUnencryptedFields?.values?.length > 0) {
  //   preConfiguredUnencryptedFields.values.forEach(fld => {
  //     unEncryptedFields.push({
  //       position: fld.position,
  //       field: {
  //         label: fld.label,
  //         name: `/http/unencrypted/${fld.id}`,
  //         id: `http.unencrypted.${fld.id}`,
  //         fieldId: `http.unencrypted.${fld.id}`,
  //         helpText: fld.helpText,
  //         type: fld.type || 'text',
  //         required: !!fld.required,
  //         options: fld.options,
  //         validWhen: fld.validWhen,
  //         defaultValue: resource?.http?.unencrypted?.[fld.id],
  //       },
  //     });
  //   });
  // }

  if (unEncryptedFields) {
    for (let i = 0; i < unEncryptedFields.length; i += 1) {
      unEncryptedFields[i] = unEncryptedFields[i].field;
      tempFiledMeta.fieldMap[unEncryptedFields[i].id] = unEncryptedFields[i];
      if (tempFiledMeta?.layout?.containers?.[0]?.containers?.[1]?.fields) {
        tempFiledMeta.layout.containers[0].containers[1]?.fields.push(unEncryptedFields[i].id);
      } else if (tempFiledMeta?.layout?.containers[1]?.fields) { tempFiledMeta.layout.containers[1].fields.push(unEncryptedFields[i].id); }
    }
  }
  if (isNewId(resource._id)) {
    const settingFields = connectionTemplate.preConfiguredFields.find(field => field.path === 'settingsForm');
    const fieldMap = settingFields?.values?.[0].fieldMap;
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
          required: !!value.required,
          options: value.options,
          validWhen: value.validWhen,
        },
      });

      if (fields) {
        const fieldIds = [];

        for (let i = 0; i < fields.length; i += 1) {
          fields[i] = fields[i].field;
          tempFiledMeta.fieldMap[fields[i].id] = fields[i];
          fieldIds.push(fields[i].id);
          // if (tempFiledMeta?.layout?.containers[1]?.fields) { tempFiledMeta.layout.containers[1].fields.push(fields[i].id); }
        }
        tempFiledMeta.layout?.containers?.push({fields: fieldIds, label: 'Custom settings'});
      }
    });
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
