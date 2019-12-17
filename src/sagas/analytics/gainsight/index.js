import { takeEvery, select } from 'redux-saga/effects';
import actionTypes from '../../../actions/types';
import * as selectors from '../../../reducers';
import * as gainsight from '../../../utils/analytics/gainsight';
import { ACCOUNT_IDS } from '../../../utils/constants';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../../constants/resource';
import { getResourceSubType } from '../../../utils/resource';

export function* identifyUser() {
  const { _id, name, email, company, createdAt } = yield select(
    selectors.userProfile
  );
  const { defaultAShareId } = yield select(selectors.userPreferences);
  const [firstName, ...lastName] = (name || '').split(' ');
  const accountInfo = {
    id: defaultAShareId === ACCOUNT_IDS.OWN ? _id : defaultAShareId,
    name: company || name,
  };
  const userInfo = {
    id: `${accountInfo.id}_${_id}`,
    _userId: _id,
    email,
    firstName,
    lastName: lastName.join(' '),
    signUpDate: createdAt ? new Date(createdAt).getTime() : '',
  };

  gainsight.identify(userInfo, accountInfo);
}

export function trackEvent({ eventId, details }) {
  gainsight.track(eventId, details);
}

export function* trackResourceCreatedEvent({ id, resourceType }) {
  const resource = yield select(selectors.resource, resourceType, id);
  const resourceTypeSingular = RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType];

  if (!resourceTypeSingular) {
    return true;
  }

  const eventId = `${resourceTypeSingular.toUpperCase()}_CREATED`;
  /**
   * TODO We need to update this to get the required details for each resource type
   * once https://celigo.atlassian.net/browse/IO-10222 is updated with required details.
   */
  const details = getResourceSubType(resource);

  trackEvent({ eventId, details });
}

export const gainsightSagas = [
  takeEvery(actionTypes.DEFAULT_ACCOUNT_SET, identifyUser),
  takeEvery(actionTypes.RESOURCE.CREATED, trackResourceCreatedEvent),
  takeEvery(actionTypes.ANALYTICS.GAINSIGHT.TRACK_EVENT, trackEvent),
];
