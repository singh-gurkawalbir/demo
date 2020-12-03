/* global expect, describe, test, beforeEach */
import {
  getDefaultData,
  convertFileDataToJSON,
  getFormattedObject,
  getSampleValue,
  extractSampleDataAtResourcePath,
  processJsonSampleData,
  generateTransformationRulesOnXMLData,
  isValidPathToMany,
  processOneToManySampleData,
  wrapExportFileSampleData,
  wrapSampleDataWithContext,
} from '.';

// TODO: describe('getFormattedSampleData util', () => {});

describe('getDefaultData util', () => {
  test('should return undefined if the data passed is null or undefined', () => {
    expect(getDefaultData()).toBeUndefined();
    expect(getDefaultData(null)).toBeUndefined();
  });
  test('should return new object with default data if sample data is passed', () => {
    const sampleData = {
      sku: 'abc',
      price: 19,
      attributes: {
        weight: 2,
      },
    };
    const expectedData = {
      sku: { default: '' },
      price: { default: '' },
      attributes: {
        weight: { default: '' },
      },
    };

    expect(getDefaultData(sampleData)).toEqual(expectedData);
  });
});

describe('convertFileDataToJSON util', () => {
  test('should return original sample data if resource is undefined or sample data is empty', () => {
    const sampleData = {
      name: 'Bob',
    };
    const resource = {
      _id: 123,
      name: 'some export',
    };

    expect(convertFileDataToJSON(sampleData)).toBe(sampleData);
    expect(convertFileDataToJSON(null, resource)).toBe(null);
  });
  test('should return original sample data if resource is a non file type adaptor', () => {
    const resource = {
      _id: '123',
      adaptorType: 'HTTPExport',
      name: 'dummy s3 export',
      _connectionId: '456',
    };
    const sampleData = {
      name: 'Bob',
    };

    expect(convertFileDataToJSON(sampleData, resource)).toBe(sampleData);
  });
  test('should return original sample data if resource is of blob file type adaptor', () => {
    const resource = {
      _id: '123',
      adaptorType: 'S3Export',
      name: 'dummy s3 export',
      _connectionId: '456',
      type: 'blob',
      blobKeyPath: '/key',
    };
    const sampleData = {
      name: 'Bob',
    };

    expect(convertFileDataToJSON(sampleData, resource)).toBe(sampleData);
  });
  test('should return original sample data if resource is file type with json or filedefinition format', () => {
    const jsonResource = {
      _id: '123',
      adaptorType: 'FTPExport',
      name: 'dummy ftp export',
      _connectionId: '456',
      file: {
        output: 'records',
        skipDelete: false,
        type: 'json',
        json: {
          resourcePath: '/',
        },
      },
    };
    const sampleData = {
      name: 'Bob',
    };

    expect(convertFileDataToJSON(sampleData, jsonResource)).toBe(sampleData);

    const fileDefResource = {
      _id: '123',
      adaptorType: 'FTPExport',
      name: 'dummy ftp export',
      _connectionId: '456',
      file: {
        output: 'records',
        skipDelete: false,
        type: 'filedefinition',
        fileDefinition: {
          _fileDefinitionId: '555',
        },
      },
    };

    expect(convertFileDataToJSON(sampleData, fileDefResource)).toBe(sampleData);
  });
  test('should convert sample data to json if resource is file type with csv format', () => {
    const resource = {
      _id: '123',
      adaptorType: 'FTPExport',
      name: 'dummy ftp export',
      _connectionId: '456',
      file: {
        output: 'records',
        skipDelete: false,
        type: 'csv',
        csv: {
          columnDelimiter: '|',
          rowDelimiter: '\n',
          hasHeaderRow: true,
          trimSpaces: true,
          rowsToSkip: 0,
        },
      },
    };
    const sampleData = "CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PART_NUM|LIST_PRICE|DESCRIPTION|CONTRACT_PRICE|QUANTITY_AVAILABLE\nC1000010839|Sato|12S000357CS|12S000357CS|99.12|wax rib 3.00\"X84',T113L,CSO,1\"core,24/cs|60.53|0\nC1000010839|Unitech|1400-900035G|1400-900035G|80.00|PA720/PA726 3.6V 3120mAH BATTERY -20C|43.53|0\nC1000010839|Magtek|21073131-NMI|21073131NMI|150.00|iDynamo 5 with NMI Encryption|89.29|0";
    const expectedData = {
      CONTRACT_PRICE: 'CONTRACT_PRICE',
      CUSTOMER_NUMBER: 'CUSTOMER_NUMBER',
      DESCRIPTION: 'DESCRIPTION',
      DISTRIBUTOR_PART_NUM: 'DISTRIBUTOR_PART_NUM',
      LIST_PRICE: 'LIST_PRICE',
      QUANTITY_AVAILABLE: 'QUANTITY_AVAILABLE',
      VENDOR_NAME: 'VENDOR_NAME',
      VENDOR_PART_NUM: 'VENDOR_PART_NUM',
    };

    expect(convertFileDataToJSON(sampleData, resource)).toEqual(expectedData);
  });
});

