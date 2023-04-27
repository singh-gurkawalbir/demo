
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../test/test-utils';
import TitleActions from '.';
import { KBDocumentation } from '../../../../../utils/connections';

const mockHistoryPush = jest.fn();

async function initTitleActions(props = {}, resourceType = 'exports', _id = '_resourceId', operation = 'add') {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.resources = {
      imports: [{ _id, _connectionId: '_connectionId', http: { relativeURI: ['/'], method: ['POST'], body: [], formType: 'http' }, adaptorType: 'HTTPImport' }],
      exports: [
        {
          _id: '_exportId',
          _connectionId: '_connectionId',
          http: {
            relativeURI: ['/'],
            method: ['GET'],
            body: [],
            formType: 'http',
          },
          adaptorType: 'HTTPExport',
        },
        {
          _id,
          _connectionId: '_connectionId',
          type: 'test',
          adaptorType: 'NetSuiteExport',
        },
      ],
      connections: [
        { _id: '_connectionId',
          type: 'http',
          http: {
            formType: 'http',
            baseURI: '/mockURI',
            mediaType: 'json',
          },
        },
        { _id: '_connectionId2',
          type: 'http',
          http: {
            formType: 'http',
            _httpConnectorId: '_httpConnectorId',
            baseURI: '/mockURI',
            mediaType: 'json',
          },
        },
      ],
    };
  });
  const ui = (
    <MemoryRouter initialEntries={[{ pathname: `/${operation}/${resourceType}/${_id}` }]}>
      <Route path="/:operation/:resourceType/:id">
        <TitleActions {...props} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));
describe('TitleActions tests', () => {
  test('Should able to test the TitleActions with application Logo', async () => {
    await initTitleActions({ flowId: '_flowId' });
    expect(screen.getByRole('img', { name: 'NetSuiteExport' })).toBeInTheDocument();
  });
  test('Should able to test the TitleActions with HTTP Connections resourceType', async () => {
    await initTitleActions({ flowId: '_flowId' }, 'connections', '_connectionId', 'edit');
    expect(screen.getByRole('link', {href: KBDocumentation.http})).toBeInTheDocument();
    expect(screen.getByText('HTTP connection guide')).toBeInTheDocument();
  });

  test('Should able to test the TitleActions with HTTP Connection with _httpConnectorId', async () => {
    await initTitleActions({ flowId: '_flowId' }, 'connections', '_connectionId2');
    expect(screen.getByText('Connection guide')).toBeInTheDocument();
  });

  test('Should able to test the TitleActions with FlowStep debug logs', async () => {
    await initTitleActions({ flowId: '_flowId' }, 'imports', '_importId', 'edit');
    const debugLog = screen.getByRole('button', { name: 'View debug logs' });

    expect(debugLog).toBeInTheDocument();
    await userEvent.click(debugLog);
    expect(mockHistoryPush).toHaveBeenCalledWith('/edit/imports/_importId/logs');
  });
});
