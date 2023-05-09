
import reducer, { selectors } from '.';
import actions from '../../../actions';

describe('http connectors session reducer', () => {
  const resourceId = '123';

  test('should return previous state if action is not handled.', () => {
    const unknownAction = { type: 'unknown' };
    const oldState = { key: { keyword: 'findme' } };
    const newState = reducer(oldState, unknownAction);

    expect(newState).toEqual(oldState);
  });

  describe('SWITCH_VIEW action', () => {
    test('should add view as true incase the state does not have resourceId and switch action dispatched first time', () => {
      const expectedState = { 123: { view: true } };
      const newState = reducer(
        undefined,
        actions.httpConnectors.resourceForm.switchView(resourceId)
      );

      expect(newState).toEqual(expectedState);
    });

    test('should update view as false if the resource already has view as true and vice versa', () => {
      const currentState = { 123: { view: true } };
      const newState = reducer(
        currentState,
        actions.httpConnectors.resourceForm.switchView(resourceId)
      );
      const expectedState = { 123: { view: false } };

      expect(newState).toEqual(expectedState);
    });
  });

  describe('CLEAR action', () => {
    test('should not throw error if resourceId does not exist', () => {
      const currentState = { 123: { view: true }, 111: { view: false} };
      const newState = reducer(
        currentState,
        actions.httpConnectors.resourceForm.clear('invalid')
      );

      expect(newState).toEqual(currentState);
    });

    test('should clear the resourceId state from the state', () => {
      const currentState = { 123: { view: true }, 111: { view: false} };
      const newState = reducer(
        currentState,
        actions.httpConnectors.resourceForm.clear(resourceId)
      );
      const expectedState = { 111: { view: false } };

      expect(newState).toEqual(expectedState);
    });
  });
});

describe('isHttpConnectorParentFormView selector', () => {
  test('should return false when state is invalid or no resourceId.', () => {
    expect(selectors.isHttpConnectorParentFormView()).toBeFalsy();
    expect(selectors.isHttpConnectorParentFormView(undefined, 'dummy')).toBeFalsy();
    expect(selectors.isHttpConnectorParentFormView({}, 'dummy')).toBeFalsy();
  });

  test('should return true if the resourceId view has true and vice versa', () => {
    const state1 = { 123: { view: true }, 111: { view: false} };

    expect(selectors.isHttpConnectorParentFormView(state1, '111')).toBeFalsy();
    expect(selectors.isHttpConnectorParentFormView(state1, '123')).toBeTruthy();
  });
});