describe('getFormattedObject util', () => {
  test('should return empty object if no data is passed', () => {
    expect(getFormattedObject()).toEqual({});
  });
  test('should correctly convert string keys to respective objects if sublist is supported', () => {
    const objData1 = {'prop[*].prop1': 'value1'};
    const expectedData1 = {prop: [{prop1: 'value1'}]};

    expect(getFormattedObject(objData1)).toEqual(expectedData1);

    const objData2 = {'prop[*].prop1[*].prop2': 'value1'};
    const expectedData2 = {prop: [{prop1: [{prop2: 'value1'}]}]};

    expect(getFormattedObject(objData2)).toEqual(expectedData2);

    const objData3 = {'prop.prop1[*].prop2': 'value1'};
    const expectedData3 = {prop: {prop1: [{prop2: 'value1'}]}};

    expect(getFormattedObject(objData3)).toEqual(expectedData3);
  });
  test('should correctly convert string keys to respective objects with non-sublist data', () => {
    const objData1 = {'prop.prop1': 'value1'};
    const expectedData1 = {prop: {prop1: 'value1'}};

    expect(getFormattedObject(objData1)).toEqual(expectedData1);

    const objData2 = {'prop.prop1.prop2': {'rest.key': 'value'}};
    const expectedData2 = {prop: {prop1: {prop2: {'rest.key': 'value'}}}};

    expect(getFormattedObject(objData2)).toEqual(expectedData2);
  });
});

describe('getSampleValue util', () => {
  test('should return undefined if field id is empty', () => {
    expect(getSampleValue('text')).toBeUndefined();
  });
  test('should return field id as sample value if invalid type is passed', () => {
    const id1 = 'shippingcarrier.internalid';

    expect(getSampleValue('invalid_type', id1)).toEqual(id1);

    const id2 = 'addressbook[*].addr1';

    expect(getSampleValue('invalid_type', id2)).toEqual('addr1');
  });
  test('should return correct sample value according to the type passed', () => {
    const id1 = 'daysoverdue';

    expect(getSampleValue('integer', id1)).toEqual(999);

    const id2 = 'telephone';

    expect(getSampleValue('phone', id2)).toEqual('(917)494-4476');
  });
});

// TODO: describe('getFormattedNetsuiteMetadataData util', () => {});
// TODO: describe('getNetsuiteRealTimeSampleData util', () => {});
// TODO: describe('getSalesforceRealTimeSampleData util', () => {});
// TODO: describe('getPathSegments util', () => {});

