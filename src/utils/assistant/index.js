import qs from 'qs';
import {
  isObject,
  isString,
  isEmpty,
  defaultsDeep,
  isNaN,
  last,
  each,
  isArray,
  assign,
  unionBy,
  isNumber,
  get,
} from 'lodash';
import { getPathParams } from './pathParamUtils';
import { getPublishedHttpConnectors } from '../../constants/applications';
import customCloneDeep from '../customCloneDeep';
import {VALID_MONGO_ID} from '../../constants/regex';

const OVERWRITABLE_PROPERTIES = Object.freeze([
  'allowUndefinedResource',
  'batchSize',
  'body',
  'delta',
  'doesNotSupportPaging',
  'errorMediaType',
  'flattenSampleData',
  'headers',
  'ignoreEmptyNodes',
  'paging',
  'queryParameters',
  'requestMediaType',
  'response',
  'sampleData',
  'responseIdPath',
  'successMediaType',
  'successPath',
  'successValues',
  'customeTemplateEval',
  'strictHandlebarEvaluation',
]);

export const PARAMETER_LOCATION = Object.freeze({
  QUERY: 'query',
  BODY: 'body',
});

export const DEFAULT_PROPS = Object.freeze({
  EXPORT: {
    REST: {
      pagingMethod: undefined,
      nextPagePath: undefined,
      nextPageRelativeURI: undefined,
      pageArgument: undefined,
      maxPagePath: undefined,
      maxCountPath: undefined,
      skipArgument: undefined,
      lastPageStatusCode: undefined,
      lastPagePath: undefined,
      lastPageValue: undefined,
    },
    HTTP: {
      relativeURI: undefined,
      body: undefined,
      paging: {
        method: undefined,
        skip: undefined,
        page: undefined,
      },
      response: {
        resourcePath: undefined,
        resourceIdPath: undefined,
        successPath: undefined,
        successValues: [],
        errorPath: undefined,
        blobFormat: undefined,
      },
    },
  },
  IMPORT: {
    REST: {
      method: [],
      relativeURI: [],
      body: [],
      responseIdPath: [],
      successPath: [],
      successValues: [],
      ignoreExisting: false,
      ignoreMissing: false,
      ignoreLookupName: undefined,
      ignoreExtract: undefined,
      headers: [],
    },
    HTTP: {
      successMediaType: 'xml',
      errorMediaType: 'xml',
      batchSize: undefined,
      ignoreEmptyNodes: undefined,
      requestMediaType: 'xml',
      method: [],
      relativeURI: [],
      headers: [],
      ignoreExisting: false,
      ignoreMissing: false,
      ignoreLookupName: undefined,
      ignoreExtract: undefined,
      strictHandlebarEvaluation: false,
    },
  },
});

