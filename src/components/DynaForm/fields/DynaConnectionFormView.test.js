
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';
import FormView from './DynaConnectionFormView';
import actions from '../../../actions';

jest.mock('../../../constants/applications', () => ({
  __esModule: true,
  ...jest.requireActual('../../../constants/applications'),
  getHttpConnector: _id => _id ? ({ _id: 'httpConnectorId', _userId: 'userId', name: 'Sample' }) : {},
}));

describe('formView tests', () => {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.resources = {
      connections: [{
        _id: '_connectionId',
        type: 'http',
        name: 'HTTP connections',
        _httpConnectorId: '_httpConnectorId',
        http: { formType: 'assistant', mediaType: 'json' },
      }],
    };
    draft.session.form = {
      'connections-_connectionId': {
        fieldMeta: {},
        fields: {
          a: {touched: true, id: 'a', value: 'a'},
        },
        value: {},
      },
    };
    draft.user = {};
  });

  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });
  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('should able to test FormView with required resource', async () => {
    const props = {
      resourceType: 'connections', resourceId: '_connectionId', defaultValue: false, formKey: 'connections-_connectionId', sourceForm: 'title',
    };

    await renderWithProviders(<FormView {...props} />, { initialStore });
    expect(screen.getByRole('group')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Simple' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'HTTP' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'HTTP' }));
    expect(mockDispatchFn).toHaveBeenNthCalledWith(1, actions.analytics.gainsight.trackEvent('CONNECTION_FORM_VIEW', {
      'Toggle Mode': 'HTTP',
      UserID: 'userId',
      Connector: 'Sample',
    }));
    expect(mockDispatchFn).toHaveBeenNthCalledWith(2, actions.resource.clearStaged('_connectionId'));
    expect(mockDispatchFn).toHaveBeenNthCalledWith(4, actions.resourceForm.init(
      'connections',
      '_connectionId',
      false,
      false,
      '',
      [{id: 'a', value: 'a'}, {id: undefined, value: 'true'}]
    ));
    await userEvent.click(screen.getByRole('button', { name: 'Simple' }));
    expect(mockDispatchFn).toHaveBeenNthCalledWith(5, actions.analytics.gainsight.trackEvent('CONNECTION_FORM_VIEW', {
      'Toggle Mode': 'Simple',
      UserID: 'userId',
      Connector: 'Sample',
    }));
  });
  test('should able to test FormView without sourceForm', async () => {
    await renderWithProviders(<FormView />, { initialStore });
    expect(screen.queryByRole('group')).not.toBeInTheDocument();
  });
});
