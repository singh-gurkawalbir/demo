import qs from 'qs';
import { isObject, isString, cloneDeep, isEmpty, defaultsDeep } from 'lodash';

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

export function mergeHeaders(headers1 = {}, headers2 = {}) {
  const mergedHeaders = {};

  Object.keys(headers1).forEach(key => (mergedHeaders[key] = headers1[key]));

  Object.keys(headers2).forEach(key => {
    if (!Object.prototype.hasOwnProperty.call(mergedHeaders, key)) {
      mergedHeaders[key] = headers2[key];
    }
  });

  return mergedHeaders;
}

export function mergeArrays(arr1 = [], arr2 = []) {
  const mergedArray = [];

  arr1.forEach(elem => mergedArray.push(elem));

  arr2.forEach(elem => {
    if (!arr1.find(e => elem.id === e.id)) {
      mergedArray.push(elem);
    }
  });

  return mergedArray;
}

export function getExportVersionAndResourceFromOperation(
  operation,
  assistantData
) {
  const toReturn = {};

  assistantData.export.versions.forEach(version => {
    version.resources.forEach(resource => {
      const ep = resource.endpoints.find(
        ep => ep.id === operation || ep.url === operation
      );

      if (ep) {
        toReturn.version = version.version;
        toReturn.resource = resource.id;
      }
    });
  });

  return toReturn;
}

export function getVersionDetails(version, assistantData) {
  let versionDetails = {};

  if (version) {
    versionDetails = assistantData.versions.find(v => v.version === version);
  } else if (assistantData.versions.length === 1) {
    [versionDetails] = assistantData.versions;
  }

  if (versionDetails) {
    ['paging', 'successPath', 'allowUndefinedResource', 'delta'].forEach(
      prop => {
        if (!versionDetails[prop]) {
          versionDetails[prop] = assistantData[prop];
        }
      }
    );
  }

  versionDetails.headers = mergeHeaders(
    versionDetails.headers,
    assistantData.headers
  );

  versionDetails.queryParameters = mergeArrays(
    versionDetails.queryParameters,
    assistantData.queryParameters
  );

  return { ...versionDetails };
}

export function getExportResourceDetails(version, resource, assistantData) {
  let resourceDetails = {};
  const versionDetails = getVersionDetails(version, assistantData.export);

  if (versionDetails && versionDetails.resources) {
    resourceDetails = versionDetails.resources.find(r => r.id === resource);

    if (resourceDetails) {
      if (!resourceDetails.paging && !resourceDetails.doesNotSupportPaging) {
        if (versionDetails.paging) {
          resourceDetails.paging = versionDetails.paging;
        }
      }

      if (
        !Object.prototype.hasOwnProperty.call(
          resourceDetails,
          'allowUndefinedResource'
        )
      ) {
        if (versionDetails.allowUndefinedResource) {
          resourceDetails.allowUndefinedResource =
            versionDetails.allowUndefinedResource;
        }
      }

      ['successPath', 'delta'].forEach(prop => {
        if (!resourceDetails[prop]) {
          if (versionDetails[prop]) {
            resourceDetails[prop] = versionDetails[prop];
          }
        }
      });

      resourceDetails.headers = mergeHeaders(
        resourceDetails.headers,
        versionDetails.headers
      );

      resourceDetails.queryParameters = mergeArrays(
        resourceDetails.queryParameters,
        versionDetails.queryParameters
      );
    }
  }

  return resourceDetails;
}

export function getExportOperationDetails(
  version,
  resource,
  operation,
  assistantData
) {
  const resourceDetails = getExportResourceDetails(
    version,
    resource,
    assistantData
  );
  let operationDetails = {};

  if (resourceDetails && resourceDetails.endpoints) {
    operationDetails = resourceDetails.endpoints.find(
      op => op.id === operation || op.url === operation
    );

    if (operationDetails) {
      if (!operationDetails.paging && !operationDetails.doesNotSupportPaging) {
        if (resourceDetails.paging) {
          operationDetails.paging = resourceDetails.paging;
        }
      }

      if (
        !operationDetails.successPath &&
        !Object.prototype.hasOwnProperty.call(operationDetails, 'successPath')
      ) {
        if (resourceDetails.successPath) {
          operationDetails.successPath = resourceDetails.successPath;
        }
      }

      if (
        !operationDetails.allowUndefinedResource &&
        !Object.prototype.hasOwnProperty.call(
          operationDetails,
          'allowUndefinedResource'
        )
      ) {
        if (resourceDetails.allowUndefinedResource) {
          operationDetails.allowUndefinedResource =
            resourceDetails.allowUndefinedResource;
        }
      }

      if (
        !operationDetails.delta &&
        !Object.prototype.hasOwnProperty.call(operationDetails, 'delta') &&
        operationDetails.supportedExportTypes &&
        operationDetails.supportedExportTypes.includes('delta')
      ) {
        if (resourceDetails.delta) {
          operationDetails.delta = resourceDetails.delta;
        }
      }

      operationDetails.headers = mergeHeaders(
        operationDetails.headers,
        resourceDetails.headers
      );

      operationDetails.queryParameters = mergeArrays(
        operationDetails.queryParameters,
        resourceDetails.queryParameters
      );
    }
  }

  return operationDetails;
}