describe('extractSampleDataAtResourcePath util', () => {
  test('should return null value object if sample data is empty', () => {
    expect(extractSampleDataAtResourcePath(null, 'somepath')).toEqual({value: null});
  });
  test('should return original sample data if resource path is empty', () => {
    const sampleData = {key: 'value'};

    expect(extractSampleDataAtResourcePath(sampleData)).toBe(sampleData);
  });
  test('should return undefined if resource path is not of string type', () => {
    const sampleData = {key: 'value'};
    const resourcePath = {};

    expect(extractSampleDataAtResourcePath(sampleData, resourcePath)).toBeUndefined();
  });
  test('should return empty object if there is any error', () => {
    const sampleData = {key: 'value'};
    const resourcePath = 'somepath[0]]';

    expect(extractSampleDataAtResourcePath(sampleData, resourcePath)).toEqual({});
  });
  test('should return correct sample data at given resource path', () => {
    const sampleData = {
      _id: '999',
      name: 'As2 json',
      file: [{
        type: 'json',
      },
      {
        type: 'xml',
      },
      {
        type: 'csv',
      },
      ],
      adaptorType: 'AS2Export',
    };
    const resourcePath = 'file[0]';
    const expectedData = {
      type: 'json',
    };

    expect(extractSampleDataAtResourcePath(sampleData, resourcePath)).toEqual(expectedData);
  });
});

// TODO: describe('processJsonPreviewData util', () => {});

describe('processJsonSampleData util', () => {
  test('should return preview data as is if its of non-array type', () => {
    const sampleData = {
      _id: '999',
      name: 'As2 json',
      file: [{
        type: 'json',
      },
      {
        type: 'xml',
      },
      {
        type: 'csv',
      },
      ],
      adaptorType: 'AS2Export',
    };
    const options = {resourcePath: 'file[0]'};
    const expectedPreviewData = {type: 'json'};

    expect(processJsonSampleData(sampleData, options)).toEqual(expectedPreviewData);
  });
  test('should return union of preview data if its an array', () => {
    const sampleData = {
      _id: '999',
      name: 'As2 json',
      file: [{
        type: 'json',
        data: 'jsonData',
      },
      {
        type: 'xml',
        node: true,
      },
      {
        type: 'csv',
        whitespace: '',
      },
      ],
      adaptorType: 'AS2Export',
    };
    const options = {resourcePath: 'file'};
    const expectedPreviewData = {data: 'jsonData', node: true, type: 'csv', whitespace: ''};

    expect(processJsonSampleData(sampleData, options)).toEqual(expectedPreviewData);
  });
});

describe('generateTransformationRulesOnXMLData util', () => {
  test('should return empty array if no xml json data is passed', () => {
    expect(generateTransformationRulesOnXMLData()).toEqual([[]]);
  });
  test('should correctly generate xml transformation rules when xml json data is valid', () => {
    const xmlJsonData = {
      InSituTestRequest: {
        Name: 'dummyName',
        Description: 'some description',
      },
    };
    const expectedRules = [[
      {
        extract: 'InSituTestRequest.Description',
        generate: 'InSituTestRequest.Description',
      },
      {
        extract: 'InSituTestRequest.Name',
        generate: 'InSituTestRequest.Name',
      },
    ]];

    expect(generateTransformationRulesOnXMLData(xmlJsonData)).toEqual(expectedRules);
  });
});

describe('isValidPathToMany util', () => {
  test('should return false if sample data or path segments is empty', () => {
    expect(isValidPathToMany({key: 'value'})).toBe(false);
    expect(isValidPathToMany(null, ['a'])).toBe(false);
  });
  test('should return false if expected path value is not an array', () => {
    const sampleData = {
      a: 5,
      c: { d: 7 },
      e: { check: { f: [{ a: 1}]} },
    };
    const pathSegments = ['c', 'd'];

    expect(isValidPathToMany(sampleData, pathSegments)).toBe(false);
    expect(isValidPathToMany(sampleData, ['e', 'x'])).toBe(false);
  });
  test('should return true if expected path value is an array', () => {
    const sampleData = {
      a: 5,
      c: { d: 7 },
      e: { check: { f: [{ a: 1}]} },
    };
    const pathSegments = ['e', 'check', 'f'];

    expect(isValidPathToMany(sampleData, pathSegments)).toBe(true);
  });
});

