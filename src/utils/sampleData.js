import { isEmpty, each, isArray } from 'lodash';
import moment from 'moment';
import deepClone from 'lodash/cloneDeep';
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

// wrap the function inside useMemo since result may contain property 'lastExportDateTime' which refers to new Date()
export default function getFormattedSampleData({
  connection,
  sampleData,
  resourceType,
  resourceName,
  wrapInArray = false,
}) {
  // create deep copy
  const _connection = deepClone(connection);
  const data = {
    connection: {},
  };
  const _sd = sampleData || {
    myField: 'sample',
  };

  data.data = wrapInArray ? [_sd] : _sd;

  if (_connection) {
    data.connection.name = _connection.name;
    const connSubDoc = _connection[_connection.type];
    const hbSubDoc = {};

    if (connSubDoc) {
      if (connSubDoc.unencrypted && !isEmpty(connSubDoc.unencrypted)) {
        hbSubDoc.unencrypted = connSubDoc.unencrypted;
      }

      if (connSubDoc.encrypted && !isEmpty(connSubDoc.encrypted)) {
        hbSubDoc.encrypted = jsonUtil.maskValues(connSubDoc.encrypted);
      }
    }

    data.connection[_connection.type] = hbSubDoc;
  }

  data[resourceType === 'imports' ? 'import' : 'export'] = {
    name: resourceName,
  };

  if (resourceType === 'exports') {
    data.lastExportDateTime = new Date().toISOString();
  }

  if (_connection && _connection.type === 'as2') {
    data.uuid = 'uuid';
  }

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

export const getPathSegments = path => {
  const segments = [];
  let buffer = [];
  let inLiteral = false;
  let escaped = false;
  let wasLiteral = false;
  let i;

  if (!path) return [];

  for (i = 0; i < path.length; i += 1) {
    const char = path[i];

    if (escaped) {
      escaped = false;

      if (char === ']') {
        buffer[buffer.length - 1] = char;
        // eslint-disable-next-line no-continue
        continue;
      }
    }

    if (char === '\\') escaped = true;

    if (!inLiteral && char === ' ' && (buffer.length === 0 || wasLiteral))
      // eslint-disable-next-line no-continue
      continue;

    if (!inLiteral && char === '[' && buffer.length === 0) {
      inLiteral = true;
      // eslint-disable-next-line no-continue
      continue;
    }

    if (inLiteral && char === ']') {
      inLiteral = false;
      wasLiteral = true;
      // eslint-disable-next-line no-continue
      continue;
    }

    if (!inLiteral && (char === '.' || char === '[')) {
      segments.push(buffer.join(''));
      buffer = [];
      inLiteral = char === '[';
      wasLiteral = false;
      // eslint-disable-next-line no-continue
      continue;
    }

    buffer.push(char);
  }

  if (buffer.length) segments.push(buffer.join(''));

  return segments;
};

export const extractSampleDataAtResourcePath = (sampleData, resourcePath) => {
  if (!sampleData) return { value: null };

  if (!resourcePath) return sampleData;

  if (typeof resourcePath !== 'string') return;
  const segments = getPathSegments(resourcePath);
  let processedSampleData = sampleData;

  // Segments : Array of level wiser paths to drill down the sample data
  segments.forEach(path => (processedSampleData = processedSampleData[path]));

  return processedSampleData;
};

/*
 * Handles Sample data of JSON file type
 * Incase of Array content, we merge all objects properties and have a combined object
 * Ex: [{a: 5, b: 6}, {c: 7}, {a: 6, d: 11}] gets converted to [{a: 6, b: 6, c: 7, d: 11}]
 */
export const processJsonSampleData = (sampleData, options = {}) => {
  if (!sampleData) return sampleData;
  const { resourcePath } = options;
  let processedSampleData = sampleData;

  if (Array.isArray(sampleData)) {
    processedSampleData = getUnionObject(sampleData);
  }

  // Handle resource paths other than * as '*' indicates extracting the very next element inside array the way we did above
  if (resourcePath && resourcePath !== '*') {
    // Extract sample data at resource
    // check for array type if yes update with union thing
    processedSampleData = extractSampleDataAtResourcePath(
      processedSampleData,
      options.resourcePath
    );

    if (Array.isArray(processedSampleData)) {
      processedSampleData = getUnionObject(processedSampleData);
    }
  }

  return processedSampleData;
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

  // TODO @Raghu: Add a check to see if at least one rule has different extract and generate.
  // Else no point in adding rules as the data is not going to change
  return [rule];
};

/*
 * Expected : path provided should lead to a property which is an array 
 * Sample Data :{
    "a": 5,
    "c": { "d": 7 },
    "e": { "check": { "f": [ { "a": 1} ]} }
    }
  * pathSegments: ["e", "check", "f"] points to "f" attribute which is an array returns true
  * If not an array returns false
 */
const isValidPathToMany = (sampleData, pathSegments) => {
  let isValid = false;
  let temp = { ...sampleData };

  pathSegments.forEach(path => {
    if (!temp) return;
    temp = temp[path];
  });

  if (Array.isArray(temp)) {
    isValid = true;
  }

  return isValid;
};

/*
 * Incase of OneToMany Resource Sample data is modified based on pathToMany
 * Sample Data :{
    "a": 5,
    "c": { "d": 7 },
    "e": { "check": { "f": [ { "a": 1} ]} }
    }
  * pathToMany : "e.check.f" to point to "f" attribute 
  * Output: { ( all Props other than path are under _PARENT level)
  *   _PARENT: { "a": 5, "c": { "d": 7}, "e": { "check": {} } } 
      "a": 1 ( properties inside "f" attribute are on to the main level )
  * }
 */
export const processOneToManySampleData = (sampleData, resource) => {
  const { pathToMany } = resource;
  const pathSegments = getPathSegments(pathToMany);

  if (!sampleData || !pathSegments || !pathSegments.length) return sampleData;

  if (!isValidPathToMany(sampleData, pathSegments)) return sampleData;
  let pathPointer = sampleData;
  let sampleDataAtPath;

  // Drill down the path and extract target sample data for the path provided
  // Also delete the pointer to that sample data to not present in parent data
  pathSegments.forEach((path, index) => {
    if (index < pathSegments.length - 1) {
      pathPointer = pathPointer[path];
    } else {
      sampleDataAtPath = [...pathPointer[path]];
      delete pathPointer[path];
    }
  });
  // sampleDataAtPath is an array at this point. So get union object with all merged properties
  sampleDataAtPath = getUnionObject(sampleDataAtPath);
  // Add sampleDataAtPath at main level and other properties under _PARENT key
  const processedSampleData = {
    _PARENT: sampleData,
    ...sampleDataAtPath,
  };

  return processedSampleData;
};
