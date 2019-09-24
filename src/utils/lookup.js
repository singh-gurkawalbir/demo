import { adaptorTypeMap } from './resource';

export default {
  getLookupFromResource: (resourceObj, appType) => {
    if (!resourceObj) {
      return;
    }

    /* TODO: With support for different application being adding up, 
    path for lookup to be updated below */
    switch (appType) {
      case adaptorTypeMap.NetSuiteDistributedImport:
        return resourceObj.netsuite_da && resourceObj.netsuite_da.lookups;
      case adaptorTypeMap.RESTImport:
        return resourceObj.rest && resourceObj.rest.lookups;
      case adaptorTypeMap.XMLImport:
      case adaptorTypeMap.FTPImport:
      case adaptorTypeMap.HTTPImport:
      case adaptorTypeMap.MongodbImport:
      case adaptorTypeMap.S3Import:
      case adaptorTypeMap.WrapperImport:
      case adaptorTypeMap.AS2Import:
      case adaptorTypeMap.RDBMSImport:
      case adaptorTypeMap.SalesforceImport:
      default:
    }
  },
  getLookupPath: application => {
    switch (application) {
      case adaptorTypeMap.RESTImport:
        return '/rest/lookups';
      case adaptorTypeMap.NetSuiteDistributedImport:
        // TODO
        return '';
      case adaptorTypeMap.XMLImport:
      case adaptorTypeMap.FTPImport:
      case adaptorTypeMap.HTTPImport:
      case adaptorTypeMap.MongodbImport:
      case adaptorTypeMap.S3Import:
      case adaptorTypeMap.WrapperImport:
      case adaptorTypeMap.AS2Import:
      case adaptorTypeMap.RDBMSImport:
      case adaptorTypeMap.SalesforceImport:
      default:
    }
  },
};