export function convertFromRestExport(exportDoc, assistantData) {
  let { version, resource, operation } = exportDoc.assistantMetadata || {};

  if (!resource || !operation) {
    if (exportDoc && exportDoc.rest && exportDoc.rest.relativeURI) {
      const urlMatch = getMatchingRoute(
        assistantData.export.urlResolution,
        exportDoc.rest.relativeURI
      );

      if (!operation) {
        operation = urlMatch.urlMatch;
      }

      console.log(`****** urlMatch ${JSON.stringify(urlMatch)}`);
      const versionAndResource = getExportVersionAndResourceFromOperation(
        urlMatch.urlMatch,
        assistantData
      );

      ({ version, resource } = versionAndResource);
    }
  }

  if (!operation) {
    return {
      version,
      resource,
      operation,
      pathParams: {},
      queryParams: {},
      bodyParams: {},
    };
  }

  const endpoint = getExportOperationDetails(
    version,
    resource,
    operation,
    assistantData
  );

  if (!endpoint || !endpoint.url) {
    return {
      version,
      resource,
      operation,
      pathParams: {},
      queryParams: {},
      bodyParams: {},
    };
  }

  console.log(`endpoint ${JSON.stringify(endpoint)}`);

  if (!exportDoc.rest) {
    exportDoc.rest = {};
  }

  const urlMatch = getMatchingRoute(
    [endpoint.url],
    exportDoc.rest.relativeURI || ''
  );

  console.log(`urlMatch ${JSON.stringify(urlMatch)}`);
  const pathParams = {};
  let queryParams = {};
  let bodyParams = {};

  if (endpoint.pathParameters && endpoint.pathParameters.length > 0) {
    endpoint.pathParameters.forEach((p, index) => {
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
    exportDoc.rest.relativeURI &&
    exportDoc.rest.relativeURI.indexOf('?') > 0
  ) {
    if (urlMatch.urlParts && urlMatch.urlParts[urlMatch.urlParts.length - 1]) {
      queryParams = qs.parse(urlMatch.urlParts[urlMatch.urlParts.length - 1], {
        delimiter: /[?&]/,
        depth: 0,
      }); /* depth should be 0 to handle IO-1683 */
    }
  }

  if (exportDoc.rest.postBody) {
    if (isObject(exportDoc.rest.postBody)) {
      bodyParams = cloneDeep(exportDoc.rest.postBody);
    } else if (isString(exportDoc.rest.postBody)) {
      if (exportDoc.assistant === 'expensify') {
        bodyParams = exportDoc.rest.postBody.replace(
          'requestJobDescription=',
          ''
        );
        bodyParams = JSON.parse(bodyParams);
      } else {
        bodyParams = exportDoc.rest.postBody;
      }
    }
  }

  if (!operation) {
    operation = endpoint.id || endpoint.url;
  }

  return {
    version,
    resource,
    operation,
    endpoint,
    pathParams,
    queryParams,
    bodyParams,
  };
}

export function convertToRestExport(assistantMetadata) {
  const {
    assistant,
    version,
    resource,
    operation,
    pathParams,
    queryParams,
    bodyParams,
    assistantData,
  } = assistantMetadata;
  const operationDetails = getExportOperationDetails(
    version,
    resource,
    operation,
    assistantData
  );
  const restExport = {
    method: operationDetails.method || 'GET',
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
    headers: [],
  };

  Object.keys(operationDetails.paging).forEach(
    prop => (restExport[prop] = operationDetails.paging[prop])
  );

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
      allQueryParams[queryParam.id] = queryParams[queryParam.id];
    }

    if (
      allQueryParams[queryParam.id] &&
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

  restExport.relativeURI = relativeURI;

  if (['POST', 'PUT'].includes(restExport.method)) {
    if (!isEmpty(bodyParams)) {
      restExport.postBody = defaultsDeep(
        cloneDeep(operationDetails.postBody),
        bodyParams
      );

      if (operationDetails.postBodyParamsOrder) {
        // IO-4570
        restExport.postBody = JSON.parse(
          JSON.stringify(
            restExport.postBody,
            operationDetails.postBodyParamsOrder
          )
        );
      }
    } else if (operationDetails.postBody) {
      restExport.postBody = cloneDeep(operationDetails.postBody);
    } else {
      restExport.postBody = queryParams;
    }

    if (restExport.postBody) {
      if (isString(restExport.postBody)) {
        if (restExport.postBody.includes('lastExportDateTime')) {
          exportType = 'delta';
        }
      } else if (isObject(restExport.postBody)) {
        if (
          JSON.stringify(restExport.postBody).includes('lastExportDateTime')
        ) {
          exportType = 'delta';
        }
      }

      if (assistant === 'expensify') {
        restExport.postBody = `requestJobDescription=${JSON.stringify(
          restExport.postBody
        )}`;
      }
    }
  }

  Object.keys(operationDetails.headers).forEach(headerName => {
    if (operationDetails.headers[headerName] !== null) {
      restExport.headers.push({
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
    assistantMetadata.exportType &&
    ['delta', 'test'].includes(assistantMetadata.exportType)
  ) {
    ({ exportType } = assistantMetadata);
  }

  const deltaConfig = {};

  if (exportType === 'delta' && operationDetails.delta) {
    ['dateFormat', 'lagOffset'].forEach(v => {
      if (operationDetails.delta[v]) {
        deltaConfig[v] = operationDetails.delta[v];
      }
    });
  }

  if (operationDetails.mergePostBodyToPagingPostBody && restExport.postBody) {
    // IO-7630
    restExport.pagingPostBody = defaultsDeep(
      restExport.pagingPostBody || {},
      restExport.postBody
    );
  }

  return {
    '/rest': restExport,
    '/type': exportType || undefined,
    '/delta': !isEmpty(deltaConfig) ? deltaConfig : undefined,
    '/assistant': assistant,
  };
}
