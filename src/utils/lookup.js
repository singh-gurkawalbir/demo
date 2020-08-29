import deepClone from 'lodash/cloneDeep';
import { adaptorTypeMap } from './resource';

export default {
  getLookupFromResource: (resourceObj = {}) => {
    if (!resourceObj) {
      return;
    }

    const { adaptorType } = resourceObj;
    let lookup;

    /* TODO: With support for different application being adding up,
    path for lookup to be updated below */
    switch (adaptorTypeMap[adaptorType]) {
      case adaptorTypeMap.NetSuiteDistributedImport:
        lookup = resourceObj.netsuite_da && resourceObj.netsuite_da.lookups;
        break;
      case adaptorTypeMap.RESTImport:
        lookup = resourceObj.rest && resourceObj.rest.lookups;
        break;
      case adaptorTypeMap.FTPImport:
      case adaptorTypeMap.S3Import:
      case adaptorTypeMap.AS2Import:
        lookup = resourceObj.file && resourceObj.file.lookups;
        break;
      case adaptorTypeMap.WrapperImport:
        lookup = resourceObj.wrapper && resourceObj.wrapper.lookups;
        break;
      case adaptorTypeMap.HTTPImport:
        lookup = resourceObj.http && resourceObj.http.lookups;
        break;
      case adaptorTypeMap.SalesforceImport:
        lookup = resourceObj.salesforce && resourceObj.salesforce.lookups;
        break;
      case adaptorTypeMap.XMLImport:
      case adaptorTypeMap.MongodbImport:
      case adaptorTypeMap.DynamodbImport:
      case adaptorTypeMap.RDBMSImport:
      default:
    }

    // returning deep cloned lookup object to avoid resource object manipulation
    return deepClone(lookup);
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
      case adaptorTypeMap.RDBMSImport:
        return '/rdbms/lookups';
      case adaptorTypeMap.XMLImport:
      case adaptorTypeMap.MongodbImport:
      default:
    }
  },
  getLookupFieldId(adaptorType) {
    const lookupPath = this.getLookupPath(adaptorTypeMap[adaptorType]);
    const lookupFieldId = lookupPath && lookupPath.substr(1).replace('/', '.');

    return lookupFieldId;
  },
  getLookupFromFormContext(formContext, adaptorType) {
    const lookupFieldId = this.getLookupFieldId(adaptorType);

    if (!formContext || !formContext.fields) return [];
    const lookupField = Object.values(formContext.fields).find(
      field => field.id === lookupFieldId
    );

    return (lookupField && lookupField.value) || [];
  },
};
