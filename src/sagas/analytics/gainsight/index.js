import { takeEvery, select } from 'redux-saga/effects';
import actionTypes from '../../../actions/types';
import * as selectors from '../../../reducers';
import * as gainsight from '../../../utils/analytics/gainsight';
import { ACCOUNT_IDS } from '../../../utils/constants';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../../constants/resource';

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

  try {
    gainsight.identity(userInfo, accountInfo);
    // eslint-disable-next-line no-empty
  } catch (error) {}
}

export function trackEvent(id, details) {
  gainsight.track(id, details);
}

export function* trackResourceCreatedEvent({ id, resourceType }) {
  const resource = yield select(selectors.resource, resourceType, id);
  const eventId = `${RESOURCE_TYPE_PLURAL_TO_SINGULAR[
    resourceType
  ].toUpperCase()}_CREATED`;
  const details = {};

  if (['connections', 'exports', 'imports'].includes(resourceType)) {
    details.type = resource.type || resource.adaptorType;
    details.assistant = resource.assistant;
  }

  trackEvent(eventId, details);
}

export const gainsightSagas = [
  // takeEvery(actionTypes.ANALYTICS.GAINSIGHT.IDENTIFY_USER, identifyUser),
  takeEvery(actionTypes.DEFAULT_ACCOUNT_SET, identifyUser),
  takeEvery(actionTypes.RESOURCE.CREATED, trackResourceCreatedEvent),
  takeEvery(actionTypes.ANALYTICS.GAINSIGHT.TRACK_EVENT, trackEvent),
];