describe('processOneToManySampleData util', () => {
  test('should return original sample data if sample data or resource or path segments are empty', () => {
    const sampleData = {
      key: 'value',
    };
    const resource = {
      _id: '999',
      name: 'dummy resource',
      adaptorType: 'HTTPImport',
      pathToMany: '*',
    };

    expect(processOneToManySampleData(null, resource)).toBeNull();
    expect(processOneToManySampleData(sampleData)).toBe(sampleData);
    expect(processOneToManySampleData(sampleData, resource)).toBe(sampleData);
  });
  test('should return original sample data if resource has invalid pathToMany field', () => {
    const sampleData = {
      a: 5,
      c: { d: 7 },
      e: { check: { f: [{ a: 1}]} },
    };
    const resource = {
      _id: '999',
      name: 'dummy resource',
      adaptorType: 'HTTPImport',
      pathToMany: 'c.d',
    };

    expect(processOneToManySampleData(sampleData, resource)).toBe(sampleData);
  });
  test('should return the correct extracted sample data at target path if resource has correct pathToMany field', () => {
    const sampleData = {
      a: 5,
      c: { d: 7 },
      e: { check: { f: [{ a: 1}]} },
    };
    const resource = {
      _id: '999',
      name: 'dummy resource',
      adaptorType: 'HTTPImport',
      pathToMany: 'e.check.f',
    };
    const expectedData = {
      _PARENT: { a: 5, c: { d: 7}, e: { check: {} } },
      a: 1,
    };

    expect(processOneToManySampleData(sampleData, resource)).toEqual(expectedData);
  });
  test('should generate correct union sample data object if target path is array of multiple objects', () => {
    const sampleData = {
      a: 5,
      c: { d: 7 },
      e: { check: { f: [{a: 5, b: 6}, {c: 7}, {a: 6, d: 11}]} },
    };
    const resource = {
      _id: '999',
      name: 'dummy resource',
      adaptorType: 'HTTPImport',
      pathToMany: 'e.check.f',
    };
    const expectedData = {
      _PARENT: { a: 5, c: { d: 7}, e: { check: {} } },
      a: 6,
      b: 6,
      c: 7,
      d: 11,
    };

    expect(processOneToManySampleData(sampleData, resource)).toEqual(expectedData);
  });
});

describe('wrapExportFileSampleData util', () => {
  test('should return empty page_of_records record if sample input is empty or not of object type', () => {
    const expectedData = { page_of_records: [{ record: {} }] };

    expect(wrapExportFileSampleData()).toEqual(expectedData);
    expect(wrapExportFileSampleData('dummy')).toEqual(expectedData);
  });
  test('should return page_of_records record = original input if input is a non-array type', () => {
    const records = {
      name: 'Bob',
      age: 23,
    };
    const expectedData = { page_of_records: [{ record: records }] };

    expect(wrapExportFileSampleData(records)).toEqual(expectedData);
  });
  test('should return correctly wrapped page_of_records and rows structure if input records is of array type', () => {
    const records = [
      {
        CONTRACT_PRICE: '20',
        CUSTOMER_NUMBER: 'C82828',
      },
      {
        CONTRACT_PRICE: '14',
        CUSTOMER_NUMBER: 'C98890',
      },
      [{
        type: 'retail',
      },
      {
        type: 'wholesale',
      }],
    ];
    const expectedData = { page_of_records: [
      {
        record: {
          CONTRACT_PRICE: '20',
          CUSTOMER_NUMBER: 'C82828',
        },
      },
      {
        record:
        {
          CONTRACT_PRICE: '14',
          CUSTOMER_NUMBER: 'C98890',
        },
      },
      {
        rows: [{
          type: 'retail',
        },
        {
          type: 'wholesale',
        },
        ],
      },
    ] };

    expect(wrapExportFileSampleData(records)).toEqual(expectedData);
  });
});

