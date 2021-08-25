/* global describe, test */

import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { parseFileData, parseFileDefinition } from '../utils/fileParserUtils';
import fileAdaptorSampleData from './fileAdaptorSampleData';
import realTimeSampleData, { _attachRelatedLists } from './realTimeSampleData';
import fetchMetadata from '../utils/metadataUtils';
import {
  getNetsuiteRealTimeSampleData,
  getSalesforceRealTimeSampleData,
} from '../../../utils/sampleData';
import { getReferenceFieldsMap } from '../../../utils/metadata';

const sfAccountMetadata = {
  actionOverrides: [],
  activateable: false,
  childRelationships: [
    {
      cascadeDelete: false,
      childSObject: 'User',
      deprecatedAndHidden: false,
      field: 'AccountId',
      junctionIdListNames: [],
      junctionReferenceTo: [],
      relationshipName: 'Users',
      restrictedDelete: false,
    },
    {
      cascadeDelete: true,
      childSObject: 'AccountPartner',
      deprecatedAndHidden: false,
      field: 'AccountToId',
      junctionIdListNames: [],
      junctionReferenceTo: [],
      relationshipName: 'AccountPartnersTo',
      restrictedDelete: false,
    },
  ],
  fields: [],
};

const sfAccountPartnerMetadata = {
  actionOverrides: [],
  activateable: false,
  compactLayoutable: true,
  createable: true,
  custom: false,
  fields: [],
};
const sfCustomerMetadata = {
  actionOverrides: [],
  activateable: false,
  compactLayoutable: true,
  createable: true,
  custom: false,
  fields: [],
};

const sfUserMetadata = {
  actionOverrides: [],
  activateable: false,
  childRelationships: [
    {
      cascadeDelete: false,
      childSObject: 'AcceptedEventRelation',
      deprecatedAndHidden: false,
      field: 'CreatedById',
      junctionIdListNames: [],
      junctionReferenceTo: [],
      relationshipName: null,
      restrictedDelete: false,
    },
  ],
  name: 'User',
  fields: [],
};

