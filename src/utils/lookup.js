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
      case adaptorTypeMap.FTPImport:
      case adaptorTypeMap.S3Import:
      case adaptorTypeMap.AS2Import:
        return resourceObj.file && resourceObj.file.lookups;
      case adaptorTypeMap.WrapperImport:
        return resourceObj.wrapper && resourceObj.wrapper.lookups;
      case adaptorTypeMap.HTTPImport:
        return resourceObj.http && resourceObj.http.lookups;
      case adaptorTypeMap.SalesforceImport:
        return resourceObj.salesforce && resourceObj.salesforce.lookups;
      case adaptorTypeMap.XMLImport:
      case adaptorTypeMap.MongodbImport:
      case adaptorTypeMap.RDBMSImport:
      default:
    }
  },
  getLookupPath: application => {
    switch (application) {
      case adaptorTypeMap.RESTImport:
        return '/rest/lookups';
      case adaptorTypeMap.NetSuiteDistributedImport:
        return '/netsuite_da/lookups';
      case adaptorTypeMap.AS2Import:
      case adaptorTypeMap.S3Import:
      case adaptorTypeMap.FTPImport:
        return '/file/lookups';
      case adaptorTypeMap.WrapperImport:
        return '/wrapper/lookups';
      case adaptorTypeMap.HTTPImport:
        return '/http/lookups';
      case adaptorTypeMap.SalesforceImport:
        return '/salesforce/lookups';
      case adaptorTypeMap.XMLImport:
      case adaptorTypeMap.MongodbImport:
      case adaptorTypeMap.RDBMSImport:
      default:
    }
  },
};
