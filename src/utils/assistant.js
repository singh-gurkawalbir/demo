import qs from 'qs';
import {
  isObject,
  isString,
  cloneDeep,
  isEmpty,
  defaultsDeep,
  isNaN,
  last,
  each,
  isArray,
  assign,
  unionBy,
} from 'lodash';

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
    },
  },
});

export function routeToRegExp(route) {
  const optionalParam = /\((.*?)\)/g;
  const namedParam = /(\(\?)?:\w+/g;
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

export function extractParameters(route, fragment) {
  const params = route.exec(fragment).slice(1);

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
      urlParts = extractParameters(regexpRoute, url);
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

export function populateDefaults({
  child = {},
  parent = {},
  isChildAnOperation = false,
}) {
  const childWithDefaults = { ...child };

  if (isArray(childWithDefaults.headers)) {
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
      }
    });
  });

  return versionAndResource;
}

export function getImportVersionAndResource({
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
    versionDetails = assistantData.versions.find(v => v.version === version);
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

  return { ...resourceDetails };
}

export function getExportOperationDetails({
  version,
  resource,
  operation,
  assistantData = {},
}) {
  const resourceDetails = getResourceDetails({
    version,
    resource,
    assistantData: assistantData.export,
  });
  let operationDetails = {};

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

  return cloneDeep({
    queryParameters: [],
    pathParameters: [],
    headers: {},
    ...operationDetails,
  });
}

export function getImportOperationDetails({
  version,
  resource,
  operation,
  assistantData = {},
}) {
  const resourceDetails = getResourceDetails({
    version,
    resource,
    assistantData: assistantData.import,
  });
  let operationDetails = { sampleData: resourceDetails.sampleData };

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
          resource,
          operation:
            operationDetails.howToFindIdentifier.lookup.id ||
            operationDetails.howToFindIdentifier.lookup.url,
          assistantData,
        });

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

  return cloneDeep({
    queryParameters: [],
    pathParameters: [],
    headers: {},
    ...operationDetails,
  });
}

