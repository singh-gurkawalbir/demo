import { call, select } from 'redux-saga/effects';
import { getNetsuiteOrSalesforceMeta } from '../../resources/meta';
import { getMetadataOptions } from '../../../reducers';

export default function* fetchMetadata({
  connectionId,
  commMetaPath,
  filterKey = 'raw',
}) {
  let metadata = yield select(getMetadataOptions, {
    connectionId,
    commMetaPath,
    filterKey,
  });

  if (!metadata || !metadata.data) {
    yield call(getNetsuiteOrSalesforceMeta, {
      connectionId,
      commMetaPath,
    });
    metadata = yield select(getMetadataOptions, {
      connectionId,
      commMetaPath,
      filterKey,
    });
  }

  return metadata;
}
