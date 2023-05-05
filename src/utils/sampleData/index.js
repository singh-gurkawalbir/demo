/* eslint-disable camelcase */
import { isEmpty, each, isArray } from 'lodash';
import moment from 'moment';
import jsonUtil from '../json';
import { isFileAdaptor, isBlobTypeResource } from '../resource';
import { extractMappingFieldsFromCsv } from '../mapping';
import {
  filterSubListProperties,
  getFormattedSalesForceMetadata,
  getFormattedNetsuiteMetadataData,
} from '../metadata';
import { getUnionObject, getTransformPaths } from '../jsonPaths';
import { getSampleFileMeta, isFileMetaExpectedForResource } from '../flowData';
import customCloneDeep from '../customCloneDeep';

// wrap the function inside useMemo since result may contain property 'lastExportDateTime' which refers to new Date()
export default function getFormattedSampleData({
  connection,
  sampleData,
  resourceType,
  resourceName,
  wrapInArray = false,
}) {
  // create deep copy
  const _connection = customCloneDeep(connection);
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

  if (_connection?.type === 'as2' || _connection?.type === 'van') {
    data.uuid = 'uuid';
  }

  return data;
}

export function getDefaultData(obj) {
  if (!obj) return;
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

export function convertFileDataToJSON(sampleData, resource) {
  if (!resource || !sampleData || isEmpty(sampleData)) return sampleData;

  // All file type's sample data logic handled here
  if (isFileAdaptor(resource)) {
    const { file = {} } = resource;
    const { type: fileType, xlsx = {}, csv = {} } = file;

    if (fileType) {
      switch (fileType) {
        case 'csv':
          return extractMappingFieldsFromCsv(sampleData, csv);
        case 'xlsx':
          // for xlsx files sample data is stored in csv format
          return extractMappingFieldsFromCsv(sampleData, xlsx);
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
  if (!id) {
    return;
  }

  let sampleValue = id.split('[*].').length === 1 ? id : id.split('[*].')[1];

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

  // TODO: below loop is redundant as 'type' is not present in 'sfFormattedMetadata'
  // @raghu pls check this
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

  if (!path || path === '*') return [];

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

    if (!inLiteral && char === ' ' && (buffer.length === 0 || wasLiteral)) {
      // eslint-disable-next-line no-continue
      continue;
    }

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
  if (!sampleData || !resourcePath) return sampleData;

  if (typeof resourcePath !== 'string') return;
  const segments = getPathSegments(resourcePath.replace(/\.?\*$/, ''));

  let processedSampleData = sampleData;

  // Segments : Array of level wiser paths to drill down the sample data
  try {
    segments.forEach(path => { processedSampleData = processedSampleData[path]; });

    return processedSampleData;
  } catch (e) {
    return undefined;
  }
};

/**
 * processes json data based on resourcePath provided
 * sampleData = { test: { a: 5, b: 6} } with options = { resourcePath: 'test' }
 * output: { a: 5, b: 6 }
 */
export const processJsonPreviewData = (sampleData, options = {}) => {
  if (!sampleData) return sampleData;
  const { resourcePath } = options;
  let processedSampleData = sampleData;

  // Handle resource paths other than * as '*' indicates extracting the very next element inside array the way we did above
  if (resourcePath && resourcePath !== '*') {
    // Extract sample data at resource
    // check for array type if yes update with union thing
    processedSampleData = extractSampleDataAtResourcePath(
      processedSampleData,
      options.resourcePath
    );
  }

  return processedSampleData;
};

/*
 * Handles Sample data of JSON file type
 * Incase of Array content, we merge all objects properties and have a combined object
 * Ex: [{a: 5, b: 6}, {c: 7}, {a: 6, d: 11}] gets converted to {a: 6, b: 6, c: 7, d: 11}
 */
export const processJsonSampleData = (sampleData, options = {}) => {
  const previewData = processJsonPreviewData(sampleData, options);

  if (Array.isArray(previewData)) {
    // If there is no resourcePath, check if the sampleData is an array,
    // so that we can merge the objects inside
    return getUnionObject(previewData);
  }

  return previewData;
};

/*
 * Returns Transformation rules set by flattening xmlJsonData
 */
export const generateTransformationRulesOnXMLData = xmlJsonData => {
  const paths = getTransformPaths(xmlJsonData);
  const rule = [];

  paths.forEach(path => {
    if (!path || typeof path !== 'string') { return; }

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
export const isValidPathToMany = (sampleData, pathSegments) => {
  let isValid = false;
  let temp = { ...sampleData };

  pathSegments?.forEach(path => {
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
  const { pathToMany } = resource || {};

  if (!sampleData) return sampleData;

  if (!pathToMany) {
    if (Array.isArray(sampleData)) return sampleData[0];

    return sampleData;
  }

  const pathSegments = getPathSegments(pathToMany);

  if (!pathSegments || !pathSegments.length) return sampleData;

  if (!isValidPathToMany(sampleData, pathSegments)) return { _PARENT: sampleData };
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

// These utils check if the sample data is in correct integrator.io canonical format
export const isValidCanonicalFormForExportData = mockData => {
  if (!mockData) return true;
  if (!mockData.page_of_records) return false;
  if (!Array.isArray(mockData.page_of_records)) return false;
  if (mockData.page_of_records.every(item => typeof item.record === 'object' && !Array.isArray(item.record))) { return true; }
  if (mockData.page_of_records.every(item => Array.isArray(item.rows))) { return true; }

  return false;
};

export const isValidCanonicalFormForImportResponse = mockData => {
  if (!mockData) return true;
  const validFields = ['statusCode', 'errors', 'id', '_json', 'ignored', 'dataURI', '_headers'];

  if (!Array.isArray(mockData)) return false;

  return mockData.every(data =>
    typeof data === 'object' &&
    Object.keys(data).every(key => validFields.includes(key)));
};

/**
 * This util adds "page_of_records" on records/rows based on the sampleData structure
 * Ideally, we should be using a BE API for this structure
 * For the time being this is used for csv/xml export sample data view
 * TODO: Discuss on this being replaced with API call, once we finalize AFE 2.0 requirements
 */
export const wrapExportFileSampleData = (records, status) => {
  const page_of_records = [];

  if (!records || typeof records !== 'object' || status === 'error') {
    page_of_records.push({ record: {} });

    return { page_of_records };
  }
  if (!Array.isArray(records)) {
    page_of_records.push({ record: records });

    return { page_of_records };
  }
  records.forEach(record => {
    if (Array.isArray(record)) {
      const rows = [];

      record.forEach(r => rows.push(r));
      page_of_records.push({rows});
    } else {
      page_of_records.push({ record });
    }
  });

  return { page_of_records };
};

// this util unwraps the sample data wrapped by wrapExportFileSampleData
export const unwrapExportFileSampleData = sampleData => {
  if (!sampleData || typeof sampleData !== 'object' || !isValidCanonicalFormForExportData(sampleData)) return;

  const {page_of_records} = sampleData;

  if (!page_of_records || !Array.isArray(page_of_records) || page_of_records.length === 0) return;

  const records = [];

  if (page_of_records.length === 1) {
    const {record, rows} = page_of_records[0];

    if (record) return record;
    if (!rows) return;
  }

  page_of_records.forEach(page => {
    const {record, rows} = page;
    const rowRecords = [];

    if (record) {
      records.push(record);
    } else if (Array.isArray(rows)) {
      rows.forEach(row => {
        rowRecords.push(row);
      });
      records.push(rowRecords);
    }
  });

  return records.length > 0 && records;
};

// this util method will wrap the sample data with correct context fields
// according to the 'stage' passed. This will be used for all the editors sample data
export const wrapSampleDataWithContext = ({
  sampleData,
  preMapSampleData,
  postMapSampleData,
  flow,
  integration,
  resource,
  connection,
  stage,
  fieldType,
  editorType,
  parentIntegration,
  lastExportDateTime,
}) => {
  const { status, data, templateVersion } = sampleData || {};

  let resourceType = 'export';

  if (resource.adaptorType?.includes('Import')) {
    resourceType = 'import';
  }

  if (!status || status === 'requested') {
    return { status };
  }

  // standalone resource should not wrap the data
  // also for below fields, return sample data as such
  if (!flow._id || ((fieldType === 'dataURITemplate' || fieldType === 'idLockTemplate'))) {
    return { status, data, templateVersion };
  }

  const isDeltaExport = resource.type === 'delta';
  let isNativeRESTAdaptor = false;

  if (['RESTImport', 'RESTExport'].includes(resource.adaptorType)) {
    isNativeRESTAdaptor = !connection.isHTTP;
  }
  const settings = {
    integration: integration.settings || {},
    flowGrouping: {},
    flow: flow.settings || {},
    [resourceType]: resource.settings || {},
    connection: connection.settings || {},
  };

  if (flow._flowGroupingId && integration.flowGroupings) {
    const index = integration.flowGroupings.findIndex(f => f._id === flow._flowGroupingId);

    settings.flowGrouping = integration.flowGroupings[index]?.settings || {};
  }
  // if integration is a child, then show parent settings as well
  if (parentIntegration) {
    settings.parentIntegration = parentIntegration.settings || {};
  }

  const resourceIds = {
    [resourceType === 'import' ? '_importId' : '_exportId']: resource._id,
    _connectionId: connection._id,
    _flowId: flow._id,
    _integrationId: integration._id,
  };
  const contextFields = {};

  if (isDeltaExport) {
    contextFields.lastExportDateTime = lastExportDateTime || moment()
      .toISOString();
    contextFields.currentExportDateTime = moment()
      .toISOString();
  }

  if (isNativeRESTAdaptor && editorType === 'handlebars') {
    // TODO: BE would be deprecating native REST adaptor as part of IO-19864
    // we can remove this logic from UI as well once that is complete
    const processedData = {
      ...data,
      ...contextFields,
      settings,
    };

    return {
      data: processedData,
      status,
      templateVersion,
    };
  }

  switch (stage) {
    case 'transform':
    case 'sampleResponse':
    case 'responseTransform':
    case 'outputFilter':
      contextFields.pageIndex = 0;

      return {
        status,
        data: {
          record: data || {},
          ...contextFields,
          settings,
        },
      };
    case 'preSavePage':
      contextFields.pageIndex = 0;

      return {
        status,
        data: {
          data: data ? [data] : [],
          files: isFileMetaExpectedForResource(resource) ? getSampleFileMeta(resource) : undefined,
          errors: [],
          ...resourceIds,
          ...contextFields,
          settings,
        },
      };
    case 'preMap':
      return {
        status,
        data: {
          data: data ? [data] : [],
          ...resourceIds,
          settings,
        },
      };
    case 'postMap':
      return {
        status,
        data: {
          preMapData: preMapSampleData?.data ? [preMapSampleData.data] : [],
          postMapData: data ? [data] : [],
          ...resourceIds,
          settings,
        },
      };
    case 'postSubmit':
      return {
        status,
        data: {
          preMapData: preMapSampleData?.data ? [preMapSampleData.data] : [],
          postMapData: postMapSampleData?.data ? [postMapSampleData.data] : [],
          // if data is undefined, show a sample responseData
          responseData: data ? [data] : [{
            statusCode: 200,
            errors: [{ code: '', message: '', source: '' }],
            ignored: false,
            id: '',
            _json: {},
            dataURI: '',
          }],
          ...resourceIds,
          settings,
        },
      };
    case 'postAggregate':
      return {
        status: 'received',
        data: {
          postAggregateData: {
            success: true,
            _json: {},
            code: '',
            message: '',
            source: '',
          },
          ...resourceIds,
          settings,
        },
      };
    case 'postResponseMapHook':
      return {
        status,
        data: {
          postResponseMapData: data ? [data] : [],
          ...resourceIds,
          settings,
        },
      };
    default:
      // For all other stages, return basic sampleData
      return { status, data, templateVersion };
  }
};

export const wrapMockInputData = sampleData =>
  wrapExportFileSampleData(Array.isArray(sampleData) ? [sampleData] : sampleData);