describe('Sample data generator sagas', () => {
  describe('fileAdaptorSampleData related sagas', () => {
    describe('fileAdaptorSampleData saga', () => {
      test('should return undefined incase of not a valid ftp resource', () => {
        const resource = {
          _id: '123',
          adaptorType: 'RESTExport',
        };
        const test1 = expectSaga(fileAdaptorSampleData, { resource })
          .not.call.fn(parseFileData)
          .not.call.fn(parseFileDefinition)
          .returns(undefined)
          .run();
        const test2 = expectSaga(fileAdaptorSampleData, { resource: null })
          .not.call.fn(parseFileData)
          .not.call.fn(parseFileDefinition)
          .returns(undefined)
          .run();

        return test1 && test2;
      });
      test('should call parseFileData saga to calculate sample data for csv, xlsx and xml file types', () => {
        const sampleData = "CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PART_NUM|LIST_PRICE|DESCRIPTION|CONTRACT_PRICE|QUANTITY_AVAILABLE\nC1000010839|Sato|12S000357CS|12S000357CS|99.12|wax rib 3.00\"X84',T113L,CSO,1\"core,24/cs|60.53|0\nC1000010839|Unitech|1400-900035G|1400-900035G|80.00|PA720/PA726 3.6V 3120mAH BATTERY -20C|43.53|0\nC1000010839|Magtek|21073131-NMI|21073131NMI|150.00|iDynamo 5 with NMI Encryption|89.29|0";

        const ftpResource = {
          _id: '123',
          file: {
            type: 'csv',
          },
          sampleData,
        };

        const csvParsedData = [{
          CONTRACT_PRICE: 'CONTRACT_PRICE',
          CUSTOMER_NUMBER: 'CUSTOMER_NUMBER',
          DESCRIPTION: 'DESCRIPTION',
          DISTRIBUTOR_PART_NUM: 'DISTRIBUTOR_PART_NUM',
          LIST_PRICE: 'LIST_PRICE',
          QUANTITY_AVAILABLE: 'QUANTITY_AVAILABLE',
          VENDOR_NAME: 'VENDOR_NAME',
          VENDOR_PART_NUM: 'VENDOR_PART_NUM',
        }];

        const expectedCsvSampleData = csvParsedData[0];

        return expectSaga(fileAdaptorSampleData, { resource: ftpResource })
          .provide([
            [call(parseFileData, {
              sampleData,
              resource: ftpResource,
            }), { data: expectedCsvSampleData}],
          ])
          .call.fn(parseFileData)
          .not.call.fn(parseFileDefinition)
          .returns(expectedCsvSampleData)
          .run();
      });
      test('should call parseFileDefinition saga to fetch file definition related sample data for the resource', () => {
        const sampleData = 'UNB+UNOC:3+<Sender GLN>:14+<Receiver GLN>:14+140407:1000+100+ + + + +EANCOM';
        const fileDefResource = {
          _id: '123',
          adaptorType: 'FTPExport',
          file: {
            type: 'filedefinition',
            fileDefinition: {
              _fileDefinitionId: '555',
            },
          },
          sampleData,
        };

        const expectedFileDefSampleData = {
          'SYNTAX IDENTIFIER': {
            'Syntax identifier': 'UNOC',
            'Syntax version number': '3',
          },
        };

        return expectSaga(fileAdaptorSampleData, { resource: fileDefResource })
          .provide([
            [call(parseFileDefinition, {
              sampleData,
              resource: fileDefResource,
            }), { data: expectedFileDefSampleData }],
          ])
          .not.call.fn(parseFileData)
          .call.fn(parseFileDefinition)
          .returns(expectedFileDefSampleData)
          .run();
      });
      test('should return json calculated sample data from the ftp json resource passed  ', () => {
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
        const ftpJsonResource = {
          _id: '123',
          file: {
            type: 'json',
            json: {resourcePath: 'file'},
          },
          sampleData,
        };
        const expectedPreviewData = {data: 'jsonData', node: true, type: 'csv', whitespace: ''};

        return expectSaga(fileAdaptorSampleData, { resource: ftpJsonResource })
          .provide([
            [call(parseFileData, {
              sampleData,
              resource: ftpJsonResource,
            }), { data: expectedPreviewData}],
          ])
          .call.fn(parseFileData)
          .not.call.fn(parseFileDefinition)
          .returns(expectedPreviewData)
          .run();
      });
      test('should return undefined incase of invalid file type', () => {
        const resource = {
          _id: '123',
          file: {
            type: 'INVALID_FILE_TYPE',
          },
        };

        return expectSaga(fileAdaptorSampleData, { resource })
          .not.call.fn(parseFileData)
          .not.call.fn(parseFileDefinition)
          .returns(undefined)
          .run();
      });
    });
  });
  describe('realTimeSampleData related sagas', () => {
    describe('realTimeSampleData saga', () => {
      test('should do nothing in case of invalid resource', () => expectSaga(realTimeSampleData, { resource: null })
        .not.call.fn(fetchMetadata)
        .returns(undefined)
        .run());
      test('should do nothing incase of NS resource without recordType', () => {
        const nsResource = {
          _id: '123',
          adaptorType: 'NetSuiteExport',
          netsuite: {
            distributed: {},
          },
        };

        return expectSaga(realTimeSampleData, { resource: nsResource })
          .not.call.fn(fetchMetadata)
          .returns(undefined)
          .run();
      });
      test('should do nothing incase of SF resource without sObjectType', () => {
        const sfResource = {
          _id: '123',
          adaptorType: 'SalesforceExport',
          salesforce: {
            distributed: {},
          },
        };

        return expectSaga(realTimeSampleData, { resource: sfResource })
          .not.call.fn(fetchMetadata)
          .returns(undefined)
          .run();
      });
      test('should call fetchMetadata saga and return sample data from the metadata incase of NS resource ', () => {
        const connectionId = 'conn-123';
        const recordType = 'account';

        const nsResource = {
          _id: '123',
          _connectionId: connectionId,
          adaptorType: 'NetSuiteExport',
          netsuite: {
            distributed: { recordType },
          },
        };
        const commMetaPath = `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${recordType}`;
        const nsSampleMetadata = [
          {group: 'Body Field', id: 'thirdpartyacct', name: '3rd Party Billing Account Number', type: 'text'},
        ];

        const testWithoutRefresh = expectSaga(realTimeSampleData, { resource: nsResource })
          .provide([
            [call(fetchMetadata, {
              connectionId,
              commMetaPath,
              refresh: undefined,
            }), { data: nsSampleMetadata}],
          ])
          .call.fn(fetchMetadata)
          .returns(getNetsuiteRealTimeSampleData(nsSampleMetadata, recordType))
          .run();
        const testWithRefresh = expectSaga(realTimeSampleData, { resource: nsResource, refresh: true })
          .provide([
            [call(fetchMetadata, {
              connectionId,
              commMetaPath,
              refresh: true,
            }), { data: nsSampleMetadata}],
          ])
          .call.fn(fetchMetadata)
          .returns(getNetsuiteRealTimeSampleData(nsSampleMetadata, recordType))
          .run();

        return testWithoutRefresh && testWithRefresh;
      });
      test('should call fetchMetadata saga and call _attachRelatedLists saga to update sample data and return the same incase of SF resource', () => {
        const connectionId = 'conn-123';
        const sObjectType = 'Account';

        const sfResource = {
          _id: 'id-123',
          _connectionId: connectionId,
          type: 'distributed',
          adaptorType: 'SalesforceExport',
          salesforce: {
            sObjectType,
            distributed: {
              referenceFields: [],
              relatedLists: [{
                referenceFields: ['Account.Description'],
                parentField: 'AccountId',
                sObjectType: 'User',
              }],
            },
          },
        };
        const sampleData = getSalesforceRealTimeSampleData(sfAccountMetadata);
        const commMetaPath = `salesforce/metadata/connections/${connectionId}/sObjectTypes/${sObjectType}`;
        const testWithoutRefresh = expectSaga(realTimeSampleData, { resource: sfResource })
          .provide([
            [call(fetchMetadata, {
              connectionId,
              commMetaPath,
              refresh: undefined,
            }), { data: sfAccountMetadata}],
            [call(_attachRelatedLists, {
              metadata: sampleData,
              relatedLists: sfResource.salesforce.distributed.relatedLists,
              childRelationships: sfAccountMetadata.childRelationships,
              connectionId,
              refresh: undefined,
            }), sampleData],
          ])
          .call.fn(fetchMetadata)
          .call.fn(_attachRelatedLists)
          .returns(sampleData)
          .run();
        const testWithRefresh = expectSaga(realTimeSampleData, { resource: sfResource, refresh: true })
          .provide([
            [call(fetchMetadata, {
              connectionId,
              commMetaPath,
              refresh: true,
            }), { data: sfAccountMetadata}],
            [call(_attachRelatedLists, {
              metadata: sampleData,
              relatedLists: sfResource.salesforce.distributed.relatedLists,
              childRelationships: sfAccountMetadata.childRelationships,
              connectionId,
              refresh: true,
            }), sampleData],
          ])
          .returns(sampleData)
          .run();

        return testWithoutRefresh && testWithRefresh;
      });
      test('should not call _attachRelatedLists saga if the SF resource does not have related lists ', () => {
        const connectionId = 'conn-123';
        const sObjectType = 'Account';

        const sfResource = {
          _id: 'id-123',
          _connectionId: connectionId,
          type: 'distributed',
          adaptorType: 'SalesforceExport',
          salesforce: {
            sObjectType,
            distributed: {
              referenceFields: [],
              relatedLists: [],
            },
          },
        };
        const metadata = {
          actionOverrides: [],
          activateable: false,
          relatedLists: [],
        };
        const sampleData = getSalesforceRealTimeSampleData(metadata);
        const commMetaPath = `salesforce/metadata/connections/${connectionId}/sObjectTypes/${sObjectType}`;

        return expectSaga(realTimeSampleData, { resource: sfResource })
          .provide([
            [call(fetchMetadata, {
              connectionId,
              commMetaPath,
              refresh: undefined,
            }), { data: metadata}],
          ])
          .call.fn(fetchMetadata)
          .not.call.fn(_attachRelatedLists)
          .returns(sampleData)
          .run();
      });

      test('should not call _attachRelatedLists saga and return metadata if SF resource have related lists as null', () => {
        const connectionId = 'conn-123';
        const sObjectType = 'Account';

        const sfResource = {
          _id: 'id-123',
          _connectionId: connectionId,
          type: 'distributed',
          adaptorType: 'SalesforceExport',
          salesforce: {
            sObjectType,
            distributed: {
              referenceFields: [],
              relatedLists: null,
            },
          },
        };
        const metadata = {
          actionOverrides: [],
          activateable: false,
          relatedLists: [],
        };
        const sampleData = getSalesforceRealTimeSampleData(metadata);
        const commMetaPath = `salesforce/metadata/connections/${connectionId}/sObjectTypes/${sObjectType}`;

        return expectSaga(realTimeSampleData, { resource: sfResource })
          .provide([
            [call(fetchMetadata, {
              connectionId,
              commMetaPath,
              refresh: undefined,
            }), { data: metadata}],
          ])
          .call.fn(fetchMetadata)
          .not.call.fn(_attachRelatedLists)
          .returns(sampleData)
          .run();
      });

      test('should return undefined if the resource has no sampleData and it is a webhook', () => {
        const webhookResource = {
          _id: '123',
          type: 'webhook',
          adaptorType: 'WebhookExport',
        };

        return expectSaga(realTimeSampleData, { resource: webhookResource })
          .returns(undefined)
          .run();
      });
      test('should return sampleData if the resource has sampleData and it is a webhook', () => {
        const webhookResource = {
          _id: '123',
          type: 'webhook',
          adaptorType: 'WebhookExport',
          sampleData: { test: 5 },
        };

        return expectSaga(realTimeSampleData, { resource: webhookResource })
          .returns(webhookResource.sampleData)
          .run();
      });
    });
    describe('_attachRelatedLists saga', () => {
      test('should return passed metadata if there are no relatedLists', () => expectSaga(_attachRelatedLists, { metadata: sfAccountMetadata, relatedLists: [] })
        .returns(sfAccountMetadata)
        .run());
      test('should call fetchMetadata for all the relatedLists and add its metadata against relationShipName passed in childRelationships', () => {
        const connectionId = 'conn-123';
        const refresh = false;
        const relatedLists = [
          {
            referencedFields: ['Account.Description'],
            parentField: 'AccountId',
            sObjectType: 'User',
          },
          {
            referencedFields: ['AccountFrom.Active__c', 'AccountFrom.Type'],
            parentField: 'AccountFromId',
            sObjectType: 'AccountPartner',
          }];
        const metadata = getSalesforceRealTimeSampleData(sfAccountMetadata);

        const [userRelation, accPartnerRelation] = sfAccountMetadata.childRelationships;
        const [userRelatedList, accPartnerRelatedList] = relatedLists;

        const expectedRealtimeSampleData = {
          ...metadata,
          [accPartnerRelation.relationshipName]: [{
            ...getSalesforceRealTimeSampleData(sfAccountPartnerMetadata),
            ...getReferenceFieldsMap(accPartnerRelatedList.referencedFields),
          }],
          [userRelation.relationshipName]: [{
            ...getSalesforceRealTimeSampleData(sfUserMetadata),
            ...getReferenceFieldsMap(userRelatedList.referencedFields),
          }],
        };

        return expectSaga(_attachRelatedLists, {
          metadata,
          relatedLists,
          connectionId,
          childRelationships: sfAccountMetadata.childRelationships,
          refresh,
        })
          .provide([
            [call(fetchMetadata, {
              connectionId,
              commMetaPath: `salesforce/metadata/connections/${connectionId}/sObjectTypes/User`,
              refresh,
            }), { data: sfUserMetadata}],
            [call(fetchMetadata, {
              connectionId,
              commMetaPath: `salesforce/metadata/connections/${connectionId}/sObjectTypes/AccountPartner`,
              refresh,
            }), { data: sfAccountPartnerMetadata}],
          ])
          .returns(expectedRealtimeSampleData)
          .run();
      });
      test('should call fetchMetadata for all the relatedLists and add its metadata against sObject name if there is no relationShipName passed in childRelationships', () => {
        const connectionId = 'conn-123';
        const refresh = false;
        const relatedLists = [
          {
            referencedFields: ['Account.Description'],
            parentField: 'AccountId',
            sObjectType: 'Customer',
          }];

        const metadata = getSalesforceRealTimeSampleData(sfAccountMetadata);

        const expectedRealtimeSampleData = {
          ...metadata,
          Customer: [{
            ...getSalesforceRealTimeSampleData(sfCustomerMetadata),
            ...getReferenceFieldsMap(relatedLists[0].referencedFields),
          }],
        };

        return expectSaga(_attachRelatedLists, {
          metadata,
          relatedLists,
          connectionId,
          childRelationships: sfAccountMetadata.childRelationships,
          refresh,
        })
          .provide([
            [call(fetchMetadata, {
              connectionId,
              commMetaPath: `salesforce/metadata/connections/${connectionId}/sObjectTypes/Customer`,
              refresh,
            }), { data: sfCustomerMetadata}],
          ])
          .returns(expectedRealtimeSampleData)
          .run();
      });
    });
  });
});
