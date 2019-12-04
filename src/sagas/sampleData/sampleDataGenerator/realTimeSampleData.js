import { call } from 'redux-saga/effects';
import fetchMetadata from '../utils/metadataUtils';
import {
  getNetsuiteRealTimeSampleData,
  getSalesforceRealTimeSampleData,
} from '../../../utils/sampleData';
import { getReferenceFieldsMap } from '../../../utils/metadata';
/*
 * Should return sample data back from this saga
 * const sampleData = yield call(requestRealTimeMetadata, {resource})
 * Used in 2 places
 * 1. While constructing options.uiData for page processor preview call
 * 2. Pass on for export preview call
 */

function* attachRelatedLists({
  metadata,
  relatedLists = [],
  connectionId,
  childRelationships = [],
}) {
  let mergedMetadata = metadata;

  for (let listIndex = 0; listIndex < relatedLists.length; listIndex += 1) {
    const relatedList = relatedLists[listIndex];
    const { sObjectType, referencedFields = [] } = relatedList;
    const commMetaPath = `salesforce/metadata/connections/${connectionId}/sObjectTypes/${sObjectType}`;
    const { data: sfMetadata = {} } = yield call(fetchMetadata, {
      connectionId,
      commMetaPath,
    });
    const relatedListMetadata = {
      ...getSalesforceRealTimeSampleData(sfMetadata),
      ...getReferenceFieldsMap(referencedFields),
    };
    const { relationshipName } =
      childRelationships.find(
        relation => relation.childSObject === sObjectType
      ) || {};

    mergedMetadata = {
      ...mergedMetadata,
      [relationshipName || sObjectType]: [relatedListMetadata],
    };
  }

  return mergedMetadata;
}

export default function* requestRealTimeMetadata({ resource }) {
  const { adaptorType } = resource;

  if (adaptorType) {
    switch (adaptorType) {
      case 'NetSuiteExport': {
        const { _connectionId: connectionId, netsuite = {} } = resource;
        const recordType =
          netsuite.distributed && netsuite.distributed.recordType;

        if (!recordType) return;
        const commMetaPath = `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${recordType}`;
        const nsMetadata = yield call(fetchMetadata, {
          connectionId,
          commMetaPath,
        });
        const { data: metadata } = nsMetadata;

        return getNetsuiteRealTimeSampleData(metadata, recordType);
      }

      case 'SalesforceExport': {
        // Adding basic flow for Salesforce Sample data
        // Need to add actual logic and return the same
        const { _connectionId: connectionId, salesforce } = resource;
        const { sObjectType, distributed = {} } = salesforce;
        const { referencedFields = [], relatedLists = [] } = distributed;
        const commMetaPath = `salesforce/metadata/connections/${connectionId}/sObjectTypes/${sObjectType}`;
        const sfMetadata = yield call(fetchMetadata, {
          connectionId,
          commMetaPath,
        });
        let { data: metadata } = sfMetadata;
        const { childRelationships } = metadata;

        metadata = getSalesforceRealTimeSampleData(metadata);
        metadata = { ...metadata, ...getReferenceFieldsMap(referencedFields) };

        return yield call(attachRelatedLists, {
          metadata,
          relatedLists: relatedLists || [],
          childRelationships,
          connectionId,
        });
      }

      case 'WebhookExport': {
        const { sampleData } = resource;

        return sampleData;
      }

      default:
    }
  }
}
