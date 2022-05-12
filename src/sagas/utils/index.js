import jsonPatch, { deepClone, applyPatch } from 'fast-json-patch';
import * as _ from 'lodash';
import { select, call } from 'redux-saga/effects';
import util from '../../utils/array';
import { selectors } from '../../reducers';
import { createFormValuesPatchSet, SCOPES } from '../resourceForm';
import { createFormValuesPatchSet as createSuiteScriptFormValuesPatchSet } from '../suiteScript/resourceForm';
import { AUTHENTICATION_LABELS} from '../../utils/constants';

const generateReplaceAndRemoveLastModified = patches =>
  (patches &&
    patches.length &&
    util.removeItem(patches, p => p.path === '/lastModified')) ||
  [];
const hasPatch = patches => patches && patches.length;
const isPathPresentAndValueDiff = patchArr => patch =>
  patchArr.some(p => p.path === patch.path && p.value !== patch.value);

const getExportVersions = (httpConnector, httpResources, httpEndpoints) => {
  const exportPreConfiguredFields = httpConnector.versions[0].supportedBy.export.preConfiguredFields;
  const pagingField = exportPreConfiguredFields.find(f => f.path === 'paging');
  const pagingValues = pagingField.values || [];
  const exportData = {
    labels: {
      version: 'API Version',
    },
  };

  // eslint-disable-next-line prefer-destructuring
  exportData.paging = pagingValues[0];

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
                const supportedExportTypes = httpEndpoint?.supportedBy?.fieldsUserMustSet?.find(f => f.path === 'type')?.values;
                const delta = httpEndpoint?.supportedBy?.preConfiguredFields?.find(f => f.path === 'delta')?.values?.[0];

                const queryParameters = httpEndpoint?.queryParameters?.map(qp => ({name: qp.name, id: qp.name, description: qp.description, required: qp.required, fieldType: qp.fieldType || 'textarea' }));

                const ep = {
                  id: httpEndpoint._id, name: httpEndpoint.name, url: httpEndpoint.relativeURI, resourcePath: httpEndpoint.resourcePath || resourcePath, supportedExportTypes, delta, queryParameters,
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
export const getHTTPConnectorMetadata = (httpConnector, httpResources, httpEndpoints) => {
  const metadata = {
    // export: {
    //   labels: {
    //     version: 'API Version',
    //   },
    // },
    import: {
      labels: {
        version: 'API Version',
      },
    },
  };
  const exportData = getExportVersions(httpConnector, httpResources, httpEndpoints);
  // const exportPreConfiguredFields = httpConnector.versions[0].supportedBy.export.preConfiguredFields;
  // const pagingField = exportPreConfiguredFields.find(f => f.path === 'paging');
  // const pagingValues = pagingField.values || [];

  // // eslint-disable-next-line prefer-destructuring
  // metadata.export.paging = pagingValues[0];

  // const versions = httpConnector.versions.map(v => ({version: v.name, _id: v._id}));

  // metadata.export.versions = versions;
  // metadata.export.versions.forEach((v, i) => {
  //   const filteredHttpResources = httpResources.filter(r => r._versionIds?.includes(v._id));

  //   if (filteredHttpResources.length) {
  //     if (!metadata.export.versions[i].resources) {
  //       metadata.export.versions[i].resources = [];
  //     }
  //     metadata.export.versions[i].resources = filteredHttpResources.map(httpResource => {
  //       const resourcePath = httpResource?.supportedBy?.export?.preConfiguredFields?.find(f => f.path === 'resourcePath')?.values?.[0];

  //       return {
  //         id: httpResource._id, name: httpResource.name, resourcePath,
  //       };
  //     });
  //     if (metadata.export.versions[i].resources.length) {
  //       metadata.export.versions[i].resources.forEach((r, j) => {
  //         const filteredHttpEndpoints = httpEndpoints.filter(e => e._httpConnectorResourceIds?.includes(r.id));
  //         const {resourcePath} = metadata.export.versions[i].resources[j];

  //         if (filteredHttpEndpoints.length) {
  //           if (!metadata.export.versions[i].resources[j].endpoints) {
  //             metadata.export.versions[i].resources[j].endpoints = [];
  //           }
  //           filteredHttpEndpoints.forEach(httpEndpoint => {
  //             if (httpEndpoint?.supportedBy?.type === 'export') {
  //               const supportedExportTypes = httpEndpoint?.supportedBy?.fieldsUserMustSet?.find(f => f.path === 'type')?.values;
  //               const delta = httpEndpoint?.supportedBy?.preConfiguredFields?.find(f => f.path === 'delta')?.values?.[0];

  //               const queryParameters = httpEndpoint?.queryParameters?.map(qp => ({name: qp.name, id: qp.name, description: qp.description, required: qp.required, fieldType: qp.fieldType || 'textarea' }));

  //               const ep = {
  //                 id: httpEndpoint._id, name: httpEndpoint.name, url: httpEndpoint.relativeURI, resourcePath: httpEndpoint.resourcePath || resourcePath, supportedExportTypes, delta, queryParameters,
  //               };

  //               metadata.export.versions[i].resources[j].endpoints.push(ep);
  //             }
  //           });
  //         }
  //       });
  //     }
  //   }
  // });
  const versions = httpConnector.versions.map(v => ({version: v.name, _id: v._id}));

  metadata.import.versions = versions;
  metadata.import.versions.forEach((v, i) => {
    const filteredHttpResources = httpResources.filter(r => r._versionIds?.includes(v._id));

    if (filteredHttpResources.length) {
      if (!metadata.import.versions[i].resources) {
        metadata.import.versions[i].resources = [];
      }
      metadata.import.versions[i].resources = filteredHttpResources.map(httpResource => {
        const resourcePath = httpResource?.supportedBy?.import?.preConfiguredFields?.find(f => f.path === 'resourcePath')?.values?.[0];

        return {
          id: httpResource._id, name: httpResource.name, resourcePath,
        };
      });
      if (metadata.import.versions[i].resources.length) {
        metadata.import.versions[i].resources.forEach((r, j) => {
          const filteredHttpEndpoints = httpEndpoints.filter(e => e._httpConnectorResourceIds?.includes(r.id));

          if (filteredHttpEndpoints.length) {
            if (!metadata.import.versions[i].resources[j].operations) {
              metadata.import.versions[i].resources[j].operations = [];
            }
            filteredHttpEndpoints.forEach(httpEndpoint => {
              if (httpEndpoint?.supportedBy?.type === 'import') {
                const requiredMappings = [];
                let supportIgnoreExisting;
                let supportIgnoreMissing;
                let parameters = [];
                let howToFindIdentifier;

                httpEndpoint?.supportedBy?.fieldsUserMustSet?.forEach(f => {
                  if (f.path === 'ignoreExisting') {
                    supportIgnoreExisting = true;
                  } else if (f.path === 'ignoreMissing') {
                    supportIgnoreMissing = true;
                  } else {
                    requiredMappings.push(f.path);
                  }
                });
                if (httpEndpoint?.supportedBy?.pathParameterToIdentifyExisting) {
                  parameters = [
                    {
                      id: httpEndpoint?.supportedBy?.pathParameterToIdentifyExisting,
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
                      in: 'path',
                      required: true,
                      isIdentifier: true,
                    });
                  });
                }
                if (httpEndpoint?.supportedBy?.lookupToIdentifyExisting) {
                  const lookup = httpEndpoint?.supportedBy?.lookupToIdentifyExisting?.[0];
                  const endpoint = lookup?._endpointId;

                  console.log('endpoint ****', endpoint);
                }

                const ep = {
                  id: httpEndpoint._id, name: httpEndpoint.name, url: httpEndpoint.relativeURI, method: httpEndpoint.method, requiredMappings, parameters, howToFindIdentifier, supportIgnoreExisting, supportIgnoreMissing,
                };

                metadata.import.versions[i].resources[j].operations.push(ep);
              }
            });
          }
        });
      }
    }
  });
  metadata.export = exportData;

  return metadata;
};
export const updateFinalMetadataWithHttpFramework = (finalFieldMeta, connector) => {
  const connectionTemplate = connector.versions[0].supportedBy.connection;
  const tempFiledMeta = _.cloneDeep(finalFieldMeta);

  Object.keys(tempFiledMeta.fieldMap).map(key => {
    const preConfiguredField = connectionTemplate.preConfiguredFields.find(field => key === field.path);
    const fieldUserMustSet = connectionTemplate.fieldsUserMustSet.find(field => key === field.path);

    if (key === 'http.auth.oauth.scope') {
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
      if (!tempFiledMeta.fieldMap[key].defaultValue) { tempFiledMeta.fieldMap[key] = {...tempFiledMeta.fieldMap[key], defaultValue: connector?.versions?.[0]?.baseURIs?.[0]}; }
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
