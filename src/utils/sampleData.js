import { isEmpty, each, isArray } from 'lodash';
import moment from 'moment';
import jsonUtil from './json';
import { isFileAdaptor, isBlobTypeResource } from './resource';
import { extractFieldsFromCsv } from './file';
import {
  getFormattedNSSalesOrderMetadataData,
  getFormattedNSCustomerSampleData,
  filterSubListProperties,
  getFormattedSalesForceMetadata,
} from './metadata';
import { getUnionObject, getTransformPaths } from './jsonPaths';

export default function getFormattedSampleData({
  connection,
  sampleData,
  // useSampleDataAsArray,
  resourceType,
  resourceName,
}) {
  const data = {
    connection: {},
  };
  const _sd = sampleData || {
    myField: 'sample',
  };

  data.data = [_sd];

  if (connection) {
    data.connection.name = connection.name;
    const connSubDoc = connection[connection.type];
    const hbSubDoc = {};

    if (connSubDoc) {
      if (connSubDoc.unencrypted && !isEmpty(connSubDoc.unencrypted)) {
        hbSubDoc.unencrypted = connSubDoc.unencrypted;
      }

      if (connSubDoc.encrypted && !isEmpty(connSubDoc.encrypted)) {
        hbSubDoc.encrypted = jsonUtil.maskValues(connSubDoc.encrypted);
      }
    }

    data.connection[connection.type] = hbSubDoc;
  }

  data[resourceType === 'imports' ? 'import' : 'export'] = {
    name: resourceName,
  };

  return data;
}

export function getDefaultData(obj) {
  const _obj = obj;

  Object.keys(_obj).forEach(key => {
    if (typeof _obj[key] === 'object' && _obj[key] !== null) {
      getDefaultData(_obj[key]);
    } else {
      _obj[key] = { default: '' };
    }
  });

  return _obj;
}

export function processSampleData(sampleData, resource) {
  if (!resource || !sampleData || isEmpty(sampleData)) return sampleData;

  // All file type's sample data logic handled here
  if (isFileAdaptor(resource)) {
    const { file = {} } = resource;
    const { type: fileType, xlsx = {}, csv = {} } = file;

    if (fileType) {
      switch (fileType) {
        case 'csv':
          return extractFieldsFromCsv(sampleData, csv);
        case 'xlsx':
          // for xlsx files sample data is stored in csv format
          return extractFieldsFromCsv(sampleData, xlsx);
        case 'json':
        case 'filedefinition':
          return sampleData;
        default:
      }
    }

    if (isBlobTypeResource(resource)) {
      return sampleData;
    }
    // For all other adapters logic can be handled here
  }

  return sampleData;
}

/**
 * converts object representing string to respective objects
 *
 * @params {object} objData
 *
 * @returns {object}
 * @example
 * {'rest.prop':'value'} ->  {rest:{prop:'value'}}
 * {'rest.prop1.prop2':'value'} -> {rest:{prop1:{prop2: 'value'}}}
 * {'prop[*].prop1': 'value1'} -> {prop: [{prop1 : 'value1'}]}
 */
export const getFormattedObject = objData => {
  const toReturn = {};
  let keyParts = [];
  let i = 0;
  let objTemp;

  each(objData, (v, k) => {
    keyParts = k.split('.');
    objTemp = toReturn;

    for (i = 0; i < keyParts.length - 1; i += 1) {
      const isSublist = /\[\*]$/.test(keyParts[i]);
      const tempVar = isSublist
        ? keyParts[i].substring(0, keyParts[i].length - 3)
        : keyParts[i];

      if (isArray(objTemp)) {
        // eslint-disable-next-line no-prototype-builtins
        if (!objTemp[0].hasOwnProperty(tempVar)) {
          objTemp[0][tempVar] = isSublist ? [{}] : {};
        }

        objTemp = objTemp[0][tempVar];
      } else {
        // eslint-disable-next-line no-prototype-builtins
        if (!objTemp.hasOwnProperty(tempVar)) {
          objTemp[tempVar] = isSublist ? [{}] : {};
        }

        objTemp = objTemp[tempVar];
      }
    }

    isArray(objTemp)
      ? (objTemp[0][keyParts[i]] = v)
      : (objTemp[keyParts[i]] = v);
  });

  return toReturn;
};

export const getSampleValue = (type, id) => {
  let sampleValue = id.split('[*].').length === 1 ? id : id.split('[*].')[1];

  if (!id) {
    return sampleValue;
  }

  switch (type) {
    case 'email':
      sampleValue = 'testemail@domain.com';
      break;
    case 'phone':
      sampleValue = '(917)494-4476';
      break;
    case 'checkbox':
      sampleValue = false;
      break;
    case 'integer':
      sampleValue = 999;
      break;
    case 'password':
      sampleValue = '**********';
      break;
    case 'datetime':
      sampleValue = moment().toISOString();
      break;
    case 'date':
      sampleValue = moment().format('MM/DD/YYYY');
      break;
    default:
  }

  return sampleValue;
};

