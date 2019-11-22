import { call } from 'redux-saga/effects';
import { getNetsuiteOrSalesforceMeta } from '../resources/meta';
import { adaptorTypeMap } from '../../utils/resource';

export default function* requestRealTimeMetadata({ resource }) {
  const { adaptorType } = resource;
  const appType = adaptorTypeMap[adaptorType];

  if (appType) {
    switch (appType) {
      case 'netsuite': {
        const {
          _connectionId: connectionId,
          netsuite = {},
          // eslint-disable-next-line camelcase
          netsuite_da = {},
        } = resource;
        const recordType =
          (netsuite.distributed && netsuite.distributed.recordType) ||
          netsuite_da.recordType;

        yield call(getNetsuiteOrSalesforceMeta, {
          connectionId,
          commMetaPath: `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${recordType}`,
        });

        break;
      }

      case 'salesforce': {
        const { _connectionId: connectionId, salesforce } = resource;

        yield call(getNetsuiteOrSalesforceMeta, {
          connectionId,
          commMetaPath: `salesforce/metadata/connections/${connectionId}/sObjectTypes/${salesforce.sObjectType}`,
        });
        break;
      }

      default:
    }
  }
}
