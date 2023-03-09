import { screen } from '@testing-library/react';
import React from 'react';
import * as ReactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import Aliases from '.';
import { getCreatedStore } from '../../../../store';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import actions from '../../../../actions';

let initialStore;
const mockHistoryPush = jest.fn();

function initAliases({integrationId, childId, integrationsData, preferencesData, aliasesStatusData, accountsData}) {
  mutateStore(initialStore, draft => {
    draft.data.resources.integrations = integrationsData;
    draft.user.preferences = preferencesData;
    draft.user.org.accounts = accountsData;
    draft.session.aliases = aliasesStatusData;
  });
  const ui = (
    <Aliases integrationId={integrationId} childId={childId} />
  );

  return renderWithProviders(ui, {initialStore});
}
// Mocking useHistory as part of unit testing
jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
  useRouteMatch: () => ({
    url: '/test',
  }),
}));

// Mocking messageStore as part of unit testing
jest.mock('../../../../utils/messageStore', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../utils/messageStore'),
  default: props => {
    switch (props) {
      case 'ALIAS.PANEL_HELPINFO':
        return 'Mock Alias Help Panel HelpInfo';
      default:
        return 'Mocking Message Store';
    }
  },
}));

// Mocking errorMessageStore as part of unit testing
jest.mock('../../../../utils/errorStore', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../utils/errorStore'),
  default: props => {
    if (props === 'NO_ALIASES_MESSAGE') return 'Mocking No Aliases Message';
  },
}));

// Mocking Panel Header as part of unit testing
jest.mock('../../../../components/PanelHeader', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/PanelHeader'),
  default: props => (
    <>
      <div>Mocking Panel Header</div>
      <div>title = {props.title}</div>
      <div>infoText = {props.infoText}</div>
      <div>placement = {props.placement}</div>
      <div>{props.children}</div>
    </>
  ),
}));

// Mocking No Result Typography as part of unit testing
jest.mock('../../../../components/NoResultTypography', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/NoResultTypography'),
  default: props => (
    <>
      <div>Mocking No result Typography</div>
      <div>{props.children}</div>
    </>
  ),
}));

// Mocking Action Group as part of unit testing
jest.mock('../../../../components/ActionGroup', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/ActionGroup'),
  default: props => (
    <>
      <div>Mocking Action Group</div>
      <div>{props.children}</div>
    </>
  ),
}));

// Mocking Text Button as part of unit testing
jest.mock('../../../../components/Buttons', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/Buttons'),
  TextButton: props => (
    <>
      <div>Mocking Text Button</div>
      <div>startIcon = {props.startIcon}</div>
      <button type="button" onClick={props.onClick} >{props.children}</button>
    </>
  ),
}));

// Mocking Add Icon as part of unit testing
jest.mock('../../../../components/icons/AddIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/icons/AddIcon'),
  default: jest.fn().mockReturnValue(<div>Mock Add Icon</div>),
}));

// Mocking Load Resources as part of unit testing
jest.mock('../../../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/LoadResources'),
  default: props => (
    <>
      <div>Mocking Load Resources</div>
      <div>required = {props.required}</div>
      <div>resources = {props.resources}</div>
      <div>{props.children}</div>
    </>
  ),
}));

// Mocking Create Alias Drawer as part of unit testing
jest.mock('../../../../components/drawer/Aliases/CreateAliases', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/drawer/Aliases/CreateAliases'),
  default: props => (
    <>
      <div>Mocking Create Alias Drawer</div>
      <div>resourceId = {props.resourceId}</div>
      <div>resourceType = {props.resourceType}</div>
    </>
  ),
}));

// Mocking View Alias Details Drawer as part of unit testing
jest.mock('../../../../components/drawer/Aliases/ViewAliasesDetails', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/drawer/Aliases/ViewAliasesDetails'),
  default: props => (
    <>
      <div>Mocking View Alias Details</div>
      <div>resourceId = {props.resourceId}</div>
      <div>resourceType = {props.resourceType}</div>
    </>
  ),
}));

