/* global describe, test,  expect */
import generateFieldAndListMappings, {
  isFileOrNetSuiteBatchExport,
  validateMappings,
  updateMappingConfigs,
  getFormattedGenerateData,
  getExtractPaths,
  getSuiteScriptAppType,
  isMappingObjEqual,
} from '.';

describe('Suitescript utils', () => {
  describe('isFileOrNetSuiteBatchExport util', () => {
    test('should return true for netsuite export ', () => {
      const testResources = [
        {
          netsuite: {
            type: 'search',
          },
        },
        {
          netsuite: {
            restlet: {searchId: '1'},
          },
        },
      ];

      testResources.forEach(res => {
        expect(isFileOrNetSuiteBatchExport(res))
          .toEqual(true);
      });
    });
  });

  test('should return true for ftp export/resource.type ="search"/s3 export and fileType = csv', () => {
    const testResources = [
      {
        ftp: {
          directoryPath: 'xyz',
        },
        file: {type: 'csv'},
      },
      {
        type: 'simple',
        file: {type: 'csv'},
      },
      {
        s3: {bucket: 'xyz'},
        file: {type: 'csv'},
      },
    ];

    testResources.forEach(res => {
      expect(isFileOrNetSuiteBatchExport(res))
        .toEqual(true);
    });
  });

  test('should return false if export is not a netsuite batch resource or csv file resource', () => {
    const testResources = [
      {
        ftp: {},
        file: {type: 'csv'},
      },
      {
        ftp: {directoryPath: 'a'},
        file: {type: 'somethingElse'},
      },
      {
        ftp: {directoryPath: 'a'},
      },
      {
        type: 'something_else',
        file: {type: 'csv'},
      },
      {
        type: 'something_else',
      },
      {
        file: {type: 'csv'},
      },
      {
        s3: {no_bucket: 'xyz'},
        file: {type: 'csv'},
      },
      {
        s3: {bucket: 'xyz'},
        file: {type: 'somethingElse'},
      },
      {
        s3: {bucket: 'xyz'},
      },
      {
        xyz: 'test',
      },
    ];

    testResources.forEach(res => {
      expect(isFileOrNetSuiteBatchExport(res))
        .toEqual(false);
    });
  });

  describe('generateFieldAndListMappings util', () => {
    test('should flatten field and list mapping for netsuite import type [ftp export of file type csv]', () => {
      const importType = 'netsuite';
      const exportResource = {
        _connectionId: 'test',
        ftp: {
          directoryPath: 'xyz',
        },
        file: {
          type: 'csv',
          csv: {},
        },
      };

      const mapping = {
        fields: [
          {
            generate: 'g1',
            extract: 'e1',
          },

          {
            generate: 'g2',
            hardCodedValue: 'h1',
          },
          {
            generate: 'g3',
            hardCodedValue: 3,
            internalId: true,
          },
          {
            generate: 'g4',
            extract: '[e4 e4]',
          },
        ],
        lists: [
          {
            generate: 'g4',
            fields: [
              {
                generate: 'g1',
                extract: 'e1',
              },
              {
                generate: 'g2',
                extract: 'e2',
              },
            ],
          },
          {
            generate: 'g5',
            fields: [
              {
                generate: 'g1',
                extract: 'e1',
                internalId: true,
              },
              {
                generate: 'g2',
                extract: '[e2 e2]',
              },

            ],
          },
        ],
      };
      const flattenedMapping = [
        {
          generate: 'g1',
          extract: 'e1',
        },
        {
          generate: 'g2',
          hardCodedValue: 'h1',
        },
        {
          generate: 'g3.internalid',
          hardCodedValue: 3,
          internalId: true,
        },
        {
          generate: 'g4',
          extract: 'e4 e4',
        },
        {
          generate: 'g4[*].g1',
          extract: 'e1',
        },
        {
          generate: 'g4[*].g2',
          extract: 'e2',
        },
        // TODO check this
        {
          generate: 'g5[*].g1.internalid',
          extract: 'e1',
          internalId: true,
        },
        {
          generate: 'g5[*].g2',
          extract: 'e2 e2',
        },
      ];

      expect(generateFieldAndListMappings({
        importType,
        mapping,
        exportResource,
        isGroupedSampleData: false,
      })).toEqual(flattenedMapping);
    });

    test('should flatten field and list mapping for netsuite import type [netsuite batch export]', () => {
      const importType = 'netsuite';
      const exportResource = {
        _connectionId: 'test',
        netsuite: {
          type: 'search',
        },
      };

      const mapping = {
        fields: [
          {
            generate: 'g1',
            extract: 'e1',
          },

          {
            generate: 'g2',
            hardCodedValue: 'h1',
          },
          {
            generate: 'g3',
            hardCodedValue: 3,
            internalId: true,
          },
          {
            generate: 'g4',
            extract: '[e4 e4]',
          },
        ],
        lists: [
          {
            generate: 'g4',
            fields: [
              {
                generate: 'g1',
                extract: 'e1',
              },
              {
                generate: 'g2',
                extract: 'e2',
              },
            ],
          },
          {
            generate: 'g5',
            fields: [
              {
                generate: 'g1',
                extract: 'e1',
                internalId: true,
              },
              {
                generate: 'g2',
                extract: '[e2 e2]',
              },

            ],
          },
        ],
      };
      const flattenedMapping = [
        {
          generate: 'g1',
          extract: 'e1',
        },
        {
          generate: 'g2',
          hardCodedValue: 'h1',
        },
        {
          generate: 'g3.internalid',
          hardCodedValue: 3,
          internalId: true,
        },
        {
          generate: 'g4',
          extract: 'e4 e4',
        },
        {
          generate: 'g4[*].g1',
          extract: 'e1',
        },
        {
          generate: 'g4[*].g2',
          extract: 'e2',
        },
        // TODO check this
        {
          generate: 'g5[*].g1.internalid',
          extract: 'e1',
          internalId: true,
        },
        {
          generate: 'g5[*].g2',
          extract: 'e2 e2',
        },
      ];

      expect(generateFieldAndListMappings({
        importType,
        mapping,
        exportResource,
        isGroupedSampleData: false,
      })).toEqual(flattenedMapping);
    });

    test('should flatten field and list mapping for netsuite import type [non netsuite batch export and non csv file export]', () => {
      const importType = 'netsuite';
      const exportResource = {
        _connectionId: 'test',
        something: 'else',
      };

      const mapping = {
        fields: [
          {
            generate: 'g1',
            extract: 'e1',
          },

          {
            generate: 'g2',
            hardCodedValue: 'h1',
          },
          {
            generate: 'g3',
            hardCodedValue: 3,
            internalId: true,
          },
          {
            generate: 'g4',
            extract: '[e4 e4]',
          },
        ],
        lists: [
          {
            generate: 'g4',
            fields: [
              {
                generate: 'g1',
                extract: 'e1',
              },
              {
                generate: 'g2',
                extract: 'e2',
              },
            ],
          },
          {
            generate: 'g5',
            fields: [
              {
                generate: 'g1',
                extract: 'e1',
                internalId: true,
              },
              {
                generate: 'g2',
                extract: '[e2 e2]',
              },

            ],
          },
        ],
      };
      const flattenedMapping = [
        {
          generate: 'g1',
          extract: 'e1',
        },
        {
          generate: 'g2',
          hardCodedValue: 'h1',
        },
        {
          generate: 'g3.internalid',
          hardCodedValue: 3,
          internalId: true,
        },
        {
          generate: 'g4',
          extract: '[e4 e4]',
        },
        {
          generate: 'g4[*].g1',
          extract: 'e1',
        },
        {
          generate: 'g4[*].g2',
          extract: 'e2',
        },
        // TODO check this
        {
          generate: 'g5[*].g1.internalid',
          extract: 'e1',
          internalId: true,
        },
        {
          generate: 'g5[*].g2',
          extract: '[e2 e2]',
        },
      ];

      expect(generateFieldAndListMappings({
        importType,
        mapping,
        exportResource,
        isGroupedSampleData: false,
      })).toEqual(flattenedMapping);
    });

    test('should flatten field and list mapping for non-netsuite import type [non netsuite batch export and non csv file export]', () => {
      const importType = 'netsuite';
      const exportResource = {
        _connectionId: 'test',
        something: 'else',
      };

      const mapping = {
        fields: [
          {
            generate: 'g1',
            extract: 'e1',
          },

          {
            generate: 'g2',
            hardCodedValue: 'h1',
          },
          {
            generate: 'g3',
            hardCodedValue: 3,
            internalId: true,
          },
          {
            generate: 'g4',
            extract: '[e4 e4]',
          },
        ],
        lists: [
          {
            generate: 'g4',
            fields: [
              {
                generate: 'g1',
                extract: 'e1',
              },
              {
                generate: 'g2',
                extract: 'e2',
              },
            ],
          },
          {
            generate: 'g5',
            fields: [
              {
                generate: 'g1',
                extract: 'e1',
                internalId: true,
              },
              {
                generate: 'g2',
                extract: '[e2 e2]',
              },

            ],
          },
        ],
      };
      const flattenedMapping = [
        {
          generate: 'g1',
          extract: 'e1',
        },
        {
          generate: 'g2',
          hardCodedValue: 'h1',
        },
        {
          generate: 'g3.internalid',
          hardCodedValue: 3,
          internalId: true,
        },
        {
          generate: 'g4',
          extract: '[e4 e4]',
        },
        {
          generate: 'g4[*].g1',
          extract: 'e1',
        },
        {
          generate: 'g4[*].g2',
          extract: 'e2',
        },
        {
          generate: 'g5[*].g1.internalid',
          extract: 'e1',
          internalId: true,
        },
        {
          generate: 'g5[*].g2',
          extract: '[e2 e2]',
        },
      ];

      expect(generateFieldAndListMappings({
        importType,
        mapping,
        exportResource,
        isGroupedSampleData: false,
      })).toEqual(flattenedMapping);
    });
  });

  describe('validateMappings util', () => {
    test('should return error in case of duplicate mapping', () => {
      const mapping = [
        {generate: 'a', extract: 'x'},
        {generate: 'a', extract: 'y'},
        {generate: 'b', extract: 'y'},
        {generate: 'b', extract: 'z'},
      ];
      const lookups = [];

      expect(validateMappings(mapping, lookups)).toEqual(
        {
          isSuccess: false,
          errMessage: 'You have duplicate mappings for the field(s): a,b',
        }
      );
    });

    test('should return error in case of generate is missing', () => {
      const mapping = [
        {generate: 'a', extract: 'x'},
        {extract: 'y'},
        {generate: 'b', extract: 'y'},
      ];
      const lookups = [];

      expect(validateMappings(mapping, lookups)).toEqual(
        {
          isSuccess: false,
          errMessage: 'One or more generate fields missing',
        }
      );
    });

    test('should return error in case of extract is missing', () => {
      const mapping = [
        {generate: 'a', extract: 'x'},
        {generate: 'b'},
      ];
      const lookups = [];

      expect(validateMappings(mapping, lookups)).toEqual(
        {
          isSuccess: false,
          errMessage: 'Extract Fields missing for field(s): b',
        }
      );
    });

    test('should not return error in case of extract is missing but hardCodedValue is present', () => {
      const mapping = [
        {generate: 'a', extract: 'x'},
        {generate: 'b', hardCodedValue: 'x'},
      ];
      const lookups = [];

      expect(validateMappings(mapping, lookups)).toEqual(
        {
          isSuccess: true,
        }
      );
    });

    test('should not return error in case of mapping list is complete', () => {
      const mapping = [
        {generate: 'a', extract: 'x'},
        {generate: 'b', extract: 'y'},
      ];
      const lookups = [];

      expect(validateMappings(mapping, lookups)).toEqual(
        {
          isSuccess: true,
        }
      );
    });

    test('should not return error in case of mapping list is empty', () => {
      const mapping = [];
      const lookups = [];

      expect(validateMappings(mapping, lookups)).toEqual(
        {
          isSuccess: true,
        }
      );
    });
  });

  describe('updateMappingConfigs util', () => {
    test('should generate field-list mapping correctly for netsuite import [non salesforce export ]', () => {
      const flatMapping = [
        {
          generate: 'g1',
          extract: 'e1',
        },
        {
          generate: 'g2',
          hardCodedValue: 'h1',
        },
        {
          generate: 'g3.internalid',
          hardCodedValue: 3,
          internalId: true,
        },
        {
          generate: 'g4',
          extract: 'e4 e4',
        },
        {
          generate: 'g4[*].g1',
          extract: 'e1',
        },
        {
          generate: 'g4[*].g2',
          extract: 'e2',
        },
        // TODO check this
        {
          generate: 'g5[*].g1.internalid',
          extract: 'e1',
          internalId: true,
        },
        {
          generate: 'g5[*].g2',
          extract: 'e2 e2',
        },
      ];
      const fieldListMapping = {
        fields: [
          {
            generate: 'g1',
            extract: 'e1',
            internalId: false,
          },

          {
            generate: 'g2',
            hardCodedValue: 'h1',
            internalId: false,
          },
          {
            generate: 'g3',
            hardCodedValue: 3,
            internalId: true,
          },
          {
            generate: 'g4',
            extract: 'e4 e4',
            internalId: false,
          },
        ],
        lists: [
          {
            generate: 'g4',
            fields: [
              {
                generate: 'g1',
                extract: 'e1',
                internalId: false,
              },
              {
                generate: 'g2',
                extract: 'e2',
                internalId: false,
              },
            ],
          },
          {
            generate: 'g5',
            fields: [
              {
                generate: 'g1',
                extract: 'e1',
                internalId: true,
              },
              {
                generate: 'g2',
                extract: 'e2 e2',
                internalId: false,
              },

            ],
          },
        ],
      };

      expect(updateMappingConfigs({
        importType: 'netsuite',
        mappings: flatMapping,
        exportConfig: {},
        options: {
          recordType: 'something',
        },
      })).toEqual(fieldListMapping);
    });

    test('should generate field-list mapping correctly for netsuite import [salesforce export]', () => {
      const flatMapping = [
        {
          generate: 'g1',
          extract: 'e1',
        },
        {
          generate: 'g2',
          hardCodedValue: 'h1',
        },
        {
          generate: 'g3.internalid',
          hardCodedValue: 3,
          internalId: true,
        },
        {
          generate: 'g4',
          extract: 'e4 e4',
        },
        {
          generate: 'g4[*].g1',
          extract: 'e1',
        },
        {
          generate: 'g4',
          extract: 'e2[*].g2',
        },
        // TODO check this
        {
          generate: 'g5[*].g1.internalid',
          extract: 'e1',
          internalId: true,
        },
        {
          generate: 'g5[*].g2',
          extract: 'e2 e2',
        },
      ];
      const fieldListMapping = {
        fields: [
          {
            generate: 'g1',
            extract: 'e1',
            internalId: false,
          },

          {
            generate: 'g2',
            hardCodedValue: 'h1',
            internalId: false,
          },
          {
            generate: 'g3',
            hardCodedValue: 3,
            internalId: true,
          },
          {
            generate: 'g4',
            extract: 'e4 e4',
            internalId: false,
          },
          {
            extract: 'e2.g2',
            generate: 'g4',
            internalId: false,
          },
        ],
        lists: [
          {
            generate: 'g4',
            fields: [
              {
                generate: 'g1',
                extract: 'e1',
                internalId: false,
              },
            ],
          },
          {
            generate: 'g5',
            fields: [
              {
                generate: 'g1',
                extract: 'e1',
                internalId: true,
              },
              {
                generate: 'g2',
                extract: 'e2 e2',
                internalId: false,
              },

            ],
          },
        ],
      };

      expect(updateMappingConfigs({
        importType: 'netsuite',
        mappings: flatMapping,
        exportConfig: {
          type: 'salesforce',
          salesforce: {
            soql: {
              query: 'xyz',
            },
          },
        },
        options: {
          childRelationships: [],
        },
      })).toEqual(fieldListMapping);
    });

    test('should generate field-list mapping correctly for salesforce import and non-salesforce export', () => {
      const flatMapping = [
        {
          generate: 'g1',
          extract: 'e1',
        },
        {
          generate: 'g2',
          hardCodedValue: 'h1',
        },
        {
          generate: 'g3.internalid',
          hardCodedValue: 3,
          internalId: true,
        },
        {
          generate: 'specific_generate[*].test',
          extract: 'e4 e4',
        },
        {
          generate: 'g4[*].g1',
          extract: 'e1',
        },
        {
          generate: 'g4',
          extract: 'e2[*].g2',
        },
        // TODO check this
        {
          generate: 'g5[*].g1',
          extract: 'e1',
          internalId: true,
        },
        {
          generate: 'g5[*].g2',
          extract: 'e2 e2',
        },
      ];
      const fieldListMapping = {
        fields: [
          {
            generate: 'g1',
            extract: 'e1',
            internalId: false,
          },

          // todo
          {
            generate: 'g2',
            hardCodedValue: 'h1',
            // internalId: false,
          },
          {
            generate: 'g3.internalid',
            hardCodedValue: 3,
            internalId: true,
          },
          {
            extract: 'e2[*].g2',
            generate: 'g4',
            internalId: false,
          },
        ],
        lists: [
          {
            generate: 'specific_generate',
            fields: [
              {
                extract: 'e4 e4',
                internalId: false,
                generate: 'test',
              },
            ],
            salesforce: {
              relationshipField: 'rel_field',
              sObjectType: 'childObject',
            },
          },
          {
            generate: 'g4',
            fields: [
              {
                generate: 'g1',
                extract: 'e1',
                internalId: false,
              },
            ],
          },
          {
            generate: 'g5',
            fields: [
              {
                generate: 'g1',
                extract: 'e1',
                internalId: false,
              },
              {
                generate: 'g2',
                extract: 'e2 e2',
                internalId: false,
              },

            ],
          },
        ],
      };

      expect(updateMappingConfigs({
        importType: 'salesforce',
        mappings: flatMapping,
        exportConfig: {
          type: 'something',
        },
        options: {
          childRelationships: [{value: 'specific_generate', field: 'rel_field', childSObject: 'childObject'}],
        },
      })).toEqual(fieldListMapping);
    });
  });

  describe('getFormattedGenerateData util', () => {
    test('should format data correctly for salesforce import', () => {
      const inputData = [
        {value: 'a', type: 't', label: 'l', picklistValues: [], childSObject: 'something', relationshipName: 'rel'},
        {value: 'b1', type: 'b2', label: 'b3', picklistValues: [], childSObject: 'something', relationshipName: 'rel'},
      ];
      const result = [
        {id: 'a', type: 't', name: 'l', options: [], childSObject: 'something', relationshipName: 'rel'},
        {id: 'b1', type: 'b2', name: 'b3', options: [], childSObject: 'something', relationshipName: 'rel'},
      ];

      expect(getFormattedGenerateData(inputData, 'salesforce'))
        .toEqual(result);
    });

    test('should format data correctly for netsuite import', () => {
      const inputData = [
        {value: 'a', type: 't', label: 'l', sublist: []},
        {value: 'b1', type: 'b2', label: 'b3', sublist: []},
      ];
      const result = [
        {id: 'a', type: 't', name: 'l', sublist: []},
        {id: 'b1', type: 'b2', name: 'b3', sublist: []},
      ];

      expect(getFormattedGenerateData(inputData, 'netsuite'))
        .toEqual(result);
    });
    test('should not format data for any other import [except netsuite and salesforce]', () => {
      const inputData = [
        {something: 's'},
        {xyz: 'asd'},
      ];
      const result = [
        {something: 's'},
        {xyz: 'asd'},
      ];

      expect(getFormattedGenerateData(inputData, 'other'))
        .toEqual(result);
    });
  });

  describe('getExtractPaths util', () => {
    test('should return extract path from jsonPath correctly', () => {
      const testCases = [
        {
          fields: {a: [{b: 'c'}], d: 'e'},
          jsonPath: undefined,
          output: [{id: 'a.length', type: 'number'}, {id: 'd', type: 'string'}, {id: 'a[*].b', type: 'string'}],
        },
        {
          fields: [{a: [{b: 'c'}], d: 'e'}],
          jsonPath: undefined,
          output: [{id: 'a.length', type: 'number'}, {id: 'd', type: 'string'}, {id: 'a[*].b', type: 'string'}],
        },
        {
          fields: [{a: [{b: 'c'}], d: 'e'}],
          jsonPath: '$',
          output: [{id: 'a.length', type: 'number'}, {id: 'd', type: 'string'}, {id: 'a[*].b', type: 'string'}],
        },
        {
          fields: [{a: [{b: 'c'}], d: 'e'}],
          jsonPath: '',
          output: [{id: 'a.length', type: 'number'}, {id: 'd', type: 'string'}, {id: 'a[*].b', type: 'string'}],
        },
        {
          fields: [{a: [{b: {e: {f: 'e'}}}], d: 'e'}],
          jsonPath: 'a',
          output: [{id: 'b.e.f', type: 'string'}],
        },
        {
          fields: [{a: [{b: [{e: {f: 'e'}}]}], d: 'e'}],
          jsonPath: 'a',
          output: [{id: 'b.length', type: 'number'}, {id: 'b[*].e.f', type: 'string'}],
        },
      ];

      testCases.forEach(({fields, jsonPath, output}) => {
        expect(getExtractPaths(fields, jsonPath))
          .toEqual(output);
      });
    });
  });

  describe('getSuiteScriptAppType util', () => {
    test('should return correct suitescript app type', () => {
      const testCases = [
        { resourceName: 'netsuite', result: 'Netsuite'},
        { resourceName: 'rakuten', result: 'Rakuten'},
        { resourceName: 'sears', result: 'Sears'},
        { resourceName: 'newegg', result: 'Newegg'},
        { resourceName: 'salesforce', result: 'Salesforce'},
        { resourceName: 'something', result: undefined},
      ];

      testCases.forEach(({resourceName, result}) => {
        expect(getSuiteScriptAppType(resourceName))
          .toEqual(result);
      });
    });
  });

  describe('getSuiteScriptAppType util', () => {
    test('should return true in case 2 compared mapping is equal', () => {
      const mappingItem1 = {generate: 'a', extract: 'b', key: 'k1'};
      const mappingItem2 = {generate: 'a', extract: 'b', key: 'k3'};

      expect(isMappingObjEqual(mappingItem1, mappingItem2))
        .toEqual(true);
    });

    test('should return false in case 2 compared mapping is equal[1]', () => {
      const mappingItem1 = {generate: 'a', extract: 'b', key: 'k1'};
      const mappingItem2 = {generate: 'a', extract: 'w', key: 'k1'};

      expect(isMappingObjEqual(mappingItem1, mappingItem2))
        .toEqual(false);
    });
    test('should return false in case 2 compared mapping is equal[2]', () => {
      const mappingItem1 = {generate: 'a', extract: 'b', key: 'k1'};
      const mappingItem2 = {generate: '', extract: 'w', key: 'k1'};

      expect(isMappingObjEqual(mappingItem1, mappingItem2))
        .toEqual(false);
    });
  });
});

