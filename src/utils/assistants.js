import qs from 'qs';
import { isObject, isString, cloneDeep } from 'lodash';

export function routeToRegExp(route) {
  const optionalParam = /\((.*?)\)/g;
  const namedParam = /(\(\?)?:\w+/g;
  const splatParam = /\*\w+/g;
  const escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
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

export function getExportVersionAndResourceFromOperation(
  operation,
  assistantData
) {
  const toReturn = {};

  assistantData.export.version.forEach(version => {
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

export function getExportVersionDetails(version, assistantData) {
  let versionDetails = {};

  if (version) {
    versionDetails = assistantData.export.versions.find(
      v => v.version === version
    );
  } else if (assistantData.export.versions.length === 1) {
    [versionDetails] = assistantData.export.versions;
  }

  return versionDetails;
}

export function getExportResourceDetails(version, resource, assistantData) {
  let resourceDetails = {};
  const versionDetails = getExportVersionDetails(version, assistantData);

  if (versionDetails) {
    resourceDetails = versionDetails.resources.find(r => r.id === resource);
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

  if (resourceDetails) {
    operationDetails = resourceDetails.endpoints.find(
      op => op.id === operation || op.url === operation
    );
  }

  return operationDetails;
}

export function convertFromRestExport(exportDoc, assistantData) {
  console.log(`in convertFromRestExport`);
  console.log(`${JSON.stringify(exportDoc)}`);
  console.log(`${JSON.stringify(assistantData)}`);
  let { version, resource, operation } = exportDoc.assistantMetadata || {};

  if (!resource || !operation) {
    const urlMatch = getMatchingRoute(
      assistantData.urlResolution,
      exportDoc.rest.relativeURI
    );
    const versionAndResource = getExportVersionAndResourceFromOperation(
      urlMatch.url,
      assistantData
    );

    ({ version, resource } = versionAndResource);
  }

  const endpoint = getExportOperationDetails(
    version,
    resource,
    operation,
    assistantData
  );
  const urlMatch = getMatchingRoute([endpoint.url], exportDoc.rest.relativeURI);

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

  if (exportDoc.rest.relativeURI.indexOf('?') > 0) {
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

  return {
    version,
    resource,
    endpoint,
    pathParams,
    queryParams,
    bodyParams,
  };
}