export function getFormattedNetsuiteMetadataData(nsMetaData, nsRecordType) {
  const formattedNSMetadata = [];

  each(nsMetaData, metadata => {
    const { sublist, type, id, ...rest } = metadata;
    let formattedID = id;

    if (['_billing_addressbook', '_shipping_addressbook'].includes(sublist)) {
      if (sublist === '_billing_addressbook') {
        formattedID = id.replace(`${sublist}[*].`, '_billingaddress_');
      }

      if (sublist === '_shipping_addressbook') {
        formattedID = id.replace(`${sublist}[*].`, '_shippingaddress_');
      }

      if (type === 'select' && id.indexOf('.') === -1) {
        formattedID += '.name';
      }
    }

    if (type === 'select') {
      if (sublist) {
        if (formattedID.indexOf('.') === formattedID.lastIndexOf('.')) {
          formattedID += '.name';
        }
      } else if (formattedID.indexOf('.') === -1) {
        formattedID += '.name';
      }
    }

    formattedNSMetadata.push({ ...rest, type, id: formattedID });

    if (id === '_billingaddress_state') {
      formattedNSMetadata.push(
        {
          id: '_billingaddress_dropdownstate.internalid',
          name: 'Billing State (InternalId)',
          type: 'select',
        },
        {
          id: '_billingaddress_dropdownstate.name',
          name: 'Billing State (Name)',
          type: 'select',
        }
      );
    } else if (id === '_shippingaddress_state') {
      formattedNSMetadata.push(
        {
          id: '_shippingaddress_dropdownstate.internalid',
          name: 'Shipping State (InternalId)',
          type: 'select',
        },
        {
          id: '_shippingaddress_dropdownstate.name',
          name: 'Shipping State (Name)',
          type: 'select',
        }
      );
    }
  });

  if (nsRecordType === 'salesorder') {
    return getFormattedNSSalesOrderMetadataData(formattedNSMetadata);
  }

  if (nsRecordType === 'customer') {
    return getFormattedNSCustomerSampleData(formattedNSMetadata);
  }

  return formattedNSMetadata;
}

/*
 * Given NS metadata list converts into JSON sample data format
 * Includes business logic of filtering some fields and adding default metadata fields to sample data
 * TODO @Raghu : Could be enhanced further
 */
export const getNetsuiteRealTimeSampleData = (nsMetaData, nsRecordType) => {
  // Array of metadata records which are formatted
  let nsFormattedMetadata = getFormattedNetsuiteMetadataData(
    nsMetaData,
    nsRecordType
  );
  const netsuiteSampleData = {};

  // Filter all the sublist props from metadata
  nsFormattedMetadata = filterSubListProperties(nsFormattedMetadata);
  // Attach sample values against each field id for sample data
  each(nsFormattedMetadata, field => {
    const { id, type } = field;

    netsuiteSampleData[id] = getSampleValue(type, id);
  });

  return getFormattedObject(netsuiteSampleData);
};

/*
 * Formats Salesforce metadata to create sample data
 */
export const getSalesforceRealTimeSampleData = sfMetadata => {
  const sfFormattedMetadata = getFormattedSalesForceMetadata(sfMetadata);
  const salesforceSampleData = {};

  // Attach sample values against each field id for sample data
  each(sfFormattedMetadata, field => {
    const { id, type } = field;

    salesforceSampleData[id] = getSampleValue(type, id);
  });

  return salesforceSampleData;
};

/*
 * Handles Sample data of JSON file type
 * Incase of Array content, we merge all objects properties and have a combined object
 * Ex: [{a: 5, b: 6}, {c: 7}, {a: 6, d: 11}] gets converted to [{a: 6, b: 6, c: 7, d: 11}]
 */
export const processJsonSampleData = sampleData => {
  if (!sampleData) return sampleData;

  if (Array.isArray(sampleData)) {
    return getUnionObject(sampleData);
  }

  return sampleData;
};

/*
 * Returns Transformation rules set by flattening xmlJsonData
 */
export const generateTransformationRulesOnXMLData = xmlJsonData => {
  const paths = getTransformPaths(xmlJsonData);
  const rule = [];

  paths.forEach(path => {
    const extract = path;
    const generate = path
      .replace(/\[0]\._$/, '')
      .replace(/\[0]\./g, '.')
      .replace(/\$\.(\w*)$/, '$1');

    rule.push({ extract, generate });
  });

  return [rule];
};
