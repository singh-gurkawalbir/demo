import { call, select } from 'redux-saga/effects';
import { getNetsuiteOrSalesforceMeta } from '../../resources/meta';
import { getMetadataOptions } from '../../../reducers';

export default function* fetchMetadata({
  connectionId,
  commMetaPath,
  filterKey = 'raw',
  refresh = false,
}) {
  let metadata = yield select(getMetadataOptions, {
    connectionId,
    commMetaPath,
    filterKey,
  });
  // Incase of refreshMode, fetch NS/SF metadata each time requested
  if (refresh || !metadata || !metadata.data) {
    yield call(getNetsuiteOrSalesforceMeta, {
      connectionId,
      commMetaPath,
      addInfo: { refreshCache: refresh}
    });
    metadata = yield select(getMetadataOptions, {
      connectionId,
      commMetaPath,
      filterKey,
    });
  }

  return metadata;
}
