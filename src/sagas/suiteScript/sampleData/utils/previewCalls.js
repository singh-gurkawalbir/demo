import { select, call } from 'redux-saga/effects';
import deepClone from 'lodash/cloneDeep';
import { suiteScriptResourceData } from '../../../../reducers';
import { apiCallWithRetry } from '../../index';
import { getFormattedResourceForPreview } from '../../../../utils/suiteScript';

export default function* exportPreview({
  resourceId,
  ssLinkedConnectionId,
  hidden = false,
  throwOnError = false,
}) {
  const { merged: resource } = yield select(suiteScriptResourceData, {
    resourceType: 'exports',
    id: resourceId,
    ssLinkedConnectionId,
  });
  let body = deepClone(resource);

  // getFormattedResourceForPreview util removes unnecessary props of resource that should not be sent in preview calls
  // Example: type: once should not be sent while previewing
  body = getFormattedResourceForPreview(body);

  const path = `/exports/preview`;

  try {
    const previewData = yield call(apiCallWithRetry, {
      path,
      opts: { method: 'POST', body },
      message: `Fetching Exports Preview`,
      hidden,
    });

    return previewData;
  } catch (e) {
    // Error handler
    if (throwOnError) {
      throw e;
    }
  }
}
