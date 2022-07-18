import { call, takeEvery, put, all, select } from 'redux-saga/effects';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import actions from '../../actions';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../constants/resource';
import { getResourceCollection } from '../resources';
import { selectors } from '../../reducers';
import { USER_ACCESS_LEVELS } from '../../constants';

export function* getRestoredResourceDependencies({ restoredResourceType }) {
  const { accessLevel } = (yield select(selectors.resourcePermissions)) || {};

  const hasMyApiResourcesAccess = [USER_ACCESS_LEVELS.ACCOUNT_OWNER, USER_ACCESS_LEVELS.ACCOUNT_ADMIN].includes(accessLevel);

  const connectionDependencies = ['connections', 'agents'];
  const allResources = [
    'flows',
    'exports',
    'imports',
    'stacks',
    'scripts',
    'integrations',
    ...connectionDependencies,
    // API resource can only be loaded if the  access is either admin/owner Ref:IO-24227
    ...(hasMyApiResourcesAccess ? ['apis'] : []),
  ];

  const dependencies = {
    stacks: ['stacks'],
    scripts: ['scripts'],
    agents: ['agents'],
    connections: connectionDependencies,
    exports: ['exports', ...connectionDependencies],
    imports: ['imports', ...connectionDependencies],
    flows: allResources,
    integrations: allResources,
  };

  return dependencies[restoredResourceType] || [];
}

export function* restore({ resourceType, resourceId }) {
  const path = `/recycleBinTTL/${resourceType}/${resourceId}/doCascadeRestore`;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'POST',
        body: {},
      },
    });
  } catch (e) {
    return;
  }

  const dependentResourceTypes = yield call(getRestoredResourceDependencies, { restoredResourceType: resourceType });

  // wait for the completion of resource calls, so that the state is ready for the redirectUrlToResourceListingPage selector
  yield all(
    [...dependentResourceTypes, 'recycleBinTTL'].map(
      resourceType => call(getResourceCollection, { resourceType })
    )
  );

  const listingPageUrl = yield select(
    selectors.redirectUrlToResourceListingPage,
    RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType],
    resourceId
  );

  yield put(actions.recycleBin.restoreRedirectUrl(listingPageUrl));
}

export function* purge({ resourceType, resourceId }) {
  const path = `/recycleBinTTL/${resourceType}/${resourceId}`;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'DELETE',
      },
    });
  } catch (e) {
    return;
  }

  yield put(actions.resource.requestCollection('recycleBinTTL'));
}

export const recycleBinSagas = [
  takeEvery(actionTypes.RECYCLEBIN.RESTORE, restore),
  takeEvery(actionTypes.RECYCLEBIN.PURGE, purge),
];
