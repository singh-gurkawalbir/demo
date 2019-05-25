/* global describe, test, expect */
import reducer, * as selectors from './';
import actions from '../../../actions';

describe('integrationAShares reducers', () => {
  test('any other action should return default state', () => {
    const newState = reducer(undefined, 'someaction');

    expect(newState).toEqual({});
  });
  test('any other action return original state', () => {
    const someState = { something: 'something' };
    const newState = reducer(someState, 'someaction');

    expect(newState).toEqual(someState);
  });
  test('should update the state properly for integration ashares collection received', () => {
    const integration1Ashares = [
      { ashare1: 'something 1' },
      { ashare2: 'something 2' },
    ];
    // eslint-disable-next-line max-len
    const integration1ASharesCollectionReceivedAction = actions.resource.receivedCollection(
      'integrations/integration1/ashares',
      integration1Ashares
    );
    let newState = reducer({}, integration1ASharesCollectionReceivedAction);

    expect(newState).toEqual({ integration1: integration1Ashares });

    const integration2Ashares = [
      { ashare3: 'something 1' },
      { ashare4: 'something 2' },
    ];
    // eslint-disable-next-line max-len
    const integration2ASharesCollectionReceivedAction = actions.resource.receivedCollection(
      'integrations/integration2/ashares',
      integration2Ashares
    );

    newState = reducer(newState, integration2ASharesCollectionReceivedAction);

    expect(newState).toEqual({
      integration1: integration1Ashares,
      integration2: integration2Ashares,
    });
  });
  test('integrationUsers should return undefined if there are no ashares/users for an integration', () => {
    let newState = reducer(undefined, 'someaction');

    expect(selectors.integrationUsers(newState, 'integration1')).toEqual(
      undefined
    );
    newState = reducer({}, 'someaction');

    expect(selectors.integrationUsers(newState, 'integration1')).toEqual(
      undefined
    );
  });
  test('integrationUsers should return correct ashares/users for an integration', () => {
    const ashares = {
      integration1: [{ ashare: 'something 11' }, { ashare: 'something 12' }],
      integration2: [{ ashare: 'something 21' }, { ashare: 'something 22' }],
    };
    const newState = reducer(ashares, 'someaction');

    expect(selectors.integrationUsers(newState, 'integration1')).toEqual(
      ashares.integration1
    );
    expect(selectors.integrationUsers(newState, 'integration2')).toEqual(
      ashares.integration2
    );
  });
});
