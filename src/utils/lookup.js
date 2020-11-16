import deepClone from 'lodash/cloneDeep';

export default {
  getLookupFromResource: (resourceObj = {}) => {
    if (!resourceObj) {
      return;
    }

    const { adaptorType } = resourceObj;
    let lookup;

    /* TODO: With support for different application being adding up,
    path for lookup to be updated below */
    switch (adaptorType) {
      case 'NetSuiteImport':
        lookup = resourceObj.netsuite && resourceObj.netsuite.lookups;
        break;
      case 'NetSuiteDistributedImport':
        lookup = resourceObj.netsuite_da && resourceObj.netsuite_da.lookups;
        break;
      case 'RESTImport':
        lookup = resourceObj.rest && resourceObj.rest.lookups;
        break;
      case 'FTPImport':
      case 'S3Import':
      case 'AS2Import':
        lookup = resourceObj.file && resourceObj.file.lookups;
        break;
      case 'WrapperImport':
        lookup = resourceObj.wrapper && resourceObj.wrapper.lookups;
        break;
      case 'HTTPImport':
        lookup = resourceObj.http && resourceObj.http.lookups;
        break;
      case 'SalesforceImport':
        lookup = resourceObj.salesforce && resourceObj.salesforce.lookups;
        break;
      default:
    }

    // returning deep cloned lookup object to avoid resource object manipulation
    return deepClone(lookup);
  },
  getLookupPath: adaptorType => {
    switch (adaptorType) {
      case 'RESTImport':
        return '/rest/lookups';
      case 'NetSuiteDistributedImport':
        return '/netsuite_da/lookups';
      case 'NetSuiteImport':
        return '/netsuite/lookups';
      case 'AS2Import':
      case 'S3Import':
      case 'FTPImport':
        return '/file/lookups';
      case 'WrapperImport':
        return '/wrapper/lookups';
      case 'HTTPImport':
        return '/http/lookups';
      case 'SalesforceImport':
        return '/salesforce/lookups';
      case 'RDBMSImport':
        return '/rdbms/lookups';
      default:
    }
  },
  getLookupFieldId(adaptorType) {
    const lookupPath = this.getLookupPath(adaptorType);
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