describe('wrapSampleDataWithContext util', () => {
  let integration; let resource; let flow; let connection; let
    sampleData;

  beforeEach(() => {
    integration = {
      _id: 'some integration id',
      name: 'dummy integration',
      settings: {
        store: 'shopify',
      },
    };
    flow = {
      _id: 'some flow id',
      _integrationId: 'some integration id',
      name: 'dummy flow',

    };
    connection = {
      _id: 'some connection id',
      name: 'dummy connection',
      type: 's3',
      offline: true,
      settings: {conn1: 'conn1'},
      http: {
        encrypted: '****',
        unencrypted: {
          user: 'abcd',
        },
      },
    };
    resource = {
      _id: 'some resource id',
      _connectionId: 'some connection id',
      name: 'dummy resource',
      adaptorType: 'S3Export',
      settings: {resourceSet: 'custom settings'},
    };
    sampleData = {
      status: 'received',
      data: {
        id: 333,
        phone: '1234',
      },
      templateVersion: 1,
    };
  });

  test('should return with status if status is empty or has requested value', () => {
    const sampleData = {
      status: 'requested',
    };
    const stage = 'flowInput';

    expect(wrapSampleDataWithContext({sampleData, stage})).toEqual({status: 'requested'});
    expect(wrapSampleDataWithContext({sampleData: {}, stage})).toEqual({status: undefined});
  });
  test('should return same sample data if resource is not attached to any flow', () => {
    const flow = {};
    const stage = 'flowInput';

    expect(wrapSampleDataWithContext({sampleData, flow, stage})).toEqual(sampleData);
  });
  test('should return same sample data if field is dataURITemplate/idLockTemplate and template version is 1', () => {
    const stage = 'flowInput';

    expect(wrapSampleDataWithContext({sampleData, flow: {}, fieldType: 'dataURITemplate', stage})).toEqual(sampleData);
    expect(wrapSampleDataWithContext({sampleData, flow: {}, fieldType: 'idLockTemplate', stage})).toEqual(sampleData);
  });
  test('should return same sample data if stage is not supported', () => {
    const stage = 'importMappingExtract';

    expect(wrapSampleDataWithContext({sampleData, flow: {}, stage})).toEqual(sampleData);
  });
  test('should return correctly wrapped sample data with connection details for http resource if stage = flowInput and version is 2', () => {
    const stage = 'flowInput';

    resource.adaptorType = 'HTTPExport';

    const sampleData = {
      status: 'received',
      data: {
        record: {
          CONTRACT_PRICE: '89',
          CUSTOMER_NUMBER: 'C1234',
        },
      },
      templateVersion: 2,
    };

    const expectedData = {
      data: {
        record: {
          CONTRACT_PRICE: '89',
          CUSTOMER_NUMBER: 'C1234',
        },
        settings: {
          integration: {
            store: 'shopify',
          },
          flow: {},
          export: {resourceSet: 'custom settings'},
          connection: {conn1: 'conn1'},
        },
        connection: {
          name: 'dummy connection',
          http: {
            unencrypted: {
              user: 'abcd',
            },
            encrypted: '****',
          },
        },
      },
      status: 'received',
      templateVersion: 2,
    };

    expect(wrapSampleDataWithContext({sampleData, flow, resource, connection, integration, stage})).toEqual(expectedData);
  });
  test('should return correctly wrapped sample data without connection details if stage is flowInput and resource is non http type', () => {
    const stage = 'flowInput';

    const sampleData = {
      status: 'received',
      data: {
        record: {
          CONTRACT_PRICE: '89',
          CUSTOMER_NUMBER: 'C1234',
        },
      },
      templateVersion: 2,
    };

    const expectedData = {
      data: {
        record: {
          CONTRACT_PRICE: '89',
          CUSTOMER_NUMBER: 'C1234',
        },
        settings: {
          integration: {
            store: 'shopify',
          },
          flow: {},
          export: {resourceSet: 'custom settings'},
          connection: {conn1: 'conn1'},
        },
      },
      status: 'received',
      templateVersion: 2,
    };

    expect(wrapSampleDataWithContext({sampleData, flow, resource, connection, integration, stage})).toEqual(expectedData);
  });
  test('should include paging details in returned object if stage is flowInput and http/rest resource has paging set', () => {
    const stage = 'flowInput';

    resource.adaptorType = 'RESTExport';
    resource.http = {
      paging: {
        method: 'token',
        path: '/p1',
        relativeURI: '/catalog/search/123?1={{{export.http.paging.token}}}',
        lastPageStatusCode: 404,
      },
    };

    const sampleData = {
      status: 'received',
      data: {
        record: {
          CONTRACT_PRICE: '89',
          CUSTOMER_NUMBER: 'C1234',
        },
      },
      templateVersion: 2,
    };

    const expectedData = {
      data: {
        record: {
          CONTRACT_PRICE: '89',
          CUSTOMER_NUMBER: 'C1234',
        },
        export: {
          http: {
            paging: {
              method: 'token',
              path: '/p1',
              relativeURI: '/catalog/search/123?1={{{export.http.paging.token}}}',
              lastPageStatusCode: 404,
            },
          },
        },
        settings: {
          integration: {
            store: 'shopify',
          },
          flow: {},
          export: {resourceSet: 'custom settings'},
          connection: {conn1: 'conn1'},
        },
      },
      status: 'received',
      templateVersion: 2,
    };

    expect(wrapSampleDataWithContext({sampleData, flow, resource, connection, integration, stage})).toEqual(expectedData);
  });
  test('should return correctly wrapped sample data if stage is transform or sampleResponse or inputFilter', () => {
    const stages = ['transform', 'sampleResponse', 'inputFilter'];
    const expectedData = {
      status: 'received',
      data: {
        record: {
          id: 333,
          phone: '1234',
        },
        settings: {
          integration: {
            store: 'shopify',
          },
          flow: {},
          export: {resourceSet: 'custom settings'},
          connection: {conn1: 'conn1'},
        },
      },
    };

    expect(wrapSampleDataWithContext({sampleData, flow, resource, connection, integration, stage: stages[Math.floor(Math.random() * stages.length)]})).toEqual(expectedData);
  });
  test('should return correctly wrapped sample data if stage is outputFilter', () => {
    const stage = 'outputFilter';

    const expectedData = {
      status: 'received',
      data: {
        record: {
          id: 333,
          phone: '1234',
        },
        pageIndex: 0,
        settings: {
          integration: {
            store: 'shopify',
          },
          flow: {},
          export: {resourceSet: 'custom settings'},
          connection: {conn1: 'conn1'},
        },
      },
    };

    expect(wrapSampleDataWithContext({sampleData, flow, resource, connection, integration, stage})).toEqual(expectedData);

    // delta type resource
    resource.type = 'delta';
    expectedData.data.lastExportDateTime = expect.any(String);
    expectedData.data.currentExportDateTime = expect.any(String);

    expect(wrapSampleDataWithContext({sampleData, flow, resource, connection, integration, stage})).toEqual(expectedData);
  });
  test('should return correctly wrapped sample data if stage is preSavePage', () => {
    const stage = 'preSavePage';

    const expectedData = {
      status: 'received',
      data: {
        data: [{
          id: 333,
          phone: '1234',
        }],
        errors: [],
        _exportId: 'some resource id',
        _connectionId: 'some connection id',
        _flowId: 'some flow id',
        _integrationId: 'some integration id',
        pageIndex: 0,
        settings: {
          integration: {
            store: 'shopify',
          },
          flow: {},
          export: {resourceSet: 'custom settings'},
          connection: {conn1: 'conn1'},
        },
      },
    };

    expect(wrapSampleDataWithContext({sampleData, flow, resource, connection, integration, stage})).toEqual(expectedData);

    // delta type resource
    resource.type = 'delta';
    expectedData.data.lastExportDateTime = expect.any(String);
    expectedData.data.currentExportDateTime = expect.any(String);

    expect(wrapSampleDataWithContext({sampleData, flow, resource, connection, integration, stage})).toEqual(expectedData);
  });
  test('should return correctly wrapped sample data if stage is preMap', () => {
    const stage = 'preMap';

    const expectedData = {
      status: 'received',
      data: {
        data: [{
          id: 333,
          phone: '1234',
        }],
        _exportId: 'some resource id',
        _connectionId: 'some connection id',
        _flowId: 'some flow id',
        _integrationId: 'some integration id',
        settings: {
          integration: {
            store: 'shopify',
          },
          flow: {},
          export: {resourceSet: 'custom settings'},
          connection: {conn1: 'conn1'},
        },
      },
    };

    expect(wrapSampleDataWithContext({sampleData, flow, resource, connection, integration, stage})).toEqual(expectedData);
  });
  test('should return correctly wrapped sample data if stage is postMap', () => {
    const preMapSampleData = {
      data: {
        id: 333,
        phone: '1234',
      },
    };
    const stage = 'postMap';

    const expectedData = {
      status: 'received',
      data: {
        preMapData: [{
          id: 333,
          phone: '1234',
        }],
        postMapData: [{
          id: 333,
          phone: '1234',
        }],
        _exportId: 'some resource id',
        _connectionId: 'some connection id',
        _flowId: 'some flow id',
        _integrationId: 'some integration id',
        settings: {
          integration: {
            store: 'shopify',
          },
          flow: {},
          export: {resourceSet: 'custom settings'},
          connection: {conn1: 'conn1'},
        },
      },
    };

    expect(wrapSampleDataWithContext({sampleData, preMapSampleData, flow, resource, connection, integration, stage})).toEqual(expectedData);
  });
  test('should return correctly wrapped sample data if stage is postSubmit', () => {
    const preMapSampleData = {
      data: {
        id: 333,
        phone: '1234',
      },
    };
    const postMapSampleData = {
      data: {
        id: 333,
        phone: '1234',
        isValid: true,
      },
    };
    const sampleData = {
      status: 'received',
      data: {
        success: true,
        id: 2001,
      },
    };
    const stage = 'postSubmit';

    const expectedData = {
      status: 'received',
      data: {
        preMapData: [{
          id: 333,
          phone: '1234',
        }],
        postMapData: [{
          id: 333,
          phone: '1234',
          isValid: true,
        }],
        responseData: [{
          statusCode: 200,
          errors: [{ code: '', message: '', source: '' }],
          ignored: false,
          id: '',
          _json: {
            success: true,
            id: 2001,
          },
          dataURI: '',
        }],
        _exportId: 'some resource id',
        _connectionId: 'some connection id',
        _flowId: 'some flow id',
        _integrationId: 'some integration id',
        settings: {
          integration: {
            store: 'shopify',
          },
          flow: {},
          export: {resourceSet: 'custom settings'},
          connection: {conn1: 'conn1'},
        },
      },
    };

    expect(wrapSampleDataWithContext({sampleData, preMapSampleData, postMapSampleData, flow, resource, connection, integration, stage})).toEqual(expectedData);
  });
  test('should return correctly wrapped sample data if stage is postAggregate', () => {
    const stage = 'postAggregate';

    const expectedData = {
      status: 'received',
      data: {
        postAggregateData: {
          success: true,
          _json: {},
          code: '',
          message: '',
          source: '',
        },
        _exportId: 'some resource id',
        _connectionId: 'some connection id',
        _flowId: 'some flow id',
        _integrationId: 'some integration id',
        settings: {
          integration: {
            store: 'shopify',
          },
          flow: {},
          export: {resourceSet: 'custom settings'},
          connection: {conn1: 'conn1'},
        },
      },
    };

    expect(wrapSampleDataWithContext({sampleData, flow, resource, connection, integration, stage})).toEqual(expectedData);
  });
  test('should return correctly wrapped sample data if stage is postResponseMapHook', () => {
    const stage = 'postResponseMapHook';
    const sampleData = {
      status: 'received',
      data: [
        {
          id: 999,
          ignored: true,
          recordId: 78,
        },
      ],
    };

    const expectedData = {
      status: 'received',
      data: {
        postResponseMapData: [
          {
            id: 999,
            ignored: true,
            recordId: 78,
          },
        ],
      },
    };

    expect(wrapSampleDataWithContext({sampleData, flow, resource, connection, integration, stage})).toEqual(expectedData);
  });
});