// Mocking metadata as part of unit testing
jest.mock('../../../../components/ResourceTable/aliases/metadata', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/ResourceTable/aliases/metadata'),
  default: {
    message: 'mock message',
  },
}));
// Mocking Celigo Table as part of unit testing
jest.mock('../../../../components/CeligoTable', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/CeligoTable'),
  default: props => (
    <>
      <div>Mocking Celigo Table</div>
      <div>data = {JSON.stringify(props.data)}</div>
      <div>filterKey = {props.filterKey}</div>
      <div>actionProps = {JSON.stringify(props.actionProps)}</div>
      <div>metadata = {JSON.stringify(props.metadata)}</div>
    </>
  ),
}));
describe('Testsuite for Aliases', () => {
  let useDispatchFn;
  let mockDispatchFn;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchFn = jest.spyOn(ReactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(
      actions => {
        switch (actions.types) {
          default:
        }
      }
    );
    useDispatchFn.mockReturnValue(mockDispatchFn);
  });
  afterEach(() => {
    useDispatchFn.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should test Aliases when there are no aliases data and when the integration is of type v2 and has owner access', async () => {
    initAliases(
      {
        integrationId: '12345',
        childId: '',
        integrationsData: [
          {
            _id: '12345',
            name: 'Test Integration Name',
            installSteps: [
              'test1',
            ],
            uninstallSteps: [
              'test2',
            ],
          },
        ],
        preferencesData: {
          defaultAShareId: 'own',
        },
        accountsData: {
          _id: 'own',
          accessLevel: 'owner',
        },
        aliasesStatusData: {},
      }
    );
    expect(screen.getByText(/mocking panel header/i)).toBeInTheDocument();
    expect(screen.getByText(/title = aliases/i)).toBeInTheDocument();
    expect(screen.getByText(/infotext = mock alias help panel helpinfo/i)).toBeInTheDocument();
    expect(screen.getByText(/placement = right-end/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking action group/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking text button/i)).toBeInTheDocument();
    expect(screen.getByText(/mock add icon/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking load resources/i)).toBeInTheDocument();
    expect(screen.getByText(/resources = flows,connections,imports,exports/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking create alias drawer/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking view alias details/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking no result typography/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking no aliases message/i)).toBeInTheDocument();
    const createAliasButtonNode = screen.getByRole('button', {
      name: /create alias/i,
    });

    expect(createAliasButtonNode).toBeInTheDocument();
    await userEvent.click(createAliasButtonNode);
    expect(mockHistoryPush).toHaveBeenCalledWith('/test/add');
    expect(mockDispatchFn).not.toHaveBeenCalled();
  });
  test('should test Aliases when there are no aliases data and when the integration is of type v2 and has monitor access and has child id', () => {
    initAliases(
      {
        integrationId: '12345',
        childId: '67890',
        integrationsData: [
          {
            _id: '12345',
            name: 'Test Integration Name',
            installSteps: [
              'test1',
            ],
            uninstallSteps: [
              'test2',
            ],
          },
        ],
        preferencesData: {
          defaultAShareId: '23456',
        },
        accountsData: [
          {
            _id: '23456',
            accessLevel: 'monitor',
          },
        ],
        aliasesStatusData: {},
      }
    );
    expect(screen.getByText(/mocking panel header/i)).toBeInTheDocument();
    expect(screen.getByText(/title = aliases/i)).toBeInTheDocument();
    expect(screen.getByText(/infotext = mock alias help panel helpinfo/i)).toBeInTheDocument();
    expect(screen.getByText(/placement = right-end/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking action group/i)).toBeInTheDocument();
    expect(screen.queryByText(/mocking text button/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/mock add icon/i)).not.toBeInTheDocument();
    expect(screen.getByText(/mocking load resources/i)).toBeInTheDocument();
    expect(screen.getByText(/resources = flows,connections,imports,exports/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking create alias drawer/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking view alias details/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking no result typography/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking no aliases message/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', {
      name: /create alias/i,
    })).not.toBeInTheDocument();
  });
  test('should test Aliases when there are no aliases data and when the integration is not of type v2 and has owner access and allias status is save', () => {
    initAliases(
      {
        integrationId: '12345',
        integrationsData: [
          {
            _id: '12345',
            name: 'Test Integration Name',
          },
        ],
        preferencesData: {
          defaultAShareId: 'own',
        },
        accountsData: {
          _id: 'own',
          accessLevel: 'owner',
        },
        aliasesStatusData: {
          12345: {
            status: 'save',
          },
        },
      }
    );
    expect(screen.getByText(/mock add icon/i)).toBeInTheDocument();
    expect(screen.getByText(/You’ve successfully created an alias./i)).toBeInTheDocument();
    const buttonNode = screen.getByRole('button', {
      name: /create alias/i,
    });

    expect(buttonNode).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.aliases.clear('12345'));
  });
  test('should test Aliases when there are no aliases data and when the integration is not of type v2 and has owner access and allias status is delete', () => {
    initAliases(
      {
        integrationId: '12345',
        integrationsData: [
          {
            _id: '12345',
            name: 'Test Integration Name',
          },
        ],
        preferencesData: {
          defaultAShareId: 'own',
        },
        accountsData: {
          _id: 'own',
          accessLevel: 'owner',
        },
        aliasesStatusData: {
          12345: {
            status: 'delete',
          },
        },
      }
    );
    expect(screen.getByText(/mock add icon/i)).toBeInTheDocument();
    expect(screen.getByText(/you’ve successfully deleted your alias\./i)).toBeInTheDocument();
    const buttonNode = screen.getByRole('button', {
      name: /create alias/i,
    });

    expect(buttonNode).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.aliases.clear('12345'));
  });
  test('should test Aliases when there are aliases data and when the integration is not of type v2 and has owner access and allias status is save', async () => {
    initAliases(
      {
        integrationId: '12345',
        integrationsData: [
          {
            _id: '12345',
            name: 'Test Integration Name',
            aliases: [
              {
                alias: 'test',
                description: 'test description',
                _flowId: '23456',
              },
            ],
          },
        ],
        preferencesData: {
          defaultAShareId: 'own',
        },
        accountsData: {
          _id: 'own',
          accessLevel: 'owner',
        },
        aliasesStatusData: {
          12345: {
            status: 'save',
          },
        },
      }
    );
    expect(screen.getByText(/mocking panel header/i)).toBeInTheDocument();
    expect(screen.getByText(/title = aliases/i)).toBeInTheDocument();
    expect(screen.getByText(/infotext = mock alias help panel helpinfo/i)).toBeInTheDocument();
    expect(screen.getByText(/placement = right-end/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking action group/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking text button/i)).toBeInTheDocument();
    expect(screen.getByText(/mock add icon/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking load resources/i)).toBeInTheDocument();
    expect(screen.getByText(/resources = flows,connections,imports,exports/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking create alias drawer/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking view alias details/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking celigo table/i)).toBeInTheDocument();
    expect(screen.getByText(
      /data = \[\{"alias":"test","description":"test description","_flowid":"23456","_id":"test"\}\]/i
    )).toBeInTheDocument();
    expect(screen.getByText(/filterkey = 12345-aliases/i)).toBeInTheDocument();
    expect(screen.getByText(
      /actionprops = \{"hasmanageaccess":true,"resourcetype":"integrations","resourceid":"12345"\}/i
    )).toBeInTheDocument();
    const createAliasButtonNode = screen.getByRole('button', {
      name: /create alias/i,
    });

    expect(createAliasButtonNode).toBeInTheDocument();
    await userEvent.click(createAliasButtonNode);
    expect(mockHistoryPush).toHaveBeenCalledWith('/test/add');
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.aliases.clear('12345'));
  });
});