export const AUTO_MAPPER_ASSISTANTS_SUPPORTING_RECORD_TYPE = Object.freeze(
  [
    'shopify',
    'zendesk',
    'magento',
    'acumatica',
    'bigcommerce',
    'stripe',
    'hubspot',
    'jira',
    'quickbooks',
    'microsoftbusinesscentral',
    'sapbydesign',
  ]
);
export function routeToRegExp(route = '') {
  const optionalParam = /\((.*?)\)/g;
  const namedParam = /(\(\?)?:_\w+/g;
  const splatParam = /\*\w+/g;
  // const escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
  const escapeRegExp = /[-{}[\]+?.,\\^$|#\s]/g;
  const updatedRoute = route
    .replace(escapeRegExp, '\\$&')
    .replace(optionalParam, '(?:$1)?')
    .replace(namedParam, (match, optional) => (optional ? match : '([^/?]+)'))
    .replace(splatParam, '([^?]*?)');

  return new RegExp(`^${updatedRoute}(?:\\?([\\s\\S]*))?$`);
}

export function extractParameters(routeRegex, fragment, route) {
  const params = routeRegex.exec(fragment).slice(1);

  if (route && route.indexOf('?') > -1) {
    const qsPart = route.substr(route.indexOf('?') + 1);
    const qsParamsWithPlaceHolders = (qsPart.match(new RegExp(':_', 'g')) || []).length;

    if (qsParamsWithPlaceHolders > 0 && params[params.length - 2]) {
      const queryParams = params[params.length - 2].split(/[?&]/);

      params[params.length - 2] = queryParams.shift();
      params[params.length - 1] = undefined;
    }
  }

  return params.map((param, i) => {
    // Don't decode the search params.
    if (i === params.length - 1) return param || null;

    return param ? decodeURIComponent(param) : null;
  });
}

export function getMatchingRoute(routes, url) {
  let i = 0;
  let urlParts = [];
  let regexpRoute;
  let found = false;
  let toReturn = {};

  for (i = 0; !found && routes && i < routes.length; i += 1) {
    regexpRoute = routeToRegExp(routes[i]);

    if (regexpRoute.test(url)) {
      urlParts = extractParameters(regexpRoute, url, routes[i]);
      toReturn = {
        urlMatch: routes[i],
        urlParts,
      };
      found = true;
    }
  }

  return toReturn;
}

export function mergeHeaders(headers = {}, overwrites = {}) {
  let headersMap = {};
  let overwritesMap = {};

  if (isArray(headers)) {
    headersMap = headers.reduce(
      (obj, h) => ({ ...obj, [h.name]: h.value }),
      headersMap
    );
  } else {
    headersMap = { ...headers };
  }

  if (isArray(overwrites)) {
    overwritesMap = overwrites.reduce(
      (obj, h) => ({ ...obj, [h.name]: h.value }),
      overwritesMap
    );
  } else {
    overwritesMap = { ...overwrites };
  }

  return assign(headersMap, overwritesMap);
}

export function mergeQueryParameters(queryParameters = [], overwrites = []) {
  return unionBy(overwrites, queryParameters, 'id');
}

function extractQueryParameters(queryString, assistant) {
  const queryParams = qs.parse(queryString, {
    delimiter: /[?&]/,
    depth: 0,
    decoder(str, defaultDecoder) {
      if (assistant !== 'liquidplanner') return defaultDecoder(str);

      // a unique case where query name contains '=' operator
      // IO-1683
      if (str === 'filter[]') {
        return 'filter[]=name';
      }
      if (str.startsWith('name=')) {
        return defaultDecoder(str.substring(5));
      }

      return defaultDecoder(str);
    },
  }); /* depth should be 0 to handle IO-1683 */

  return queryParams;
}

function populateDefaults({
  child = {},
  parent = {},
  isChildAnOperation = false,
}) {
  const childWithDefaults = { ...child };

  if (isArray(childWithDefaults.headers)) {
    childWithDefaults.headersMetadata = childWithDefaults.headers;
    childWithDefaults.headers = childWithDefaults.headers.reduce(
      (obj, h) => ({ ...obj, [h.name]: h.value }),
      {}
    );
  }

  OVERWRITABLE_PROPERTIES.forEach(prop => {
    if (['delta', 'headers', 'paging', 'queryParameters'].includes(prop)) {
      if (Object.prototype.hasOwnProperty.call(parent, prop)) {
        if (prop === 'headers') {
          childWithDefaults[prop] = mergeHeaders(
            parent[prop],
            childWithDefaults[prop]
          );
          if (Array.isArray(parent.headers)) {
            if (!childWithDefaults.headersMetadata) {
              childWithDefaults.headersMetadata = [];
            }
            childWithDefaults.headersMetadata = [...parent.headers, ...childWithDefaults.headersMetadata];
          }
        } else if (prop === 'queryParameters') {
          childWithDefaults[prop] = mergeQueryParameters(
            parent[prop],
            childWithDefaults[prop]
          );
        } else if (isChildAnOperation) {
          if (
            prop === 'paging' &&
            !childWithDefaults.doesNotSupportPaging &&
            !Object.prototype.hasOwnProperty.call(childWithDefaults, prop)
          ) {
            childWithDefaults[prop] = parent[prop];
          } else if (
            prop === 'delta' &&
            (childWithDefaults.supportedExportTypes &&
              childWithDefaults.supportedExportTypes.includes('delta')) &&
            !Object.prototype.hasOwnProperty.call(childWithDefaults, prop)
          ) {
            childWithDefaults[prop] = parent[prop];
          }
        } else if (
          !Object.prototype.hasOwnProperty.call(childWithDefaults, prop) &&
          Object.prototype.hasOwnProperty.call(parent, prop)
        ) {
          if (!isArray(parent[prop]) && isObject(parent[prop])) {
            childWithDefaults[prop] = defaultsDeep(
              childWithDefaults[prop],
              parent[prop]
            );
          } else {
            childWithDefaults[prop] = parent[prop];
          }
        }
      }
    } else if (
      !Object.prototype.hasOwnProperty.call(childWithDefaults, prop) &&
      Object.prototype.hasOwnProperty.call(parent, prop)
    ) {
      if (!isArray(parent[prop]) && isObject(parent[prop])) {
        childWithDefaults[prop] = defaultsDeep(
          childWithDefaults[prop],
          parent[prop]
        );
      } else {
        childWithDefaults[prop] = parent[prop];
      }
    }
  });

  return childWithDefaults;
}

export function searchParameterFieldsMeta({
  label,
  paramLocation,
  parameters = [],
  oneMandatoryQueryParamFrom,
  value,
  operationChanged,
  isDeltaExport,
  deltaDefaults = {},
  url,
  isHTTPFramework = false,
}) {
  let searchParamsField;
  const defaultValue = {};
  const filteredValues = value;

  if (url) {
    const [, queryPart] = url.split('?');
    const queryObj = new URLSearchParams(queryPart);
    const parameterIds = parameters.map(param => param.id);

    if (queryPart) {
      [...queryObj.entries()].filter(([key]) => !parameterIds.includes(key)).map(([key]) => key).forEach(key => {
        delete filteredValues[key];
      });
    }
  }

  parameters.forEach(p => {
    if (Object.prototype.hasOwnProperty.call(p, 'defaultValue') && operationChanged) {
      if (p.type === 'array' && p.defaultValue && typeof p.defaultValue === 'string') {
        try {
          defaultValue[p.id] = JSON.parse(p.defaultValue);
        } catch (e) {
          defaultValue[p.id] = [];
        }
      } else {
        defaultValue[p.id] = p.defaultValue;
      }
    }
  });

  if (parameters.length > 0) {
    searchParamsField = {
      fieldId: 'assistantMetadata.searchParams',
      id:
        paramLocation === PARAMETER_LOCATION.QUERY
          ? 'assistantMetadata.queryParams'
          : 'assistantMetadata.bodyParams',
      label,
      value: !isEmpty(filteredValues) ? filteredValues : defaultValue,
      paramMeta: {
        paramLocation,
        fields: parameters,
        oneMandatoryQueryParamFrom,
        isDeltaExport,
        defaultValuesForDeltaExport: deltaDefaults,
      },
    };

    if (isHTTPFramework) {
      searchParamsField.type = 'hfsearchparams';
      searchParamsField.keyName = 'name';
      searchParamsField.valueName = 'value';
      searchParamsField.keyPlaceholder = 'Search, select or add a name';
    }

    if (
      parameters.filter(p => !!p.required).length > 0 ||
      (oneMandatoryQueryParamFrom && oneMandatoryQueryParamFrom.length > 0)
    ) {
      searchParamsField.required = true;
      searchParamsField.validWhen = {
        isNot: {
          values: [undefined, {}],
        },
      };
    }
  }

  if (searchParamsField) {
    return [searchParamsField];
  }

  return [];
}

export function getExportVersionAndResource({
  assistantVersion,
  assistantOperation,
  assistantData,
}) {
  const versionAndResource = {};

  if (
    !assistantOperation ||
    !assistantData ||
    !assistantData.versions ||
    assistantData.versions.length === 0
  ) {
    return versionAndResource;
  }

  assistantData.versions.forEach(version => {
    if (assistantVersion && version.version !== assistantVersion) {
      return true;
    }

    version.resources.forEach(resource => {
      const ep = resource.endpoints.find(
        ep => ep.id === assistantOperation || ep.url === assistantOperation
      );

      if (ep) {
        versionAndResource.version = version.version;
        versionAndResource.resource = resource.id;
        if (ep.id) {
          versionAndResource.operation = ep.id;
        }
      }
    });
  });

  return versionAndResource;
}

function getImportVersionAndResource({
  assistantVersion,
  assistantOperation,
  assistantData,
}) {
  const versionAndResource = {};

  if (
    !assistantOperation ||
    !assistantData ||
    !assistantData.versions ||
    assistantData.versions.length === 0
  ) {
    return versionAndResource;
  }

  assistantData.versions.forEach(version => {
    if (assistantVersion && version.version !== assistantVersion) {
      return true;
    }

    version.resources.forEach(resource => {
      const ep = resource.operations.find(ep => {
        if (ep.id === assistantOperation) {
          return true;
        }

        if (isArray(ep.url)) {
          if (
            [ep.method.join(':'), ep.url.join(':')].join(':') ===
            assistantOperation
          ) {
            return true;
          }
        } else if ([ep.method, ep.url].join(':') === assistantOperation) {
          return true;
        }

        return false;
      });

      if (ep) {
        versionAndResource.version = version.version;
        versionAndResource.resource = resource.id;
        versionAndResource.sampleData = resource.sampleData;
        if (ep.id) {
          versionAndResource.operation = ep.id;
        }
      }
    });
  });

  return versionAndResource;
}

export function getVersionDetails({ version, assistantData }) {
  let versionDetails = {};

  if (
    !assistantData ||
    !assistantData.versions ||
    assistantData.versions.length === 0
  ) {
    return versionDetails;
  }

  if (version) {
    versionDetails = assistantData.versions.find(v => (v.version === version || v._id === version));
  } else if (assistantData.versions.length === 1) {
    [versionDetails] = assistantData.versions;
  }

  if (versionDetails && (versionDetails.version || versionDetails.resources)) {
    versionDetails = populateDefaults({
      child: versionDetails,
      parent: assistantData,
    });
  }

  return { ...versionDetails };
}
export function getHFResourceDetails({ resource, assistantData }) {
  let resourceDetails = {};

  if (
    !assistantData ||
    !assistantData.resources ||
    assistantData.resources.length === 0
  ) {
    return resourceDetails;
  }

  if (resource) {
    resourceDetails = assistantData.resources.find(r => (r.id === resource || r._id === resource));
  } else if (assistantData.resources.length === 1) {
    [resourceDetails] = assistantData.resources;
  }

  if (resourceDetails && (resourceDetails.resource || resourceDetails.versions)) {
    resourceDetails = populateDefaults({
      child: resourceDetails,
      parent: assistantData,
    });
  }

  return { ...resourceDetails };
}

export function getResourceDetails({ version, resource, assistantData }) {
  let resourceDetails = {};
  const versionDetails = getVersionDetails({
    version,
    assistantData,
  });

  if (versionDetails && versionDetails.resources) {
    resourceDetails = versionDetails.resources.find(r => r.id === resource);

    if (resourceDetails) {
      resourceDetails = populateDefaults({
        child: resourceDetails,
        parent: versionDetails,
      });
    }
  }

  return { ...resourceDetails, headersMetadata: versionDetails.headersMetadata };
}

export function getHFVersionDetails({ version, resource, assistantData }) {
  let versionDetails = {};
  const resourceDetails = getHFResourceDetails({
    resource,
    assistantData,
  });

  if (resourceDetails && resourceDetails.versions) {
    versionDetails = resourceDetails.versions.find(v => v.version === version || v._id === version);

    if (versionDetails) {
      versionDetails = populateDefaults({
        child: versionDetails,
        parent: resourceDetails,
      });
    }
  }

  return { ...versionDetails, headersMetadata: resourceDetails.headersMetadata };
}
export function getExportOperationDetails({
  version,
  resource,
  operation,
  assistantData = {},
}) {
  let operationDetails = {};
  const headersMetadata = [];

  if (assistantData?.export?.resources?.length) {
    if (version) {
      let modifiedResource = resource;
      let modifiedOperation = operation;

      if (resource.includes('+')) {
        let resources = resource.split('+');

        resources = assistantData?.export?.resources.filter(res => resources.includes(res._id));

        modifiedResource = resources.find(r => r._versionIds.includes(version))?._id;
      }
      const resourceDetails = getHFResourceDetails({
        version,
        resource,
        assistantData: assistantData.export,
      });

      if (operation.includes('+') && version) {
        let operations = operation.split('+');

        operations = resourceDetails.endpoints.filter(ep => operations.includes(ep.id));

        modifiedOperation = operations.find(op => op?._httpConnectorResourceIds?.includes(modifiedResource))?.id;
      }

      if (resourceDetails && resourceDetails.endpoints) {
        operationDetails = resourceDetails.endpoints.find(
          op => op.id === modifiedOperation || op.url === modifiedOperation
        );
        const versionLabel = assistantData?.export?.versions?.find(ver => ver._id === version)?.version;

        if (operationDetails && version && !operationDetails?.url?.includes(`/${versionLabel}`) && assistantData?.export?.addVersionToUrl) {
          operationDetails.url = `/${versionLabel}/${operationDetails.url}`.replace(/([^:]\/)\/+/g, '$1');
        }

        if (operationDetails) {
          if (
            !operationDetails.supportedExportTypes ||
          !operationDetails.supportedExportTypes.includes('delta')
          ) {
            delete operationDetails.delta;
          }

          operationDetails = populateDefaults({
            child: operationDetails,
            parent: resourceDetails,
            isChildAnOperation: true,
          });
        }
      }
      const headersMetadata = [];

      if (resourceDetails?.headersMetadata) {
        headersMetadata.push(...resourceDetails.headersMetadata);
      }
      if (operationDetails?.headersMetadata) {
        headersMetadata.push(...operationDetails.headersMetadata);
      }
    }
  } else {
    const resourceDetails = getResourceDetails({
      version,
      resource,
      assistantData: assistantData.export,
    });

    if (resourceDetails && resourceDetails.endpoints) {
      operationDetails = resourceDetails.endpoints.find(
        op => op.id === operation || op.url === operation
      );

      if (operationDetails) {
        if (
          !operationDetails.supportedExportTypes ||
          !operationDetails.supportedExportTypes.includes('delta')
        ) {
          delete operationDetails.delta;
        }

        operationDetails = populateDefaults({
          child: operationDetails,
          parent: resourceDetails,
          isChildAnOperation: true,
        });
      }
    }

    const headersMetadata = [];

    if (resourceDetails?.headersMetadata) {
      headersMetadata.push(...resourceDetails.headersMetadata);
    }
    if (operationDetails?.headersMetadata) {
      headersMetadata.push(...operationDetails.headersMetadata);
    }
  }

  return customCloneDeep({
    queryParameters: [],
    pathParameters: [],
    headers: {},
    ...operationDetails,
    headersMetadata,
  });
}

export function getImportOperationDetails({
  version,
  resource,
  operation,
  assistantData = {},
}) {
  const headersMetadata = [];
  let operationDetails;

  if (assistantData?.import?.resources?.length) {
    if (version) {
      let modifiedResource = resource;
      let modifiedOperation = operation;

      if (resource.includes('+')) {
        let resources = resource.split('+');

        resources = assistantData?.export?.resources.filter(res => resources.includes(res._id));

        modifiedResource = resources.find(r => r._versionIds.includes(version))?._id;
      }
      const resourceDetails = getHFResourceDetails({
        version,
        resource,
        assistantData: assistantData.import,
      });

      if (operation.includes('+') && version) {
        let operations = operation.split('+');

        operations = resourceDetails.operations.filter(ep => operations.includes(ep.id));

        modifiedOperation = operations.find(op => op?._httpConnectorResourceIds?.includes(modifiedResource))?.id;
      }
      // const versionDetails = getHFVersionDetails({
      //   version,
      //   resource,
      //   assistantData: assistantData.import,
      // });

      operationDetails = { sampleData: resourceDetails.sampleData };

      if (resourceDetails && resourceDetails.operations) {
        operationDetails = resourceDetails.operations.find(op => {
          if (op.id === modifiedOperation) {
            return true;
          }

          if (isArray(op.url)) {
            if ([op.method.join(':'), op.url.join(':')].join(':') === modifiedOperation) {
              return true;
            }
          } else if ([op.method, op.url].join(':') === modifiedOperation) {
            return true;
          }

          return false;
        });

        if (operationDetails) {
          operationDetails = populateDefaults({
            child: operationDetails,
            parent: resourceDetails,
            isChildAnOperation: true,
          });

          if (!operationDetails.howToFindIdentifier) {
            operationDetails.howToFindIdentifier = {};
          }

          if (operationDetails.howToFindIdentifier.lookup) {
            const lookupOperationDetails = getExportOperationDetails({
              version,
              resource: operationDetails.howToFindIdentifier.lookup.resource || resource,
              operation:
              operationDetails.howToFindIdentifier.lookup.id ||
              operationDetails.howToFindIdentifier.lookup.url,
              assistantData,
            });

            if (lookupOperationDetails.queryParameters) {
              lookupOperationDetails.queryParameters = lookupOperationDetails.queryParameters.filter(
                qp =>
                  !(
                    qp.readOnly &&
                  qp.defaultValue &&
                  qp.defaultValue.includes &&
                  qp.defaultValue.includes('{{export.')
                  )
              );
            }
            if (operationDetails.howToFindIdentifier.lookup.resource) {
              lookupOperationDetails.resource = operationDetails.howToFindIdentifier.lookup.resource;
            }

            if (operationDetails.howToFindIdentifier.lookup.parameterValues) {
              Object.keys(
                operationDetails.howToFindIdentifier.lookup.parameterValues
              ).forEach(p => {
                if (lookupOperationDetails.queryParameters) {
                  lookupOperationDetails.queryParameters = lookupOperationDetails.queryParameters.map(
                    qp => {
                      if (qp.id === p) {
                      // eslint-disable-next-line no-param-reassign
                        qp = {
                          ...qp,
                          readOnly: true,
                          defaultValue:
                          operationDetails.howToFindIdentifier.lookup
                            .parameterValues[p],
                        };
                      }

                      return qp;
                    }
                  );
                }
              });
            }

            operationDetails.lookupOperationDetails = lookupOperationDetails;
          }
        }
      }

      if (resourceDetails?.headersMetadata) {
        headersMetadata.push(...resourceDetails.headersMetadata);
      }
      if (operationDetails?.headersMetadata) {
        headersMetadata.push(...operationDetails.headersMetadata);
      }
    }
  } else {
    const resourceDetails = getResourceDetails({
      version,
      resource,
      assistantData: assistantData.import,
    });

    operationDetails = { sampleData: resourceDetails.sampleData };

    if (resourceDetails && resourceDetails.operations) {
      operationDetails = resourceDetails.operations.find(op => {
        if (op.id === operation) {
          return true;
        }

        if (isArray(op.url)) {
          if ([op.method.join(':'), op.url.join(':')].join(':') === operation) {
            return true;
          }
        } else if ([op.method, op.url].join(':') === operation) {
          return true;
        }

        return false;
      });

      if (operationDetails) {
        operationDetails = populateDefaults({
          child: operationDetails,
          parent: resourceDetails,
          isChildAnOperation: true,
        });

        if (!operationDetails.howToFindIdentifier) {
          operationDetails.howToFindIdentifier = {};
        }

        if (operationDetails.howToFindIdentifier.lookup) {
          const lookupOperationDetails = getExportOperationDetails({
            version,
            resource: operationDetails.howToFindIdentifier.lookup.resource || resource,
            operation:
              operationDetails.howToFindIdentifier.lookup.id ||
              operationDetails.howToFindIdentifier.lookup.url,
            assistantData,
          });

          if (lookupOperationDetails.queryParameters) {
            lookupOperationDetails.queryParameters = lookupOperationDetails.queryParameters.filter(
              qp =>
                !(
                  qp.readOnly &&
                  qp.defaultValue &&
                  qp.defaultValue.includes &&
                  qp.defaultValue.includes('{{export.')
                )
            );
          }
          if (operationDetails.howToFindIdentifier.lookup.resource) {
            lookupOperationDetails.resource = operationDetails.howToFindIdentifier.lookup.resource;
          }

          if (operationDetails.howToFindIdentifier.lookup.parameterValues) {
            Object.keys(
              operationDetails.howToFindIdentifier.lookup.parameterValues
            ).forEach(p => {
              if (lookupOperationDetails.queryParameters) {
                lookupOperationDetails.queryParameters = lookupOperationDetails.queryParameters.map(
                  qp => {
                    if (qp.id === p) {
                      // eslint-disable-next-line no-param-reassign
                      qp = {
                        ...qp,
                        readOnly: true,
                        defaultValue:
                          operationDetails.howToFindIdentifier.lookup
                            .parameterValues[p],
                      };
                    }

                    return qp;
                  }
                );
              }
            });
          }

          operationDetails.lookupOperationDetails = lookupOperationDetails;
        }
      }
    }

    if (resourceDetails?.headersMetadata) {
      headersMetadata.push(...resourceDetails.headersMetadata);
    }
    if (operationDetails?.headersMetadata) {
      headersMetadata.push(...operationDetails.headersMetadata);
    }
  }

  return customCloneDeep({
    queryParameters: [],
    pathParameters: [],
    headers: {},
    ...operationDetails,
    headersMetadata,
  });
}
export function getMergedImportOperationDetails({
  version,
  resource,
  createEndpoint,
  updateEndpoint,
  assistantData = {},
}) {
  const createOperation = getImportOperationDetails({
    version,
    resource,
    operation: createEndpoint,
    assistantData,
  });
  const updateOperation = getImportOperationDetails({
    version,
    resource,
    operation: updateEndpoint,
    assistantData,
  });

  if (!createOperation || !createOperation.url || !updateOperation || !updateOperation.url) {
    return undefined;
  }
  const lengthisIdentifier = createOperation?.parameters?.length;

  const createorupdateoperation = customCloneDeep(createOperation);

  createorupdateoperation.ignoreExisting = false;
  createorupdateoperation.ignoreMissing = false;
  delete createorupdateoperation.supportIgnoreExisting;
  delete createorupdateoperation.requiredMappings;
  createorupdateoperation.strictHandlebarEvaluation = true;
  createorupdateoperation.id = [updateOperation.id, createOperation.id];
  createorupdateoperation.method = [updateOperation.method, createOperation.method];
  createorupdateoperation.url = [updateOperation.url, createOperation.url];
  if (createorupdateoperation.body) {
    createorupdateoperation.body.push(...updateOperation.body);
  } else if (updateOperation.body) {
    createorupdateoperation.body = [...updateOperation.body, ...updateOperation.body];
  }
  const responseFields = ['successPath', 'successValues', 'failPath', 'failValues', 'resourceIdPath', 'resourcePath'];

  if (updateOperation?.response && createOperation?.response) {
    responseFields.forEach(element => {
      if (updateOperation.response[element] && createOperation.response[element]) {
        createorupdateoperation.response[element] = [...updateOperation.response[element], ...createOperation.response[element]];
      }
    });
  } else if (updateOperation?.response && !createOperation?.response) {
    responseFields.forEach(element => {
      createorupdateoperation.response[element] = [...updateOperation.response[element]];
    });
  }
  for (let i = 0; i < lengthisIdentifier; i += 1) {
    if (createOperation.parameters[i].isIdentifier === true) {
      createOperation.parameters.splice(i, 1);
    }
  }
  const updateArray = updateOperation.parameters.map(p => p.id);
  const createParameters = createOperation.parameters.filter(param => !param.isIdentifier && !updateArray.includes(param.id));

  createorupdateoperation.parameters = [...updateOperation.parameters, ...createParameters];

  return createorupdateoperation;
}

export function convertFromExport({ exportDoc: exportDocOrig, assistantData: assistantDataOrig, adaptorType }) {
  const exportDoc = customCloneDeep(exportDocOrig);
  const assistantData = customCloneDeep(assistantDataOrig);
  let { version, resource, operation } = exportDoc.assistantMetadata || {};

  if (exportDoc?.http && (exportDoc.http?._httpConnectorEndpointId && exportDoc.http?._httpConnectorResourceId)) {
    operation = (VALID_MONGO_ID.test(operation) || operation?.includes('+')) ? operation : exportDoc.http?._httpConnectorEndpointId;
    resource = (VALID_MONGO_ID.test(resource) || resource?.includes('+')) ? resource : exportDoc.http?._httpConnectorResourceId;
    version = VALID_MONGO_ID.test(version) ? version : exportDoc.http?._httpConnectorVersionId;
  }
  const { exportType, dontConvert } = exportDoc.assistantMetadata || {};
  const assistantMetadata = {
    pathParams: {},
    queryParams: {},
    bodyParams: {},
    exportType,
  };

  /**
   * Derive exportType, version, resource and operation from exportDoc only on first run/init (dontConvert = false).
   * If user changes anything (version, resource, operation, etc...) we are setting the flag dontConvert to true.
   * And we just need to use the values directly from assistantMetadata.
   */

  if (!dontConvert && !assistantMetadata.exportType && exportDoc) {
    assistantMetadata.exportType = exportDoc.type;
  }

  if (!dontConvert && (!resource || !operation)) {
    if (
      exportDoc &&
      exportDoc[adaptorType] &&
      exportDoc[adaptorType].relativeURI
    ) {
      const urlMatch = getMatchingRoute(
        assistantData.export.urlResolution,
        exportDoc[adaptorType].relativeURI
      );

      if (!operation) {
        operation = urlMatch.urlMatch;
      }

      const versionAndResource = getExportVersionAndResource({
        assistantVersion: version,
        assistantOperation: urlMatch.urlMatch,
        assistantData: assistantData.export,
      });

      ({ version, resource } = versionAndResource);
      if (versionAndResource.operation) {
        ({ operation } = versionAndResource);
      }
    }
  }

  assistantMetadata.version = version;
  assistantMetadata.resource = resource;
  assistantMetadata.operation = operation;

  if (!operation) {
    return assistantMetadata;
  }

  const operationDetails = getExportOperationDetails({
    version,
    resource,
    operation,
    assistantData,
  });

  if (!operationDetails || !operationDetails.url) {
    return assistantMetadata;
  }

  const exportAdaptorSubSchema = exportDoc[adaptorType] || {};

  const urlMatch = getMatchingRoute(
    [operationDetails.url],
    exportAdaptorSubSchema.relativeURI || ''
  );
  let pathParams = {};
  let queryParams = {};
  let bodyParams = {};

  if (
    operationDetails.pathParameters &&
    operationDetails.pathParameters.length > 0
  ) {
    pathParams = getPathParams({relativePath: operationDetails.url, actualPath: exportAdaptorSubSchema.relativeURI, pathParametersInfo: operationDetails?.pathParameters});
  }

  if (
    exportAdaptorSubSchema.relativeURI &&
    exportAdaptorSubSchema.relativeURI.indexOf('?') > 0
  ) {
    let toParseQueryString = exportAdaptorSubSchema.relativeURI.split('?')[1];

    if (urlMatch.urlParts && urlMatch.urlParts[urlMatch.urlParts.length - 1]) {
      toParseQueryString = urlMatch.urlParts[urlMatch.urlParts.length - 1];
    }
    queryParams = extractQueryParameters(toParseQueryString, exportDoc.assistant);
  }

  if (exportAdaptorSubSchema.postBody) {
    if (isObject(exportAdaptorSubSchema.postBody)) {
      bodyParams = customCloneDeep(exportAdaptorSubSchema.postBody);
    } else if (isString(exportAdaptorSubSchema.postBody)) {
      if (exportDoc.assistant === 'expensify') {
        bodyParams = exportAdaptorSubSchema.postBody.replace(
          'requestJobDescription=',
          ''
        );
        bodyParams = JSON.parse(bodyParams);
      } else {
        bodyParams = exportAdaptorSubSchema.postBody;
      }
    }
  } else if (exportAdaptorSubSchema.body) {
    if (exportDoc.assistant === 'expensify') {
      bodyParams = exportAdaptorSubSchema.body.replace(
        'requestJobDescription=',
        ''
      );
    } else {
      bodyParams = exportAdaptorSubSchema.body;
    }
    try {
      bodyParams = JSON.parse(bodyParams);
    // eslint-disable-next-line no-empty
    } catch (e) {
    }
  }

  if (!operation) {
    operation = operationDetails.id || operationDetails.url;
  }

  return {
    ...assistantMetadata,
    operation,
    operationDetails,
    pathParams,
    queryParams,
    bodyParams,
  };
}

export function convertToExport({ assistantConfig, assistantData, headers = [] }) {
  const {
    adaptorType = 'http',
    assistant,
    version,
    resource,
    operation,
    pathParams,
    queryParams,
    bodyParams,
  } = assistantConfig;

  if (!resource || !operation || !assistantData) {
    return undefined;
  }

  const operationDetails = getExportOperationDetails({
    version,
    resource,
    operation,
    assistantData,
  });
  const exportDefaults = {
    rest: {
      ...customCloneDeep(DEFAULT_PROPS.EXPORT.REST),
      resourcePath: operationDetails.resourcePath,
      successPath: operationDetails.successPath,
      allowUndefinedResource: !!operationDetails.allowUndefinedResource,
    },
    http: {
      ...customCloneDeep(DEFAULT_PROPS.EXPORT.HTTP),
      requestMediaType: operationDetails.requestMediaType,
      successMediaType: operationDetails.successMediaType,
      errorMediaType: operationDetails.errorMediaType,
      customeTemplateEval: operationDetails.customeTemplateEval,
    },
  };
  const exportDoc = {
    method: operationDetails.method || 'GET',
    relativeURI: undefined,
    headers: [],
    ...exportDefaults[adaptorType],
  };

  if (adaptorType === 'http') {
    Object.keys(operationDetails.response || {}).forEach(
      prop => { exportDoc.response[prop] = operationDetails.response[prop]; }
    );
  }

  Object.keys(operationDetails.paging || {}).forEach(prop => {
    if (adaptorType === 'rest') {
      exportDoc[prop] = operationDetails.paging[prop];
    } else if (adaptorType === 'http') {
      exportDoc.paging[prop] = operationDetails.paging[prop];
    }
  });

  let { url: relativeURI } = { ...operationDetails };

  let pagingRelativeURI = operationDetails.paging?.nextPageRelativeURI || operationDetails.paging?.relativeURI;

  operationDetails.pathParameters?.forEach(pathParam => {
    if (pathParams) {
      let pathParamValue = pathParams[pathParam.id];

      if (pathParamValue && pathParam.config) {
        if (pathParam.config.prefix) {
          pathParamValue = pathParam.config.prefix + pathParamValue;
        }

        if (pathParam.config.suffix) {
          pathParamValue += pathParam.config.suffix;
        }
      }

      relativeURI = relativeURI.replace(
        new RegExp(`:_${pathParam.id}`, 'g'),
        pathParamValue
      );
      if (pagingRelativeURI) {
        pagingRelativeURI = pagingRelativeURI.replace(
          new RegExp(`:_${pathParam.id}`, 'g'),
          pathParamValue
        );
      }
    }
  });

  let exportType;
  const allQueryParams = {};

  operationDetails.queryParameters?.forEach(queryParam => {
    allQueryParams[queryParam.id] = queryParam.defaultValue;

    if (!queryParam.readOnly) {
      if (queryParam.type === 'repeat') {
        allQueryParams[queryParam.id] = queryParams[queryParam.id];
        each(queryParams, (v, k) => {
          if (
            k &&
            k.startsWith(queryParam.id) &&
            k.split('.').length > 1 &&
            !isNaN(parseInt(last(k.split('.')), 10))
          ) {
            allQueryParams[k] = v;
          }
        });
      } else {
        allQueryParams[queryParam.id] = queryParams[queryParam.id];
      }
    }

    if (
      allQueryParams[queryParam.id] &&
      allQueryParams[queryParam.id].includes &&
      allQueryParams[queryParam.id].includes('lastExportDateTime')
    ) {
      exportType = 'delta';
    }
  });
  if (queryParams) {
    Object.keys(queryParams).forEach(qp => {
      if (!allQueryParams[qp]) {
        allQueryParams[qp] = queryParams[qp];
      }
    });
  }
  const finalQueryString = qs.stringify(allQueryParams, {
    encode: false,
    indices: false,
  }); /* indices should be false to handle IO-1776 */

  if (finalQueryString) {
    const [pathPart, queryPart] = relativeURI.split('?');
    const queryStringObj = new URLSearchParams(finalQueryString);
    const queryObj = new URLSearchParams(queryPart);

    if (queryPart) {
      [...queryStringObj.entries()].forEach(([key, value]) => {
        const paramType = operationDetails.queryParameters.find(({id}) => id === key)?.fieldType;

        if (paramType && (paramType === 'array' || paramType === 'multiselect')) {
          queryObj.append(key, value);
        } else {
          queryObj.set(key, value);
        }
      });
      const queryString = qs.stringify(Array.from(queryObj.entries()).reduce((acc, [key, value]) => ({...acc, [key]: value}), {}), {encode: false, indices: false });

      relativeURI = `${pathPart}?${queryString}`;
    } else { relativeURI += (relativeURI.includes('?') ? '&' : '?') + finalQueryString; }
    if (pagingRelativeURI) {
      pagingRelativeURI += (pagingRelativeURI.includes('?') ? '&' : '?') + finalQueryString;
    }
  }

  exportDoc.relativeURI = relativeURI;
  if (pagingRelativeURI) {
    if (adaptorType === 'rest') {
      exportDoc.nextPageRelativeURI = pagingRelativeURI;
    } else if (adaptorType === 'http') {
      exportDoc.paging.relativeURI = pagingRelativeURI;
    }
  }

  if (adaptorType === 'rest') {
    if (['POST', 'PUT'].includes(exportDoc.method)) {
      if (!isEmpty(bodyParams)) {
        exportDoc.postBody = defaultsDeep(
          customCloneDeep(operationDetails.postBody),
          bodyParams
        );

        if (operationDetails.postBodyParamsOrder) {
          // IO-4570
          exportDoc.postBody = JSON.parse(
            JSON.stringify(
              exportDoc.postBody,
              operationDetails.postBodyParamsOrder
            )
          );
        }
      } else if (operationDetails.postBody) {
        exportDoc.postBody = customCloneDeep(operationDetails.postBody);
      } else {
        exportDoc.postBody = queryParams;
      }

      if (exportDoc.postBody) {
        if (isString(exportDoc.postBody)) {
          if (exportDoc.postBody.includes('lastExportDateTime')) {
            exportType = 'delta';
          }
        } else if (isObject(exportDoc.postBody)) {
          if (
            JSON.stringify(exportDoc.postBody).includes('lastExportDateTime')
          ) {
            exportType = 'delta';
          }
        }

        if (assistant === 'expensify') {
          exportDoc.postBody = `requestJobDescription=${JSON.stringify(
            exportDoc.postBody
          )}`;
        }
      }
    }
  } else if (['POST', 'PUT'].includes(exportDoc.method)) {
    if (!isEmpty(bodyParams)) {
      exportDoc.body = defaultsDeep(
        customCloneDeep(operationDetails.body),
        bodyParams
      );

      if (operationDetails.bodyParamsOrder) {
        // IO-4570
        exportDoc.body = JSON.parse(
          JSON.stringify(exportDoc.body, operationDetails.bodyParamsOrder)
        );
      }
    } else if (operationDetails.body) {
      exportDoc.body = customCloneDeep(operationDetails.body);
    } else {
      exportDoc.body = queryParams;
    }
  }

  const userHeaders = Object.keys(operationDetails.headers || {}).filter(headerName => !operationDetails.headers[headerName]);

  Object.keys(operationDetails.headers).forEach(headerName => {
    if (userHeaders.includes(headerName) && Array.isArray(headers)) {
      const header = headers.find(header => header.name === headerName && !!header.value);

      if (header) { exportDoc.headers.push(header); }
    } else if (operationDetails.headers[headerName] !== null) {
      exportDoc.headers.push({
        name: headerName,
        value: operationDetails.headers[headerName],
      });

      if (
        operationDetails.headers[headerName].includes &&
        operationDetails.headers[headerName].includes('lastExportDateTime')
      ) {
        exportType = 'delta';
      }
    }
  });

  if (
    !exportType &&
    assistantConfig.exportType &&
    ['delta', 'test'].includes(assistantConfig.exportType)
  ) {
    ({ exportType } = assistantConfig);
  }

  const deltaConfig = {};

  if (exportType === 'delta' && operationDetails.delta) {
    ['dateFormat', 'lagOffset'].forEach(v => {
      if (operationDetails.delta[v]) {
        deltaConfig[v] = operationDetails.delta[v];
      }
    });
  }

  if (operationDetails.mergePostBodyToPagingPostBody && exportDoc.postBody) {
    // IO-7630
    exportDoc.pagingPostBody = defaultsDeep(
      exportDoc.pagingPostBody || {},
      exportDoc.postBody
    );
  }

  if (exportDoc.body) {
    // IO-9428
    if (operationDetails.mergeBodyToPagingBody) {
      if (!exportDoc.paging) {
        exportDoc.paging = {};
      }

      exportDoc.paging.body = defaultsDeep(
        exportDoc.paging.body || {},
        exportDoc.body
      );
    }

    if (isObject(exportDoc.body)) {
      exportDoc.body = JSON.stringify(exportDoc.body);
    }

    if (exportDoc.body.includes('lastExportDateTime')) {
      exportType = 'delta';
    }

    if (assistant === 'expensify') {
      exportDoc.body = `requestJobDescription=${exportDoc.body}`;
    }
  }

  /** paging.body should be a string */
  if (exportDoc.paging && isObject(exportDoc.paging.body)) {
    exportDoc.paging.body = JSON.stringify(exportDoc.paging.body);
  }

  const assistantMetadata = { resource };

  if (version) {
    assistantMetadata.version = version;
  }

  /** We need to set operation only if id is set on endpoint in metadata. Otherwise, the conversion logic in ampersand app fails */
  if (operationDetails.id) {
    assistantMetadata.operation = operationDetails.id;
  } else if (operationDetails.url) {
    assistantMetadata.operationUrl = operationDetails.url;
  }

  return {
    [`/${adaptorType}`]: exportDoc,
    '/file':
      operationDetails.file ||
      undefined /* populate file subschema if it is in metadata (ex: concurexpense assistant) */,
    '/type': exportType || undefined,
    '/delta': !isEmpty(deltaConfig) ? deltaConfig : undefined,
    '/test': undefined,
    '/assistant': assistant,
    '/assistantMetadata': assistantMetadata,
  };
}

export function getParamValue({ fieldMeta, values = {} }) {
  let paramValue;

  if (fieldMeta && fieldMeta.id && values) {
    if (Object.prototype.hasOwnProperty.call(values, fieldMeta.id)) {
      paramValue = values[fieldMeta.id];

      if (fieldMeta.paramLocation === PARAMETER_LOCATION.QUERY) {
        if (fieldMeta.inputType === 'multiselect' && !isArray(paramValue)) {
          // wrap item inside array as multiselect expects item by default an array @BugFix : 8896
          paramValue = [paramValue];
        }
      } else if (fieldMeta.paramLocation === PARAMETER_LOCATION.BODY) {
        if (fieldMeta.inputType === 'select' && isArray(paramValue)) {
          [paramValue] = paramValue;
        }
      }
    } else if (fieldMeta.paramLocation === PARAMETER_LOCATION.QUERY) {
      if (fieldMeta.id.indexOf('[') > 0) {
        const prefix = fieldMeta.id.substr(0, fieldMeta.id.indexOf('['));

        if (Object.prototype.hasOwnProperty.call(values, prefix)) {
          paramValue =
            values[prefix][fieldMeta.id.substr(fieldMeta.id.indexOf('['))];
        }
      }
    } else if (fieldMeta.paramLocation === PARAMETER_LOCATION.BODY) {
      const keyParts = fieldMeta.id.split('.');

      paramValue = values[keyParts[0]];

      for (let i = 1; paramValue && i < keyParts.length; i += 1) {
        paramValue = paramValue[keyParts[i]];
      }

      if (fieldMeta.inputType === 'select' && isArray(paramValue)) {
        [paramValue] = paramValue;
      }
    }
  }

  return paramValue;
}

export function generateValidReactFormFieldId(fieldId) {
  return fieldId
    .replace(/\./g, '/')
    .replace(/\[/g, '*_*')
    .replace(/\]/g, '*__*');
}
// ids look like this AmazonOrderId.Id and keys AmazonOrderId.Id.1
const isRepeatIndexedKey = (k, fieldId
) => k && k.startsWith(fieldId) && k.split('.').length > 1 && !isNaN(parseInt(last(k.split('.')), 10));
export const isMetaRequiredValuesMet = (meta, value) => {
  if (!meta.fields) return true;
  const requiredFields = meta.fields.filter(field => field.required);

  if (!requiredFields || !requiredFields.length) return true;

  return requiredFields.every(({id, type, indexed}) => {
    if (type === 'repeat' && indexed) {
      const repeatIndexedKeys = value && Object.keys(value)
        .filter(key => isRepeatIndexedKey(key, id));

      if (!repeatIndexedKeys || !repeatIndexedKeys.length) {
        return false;
      }

      return repeatIndexedKeys.every(key => get(value, key));
    }

    return get(value, id);
  });
};

export function convertToReactFormFields({
  paramMeta = {},
  value = {},
  flowId,
  resourceContext = {},
  operationChanged,
}) {
  const fields = [];
  const fieldDetailsMap = {};
  const actualFieldIdToGeneratedFieldIdMap = {};
  const paramValues = { ...value };
  let anyParamValuesSet = false;

  const paramMetaFields = paramMeta?.fields?.map(fld => {
    const field = {...fld};

    if (field.type === 'repeat' && field.indexed) {
      const fieldValue = [];

      each(value, (v, k) => {
        if (isRepeatIndexedKey(k, field.id)) {
          fieldValue.push(v);
        }
      });
      if (fieldValue.length > 0) {
        paramValues[field.id] = fieldValue;
      }
      if (!field.defaultValue) {
        // eslint-disable-next-line no-param-reassign
        field.defaultValue = [];
      }
    }

    return field;
  });

  paramMetaFields &&
    paramMetaFields.forEach(field => {
      if (!field.readOnly && Object.prototype.hasOwnProperty.call(paramValues, field.id) && paramValues[field.id] !== field.defaultValue) {
        anyParamValuesSet = true;
      }

      /** There are some issues with forms processor if field id/name contains special chars like . and [] */
      const fieldId = generateValidReactFormFieldId(field.id);

      actualFieldIdToGeneratedFieldIdMap[field.id] = fieldId;

      let { fieldType } = field;
      const { type } = field;

      fieldDetailsMap[fieldId] = {
        id: field.id,
      };
      ['type', 'indexed'].forEach(prop => {
        if (Object.prototype.hasOwnProperty.call(field, prop)) {
          fieldDetailsMap[fieldId][prop] = field[prop];
        }
      });

      if (fieldType === 'integer') {
        fieldDetailsMap[fieldId].type = 'integer';
      }

      if (paramMeta.paramLocation === PARAMETER_LOCATION.BODY) {
        if (['array', 'json'].includes(type)) {
          fieldType = 'editor';
        }
      }

      if (
        !['checkbox', 'editor', 'multiselect', 'select', 'text', 'textarea'].includes(
          fieldType
        )
      ) {
        fieldType = 'text';
      }

      if ((fieldType === 'text' || fieldType === 'textarea') && fieldDetailsMap[fieldId].type !== 'integer') {
        fieldType = 'textwithflowsuggestion';
      }

      fieldDetailsMap[fieldId].inputType = fieldType;
    });

  paramMetaFields &&
    paramMetaFields.forEach(field => {
      const fieldId = actualFieldIdToGeneratedFieldIdMap[field.id];
      const { inputType, type } = fieldDetailsMap[fieldId];
      const paramValue = getParamValue({
        fieldMeta: {
          id: field.id,
          inputType,
          paramLocation: paramMeta.paramLocation,
        },
        values: paramValues,
      });
      /**
       * Set default values only if there are no values for any params set.(IO-12293)
       */
      let { defaultValue } = (!anyParamValuesSet && operationChanged) ? field : {};

      if (
        !anyParamValuesSet &&
        paramValue === undefined &&
        paramMeta.isDeltaExport &&
        paramMeta.defaultValuesForDeltaExport &&
        Object.prototype.hasOwnProperty.call(
          paramMeta.defaultValuesForDeltaExport,
          field.id
        )
      ) {
        defaultValue = paramMeta.defaultValuesForDeltaExport[field.id];
      }

      const fieldDef = {
        id: fieldId,
        name: fieldId,
        defaultValue: paramValue || defaultValue,
        helpText: field.description,
        label: field.name,
        placeholder: field.placeholder,
        required: !!field.required,
        type: inputType,
        readOnly: !!field.readOnly,
      };

      if (inputType === 'textwithflowsuggestion' && isNumber(fieldDef.defaultValue)) {
        fieldDef.defaultValue = fieldDef.defaultValue.toString();
      }

      if (!fieldDef.readOnly && fieldDef.defaultValue === undefined) { // IO-12441
        fieldDef.defaultValue = '';
      }

      if (fieldDef.readOnly) {
        fieldDef.defaultDisabled = true;
      }

      if (fieldDef.type === 'editor') {
        fieldDef.saveMode = 'json';
        fieldDef.mode = 'json';
      }

      if (fieldDef.type === 'textwithflowsuggestion') {
        if (isArray(fieldDef.defaultValue)) {
          fieldDef.defaultValue = fieldDef.defaultValue.join(',');
        }
        fieldDef.showLookup = false;
        if (field.fieldType === 'textarea') {
          fieldDef.multiline = true;
          fieldDef.rowsMax = 10;
        }
      }

      if (flowId) {
        fieldDef.flowId = flowId;
      }

      if (resourceContext) {
        if (resourceContext.resourceId) {
          fieldDef.resourceId = resourceContext.resourceId;
        }

        if (resourceContext.resourceType) {
          fieldDef.resourceType = resourceContext.resourceType;
        }
      }

      if (['multiselect', 'select'].includes(fieldDef.type)) {
        fieldDef.options = [
          {
            items: field.options
              ? field.options.map(opt => ({
                label: opt.toString(),
                value: opt,
              }))
              : [],
          },
        ];
      }

      /** Clean up props with no values */
      ['helpText', 'label', 'placeholder'].forEach(prop => {
        if (!fieldDef[prop]) {
          delete fieldDef[prop];
        }
      });

      if (fieldDef.defaultValue === undefined) {
        delete fieldDef.defaultValue;
      }

      if (type === 'integer') {
        fieldDef.validWhen = {
          matchesRegEx: {
            pattern: '^[\\d]+$',
            message: 'Must be a number.',
          },
        };
      }

      ['requiredWhen', 'validWhen'].forEach(p => {
        if (Object.prototype.hasOwnProperty.call(field, p)) {
          fieldDef[p] = field[p];
        }
      });

      fields.push(fieldDef);
    });

  const requiredFields = fields.filter(field => field.required);
  const optionalFields = fields.filter(field => !field.required);
  const fieldMap = {};

  fields.forEach(field => {
    fieldMap[field.id] = field;
  });

  if (
    paramMeta.oneMandatoryQueryParamFrom &&
    paramMeta.oneMandatoryQueryParamFrom.length > 1
  ) {
    fields.forEach(field => {
      if (paramMeta.oneMandatoryQueryParamFrom.includes(field.id)) {
        fieldMap[field.id].requiredWhen = [];
        paramMeta.oneMandatoryQueryParamFrom.forEach(f => {
          if (f !== field.id) {
            fieldMap[field.id].requiredWhen.push({
              field: fieldMap[f].id,
              is: [fieldMap[f].type === 'multiselect' ? [] : ''],
            });
          }
        });
      }
    });
  }

  if (requiredFields.length > 0 && optionalFields.length > 0) {
    return {
      fieldMap,
      layout: {
        fields: requiredFields.map(field => field.id),
        type: 'collapse',
        containers: [
          {
            label: 'Optional',
            collapsed: true,
            fields: optionalFields.map(field => field.id),
          },
        ],
      },
      fieldDetailsMap,
    };
  }

  return {
    fieldMap,
    layout: {
      fields: fields.map(field => field.id),
    },
    fieldDetailsMap,
  };
}

export function updateFormValues({
  formValues,
  fieldDetailsMap,
  paramLocation,
}) {
  let updatedFormValues = {};

  Object.keys(formValues).forEach(key => {
    let value = formValues[key];
    const { id, type, indexed } = fieldDetailsMap[key];

    if (type === 'repeat' && indexed && value && value.length > 0) {
      value = isArray(value) ? value : value.split(',');
      value.forEach((v, i) => {
        updatedFormValues[`${id}.${i + 1}`] = v;
      });
    } else {
      if (type === 'array') {
        if (paramLocation !== PARAMETER_LOCATION.BODY) {
        // IO-1776
          if (value && !isArray(value)) {
            value = value.split(',');
          }
        }
      } else if (type === 'csv') {
        if (isArray(value)) {
          value = value.join(',');
        }
      } else if (type === 'integer') {
        if (value) {
          try {
            value = parseInt(value, 10);
          } catch (ex) {
            // do nothing
          }
        }
      }

      if (value || value === false) {
        // allow any truthy and boolean false
        updatedFormValues[id] = value;
      }
    }
  });

  if (paramLocation === PARAMETER_LOCATION.BODY) {
    let keyParts;
    let objTemp;
    const toReturn = {};

    Object.keys(updatedFormValues).forEach(key => {
      const value = updatedFormValues[key];

      if (value || value === false) {
        // allow booleans
        keyParts = key.split('.');
        objTemp = toReturn;
        let i = 0;

        for (i = 0; i < keyParts.length - 1; i += 1) {
          if (!Object.prototype.hasOwnProperty.call(objTemp, keyParts[i])) {
            objTemp[keyParts[i]] = {};
          }

          objTemp = objTemp[keyParts[i]];
        }

        objTemp[keyParts[i]] = value;
      }
    });

    updatedFormValues = toReturn;
  }

  return updatedFormValues;
}

export function convertFromImport({ importDoc: importDocOrig, assistantData: assistantDataOrig, adaptorType }) {
  // mutating of args so we are cloning of objects to allow this operation
  const importDoc = customCloneDeep(importDocOrig);

  const assistantData = customCloneDeep(assistantDataOrig);
  let { version, resource, operation, lookupType, createEndpoint, updateEndpoint } =
    importDoc.assistantMetadata || {};

  if (importDoc?.http) {
    if (importDoc.http?._httpConnectorEndpointId || importDoc.http?._httpConnectorEndpointIds || importDoc.http?._httpConnectorResourceId) {
      if (operation === 'create-update-id' || isArray(operation) || (importDoc.http._httpConnectorEndpointIds?.length > 1 && operation !== '')) {
        operation = (VALID_MONGO_ID.test(operation) || VALID_MONGO_ID.test(operation?.[0]) || operation?.includes('+') || operation?.includes('create-update-id')) ? operation : importDoc.http._httpConnectorEndpointIds;
      } else {
        operation = (VALID_MONGO_ID.test(operation) || operation?.includes('+')) ? operation : importDoc.http?._httpConnectorEndpointId || importDoc.http?._httpConnectorEndpointIds?.[0];
      }
      resource = (VALID_MONGO_ID.test(resource) || resource?.includes('+')) ? resource : importDoc.http?._httpConnectorResourceId;
      version = VALID_MONGO_ID.test(version) ? version : importDoc.http?._httpConnectorVersionId;
    }
    if (operation !== 'create-update-id' && ((isArray(operation) && operation.length > 1) || (isArray(importDoc.http._httpConnectorEndpointIds) && importDoc.http._httpConnectorEndpointIds.length > 1))) {
      [updateEndpoint, createEndpoint] = isArray(operation) ? operation : importDoc.http._httpConnectorEndpointIds;
    }
    if ((isArray(operation) && operation.length > 1)) { operation = 'create-update-id'; }
  }
  const { dontConvert, lookups } = importDoc.assistantMetadata || {};
  let sampleData;
  let { ignoreExisting, ignoreMissing } = importDoc;

  if (importDoc.assistantMetadata) {
    if (
      Object.hasOwnProperty.call(importDoc.assistantMetadata, 'ignoreExisting')
    ) {
      ({ ignoreExisting } = importDoc.assistantMetadata);
    }

    if (
      Object.hasOwnProperty.call(importDoc.assistantMetadata, 'ignoreMissing')
    ) {
      ({ ignoreMissing } = importDoc.assistantMetadata);
    }
  }

  const assistantMetadata = {
    pathParams: {},
    queryParams: {},
    bodyParams: {},
    lookups,
  };
  const importURLs = [];

  /**
   * Derive version, resource and operation from importDoc only on first run/init (dontConvert = false).
   * If user changes anything (version, resource, operation, etc...) we are setting the flag dontConvert to true.
   * And we just need to use the values directly from assistantMetadata.
   */

  if (!dontConvert && (!resource || !operation)) {
    if (
      importDoc &&
      importDoc[adaptorType] &&
      importDoc[adaptorType].relativeURI
    ) {
      const url1Info = getMatchingRoute(
        assistantData.import.urlResolution,
        importDoc[adaptorType].relativeURI[0]
      );

      importURLs.push(url1Info.urlMatch);

      if (importDoc[adaptorType].relativeURI[1]) {
        const url2Info = getMatchingRoute(
          assistantData.import.urlResolution,
          importDoc[adaptorType].relativeURI[1]
        );

        importURLs.push(url2Info.urlMatch);
      }

      if (!operation && importURLs[0]) {
        operation = [
          importDoc[adaptorType].method.join(':'),
          importURLs.join(':'),
        ].join(':');
      }

      const versionAndResource = getImportVersionAndResource({
        assistantVersion: version,
        assistantOperation: operation,
        assistantData: assistantData.import,
      });

      ({ version, resource, sampleData } = versionAndResource);
      if (versionAndResource.operation) {
        ({ operation } = versionAndResource);
      }
    }
  }

  assistantMetadata.version = version;
  assistantMetadata.resource = resource;
  assistantMetadata.sampleData = sampleData;
  assistantMetadata.operation = operation;
  assistantMetadata.createEndpoint = createEndpoint;
  assistantMetadata.updateEndpoint = updateEndpoint;

  if (!operation) {
    return assistantMetadata;
  }
  if (operation === 'create-update-id' && (!createEndpoint || !updateEndpoint || createEndpoint === '' || updateEndpoint === '')) {
    return assistantMetadata;
  }
  let operationDetails;

  if (operation === 'create-update-id') {
    operationDetails = getMergedImportOperationDetails({
      version,
      resource,
      createEndpoint,
      updateEndpoint,
      assistantData,
    });
  } else {
    operationDetails = getImportOperationDetails({
      version,
      resource,
      operation,
      assistantData,
    });
  }

  if (!operationDetails || !operationDetails.url) {
    return assistantMetadata;
  }

  let howToFindIdentifierLookupConfig = {};

  if (operationDetails?.howToFindIdentifier?.lookup) {
    howToFindIdentifierLookupConfig =
      operationDetails.howToFindIdentifier.lookup;
  }

  const importAdaptorSubSchema = importDoc[adaptorType] || {};

  if (!importAdaptorSubSchema.lookups) {
    importAdaptorSubSchema.lookups = [];
  }

  let url1Info;
  let url2Info;

  if (importAdaptorSubSchema.relativeURI) {
    if (!isArray(importAdaptorSubSchema.relativeURI)) { importAdaptorSubSchema.relativeURI = [importAdaptorSubSchema.relativeURI]; }
    url1Info = getMatchingRoute(
      [
        isArray(operationDetails.url)
          ? operationDetails.url[0]
          : operationDetails.url,
      ],
      importAdaptorSubSchema.relativeURI[0] || ''
    );

    if (importAdaptorSubSchema.relativeURI[1]) {
      url2Info = getMatchingRoute(
        [operationDetails.url[1]],
        importAdaptorSubSchema.relativeURI[1] || ''
      );
    }
  }

  const pathParams = {};
  const bodyParams = {};
  let queryParams = {};
  let lookupUrl;
  let lookupQueryParams;
  let identifierValue;

  if (operationDetails.parameters && operationDetails.parameters.length > 0) {
    operationDetails.parameters.forEach((p, index) => {
      if (p.in !== 'query') {
        /**
         * IO-16945, check if the urlMatch has path (:_XYZ) parameters
         */
        if (operation === 'create-update-id') {
          if (url1Info?.urlMatch?.indexOf(`:_${p.id}`) > 0) {
            const idIndex = url1Info?.urlMatch?.indexOf(`:_${p.id}`);
            const beforeIndex = [...url1Info?.urlMatch.substring(0, idIndex).matchAll(new RegExp(':_', 'gi'))].length;

            if (p.isIdentifier) {
              pathParams[p.id] = url1Info.urlParts[beforeIndex]
                .replace(/{/g, '')
                .replace(/}/g, '')
                .replace('data.0.', '');
            } else {
              pathParams[p.id] = url1Info.urlParts[beforeIndex];
            }
          } else if (url2Info?.urlMatch?.indexOf(`:_${p.id}`) > 0) {
            const idIndex = url1Info?.urlMatch?.indexOf(`:_${p.id}`);
            const beforeIndex = [...url1Info?.urlMatch.substring(0, idIndex).matchAll(new RegExp(':_', 'gi'))].length;

            if (p.isIdentifier) {
              pathParams[p.id] = url2Info.urlParts[beforeIndex]
                .replace(/{/g, '')
                .replace(/}/g, '')
                .replace('data.0.', '');
            } else {
              pathParams[p.id] = url2Info.urlParts[beforeIndex];
            }
          }
        } else if (url1Info?.urlMatch?.indexOf(':_') > 0 && url1Info?.urlParts && url1Info.urlParts[index]) {
          if (p.isIdentifier) {
            pathParams[p.id] = url1Info.urlParts[index]
              .replace(/{/g, '')
              .replace(/}/g, '')
              .replace('data.0.', '');
          } else {
            pathParams[p.id] = url1Info.urlParts[index];
          }
        } else if (url2Info?.urlMatch?.indexOf(':_') > 0 && url2Info?.urlParts && url2Info.urlParts[index]) {
          if (p.isIdentifier) {
            pathParams[p.id] = url2Info.urlParts[index]
              .replace(/{/g, '')
              .replace(/}/g, '')
              .replace('data.0.', '');
          } else {
            pathParams[p.id] = url2Info.urlParts[index];
          }
        }

        if (pathParams[p.id]) {
          if (p.config) {
            if (p.config.prefix) {
              pathParams[p.id] = pathParams[p.id].replace(p.config.prefix, '');
            }

            if (p.config.suffix) {
              pathParams[p.id] = pathParams[p.id].replace(p.config.suffix, '');
            }
          }

          /* IO-3665 */
          if (
            pathParams[p.id].indexOf('(') === 0 &&
            pathParams[p.id].indexOf(')') === pathParams[p.id].length - 1
          ) {
            pathParams[p.id] = pathParams[p.id].substring(
              1,
              pathParams[p.id].length - 1
            );
          }

          pathParams[p.id] = pathParams[p.id].replace('lookup.', '');
        }
      }

      if (p.isIdentifier && !pathParams[p.id]) {
        if (ignoreExisting || ignoreMissing) {
          if (importAdaptorSubSchema.ignoreExtract) {
            pathParams[p.id] = importAdaptorSubSchema.ignoreExtract
              .replace(/{/g, '')
              .replace(/}/g, '')
              .replace('data.0.', '');
          } else if (importAdaptorSubSchema.ignoreLookupName) {
            pathParams[p.id] = importAdaptorSubSchema.ignoreLookupName;
          }
        }
        /*
        Fix for https://celigo.atlassian.net/browse/IO-22027
        If ignoreExtract has url parameter delimiters(? and /) in them, it will not be extracted from url
        */
        if (importAdaptorSubSchema.ignoreExtract && /(\?|\/)/.test(importAdaptorSubSchema.ignoreExtract)) {
          pathParams[p.id] = importAdaptorSubSchema.ignoreExtract;
        }
      }

      if (p.isIdentifier && (pathParams[p.id] || operationDetails.howToIdentifyExistingRecords)) {
        const {existingLookupName} = operationDetails.howToIdentifyExistingRecords ? importAdaptorSubSchema : {};
        const lookup = importAdaptorSubSchema.lookups.find(
          lu => lu.name === pathParams[p.id] || lu.name === existingLookupName
        );

        if (lookup) {
          lookupType = 'lookup';
          lookupUrl = lookup.relativeURI;
          let lookupUrlInfo;

          if (
            howToFindIdentifierLookupConfig.id &&
            assistantMetadata &&
            ((assistantMetadata.lookups &&
            assistantMetadata.lookups[pathParams[p.id] || existingLookupName]) || importDoc.http?._httpConnectorResourceId)
          ) {
            const luEndpoint = getExportOperationDetails({
              version: assistantMetadata.version,
              resource:
                assistantMetadata.lookups?.[pathParams[p.id] || existingLookupName]?.resource || operationDetails.lookupOperationDetails?.resource ||
                 assistantMetadata.resource,
              operation: assistantMetadata.lookups?.[pathParams[p.id] || existingLookupName]?.operation || operationDetails.lookupOperationDetails?.id,
              assistantData,
            });
            let luEndpointUrl = luEndpoint.url;

            if (luEndpointUrl?.includes('?') && luEndpoint?._httpConnectorResourceIds?.length) { luEndpointUrl = luEndpointUrl.split('?')?.[0]; }
            lookupUrlInfo = getMatchingRoute([luEndpointUrl], lookupUrl);
          } else {
            lookupUrlInfo = getMatchingRoute(
              assistantData.export.urlResolution,
              lookupUrl
            );
          }

          if (
            lookupUrlInfo.urlParts &&
            lookupUrlInfo.urlParts[lookupUrlInfo.urlParts.length - 1]
          ) {
            lookupQueryParams = extractQueryParameters(
              lookupUrlInfo.urlParts[lookupUrlInfo.urlParts.length - 1],
              importDoc.assistant
            );
          }

          lookupUrl = lookupUrlInfo.urlMatch;
        } else {
          lookupType = 'source';
        }
      }
    });
  }

  if (
    importAdaptorSubSchema.relativeURI &&
    importAdaptorSubSchema.relativeURI[0].indexOf('?') > 0
  ) {
    let toParseQueryString = importAdaptorSubSchema.relativeURI[0].split('?')?.[1];

    if (url1Info.urlParts && url1Info.urlParts[url1Info.urlParts.length - 1]) {
      toParseQueryString = url1Info.urlParts[url1Info.urlParts.length - 1];
      url1Info.urlParts.splice(url1Info.urlParts.length - 1);
      /* if there is parameter (path) defined but no place-holder in the url then the pathParameter is being set with the entire query string */
    }
    queryParams = extractQueryParameters(toParseQueryString, importDoc.assistant);
  }

  if (importAdaptorSubSchema.existingExtract) {
    identifierValue = importAdaptorSubSchema.existingExtract;
    lookupType = 'source';
  }
  if (!operation) {
    if (operationDetails.id) {
      operation = operationDetails.id;
    } else if (isArray(operationDetails.url)) {
      operation = [
        operationDetails.method.join(':'),
        operationDetails.url.join(':'),
      ].join(':');
    } else {
      operation = [operationDetails.method, operationDetails.url].join(':');
    }
  }

  return {
    ...assistantMetadata,
    operation,
    operationDetails,
    pathParams,
    queryParams,
    bodyParams,
    ignoreExisting,
    ignoreMissing,
    lookupType,
    lookupUrl,
    lookupQueryParams,
    identifierValue,
  };
}

export function convertToImport({ assistantConfig, assistantData, headers }) {
  const {
    adaptorType = 'http',
    assistant,
    version,
    resource,
    operation,
    pathParams = {},
    queryParams = {},
    lookupType,
    ignoreExisting = false,
    ignoreMissing = false,
    lookups = [],
    existingExtract,
    createEndpoint,
    updateEndpoint,
  } = assistantConfig;
  let { lookupQueryParams = {} } = assistantConfig;

  if (!resource || !operation || !assistantData) {
    return undefined;
  }
  let operationDetails;

  if (operation === 'create-update-id') {
    operationDetails = getMergedImportOperationDetails({
      version,
      resource,
      createEndpoint,
      updateEndpoint,
      assistantData,
    });
  } else {
    operationDetails = getImportOperationDetails({
      version,
      resource,
      operation,
      assistantData,
    });
  }
  const importDefaults = {
    rest: {
      ...customCloneDeep(DEFAULT_PROPS.IMPORT.REST),
    },
    http: {
      ...customCloneDeep(DEFAULT_PROPS.IMPORT.HTTP),
    },
  };
  const importDoc = {
    ...importDefaults[adaptorType],
    lookups: isArray(lookups) ? lookups : [],
  };

  if (adaptorType === 'rest') {
    if (isArray(operationDetails.method)) {
      importDoc.method = operationDetails.method;
      importDoc.requestType = operationDetails.requestType;
      if (!importDoc.requestType) {
        importDoc.requestType = ['UPDATE', 'CREATE'];
      }

      importDoc.relativeURI = operationDetails.url;
      importDoc.body = operationDetails.body || [null, null];
      importDoc.responseIdPath = operationDetails.responseIdPath;
      importDoc.successPath = operationDetails.successPath;
      importDoc.successValues = operationDetails.successValues;
    } else {
      importDoc.method = [operationDetails.method];
      importDoc.relativeURI = [operationDetails.url];
      importDoc.body = [operationDetails.body || null];
      importDoc.responseIdPath = [operationDetails.responseIdPath];
      importDoc.successPath = [operationDetails.successPath];

      if (isArray(operationDetails.successValues)) {
        /**
         * TODO We can remove this check once T&A team fixes the metadata.
         */
        importDoc.successValues = operationDetails.successValues;
      } else {
        importDoc.successValues = [operationDetails.successValues];
      }
    }
  } else if (adaptorType === 'http') {
    if (isArray(operationDetails.method)) {
      importDoc.method = operationDetails.method;
      importDoc.relativeURI = operationDetails.url;
      importDoc.requestType = operationDetails.requestType;
      if (!importDoc.requestType) {
        importDoc.requestType = ['UPDATE', 'CREATE'];
      }
    } else {
      importDoc.method = [operationDetails.method];
      importDoc.relativeURI = [operationDetails.url];
    }

    if (operationDetails.body) {
      importDoc.body = operationDetails.body;
    }

    if (!importDoc.response) {
      importDoc.response = {};
    }

    /**
     * TODO We can remove the below code of setting response.resourceIdPath and response.successPath
     * from operationDetails once all the assistant metadata files are updated to use
     * operationDetails.response (https://celigo.atlassian.net/browse/AS-953).
     */
    importDoc.response.resourceIdPath = operationDetails.responseIdPath;
    importDoc.response.successPath = operationDetails.successPath;

    Object.keys(operationDetails.response || {}).forEach(
      prop => { importDoc.response[prop] = operationDetails.response[prop]; }
    );
  }

  const assistantMetadata = { resource };

  if (version) {
    assistantMetadata.version = version;
  }

  let identifiers;
  const lookupOperationQueryParams = {};

  if (operationDetails.parameters) {
    identifiers = operationDetails.parameters.filter(p => !!p.isIdentifier);

    if (identifiers && identifiers.length > 0) {
      importDoc.lookups = importDoc.lookups.filter(
        lu => lu.name !== identifiers[0].id
      );
    }
  }

  const lookupConfigMetadata = operationDetails.howToFindIdentifier
    ? operationDetails.howToFindIdentifier.lookup
    : undefined;

  const { lookupOperationDetails = {} } = operationDetails;
  const luConfig = {
    method: lookupOperationDetails.method || 'GET',
    postBody: '',
  };
  const luMetadata = {};

  if (identifiers && identifiers.length > 0) {
    if (lookupType === 'lookup') {
      luConfig.name = identifiers[0].id;

      if (lookupConfigMetadata && lookupConfigMetadata.extract) {
        luConfig.extract = lookupConfigMetadata.extract;
      } else {
        luConfig.extract = lookupOperationDetails.resourcePath
          ? `${lookupOperationDetails.resourcePath}[0].${identifiers[0].id}`
          : '';
      }

      if (lookupOperationDetails.queryParameters) {
        lookupOperationDetails.queryParameters.forEach(p => {
          lookupOperationQueryParams[p.id] = p.defaultValue;
        });
      }

      if (lookupConfigMetadata && lookupConfigMetadata.parameterValues) {
        Object.keys(lookupConfigMetadata.parameterValues).forEach(p => {
          lookupOperationQueryParams[p] =
            lookupConfigMetadata.parameterValues[p];
        });
      }

      lookupQueryParams = {
        ...lookupOperationQueryParams,
        ...lookupQueryParams,
      };

      let lookupOperationRelativeURI = lookupOperationDetails.url;

      if (lookupOperationRelativeURI?.includes('?') && lookupOperationDetails?._httpConnectorResourceIds?.length) {
        lookupOperationRelativeURI = lookupOperationRelativeURI.split('?')?.[0];
      }
      if (luConfig.method === 'GET') {
        const queryString = qs.stringify(lookupQueryParams, {
          encode: false,
          indices: false,
        }); /* indices should be false to handle IO-1776 */

        if (queryString) {
          lookupOperationRelativeURI += `?${queryString}`;
        }
      } else if (luConfig.method === 'POST') {
        luConfig.postBody = lookupQueryParams;
      }

      luConfig.relativeURI = lookupOperationRelativeURI;
      Object.keys(pathParams).forEach(p => {
        luConfig.relativeURI = luConfig.relativeURI.replace(
          new RegExp(`:_${p}`, 'g'),
          pathParams[p]
        );
      });

      importDoc.lookups = [...importDoc.lookups, luConfig];

      if (lookupOperationDetails.id) {
        luMetadata[luConfig.name] = {
          operation: lookupOperationDetails.id,
          ...(lookupOperationDetails.resource ? {resource: lookupOperationDetails.resource} : {}),
        };
      }
      if (ignoreExisting || ignoreMissing) {
        importDoc.ignoreLookupName = luConfig.name;
        importDoc.existingLookupName = undefined;
      } else {
        importDoc.existingLookupName = luConfig.name;
        importDoc.ignoreLookupName = undefined;
      }
    }
  }
  if (operationDetails.howToIdentifyExistingRecords && existingExtract) {
    importDoc.existingExtract = existingExtract;
    importDoc.existingLookupName = undefined;
  }
  if (ignoreExisting) {
    if (identifiers && identifiers.length > 0) {
      if (lookupType === 'source') {
        importDoc.ignoreExtract = pathParams[identifiers[0].id];
      }
    }
  } else if (
    importDoc.method.length === 2 ||
    lookupType === 'lookup' ||
    ignoreMissing
  ) {
    if (identifiers && identifiers.length > 0) {
      if (lookupType === 'source' && pathParams[identifiers[0].id]) {
        if (ignoreMissing) {
          importDoc.ignoreExtract = pathParams[identifiers[0].id];
          importDoc.existingExtract = undefined;
        } else {
          importDoc.existingExtract = pathParams[identifiers[0].id];
          importDoc.ignoreExtract = undefined;
        }
      } else if (lookupType === 'lookup') {
        if (operationDetails.howToIdentifyExistingRecords) {
          importDoc.existingLookupName = identifiers[0].id;
          importDoc.existingExtract = undefined;
        } else {
          pathParams[identifiers[0].id] = identifiers[0].id;
        }
      }
    }
  }

  let paramValue;

  if (operationDetails.parameters) {
    operationDetails.parameters.forEach(p => {
      paramValue = pathParams[p.id];

      if (p.isIdentifier) {
        if (adaptorType === 'rest') {
          paramValue = `{{{${paramValue}}}}`;
        } else if (adaptorType === 'http') {
          if (importDoc.ignoreLookupName || importDoc.existingLookupName) {
            paramValue = `{{{lookup.${paramValue}}}}`;
          } else {
            paramValue = `{{{data.0.${paramValue}}}}`;
          }
        }
      }

      if (paramValue && p.config) {
        if (p.config.prefix) {
          paramValue = p.config.prefix + paramValue;
        }

        if (p.config.suffix) {
          paramValue += p.config.suffix;
        }
      }

      importDoc.relativeURI[0] = importDoc.relativeURI[0].replace(
        new RegExp(`:_${p.id}`, 'g'),
        paramValue
      );

      if (importDoc.relativeURI[1]) {
        importDoc.relativeURI[1] = importDoc.relativeURI[1].replace(
          new RegExp(`:_${p.id}`, 'g'),
          paramValue
        );
      }
    });
  }

  const allQueryParams = {};

  if (operationDetails.queryParameters) {
    operationDetails.queryParameters.forEach(queryParam => {
      allQueryParams[queryParam.id] = queryParam.defaultValue;
      if (!queryParam.readOnly) {
        allQueryParams[queryParam.id] = queryParams[queryParam.id];
      }
    });
  }
  if (queryParams) {
    Object.keys(queryParams).forEach(qp => {
      if (!allQueryParams[qp]) {
        allQueryParams[qp] = queryParams[qp];
      }
    });
  }
  const queryString = qs.stringify(allQueryParams, {
    encode: false,
    indices: false,
  });

  if (queryString) {
    importDoc.relativeURI = importDoc.relativeURI.map(
      u => u + (u.indexOf('?') === -1 ? '?' : '&') + queryString
    );
  }

  if (operationDetails.headers) {
    const userHeaders = Object.keys(operationDetails.headers || {}).filter(headerName => !operationDetails.headers[headerName]);

    Object.keys(operationDetails.headers).forEach(h => {
      if (userHeaders.includes(h) && Array.isArray(headers)) {
        importDoc.headers.push(headers.find(header => header.name === h && !!header.value));
      } else if (operationDetails.headers[h] !== null) {
        const hv = operationDetails.headers[h].replace(
          /RECORD_IDENTIFIER/gi,
          (!isEmpty(identifiers) && pathParams[identifiers[0]?.id]) || ''
        ); // IO-6119. Static headers with preconfigured string is replaced dynamically with record identifier.

        importDoc.headers.push({ name: h, value: hv });
      }
    });
  }

  if (adaptorType === 'http') {
    [
      'successMediaType',
      'errorMediaType',
      'requestMediaType',
      'batchSize',
      'ignoreEmptyNodes',
      'strictHandlebarEvaluation',
    ].forEach(p => {
      if (operationDetails[p]) {
        if (p === 'batchSize') {
          importDoc[p] = parseInt(operationDetails[p], 10);
        } else {
          importDoc[p] = operationDetails[p];
        }
      }
    });
  }

  /** We need to set operation only if id is set on endpoint in metadata. Otherwise, the conversion logic in ampersand app fails */
  if (operationDetails.id) {
    assistantMetadata.operation = operationDetails.id;
  } else if (isArray(operationDetails.url)) {
    assistantMetadata.operationUrl = [
      operationDetails.method.join(':'),
      operationDetails.url.join(':'),
    ].join(':');
  } else {
    assistantMetadata.operationUrl = [
      operationDetails.method,
      operationDetails.url,
    ].join(':');
  }

  if (luMetadata) {
    assistantMetadata.lookups = luMetadata;
  }

  return {
    [`/${adaptorType}`]: importDoc,
    '/file':
      operationDetails.file ||
      undefined /* populate file subschema if it is in metadata (ex: concurexpense assistant) */,
    '/assistant': assistant,
    '/assistantMetadata': assistantMetadata,
    '/ignoreExisting': !!ignoreExisting,
    '/ignoreMissing': !!ignoreMissing,
  };
}

// this is a temporary util to calculate record type for assistants while fetching mapping auto suggestions.
// The same is used in prometheus stack.
// This util should be deleted after recordtype calculation is moved from frontent to backend layer
export function getRecordTypeForAutoMapper(uri) {
  const temp = uri.split('/');
  const arr = [];
  const pattern = '^[A-Za-z_-]*$';
  const removable = '{|}|:|#|custbody|search|^api$|^$|^admin$|^id$|.*[cC]ustom[A-Z_].*';

  // eslint-disable-next-line no-restricted-syntax
  for (const s of temp) {
    let str = s;

    if (s.includes('?')) {
      // eslint-disable-next-line prefer-destructuring
      str = s.split('?')[0];
    }
    if (str.match(pattern) && !str.match(removable)) {
      arr.push(str);
    }
  }

  return arr.join('/');
}
export function isAppConstantContact(application) {
  return application === 'constantcontact';
}

export function isAmazonHybridConnection(connection) {
  return connection?.assistant === 'amazonmws' && connection?.http?.type === 'Amazon-Hybrid';
}

export function isAmazonSellingPartnerConnection(connection) {
  return connection?.assistant === 'amazonmws' && connection?.http?.type === 'Amazon-SP-API';
}

export function isLoopReturnsv2Connection(connection) {
  return connection?.assistant === 'loopreturns' && connection?.http?.unencrypted?.version === 'v2';
}
export function isAcumaticaEcommerceConnection(connection) {
  return connection?.assistant === 'acumatica' && connection?.http?.unencrypted?.endpointName === 'ecommerce';
}
export function isAcumaticaManufacturingConnection(connection) {
  return connection?.assistant === 'acumatica' && connection?.http?.unencrypted?.endpointName === 'manufacturing';
}
export function isMicrosoftBusinessCentralOdataConnection(connection) {
  return connection?.assistant === 'microsoftbusinesscentral' && connection?.http?.unencrypted?.apiType === 'odata';
}
export function isSapByDesignSoapConnection(connection) {
  return connection?.assistant === 'sapbydesign' && connection?.http?.unencrypted?.apiType === 'soap';
}

export function shouldLoadAssistantFormForImports(resource, connection) {
  return resource &&
          !isAmazonHybridConnection(connection) &&
          (resource.useParentForm !== undefined
            ? !resource.useParentForm && resource.assistant
            : resource.assistant) && (!resource.useTechAdaptorForm || isAmazonSellingPartnerConnection(connection));
}

export function shouldLoadAssistantFormForExports(resource, connection) {
  return resource &&
          resource.assistant !== 'openair' &&
          !isAmazonHybridConnection(connection) &&
          (resource.useParentForm !== undefined
            ? !resource.useParentForm && resource.assistant
            : resource.assistant) && !resource.useTechAdaptorForm;
}

export function isEbayFinanceConnection(connection) {
  return connection?.assistant === 'ebayfinance';
}

export function getConnectorId(legacyId, name) {
  return legacyId || name?.toLowerCase().replace(/\.|\s/g, '');
}

export function getPublishedConnectorName(httpConnectorId) {
  const publishedConnectors = getPublishedHttpConnectors();
  const publishedConnector = publishedConnectors?.find(pc => pc._id === httpConnectorId);

  return getConnectorId(publishedConnector?.legacyId, publishedConnector?.name);
}

export function getPublishedConnectorId(application) {
  const publishedConnectors = getPublishedHttpConnectors();

  return publishedConnectors?.find(pc => getConnectorId(pc.legacyId, pc.name) === application)?._id;
}