export function convertFromExport({ exportDoc, assistantData, adaptorType }) {
  let { version, resource, operation } = exportDoc.assistantMetadata || {};
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
  const pathParams = {};
  let queryParams = {};
  let bodyParams = {};

  if (
    operationDetails.pathParameters &&
    operationDetails.pathParameters.length > 0
  ) {
    operationDetails.pathParameters.forEach((p, index) => {
      if (urlMatch && urlMatch.urlParts && urlMatch.urlParts[index]) {
        pathParams[p.id] = urlMatch.urlParts[index];
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
      }
    });
  }

  if (
    exportAdaptorSubSchema.relativeURI &&
    exportAdaptorSubSchema.relativeURI.indexOf('?') > 0
  ) {
    if (urlMatch.urlParts && urlMatch.urlParts[urlMatch.urlParts.length - 1]) {
      queryParams = qs.parse(urlMatch.urlParts[urlMatch.urlParts.length - 1], {
        delimiter: /[?&]/,
        depth: 0,
      }); /* depth should be 0 to handle IO-1683 */
    }
  }

  if (exportAdaptorSubSchema.postBody) {
    if (isObject(exportAdaptorSubSchema.postBody)) {
      bodyParams = cloneDeep(exportAdaptorSubSchema.postBody);
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

export function convertToExport({ assistantConfig, assistantData }) {
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

  if (!assistant || !resource || !operation || !assistantData) {
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
      ...DEFAULT_PROPS.EXPORT.REST,
      resourcePath: operationDetails.resourcePath,
      successPath: operationDetails.successPath,
      allowUndefinedResource: !!operationDetails.allowUndefinedResource,
    },
    http: {
      ...DEFAULT_PROPS.EXPORT.HTTP,
      successMediaType: operationDetails.successMediaType,
      errorMediaType: operationDetails.errorMediaType,
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
      prop => (exportDoc.response[prop] = operationDetails.response[prop])
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

  operationDetails.pathParameters.forEach(pathParam => {
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
    }
  });

  let exportType;
  const allQueryParams = {};

  operationDetails.queryParameters.forEach(queryParam => {
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
  const queryString = qs.stringify(allQueryParams, {
    encode: false,
    indices: false,
  }); /* indices should be false to handle IO-1776 */

  if (queryString) {
    relativeURI += (relativeURI.includes('?') ? '&' : '?') + queryString;
  }

  exportDoc.relativeURI = relativeURI;

  if (['POST', 'PUT'].includes(exportDoc.method)) {
    if (!isEmpty(bodyParams)) {
      exportDoc.postBody = defaultsDeep(
        cloneDeep(operationDetails.postBody),
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
      exportDoc.postBody = cloneDeep(operationDetails.postBody);
    } else {
      exportDoc.postBody = queryParams;
    }

    if (exportDoc.postBody) {
      if (isString(exportDoc.postBody)) {
        if (exportDoc.postBody.includes('lastExportDateTime')) {
          exportType = 'delta';
        }
      } else if (isObject(exportDoc.postBody)) {
        if (JSON.stringify(exportDoc.postBody).includes('lastExportDateTime')) {
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

  Object.keys(operationDetails.headers).forEach(headerName => {
    if (operationDetails.headers[headerName] !== null) {
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
  const testConfig = {};

  if (exportType === 'delta' && operationDetails.delta) {
    ['dateFormat', 'lagOffset'].forEach(v => {
      if (operationDetails.delta[v]) {
        deltaConfig[v] = operationDetails.delta[v];
      }
    });
  } else if (exportType === 'test') {
    testConfig.limit = 1;
  }

  if (operationDetails.mergePostBodyToPagingPostBody && exportDoc.postBody) {
    // IO-7630
    exportDoc.pagingPostBody = defaultsDeep(
      exportDoc.pagingPostBody || {},
      exportDoc.postBody
    );
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
    '/type': exportType || undefined,
    '/delta': !isEmpty(deltaConfig) ? deltaConfig : undefined,
    '/test': !isEmpty(testConfig) ? testConfig : undefined,
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

export function convertToReactFormFields({ paramMeta = {}, value = {} }) {
  const fields = [];
  const fieldDetailsMap = {};
  const actualFieldIdToGeneratedFieldIdMap = {};
  const paramValues = { ...value };
  const anyParamValuesSet = isEmpty(paramValues);

  paramMeta.fields &&
    paramMeta.fields.forEach(field => {
      // if (field.readOnly) {
      //   return true;
      // }

      if (field.type === 'repeat' && field.indexed) {
        const fieldValue = [];

        each(value, (v, k) => {
          if (
            k &&
            k.startsWith(field.id) &&
            k.split('.').length > 1 &&
            !isNaN(parseInt(last(k.split('.')), 10))
          ) {
            fieldValue.push(v);
          }
        });
        paramValues[field.id] = fieldValue;
      }

      /** There are some issues with forms processor if field id/name contains special chars like . and [] */
      const fieldId = generateValidReactFormFieldId(field.id);

      actualFieldIdToGeneratedFieldIdMap[field.id] = fieldId;

      let { fieldType } = field;

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

      if (
        !['checkbox', 'multiselect', 'select', 'text', 'textarea'].includes(
          fieldType
        )
      ) {
        fieldType = 'text';
      }

      fieldDetailsMap[fieldId].inputType = fieldType;
    });

  paramMeta.fields &&
    paramMeta.fields.forEach(field => {
      // if (field.readOnly) {
      //   return true;
      // }

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
      let { defaultValue } = anyParamValuesSet ? field : {};

      if (
        anyParamValuesSet &&
        paramValue === undefined &&
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

      if (['multiselect', 'select'].includes(fieldDef.type)) {
        fieldDef.options = [
          {
            items: field.options
              ? field.options.map(opt => ({
                  label: opt,
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
        // IO-1776
        if (value && !isArray(value)) {
          value = value.split(',');
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

export function convertFromImport({ importDoc, assistantData, adaptorType }) {
  let { version, resource, operation, lookupType } =
    importDoc.assistantMetadata || {};
  const { dontConvert } = importDoc.assistantMetadata || {};
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
    }
  }

  assistantMetadata.version = version;
  assistantMetadata.resource = resource;
  assistantMetadata.sampleData = sampleData;
  assistantMetadata.operation = operation;

  if (!operation) {
    return assistantMetadata;
  }

  const operationDetails = getImportOperationDetails({
    version,
    resource,
    operation,
    assistantData,
  });

  if (!operationDetails || !operationDetails.url) {
    return assistantMetadata;
  }

  let howToFindIdentifierLookupConfig = {};

  if (operationDetails && operationDetails.howToFindIdentifier) {
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
  let queryParams = {};
  const bodyParams = {};
  let lookupUrl;
  let lookupQueryParams;

  if (operationDetails.parameters && operationDetails.parameters.length > 0) {
    operationDetails.parameters.forEach((p, index) => {
      if (p.in !== 'query') {
        if (url1Info && url1Info.urlParts && url1Info.urlParts[index]) {
          if (p.isIdentifier) {
            pathParams[p.id] = url1Info.urlParts[index]
              .replace(/{/g, '')
              .replace(/}/g, '')
              .replace('data.0.', '');
          } else {
            pathParams[p.id] = url1Info.urlParts[index];
          }
        } else if (url2Info && url2Info.urlParts && url2Info.urlParts[index]) {
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
      }

      if (p.isIdentifier && pathParams[p.id]) {
        const lookup = importAdaptorSubSchema.lookups.find(
          lu => lu.name === pathParams[p.id]
        );

        if (lookup) {
          lookupType = 'lookup';
          lookupUrl = lookup.relativeURI;
          let lookupUrlInfo;

          if (
            howToFindIdentifierLookupConfig.id &&
            assistantMetadata &&
            assistantMetadata.lookups &&
            assistantMetadata.lookups[pathParams[p.id]]
          ) {
            const luEndpoint = getExportOperationDetails({
              version: assistantMetadata.version,
              resource:
                assistantMetadata.lookups[pathParams[p.id]].resource ||
                assistantMetadata.resource,
              operation: assistantMetadata.lookups[pathParams[p.id]].operation,
              assistantData,
            });

            lookupUrlInfo = getMatchingRoute([luEndpoint.url], lookupUrl);
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
            lookupQueryParams = qs.parse(
              lookupUrlInfo.urlParts[lookupUrlInfo.urlParts.length - 1],
              { delimiter: /[?&]/, depth: 0 }
            ); /* depth should be 0 to handle IO-1683 */
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
    if (url1Info.urlParts && url1Info.urlParts[url1Info.urlParts.length - 1]) {
      queryParams = qs.parse(url1Info.urlParts[url1Info.urlParts.length - 1], {
        delimiter: /[?&]/,
        depth: 0,
      }); /* depth should be 0 to handle IO-1683 */
      url1Info.urlParts.splice(
        url1Info.urlParts.length - 1
      ); /* if there is parameter (path) defined but no place-holder in the url then the pathParameter is being set with the entire query string */
    }
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
  };
}

export function convertToImport({ assistantConfig, assistantData }) {
  const {
    adaptorType = 'http',
    assistant,
    version,
    resource,
    operation,
    pathParams = {},
    lookupType,
    ignoreExisting = false,
    ignoreMissing = false,
  } = assistantConfig;
  let { lookupQueryParams = {} } = assistantConfig;

  if (!assistant || !resource || !operation || !assistantData) {
    return undefined;
  }

  const operationDetails = getImportOperationDetails({
    version,
    resource,
    operation,
    assistantData,
  });
  const importDefaults = {
    rest: {
      ...DEFAULT_PROPS.IMPORT.REST,
    },
    http: {
      ...DEFAULT_PROPS.IMPORT.HTTP,
    },
  };
  const importDoc = {
    ...importDefaults[adaptorType],
    lookups: [],
  };

  if (adaptorType === 'rest') {
    if (isArray(operationDetails.method)) {
      importDoc.method = operationDetails.method;
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
      prop => (importDoc.response[prop] = operationDetails.response[prop])
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

    if (identifiers.length > 0) {
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
        };
      }

      importDoc.ignoreLookupName = luConfig.name;
    }
  }

  if (ignoreExisting) {
    if (identifiers.length > 0) {
      if (lookupType === 'source') {
        importDoc.ignoreExtract = pathParams[identifiers[0].id];
      }
    }
  } else if (
    importDoc.method.length === 2 ||
    lookupType === 'lookup' ||
    ignoreMissing
  ) {
    if (identifiers.length > 0) {
      if (lookupType === 'source') {
        importDoc.ignoreExtract = pathParams[identifiers[0].id];
      } else if (lookupType === 'lookup') {
        pathParams[identifiers[0].id] = identifiers[0].id;
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
          if (importDoc.ignoreLookupName) {
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

    let defaultQueryString = '';

    if (operationDetails.queryParameters) {
      operationDetails.queryParameters.forEach(p => {
        if (defaultQueryString.length > 0) {
          defaultQueryString += '&';
        }

        defaultQueryString += [p.id, p.defaultValue].join('=');
      });
    }

    if (defaultQueryString) {
      importDoc.relativeURI = importDoc.relativeURI.map(
        u => u + (u.indexOf('?') === -1 ? '?' : '&') + defaultQueryString
      );
    }

    if (operationDetails.headers) {
      Object.keys(operationDetails.headers).forEach(h => {
        if (operationDetails.headers[h] !== null) {
          const hv = operationDetails.headers[h].replace(
            /RECORD_IDENTIFIER/gi,
            pathParams[identifiers[0].id] || ''
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
    '/assistant': assistant,
    '/assistantMetadata': assistantMetadata,
    '/ignoreExisting': !!ignoreExisting,
    '/ignoreMissing': !!ignoreMissing,
  };
}
