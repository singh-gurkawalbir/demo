
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import { mutateStore, reduxStore, renderWithProviders } from '../../../../test/test-utils';
import ResourceFormActionsPanel, {ActionsFactory} from './ResourceFormActionsPanel';
import consolidatedActions from '../../../ResourceFormFactory/Actions';

const actionPanelProps = {
  resourceId: '_exportId',
  resourceType: 'exports',
  isNew: false,
};

const actionsFactoryProps = {
  variant: 'edit',
  consolidatedActions,
  fieldMap: {_key1: {label: '_Field1'}},
  actions: [{id: 'saveandclosegroup', mode: 'group'}],
  resourceType: 'exports',
  isNew: false,
  onCancel: jest.fn(),
  formKey: 'exports-_exportId',
};

const fieldMeta = {
  layout: {containers: []},
  fieldMap: {name: {label: 'Name', defaultValue: 'name'}},
};

function initStore(initComplete, insertMeta, addActions) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.resourceForm = {
      'exports-_exportId': {
        fieldMeta: insertMeta ? fieldMeta : undefined,
        flowId: '_flowId',
        initComplete,
      },
      'connections-_OAuthConnectionId': {
        fieldMeta,
        flowId: '_flowId',
        initComplete,
      },
      'connections-_connectionId': {
        fieldMeta,
        flowId: '_flowId',
        initComplete,
      },
      'connections-1234': {
        fieldMeta,
        flowId: '_flowId',
        initComplete,
      },
      'eventreports-_eventreportId': {
        fieldMeta,
        initComplete,
      },
      'scripts-_scriptId': {
        fieldMeta,
        initComplete,
      },
    };
    draft.data.resources = {
      exports: [
        {
          _id: '_exportId',
          _connectionId: '_connectionId',
          assistant: 'amazonmws',
          http: {
            relativeURI: ['/'],
            method: ['GET'],
            body: [],
            formType: 'http',
          },
          adaptorType: 'HTTPExport',
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
        { _id: '1234',
          type: 'http',
          http: {
            formType: 'http',
            baseURI: '/mockURI',
            mediaType: 'json',
          },
        },
        { _id: '_OAuthConnectionId',
          type: 'rest',
          assistant: 'acton',
          http: {
            formType: 'http',
            baseURI: '/mockURI',
            mediaType: 'json',
          },
        },
      ],
    };
    draft.session.form['connections-1234'] = {
      fields: {},
      value: {
        '/http/_iClientId': 'ic-123',
        '/http/auth/type': 'oauth',
      },
    };
    draft.data.resources.iClients = [{
      _id: 'ic-123',
      oauth2: {
        grantType: 'authorizecode',
      },
    }];
    if (insertMeta) {
      draft.session.resourceForm['exports-_exportId'].fieldMeta = {actions: addActions ? [{id: 'testandsavegroup', mode: 'group'}] : null};
    }
  });

  return (initialStore);
}

async function initResourceFormActionsPanel(props = {}, initComplete = true, insertMeta = false, addActions = false) {
  const ui = (
    <MemoryRouter >
      <ResourceFormActionsPanel {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore: initStore(initComplete, insertMeta, addActions)});
}

async function initActionsFactory(props = {}) {
  const ui = (
    <MemoryRouter >
      <ActionsFactory {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore: initStore()});
}
jest.mock('../../../DynaForm/RenderActionButtonWhenVisible', () => ({
  __esModule: true,
  ...jest.requireActual('../../../DynaForm/RenderActionButtonWhenVisible'),
  default: ({children}) => (<>{children}</>),
}));

describe('ResourceFormActionsPanel tests', () => {
  test('Should able to test the ResourceFormActionsPanel For Connections Using OAuth', async () => {
    await initResourceFormActionsPanel({isNew: false, resourceType: 'connections', resourceId: '_OAuthConnectionId'});
    await waitFor(() => expect(screen.getByRole('button', {name: /Save & authorize/i})).toBeEnabled());
    await waitFor(() => expect(screen.getByRole('button', {name: /Close/i})).toBeEnabled());
  });

  test('Should able to test the ResourceFormActionsPanel For Connections Not Using OAuth', async () => {
    await initResourceFormActionsPanel({isNew: false, resourceType: 'connections', resourceId: '_connectionId'});
    await waitFor(() => expect(screen.getByRole('button', {name: /Save/i})).toBeDisabled());
  });

  test('Should able to test the ResourceFormActionsPanel For Connections Using OAuth2 and iclientGrantType as authorizecode', async () => {
    await initResourceFormActionsPanel({isNew: false, resourceType: 'connections', resourceId: '1234', formKey: 'connections-1234'});
    await waitFor(() => expect(screen.getByRole('button', {name: /Save & authorize/i})).toBeEnabled());
    await waitFor(() => expect(screen.getByRole('button', {name: /Close/i})).toBeEnabled());
    await waitFor(() => expect(screen.queryByRole('button', {name: /Test connection/i})).not.toBeInTheDocument());
  });

  test('Should able to test the ResourceFormActionsPanel For eventreports', async () => {
    await initResourceFormActionsPanel({isNew: false, resourceType: 'eventreports', resourceId: '_eventreportId'});
    await waitFor(() => expect(screen.getByRole('button', {name: /Run report/i})).toBeDisabled());
    await waitFor(() => expect(screen.getByRole('button', {name: /Close/i})).toBeEnabled());
  });

  test('Should able to test the ResourceFormActionsPanel is there with Export/Import with action button metadata', async () => {
    await initResourceFormActionsPanel(actionPanelProps, true, true, true);
    const save = screen.getByRole('button', {name: /save/i});
    const close = screen.getByRole('button', {name: /close/i});

    expect(save).toBeInTheDocument();
    expect(save).toBeDisabled();
    expect(close).toBeEnabled();
  });

  test('Should able to test the ResourceFormActionsPanel is there with Export/Import with initComplete false and no fieldMeta', async () => {
    await initResourceFormActionsPanel(actionPanelProps, false);
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });
  test('Should able to test the ResourceFormActionsPanel is there with New Export/Import with fieldMeta', async () => {
    await initResourceFormActionsPanel({...actionPanelProps, isNew: true}, true, true, false);
    await waitFor(() => expect(screen.getByRole('button', {name: /Next/i})).toBeDisabled());
    await waitFor(() => expect(screen.getByRole('button', {name: /Close/i})).toBeEnabled());
  });
  test('Should able to test the ResourceFormActionsPanel For Scripts', async () => {
    await initResourceFormActionsPanel({isNew: true, resourceType: 'scripts', resourceId: '_scriptId'});
    expect(screen.getByRole('button', {name: /save/i})).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('button', {name: /Close/i})).toBeEnabled());
  });

  test('Should able to test the ActionsFactory', async () => {
    await initActionsFactory(actionsFactoryProps);
    expect(screen.getByRole('button', {name: /save/i})).toBeInTheDocument();
  });

  test('Should able to test the ActionsFactory with variant = view', async () => {
    await initActionsFactory({...actionsFactoryProps, variant: 'view'});
    expect(screen.queryByText(/save/i)).not.toBeInTheDocument();
  });

  test('Should able to test the ActionsFactory with proceedOnChange', async () => {
    await initActionsFactory({...actionsFactoryProps, isNew: true, resourceType: 'connections'});
    expect(screen.queryByText(/close/i)).not.toBeInTheDocument();
  });

  test('Should able to test the ActionsFactory without actions', async () => {
    await initActionsFactory({...actionsFactoryProps, actions: []});
    expect(screen.queryByText(/save/i)).not.toBeInTheDocument();
  });
});
