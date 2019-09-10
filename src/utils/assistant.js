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
  'delta',
  'errorMediaType',
  'headers',
  'paging',
  'queryParameters',
  'successMediaType',
  'successPath',
]);

export const SEARCH_PARAMETER_TYPES = Object.freeze({
  QUERY: 'query',
  BODY: 'body',
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
  return assign({ ...headers }, { ...overwrites });
}

export function mergeQueryParameters(queryParameters = [], overwrites = []) {
  return unionBy(overwrites, queryParameters, 'id');
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

  if (versionDetails && versionDetails.version) {
    versionDetails = { ...versionDetails };
    OVERWRITABLE_PROPERTIES.forEach(prop => {
      if (['headers', 'queryParameters'].includes(prop)) {
        if (Object.prototype.hasOwnProperty.call(assistantData, prop)) {
          if (prop === 'headers') {
            versionDetails[prop] = mergeHeaders(
              assistantData[prop],
              versionDetails[prop]
            );
          } else if (prop === 'queryParameters') {
            versionDetails[prop] = mergeQueryParameters(
              assistantData[prop],
              versionDetails[prop]
            );
          }
        }
      } else if (
        !Object.prototype.hasOwnProperty.call(versionDetails, prop) &&
        Object.prototype.hasOwnProperty.call(assistantData, prop)
      ) {
        versionDetails[prop] = assistantData[prop];
      }
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
      OVERWRITABLE_PROPERTIES.forEach(prop => {
        if (['headers', 'paging', 'queryParameters'].includes(prop)) {
          if (Object.prototype.hasOwnProperty.call(versionDetails, prop)) {
            if (prop === 'headers') {
              resourceDetails[prop] = mergeHeaders(
                versionDetails[prop],
                resourceDetails[prop]
              );
            } else if (prop === 'queryParameters') {
              resourceDetails[prop] = mergeQueryParameters(
                versionDetails[prop],
                resourceDetails[prop]
              );
            } else if (
              prop === 'paging' &&
              !resourceDetails.doesNotSupportPaging &&
              !Object.prototype.hasOwnProperty.call(resourceDetails, prop)
            ) {
              resourceDetails[prop] = versionDetails[prop];
            }
          }
        } else if (
          !Object.prototype.hasOwnProperty.call(resourceDetails, prop) &&
          Object.prototype.hasOwnProperty.call(versionDetails, prop)
        ) {
          resourceDetails[prop] = versionDetails[prop];
        }
      });
    }
  }

  return resourceDetails;
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
      OVERWRITABLE_PROPERTIES.forEach(prop => {
        if (['delta', 'headers', 'paging', 'queryParameters'].includes(prop)) {
          if (Object.prototype.hasOwnProperty.call(resourceDetails, prop)) {
            if (prop === 'headers') {
              operationDetails[prop] = mergeHeaders(
                resourceDetails[prop],
                operationDetails[prop]
              );
            } else if (prop === 'queryParameters') {
              operationDetails[prop] = mergeQueryParameters(
                resourceDetails[prop],
                operationDetails[prop]
              );
            } else if (
              prop === 'paging' &&
              !operationDetails.doesNotSupportPaging &&
              !Object.prototype.hasOwnProperty.call(operationDetails, prop)
            ) {
              operationDetails[prop] = resourceDetails[prop];
            } else if (
              prop === 'delta' &&
              (operationDetails.supportedExportTypes &&
                operationDetails.supportedExportTypes.includes('delta')) &&
              !Object.prototype.hasOwnProperty.call(operationDetails, prop)
            ) {
              operationDetails[prop] = resourceDetails[prop];
            }
          }
        } else if (
          !Object.prototype.hasOwnProperty.call(operationDetails, prop) &&
          Object.prototype.hasOwnProperty.call(resourceDetails, prop)
        ) {
          operationDetails[prop] = resourceDetails[prop];
        }
      });
    }
  }

  return {
    paging: {},
    queryParameters: [],
    pathParameters: [],
    headers: [],
    ...operationDetails,
  };
}

