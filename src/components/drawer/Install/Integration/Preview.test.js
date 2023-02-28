
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
import IntegrationPreview from './Preview';
import {ConfirmDialogProvider} from '../../../ConfirmDialog';
import actions from '../../../../actions';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));
function createInitialStore() {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session = {
      templates: {
        _templateId:
        {
          preview: {
            status: 'success',
            components: {
              objects: [],
              stackRequired: false,
            },
          },
          runKey: '_templateId',
        },
      },
      integrationApps: {
        clone: {
          _templateId: {isCloned: false, integrationId: '_integrationId'},
        },
      },
    };
  });

  return initialStore;
}
async function initIntegrationPreview({renderFn, initialStore}) {
  const store = (!initialStore ? createInitialStore() : initialStore);
  const ui = (
    <MemoryRouter initialEntries={[{pathname: '/preview/_templateId'}]}>
      <Route
        path="/preview/:templateId"
        params={{templateId: '_templateId'}}>
        <ConfirmDialogProvider>
          <IntegrationPreview />
        </ConfirmDialogProvider>
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore: store, renderFun: renderFn});
}

describe('IntegrationPreview tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockHistoryPush.mockClear();
  });
  test('Should able to test the initial render with IntegrationPreview', async () => {
    await initIntegrationPreview({});
    expect(screen.getByText('Preview')).toBeInTheDocument();
    expect(screen.getByText('The following components are created with this integration:')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Flows'})).toBeInTheDocument();
    const installButton = screen.getByRole('button', {name: 'Install integration'});

    expect(installButton).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();

    await userEvent.click(installButton);
    const proceed = screen.getByRole('button', {name: 'Proceed'});
    const cancel = screen.getByRole('button', {name: 'Cancel'});

    expect(proceed).toBeInTheDocument();
    expect(cancel).toBeInTheDocument();
    expect(screen.getByText('Disclaimer')).toBeInTheDocument();
    await userEvent.click(proceed);
    expect(mockDispatchFn).toHaveBeenNthCalledWith(1, actions.integrationApp.clone.clearIntegrationClonedStatus('_templateId'));
  });

  test('Should able to test the IntegrationPreview For cloned Integration Setup', async () => {
    const {utils, store} = await initIntegrationPreview({});

    expect(screen.getByText('Preview')).toBeInTheDocument();
    mutateStore(store, draft => {
      draft.session.integrationApps.clone._templateId.isCloned = true;
    });
    await initIntegrationPreview({renderFn: utils.rerender, initialStore: store});
    await waitFor(() => expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/_integrationId/setup'));
  });
});
