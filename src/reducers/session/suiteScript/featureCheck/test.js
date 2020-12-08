/* global describe, test, expect */
import reducer, {selectors} from '.';
import actions from '../../../../actions/suiteScript';
import { COMM_STATES } from '../../../comms/networkComms';

const intialState = {

  '1-2-someFeature': COMM_STATES.LOADING,
};

describe('featurecheck reducer', () => {
  const ssConnectionId = 'someSSConnectionId';
  const integrationId = 'someIntegrationId';
  const feature = 'someFeature';
  const generatedKey = 'someSSConnectionId-someIntegrationId-someFeature';

  test('should return state unaltered when invalid action ids are sent like null, undefined, "', () => {
    expect(reducer(intialState,
      actions.featureCheck.request(null, '', null))).toEqual(intialState);
    expect(reducer(intialState,
      actions.featureCheck.request(undefined, undefined, ''))).toEqual(intialState);
    expect(reducer(intialState,
      actions.featureCheck.request('', null, undefined))).toEqual(intialState);
  });

  test('should initiate a loading state when feature request is made', () => {
    const state = reducer(intialState, actions.featureCheck.request(ssConnectionId, integrationId, feature));

    expect(state).toEqual({
      '1-2-someFeature': COMM_STATES.LOADING,

      [generatedKey]: {
        status: COMM_STATES.LOADING,
      },
    });
  });
  test('should set a success state when feature request is successful', () => {
    const state = reducer(intialState, actions.featureCheck.successful(ssConnectionId, integrationId, feature));

    expect(state).toEqual({
      '1-2-someFeature': COMM_STATES.LOADING,

      [generatedKey]: {
        status: COMM_STATES.SUCCESS,
      },
    });
  });
  test('should set a failure state when feature request fails', () => {
    const error = 'some error';
    const state = reducer(intialState, actions.featureCheck.failed(ssConnectionId, integrationId, feature, error));

    expect(state).toEqual({
      '1-2-someFeature': COMM_STATES.LOADING,
      [generatedKey]: {
        status: COMM_STATES.ERROR,
        message: error,
      },
    });
  });
  test('should clear the corresponding feature state when feature clear is called', () => {
    const state = reducer(intialState, actions.featureCheck.clear(ssConnectionId, integrationId, feature));

    expect(state).toEqual({
      '1-2-someFeature': COMM_STATES.LOADING,
    });
  });

  test('should function correctly in a feature success flow', () => {
    let state = reducer(intialState, actions.featureCheck.request(ssConnectionId, integrationId, feature));

    expect(state).toEqual({
      '1-2-someFeature': COMM_STATES.LOADING,

      [generatedKey]: {
        status: COMM_STATES.LOADING,
      },
    });
    state = reducer(state, actions.featureCheck.successful(ssConnectionId, integrationId, feature));
    expect(state).toEqual({
      '1-2-someFeature': COMM_STATES.LOADING,

      [generatedKey]: {
        status: COMM_STATES.SUCCESS,
      },
    });
    // clear called by the component
    state = reducer(state, actions.featureCheck.clear(ssConnectionId, integrationId, feature));
    expect(state).toEqual({
      '1-2-someFeature': COMM_STATES.LOADING,
    });
  });

  test('should function correctly in a feature failure flow', () => {
    let state = reducer(intialState, actions.featureCheck.request(ssConnectionId, integrationId, feature));

    expect(state).toEqual({
      '1-2-someFeature': COMM_STATES.LOADING,

      [generatedKey]: {
        status: COMM_STATES.LOADING,
      },
    });
    const someError = 'some error';

    state = reducer(state, actions.featureCheck.failed(ssConnectionId, integrationId, feature, someError));
    expect(state).toEqual({

      '1-2-someFeature': COMM_STATES.LOADING,

      [generatedKey]: {
        status: COMM_STATES.ERROR,
        message: someError,
      },
    });
    // clear called by the component
    state = reducer(state, actions.featureCheck.clear(ssConnectionId, integrationId, feature));
    expect(state).toEqual({
      '1-2-someFeature': COMM_STATES.LOADING,
    });
  });
});
describe('suiteScriptIAFeatureCheckState', () => {
  const ssLinkedConnectionId = 'someSSConnectionId';
  const integrationId = 'someIntegrationId';
  const featureName = 'someFeature';
  const state = reducer(intialState, actions.featureCheck.request(ssLinkedConnectionId, integrationId, featureName));

  test('should return state correctly it should show a loading state when valid ids are sent through', () => {
    expect(selectors.suiteScriptIAFeatureCheckState(state, {

      ssLinkedConnectionId, integrationId, featureName,
    })).toEqual({
      status: COMM_STATES.LOADING,
    });
  });

  test('should return null correctly when invalid ids are sent through the selector', () => {
    expect(selectors.suiteScriptIAFeatureCheckState(state, {
    })).toEqual(null);
  });
});
