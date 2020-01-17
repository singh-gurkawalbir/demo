import { call, takeEvery } from 'redux-saga/effects';
import { apiCallWithRetry } from '../..';
import actionTypes from '../../../actions/types';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../../constants/resource';

function* postFeedback({ resourceType, fieldId, helpful, feedback }) {
  try {
    yield call(
      apiCallWithRetry,

      {
        path: '/fieldHelp',
        opts: {
          method: 'POST',
          body: {
            resource: RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType],
            field: fieldId,
            helpful,
            feedback,
          },
        },
        message: 'Sending feedback',
      }
    );
    // eslint-disable-next-line no-empty
  } catch (e) {}
}

const feedbackSagas = [takeEvery(actionTypes.POST_FEEDBACK, postFeedback)];

export default feedbackSagas;