export function convertFromExport({ resourceDoc, assistantData, adaptorType }) {
  const exportResource = { ...resourceDoc };
  let { version, resource, operation } = exportResource.assistantMetadata || {};
  const { exportType } = exportResource.assistantMetadata || {};
  const assistantMetadata = {
    pathParams: {},
    queryParams: {},
    bodyParams: {},
    exportType,
  };

  if (!assistantMetadata.exportType && resourceDoc) {
    assistantMetadata.exportType = resourceDoc.type;
  }

  if (!resource || !operation) {
    if (
      exportResource &&
      exportResource[adaptorType] &&
      exportResource[adaptorType].relativeURI
    ) {
      const urlMatch = getMatchingRoute(
        assistantData.export.urlResolution,
        exportResource[adaptorType].relativeURI
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

  if (!exportResource[adaptorType]) {
    exportResource[adaptorType] = {};
  }

  const exportAdaptorSubSchema = exportResource[adaptorType];
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
      if (exportResource.assistant === 'expensify') {
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

export function convertToExport({ assistantConfig }) {
  const {
    adaptorType,
    assistant,
    version,
    resource,
    operation,
    pathParams,
    queryParams,
    bodyParams,
    assistantData,
  } = assistantConfig;
  const operationDetails = getExportOperationDetails({
    version,
    resource,
    operation,
    assistantData,
  });
  const exportDefaults = {
    rest: {
      resourcePath: operationDetails.resourcePath,
      successPath: operationDetails.successPath,
      allowUndefinedResource: operationDetails.allowUndefinedResource,
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
    http: {
      successMediaType: operationDetails.successMediaType,
      errorMediaType: operationDetails.errorMediaType,
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
  };
  const exportDoc = {
    method: operationDetails.method || 'GET',
    relativeURI: undefined,
    headers: [],
    ...exportDefaults[adaptorType],
  };

  Object.keys(operationDetails.response || {}).forEach(
    prop => (exportDoc.response[prop] = operationDetails.response[prop])
  );

  Object.keys(operationDetails.paging || {}).forEach(prop => {
    if (adaptorType === 'rest') {
      exportDoc[prop] = operationDetails.paging[prop];
    } else {
      exportDoc.paging[prop] = operationDetails.paging[prop];
    }
  });

  let { url: relativeURI } = { ...operationDetails };

  operationDetails.pathParameters.forEach(pathParam => {
    if (pathParams) {
      let pathParamValue = pathParams[pathParam.id];

      if (pathParamValue && pathParam.config) {
        if (pathParam.config.prefix) {
          pathParamValue = pathParam.config + pathParamValue;
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

  const assistantMetadata = { version, resource };

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

      if (fieldMeta.paramType === SEARCH_PARAMETER_TYPES.QUERY) {
        if (fieldMeta.inputType === 'multiselect' && !isArray(paramValue)) {
          // wrap item inside array as multiselect expects item by default an array @BugFix : 8896
          paramValue = [paramValue];
        }
      } else if (fieldMeta.paramType === SEARCH_PARAMETER_TYPES.BODY) {
        if (fieldMeta.inputType === 'select' && isArray(paramValue)) {
          [paramValue] = paramValue;
        }
      }
    } else if (fieldMeta.paramType === SEARCH_PARAMETER_TYPES.QUERY) {
      if (fieldMeta.id.indexOf('[') > 0) {
        const prefix = fieldMeta.id.substr(0, fieldMeta.id.indexOf('['));

        if (Object.prototype.hasOwnProperty.call(values, prefix)) {
          paramValue =
            values[prefix][fieldMeta.id.substr(fieldMeta.id.indexOf('['))];
        }
      }
    } else if (fieldMeta.paramType === SEARCH_PARAMETER_TYPES.BODY) {
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

export function convertToReactFormFields({
  fieldMeta = [],
  defaultValuesForDeltaExport = {},
  value = {},
  paramsType,
}) {
  const fields = [];
  const fieldDetailsMap = {};
  const actualFieldIdToGeneratedFieldIdMap = {};
  const paramValues = { ...value };

  fieldMeta.forEach(field => {
    if (field.readOnly) {
      return true;
    }

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
      type: field.type,
      indexed: field.indexed,
    };

    if (fieldType === 'integer') {
      fieldDetailsMap[fieldId].type = 'integer';
    }

    if (fieldType === 'input') {
      fieldType = 'text';
    }

    if (
      !['multiselect', 'select', 'text', 'textarea', 'checkbox'].includes(
        fieldType
      )
    ) {
      fieldType = 'text';
    }

    fieldDetailsMap[fieldId].inputType = fieldType;
  });

  fieldMeta.forEach(field => {
    if (field.readOnly) {
      return true;
    }

    const fieldId = actualFieldIdToGeneratedFieldIdMap[field.id];
    const { inputType, type } = fieldDetailsMap[fieldId];
    const paramValue = getParamValue({
      fieldMeta: { id: field.id, inputType, paramType: paramsType },
      values: paramValues,
    });
    let { defaultValue } = field;

    if (
      paramValue === undefined &&
      Object.prototype.hasOwnProperty.call(
        defaultValuesForDeltaExport,
        field.id
      )
    ) {
      defaultValue = defaultValuesForDeltaExport[field.id];
    }

    const fieldDef = {
      id: fieldId,
      name: fieldId,
      label: field.name,
      type: inputType,
      required: !!field.required,
      placeholder: field.placeholder,
      defaultValue:
        getParamValue({
          fieldMeta: { id: field.id, inputType, paramType: paramsType },
          values: paramValues,
        }) || defaultValue,
      options: [
        {
          items: field.options
            ? field.options.map(opt => ({
                label: opt,
                value: opt,
              }))
            : [],
        },
      ],
      helpText: field.description,
    };

    if (type === 'integer' || field.id === 'per_page') {
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

  if (requiredFields.length > 0 && optionalFields.length > 0) {
    return {
      fields: requiredFields,
      fieldSets: [
        {
          header: 'Optional',
          collapsed: true,
          fields: optionalFields,
        },
      ],
      fieldDetailsMap,
    };
  }

  return {
    fields: requiredFields.length > 0 ? requiredFields : optionalFields,
    fieldDetailsMap,
  };
}

export function updateFormValues({ formValues, fieldDetailsMap, paramsType }) {
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

  if (paramsType === SEARCH_PARAMETER_TYPES.BODY) {
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
