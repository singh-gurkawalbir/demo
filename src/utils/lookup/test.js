/* global describe, test, expect */
import lookupUtil from './index';

describe('lookup utils test cases', () => {
  describe('getLookupFromResource util', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(lookupUtil.getLookupFromResource()).toEqual(undefined);
      expect(lookupUtil.getLookupFromResource(null)).toEqual(undefined);
    });
    test('should return undefined if adaptorType does not match', () => {
      expect(lookupUtil.getLookupFromResource({adaptorType: 'RDBMSImport'})).toEqual(undefined);
    });
    const lookups = [
      [
        {
          name: '1',
          allowFailures: false,
        },
      ],
      [
        {
          name: '2',
          allowFailures: false,
        },
      ],
      [
        {
          name: '3',
          allowFailures: false,
        },
      ],
      [
        {
          name: '4',
          allowFailures: false,
        },
      ],
      [
        {
          name: '5',
          allowFailures: false,
        },
      ],
      [
        {
          name: '6',
          allowFailures: false,
        },
      ],
      [
        {
          name: '7',
          allowFailures: false,
        },
      ],

    ];
    const resources = [
      {
        _id: 1,
        adaptorType: 'NetSuiteImport',
        netsuite: {
          lookups: lookups[0],
        },
      },
      {
        _id: 2,
        adaptorType: 'NetSuiteDistributedImport',
        netsuite_da: {
          lookups: lookups[1],
        },
      },
      {
        _id: 3,
        adaptorType: 'RESTImport',
        rest: {
          lookups: lookups[2],
        },
      },
      {
        _id: 4,
        adaptorType: 'FTPImport',
        file: {
          lookups: lookups[3],
        },
      },
      {
        _id: 5,
        adaptorType: 'WrapperImport',
        wrapper: {
          lookups: lookups[4],
        },
      },
      {
        _id: 6,
        adaptorType: 'HTTPImport',
        http: {
          lookups: lookups[5],
        },
      },
      {
        _id: 7,
        adaptorType: 'SalesforceImport',
        salesforce: {
          lookups: lookups[6],
        },
      },
    ];

    resources.forEach((res, index) => {
      test(`should return correct lookups for ${res.adaptorType} adaptor type`, () => {
        expect(lookupUtil.getLookupFromResource(res)).toEqual(lookups[index]);
      });
    });
  });

  describe('getLookupPath util', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(lookupUtil.getLookupPath()).toEqual(undefined);
      expect(lookupUtil.getLookupPath(null)).toEqual(undefined);
    });
    test('should return undefined if adaptor type does not match', () => {
      expect(lookupUtil.getLookupPath('FTPExport')).toEqual(undefined);
    });
    test('should return correct path if adaptor type matches', () => {
      expect(lookupUtil.getLookupPath('S3Import')).toEqual('/file/lookups');
    });
  });

  describe('getLookupFieldId util', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(lookupUtil.getLookupFieldId()).toEqual(undefined);
      expect(lookupUtil.getLookupFieldId(null)).toEqual(undefined);
    });
    test('should return undefined if adaptor type does not match', () => {
      expect(lookupUtil.getLookupFieldId('FTPExport')).toEqual(undefined);
    });
    test('should replace / with . and return if lookup path is found', () => {
      expect(lookupUtil.getLookupFieldId('NetSuiteDistributedImport')).toEqual('netsuite_da.lookups');
    });
  });

  describe('getLookupFromFormContext util', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(lookupUtil.getLookupFromFormContext()).toEqual([]);
      expect(lookupUtil.getLookupFromFormContext(null)).toEqual([]);
    });
    test('should return empty array if no formContext is passed or it does not contain any fields', () => {
      expect(lookupUtil.getLookupFromFormContext(null, 'FTPImport')).toEqual([]);
      expect(lookupUtil.getLookupFromFormContext({fields: null}, 'FTPImport')).toEqual([]);
    });
    test('should return empty array if adaptor type does not match', () => {
      expect(lookupUtil.getLookupFromFormContext({fields: {'/path': {id: 'path', value: 'abc'}}}, 'FTPExport')).toEqual([]);
    });
    test('should return the correct lookup context for passed adaptor type', () => {
      expect(lookupUtil.getLookupFromFormContext({fields: {'/http/lookups': {id: 'http.lookups', value: 'some lookup'}}}, 'HTTPImport')).toEqual('some lookup');
    });
  });
});

