import getRoutePath from './routePaths';
import { RESOURCE_TYPE_SINGULAR_TO_PLURAL } from '../constants/resource';

/**
 * @param resourceDetails Details about the resource.
 * @param resourceDetails.type The type of the resource.
 * @param resourceDetails.id The id of the resource.
 * @param resourceDetails._integrationId _integrationId of the resource.
 */
export default function getExistingResourcePagePath(resourceDetails = {}) {
  let { type } = resourceDetails;
  const { id, _integrationId } = resourceDetails;
  let path;

  if (type) {
    if (RESOURCE_TYPE_SINGULAR_TO_PLURAL[type]) {
      type = RESOURCE_TYPE_SINGULAR_TO_PLURAL[type];
    }

    const routeMap = {
      accesstokens: 'tokens',
    };

    switch (type) {
      case 'exports':
      case 'imports':
      case 'stacks':
        path = `/${type}/${id}/edit`;
        break;

      case 'accesstokens':
      case 'connections':
        path = `/${routeMap[type] || type}?_id=${id}`;
        break;

      case 'flows':
        path = `/integrations/${_integrationId ||
          'none'}/settings/${type}/${id}/edit`;
        break;

      case 'integrations':
        path = `/${type}/${id}/settings/flows`;
        break;

      default:
        path = undefined;
    }
  }

  return getRoutePath(path);
}

export const adaptorTypeMap = {
  NetSuiteExport: 'netsuite',
  NetSuiteImport: 'netsuite',
  NetSuiteConnection: 'netsuite',
  XMLImport: 'xml',
  XMLExport: 'xml',
  XMLConnection: 'xml',
  FTPExport: 'ftp',
  FTPImport: 'ftp',
  FTPConnection: 'ftp',
  HTTPExport: 'http',
  HTTPImport: 'http',
  HTTPConnection: 'http',
  RESTImport: 'rest',
  RESTExport: 'rest',
  RESTConnection: 'rest',
};

// This method is used for only import/export/connection. Im not sure
// what to call this "class" of resource. It could be confusing to simply
// all this method "getResourceType"
export function getResourceSubType(resource) {
  if (!resource) return;

  const { adaptorType, type, assistant } = resource;

  // connection resource has a type field which indicates sub-type.
  if (type) {
    return { type, assistant };
  }

  // Since this function is intended to be used for only imp/exp/conn,
  // we should have an adaptorType... if now, we cant proceed.
  if (!adaptorType) return;

  return { type: adaptorTypeMap[adaptorType], assistant };
}
