
import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import * as reactRedux from 'react-redux';
import ApiTokenSection from './ApiTokens';
import {mutateStore, renderWithProviders} from '../../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../../store';

async function initApiTokenSection(props = {}) {
  const initialStore = getCreatedStore();

  mutateStore(initialStore, draft => {
    draft.data.resources.accesstokens = props.accesstokens;
    draft.data.resources.integrations = [{_id: '60e6f83f3499084a689178cc', _connectorId: '5656f5e3bebf89c03f5dd77e'}];
  });

  const ui = (<MemoryRouter><ApiTokenSection {...props} /></MemoryRouter>);

  return renderWithProviders(ui, {initialStore});
}

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));
jest.mock('../../../../../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../../components/LoadResources'),
  default: props =>
    (
      props.children
    )
  ,
}));
const demoTokens = [{
  _id: '62e69d4151208d4e70497391',
  token: '******',
  name: 'Webhook Issue',
  description: 'Webhook Issue',
  revoked: false,
  fullAccess: false,
  legacyNetSuite: false,
  _exportIds: [],
  _importIds: [],
  _apiIds: [],
  _connectionIds: [],
  createdAt: '2022-07-31T15:18:25.998Z',
  lastModified: '2022-07-31T15:18:26.037Z',
  _integrationId: '60e6f83f3499084a689178cc',
  _connectorId: '5656f5e3bebf89c03f5dd77e',
  autoPurgeAt: '2022-08-30T15:18:25.682Z',
}];

describe('ApiTokensSection UI tests', () => {
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
  });
  test('should pass the initial render with values of accesstokesns', async () => {
    await initApiTokenSection({integrationId: '60e6f83f3499084a689178cc', accesstokens: demoTokens });
    await waitFor(() => expect(screen.getByText('API tokens')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Create API token')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Name')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Status')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Scope')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Auto purge')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Last updated')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Token')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Actions')).toBeInTheDocument());
  });
  test('should make a dispatch call and url redirection on clicking "Create API token" button', async () => {
    await initApiTokenSection({integrationId: '60e6f83f3499084a689178cc', accesstokens: demoTokens});
    await userEvent.click(screen.getByText('Create API token'));
    await waitFor(() => expect(mockDispatchFn).toBeCalled());
    await waitFor(() => expect(mockHistoryPush).toBeCalled());
  });
});
