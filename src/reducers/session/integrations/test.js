/* global describe, test, expect */
import reducer, {selectors} from '.';
import actions from '../../../actions';

describe('integration redirectTo action', () => {
  test('should set redirectTo prop on to the state and should not clear other data', () => {
    const state = reducer({
      '1-3': { initComplete: true},
      '1-2': { formSaveStatus: 'loading'},
    }, actions.resource.integrations.redirectTo('integrationId', '/path'));

    expect(state).toEqual({
      '1-3': { initComplete: true},
      '1-2': { formSaveStatus: 'loading'},
      integrationId: {
        redirectTo: '/path',
      },
    });
  });
});

describe('integrationApps settings shouldRedirect test', () => {
  test('should not throw exception for bad params', () => {
    expect(selectors.shouldRedirect()).toEqual(null);
    expect(selectors.shouldRedirect({})).toEqual(null);
    expect(selectors.shouldRedirect(null)).toEqual(null);
  });

  test('should return correct saveStatus value for valid integration and flow', () => {
    const state = {
      integration: {
        meta: {
          data: 'dummy',
        },
        redirectTo: '/dashboard',
      },
    };

    expect(selectors.shouldRedirect(state, 'integration')).toEqual('/dashboard');
  });
});
