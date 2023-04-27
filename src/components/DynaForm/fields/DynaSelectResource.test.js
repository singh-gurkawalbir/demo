import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaSelectResource from './DynaSelectResource';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';
import * as Resource from '../../../utils/resource';
import actions from '../../../actions';
import * as MockUseIntegration from '../../../hooks/useIntegration';
import * as ApplicationList from '../../../constants/applications';

let initialStore;

const mockOnFieldChange = jest.fn();
const mockGetItemInfo = jest.fn();
const mockHistoryPush = jest.fn();

function initDynaSelectResource({props, loadResources, resourcesData}) {
  mutateStore(initialStore, draft => {
    draft.session.loadResources = loadResources;
    draft.user.preferences = {
      environment: 'production',
      defaultAShareId: 'own',
    };
    draft.data.resources = resourcesData;
  });
  const ui = (
    <MemoryRouter>
      <Route>
        <DynaSelectResource {...props} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}
// Mocking LoadResource child component as part of unit testing
jest.mock('../../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../LoadResources'),
  default: props => (
    <div>
      Mocking Load Resources
      <div>Required = {props.required}</div>
      <div>Spinner = {props.spinner}</div>
      <div>Resources = {props.resources}</div>
      <div>{props.children}</div>
    </div>
  ),
}));
// Mocking Spinner child component as part of unit testing
jest.mock('@celigo/fuse-ui', () => ({
  __esModule: true,
  ...jest.requireActual('@celigo/fuse-ui'),
  Spinner: () => (
    <div>
      <div>Mocking Spinner</div>
    </div>
  ),
}));
// Mocking DynaMultiSelect child component as part of unit testing
jest.mock('./DynaMultiSelect', () => ({
  __esModule: true,
  ...jest.requireActual('./DynaMultiSelect'),
  default: props => (
    <div>
      <div>Mocking Dyna Multi Select</div>
      <div>disabled = {props.disabled}</div>
      <div>options = {JSON.stringify(props.options)}</div>
    </div>
  ),
}));
// Mocking DynaSelect child component as part of unit testing
jest.mock('./DynaSelect', () => ({
  __esModule: true,
  ...jest.requireActual('./DynaSelect'),
  default: props => (
    <div>
      <div>Mocking Dyna Select</div>
      <div>disabled = {props.disabled}</div>
      <div>removeHelperText = {props.removeHelperText}</div>
      <div>
        options = {
           JSON.stringify(
             props.options.map(option => {
               const items = option.items.map(item => {
                 const { label, ...rest } = item;

                 return rest;
               });

               return { items };
             })
           )
        }
      </div>
    </div>
  ),
}));
// Mocking OnlineStatus child component as part of unit testing
jest.mock('../../OnlineStatus', () => ({
  __esModule: true,
  ...jest.requireActual('../../OnlineStatus'),
  default: props => (
    <div>
      <div>Mocking OnlineStatus</div>
      <div>offline = {props.offline}</div>
    </div>
  ),
}));
// Mocking IconButtonWithTooltip child component as part of unit testing
jest.mock('../../IconButtonWithTooltip', () => ({
  __esModule: true,
  ...jest.requireActual('../../IconButtonWithTooltip'),
  default: props => {
    const mockDataTest = 'data-test';

    if (props[mockDataTest] === 'addNewResource') {
      return (
        <div>
          <div>Mocking IconButtonWithTooltip(Add)</div>
          <button type="button" data-test={props[mockDataTest]} onClick={props.onClick}>IconButtonWithTooltip</button>
          <div>tooltipProps = {JSON.stringify(props.tooltipProps)}</div>
          <div>buttonSize = {props.buttonSize}</div>
          <div>{props.children}</div>
        </div>
      );
    }

    return (
      <div>
        <div>Mocking IconButtonWithTooltip(Edit)</div>
        <button type="button" data-test={props[mockDataTest]} onClick={props.onClick}>IconButtonWithTooltip</button>
        <div>tooltipProps = {JSON.stringify(props.tooltipProps)}</div>
        <div>buttonSize = {props.buttonSize}</div>
        <div>{props.children}</div>
      </div>
    );
  },
}));
// Mocking Add Icon child component as part of unit testing
jest.mock('../../icons/AddIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../icons/AddIcon'),
  default: jest.fn().mockReturnValue('Mocking Add Icon'),
}));
// Mocking Edit Icon child component as part of unit testing
jest.mock('../../icons/EditIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../icons/EditIcon'),
  default: jest.fn().mockReturnValue('Mocking Edit Icon'),
}));
// Mocking react-router-dom as part of unit testing
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('Testsuite for Dyna Select Resource', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();

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
    mockDispatchFn.mockClear();
    mockOnFieldChange.mockClear();
    mockGetItemInfo.mockClear();
    mockHistoryPush.mockClear();
  });
  test('should test the spinner and mocked load resource component when the resource type is not a connectorLicenses', () => {
    jest.spyOn(Resource, 'generateNewId').mockReturnValue('mockNewId');
    jest.spyOn(MockUseIntegration, 'default').mockReturnValue('mockIntegrationFromURL');
    jest.spyOn(ApplicationList, 'applicationsList').mockReturnValue([{id: 'acumatica', assistant: 'acumatica', type: 'http'}]);
    const props = {
      disabled: true,
      id: 'test_id',
      onFieldChange: mockOnFieldChange,
      value: 'test_value',
      resourceType: 'connections',
      allowNew: true,
      allowEdit: false,
      filter: '',
      statusExport: true,
      ignoreEnvironmentFilter: true,
      resourceContext: {
        resourceType: 'connections',
        resourceId: 'resource_id',
      },
      skipPingConnection: false,
      integrationId: 'integration_id',
      connectorId: 'connector_id',
      flowId: 'flow_id',
      addTitle: 'test_add_title',
      editTitle: 'test_edit_title',
      disabledTitle: 'test_disabled_title',
      getItemInfo: mockGetItemInfo,
    };
    const loadResources = {
      connections: 'received',
    };
    const resourcesData = {
      connections: [{
        _id: 'conn_id',
        offline: true,
        name: 'test connection',
      }],
    };

    initDynaSelectResource({props, loadResources, resourcesData});
    expect(screen.getByText(/mocking load resources/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking spinner/i)).toBeInTheDocument();
    expect(screen.getByText(/resources = connections/i)).toBeInTheDocument();
  });
  test('should test the spinner and empty resources when mocked load resource component resource type is equal to connectorLicenses', () => {
    jest.spyOn(Resource, 'generateNewId').mockReturnValue('mockNewId');
    jest.spyOn(MockUseIntegration, 'default').mockReturnValue('mockIntegrationFromURL');
    jest.spyOn(ApplicationList, 'applicationsList').mockReturnValue([{id: 'acumatica', assistant: 'acumatica', type: 'http'}]);
    const props = {
      disabled: true,
      id: 'test_id',
      onFieldChange: mockOnFieldChange,
      value: 'test_value',
      resourceType: 'connectorLicenses',
      allowNew: true,
      allowEdit: false,
      filter: '',
      statusExport: true,
      ignoreEnvironmentFilter: true,
      resourceContext: {
        resourceType: 'connections',
        resourceId: 'resource_id',
      },
      skipPingConnection: false,
      integrationId: 'integration_id',
      connectorId: 'connector_id',
      flowId: 'flow_id',
      addTitle: 'test_add_title',
      editTitle: 'test_edit_title',
      disabledTitle: 'test_disabled_title',
      getItemInfo: mockGetItemInfo,
    };
    const loadResources = {
      connections: 'received',
    };
    const resourcesData = {
      connections: [{
        _id: 'conn_id',
        offline: true,
        name: 'test connection',
      }],
    };

    initDynaSelectResource({props, loadResources, resourcesData});
    expect(screen.getByText(/mocking load resources/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking spinner/i)).toBeInTheDocument();
    expect(screen.getByText(/resources =/i)).toBeInTheDocument();
  });
  test('should test the dyna select options and it should render connection name followed by offline when there is no options and no filters and when offline set to true and check permission has set to false', () => {
    jest.spyOn(Resource, 'generateNewId').mockReturnValue('mockNewId');
    jest.spyOn(MockUseIntegration, 'default').mockReturnValue('mockIntegrationFromURL');
    jest.spyOn(ApplicationList, 'applicationsList').mockReturnValue([{id: 'acumatica', assistant: 'acumatica', type: 'http'}]);
    const props = {
      disabled: true,
      id: 'test_id',
      onFieldChange: mockOnFieldChange,
      value: 'test_value',
      resourceType: 'connections',
      allowNew: true,
      allowEdit: false,
      filter: '',
      statusExport: true,
      ignoreEnvironmentFilter: true,
      resourceContext: {
        resourceType: 'connections',
        resourceId: 'resource_id',
      },
      skipPingConnection: false,
      integrationId: 'integration_id',
      connectorId: 'connector_id',
      flowId: 'flow_id',
      addTitle: 'test_add_title',
      editTitle: 'test_edit_title',
      disabledTitle: 'test_disabled_title',
      getItemInfo: mockGetItemInfo,
    };
    const loadResources = {
      connections: 'received',
    };
    const resourcesData = {
      connections: [{
        _id: 'conn_id',
        offline: true,
        name: 'test connection',
      }],
    };

    initDynaSelectResource({props, loadResources, resourcesData});
    expect(screen.getByText(/mocking dyna select/i)).toBeInTheDocument();
    expect(screen.getByText(/options = \[\{"items":\[\{"optionsearch":"test connection - offline","value":"conn_id","connInfo":\{\}\}\]\}\]/i)).toBeInTheDocument();
    expect(mockGetItemInfo).toHaveBeenCalled();
  });
  test('should test the dyna select options and it should render connection name when there is no options and no filters and when offline set to false and check permission has set to false', () => {
    jest.spyOn(Resource, 'generateNewId').mockReturnValue('mockNewId');
    jest.spyOn(MockUseIntegration, 'default').mockReturnValue('mockIntegrationFromURL');
    jest.spyOn(ApplicationList, 'applicationsList').mockReturnValue([{id: 'acumatica', assistant: 'acumatica', type: 'http'}]);
    const props = {
      disabled: true,
      id: 'test_id',
      onFieldChange: mockOnFieldChange,
      value: 'test_value',
      resourceType: 'connections',
      allowNew: true,
      allowEdit: false,
      filter: '',
      statusExport: true,
      ignoreEnvironmentFilter: true,
      resourceContext: {
        resourceType: 'connections',
        resourceId: 'resource_id',
      },
      skipPingConnection: false,
      integrationId: 'integration_id',
      connectorId: 'connector_id',
      flowId: 'flow_id',
      addTitle: 'test_add_title',
      editTitle: 'test_edit_title',
      disabledTitle: 'test_disabled_title',
      getItemInfo: mockGetItemInfo,
    };
    const loadResources = {
      connections: 'received',
    };
    const resourcesData = {
      connections: [{
        _id: 'conn_id',
        offline: false,
        name: 'test connection',
      }],
    };

    initDynaSelectResource({props, loadResources, resourcesData});
    expect(screen.getByText(/mocking dyna select/i)).toBeInTheDocument();
    expect(screen.getByText(/options = \[\{"items":\[\{"optionsearch":"test connection","value":"conn_id","connInfo":\{\}\}\]\}\]/i)).toBeInTheDocument();
    expect(mockGetItemInfo).toHaveBeenCalled();
  });
  test('should test the dyna select options and it should render connection id followed by offline when there is no options and no filters and when offline set to true and check permission has set to false and when there is no connection name', () => {
    jest.spyOn(Resource, 'generateNewId').mockReturnValue('mockNewId');
    jest.spyOn(MockUseIntegration, 'default').mockReturnValue('mockIntegrationFromURL');
    jest.spyOn(ApplicationList, 'applicationsList').mockReturnValue([{id: 'acumatica', assistant: 'acumatica', type: 'http'}]);
    const props = {
      disabled: true,
      id: 'test_id',
      onFieldChange: mockOnFieldChange,
      value: 'test_value',
      resourceType: 'connections',
      allowNew: true,
      allowEdit: false,
      filter: '',
      statusExport: true,
      ignoreEnvironmentFilter: true,
      resourceContext: {
        resourceType: 'connections',
        resourceId: 'resource_id',
      },
      skipPingConnection: false,
      integrationId: 'integration_id',
      connectorId: 'connector_id',
      flowId: 'flow_id',
      addTitle: 'test_add_title',
      editTitle: 'test_edit_title',
      disabledTitle: 'test_disabled_title',
      getItemInfo: mockGetItemInfo,
    };
    const loadResources = {
      connections: 'received',
    };
    const resourcesData = {
      connections: [{
        _id: 'conn_id',
        offline: true,
      }],
    };

    initDynaSelectResource({props, loadResources, resourcesData});
    expect(screen.getByText(/mocking dyna select/i)).toBeInTheDocument();
    expect(screen.getByText(
      /options = \[\{"items":\[\{"optionsearch":"conn_id - offline","value":"conn_id","connInfo":\{\}\}\]\}\]/i
    )).toBeInTheDocument();
    expect(mockGetItemInfo).toHaveBeenCalled();
  });
  test('should test the dyna select options and it should render connection id when there is no options and no filters and when offline set to false and check permission has set to false and when there is no connection name', () => {
    jest.spyOn(Resource, 'generateNewId').mockReturnValue('mockNewId');
    jest.spyOn(MockUseIntegration, 'default').mockReturnValue('mockIntegrationFromURL');
    jest.spyOn(ApplicationList, 'applicationsList').mockReturnValue([{id: 'acumatica', assistant: 'acumatica', type: 'http'}]);
    const props = {
      disabled: true,
      id: 'test_id',
      onFieldChange: mockOnFieldChange,
      value: 'test_value',
      resourceType: 'connections',
      allowNew: true,
      allowEdit: false,
      filter: '',
      statusExport: true,
      ignoreEnvironmentFilter: true,
      resourceContext: {
        resourceType: 'connections',
        resourceId: 'resource_id',
      },
      skipPingConnection: false,
      integrationId: 'integration_id',
      connectorId: 'connector_id',
      flowId: 'flow_id',
      addTitle: 'test_add_title',
      editTitle: 'test_edit_title',
      disabledTitle: 'test_disabled_title',
      getItemInfo: mockGetItemInfo,
    };
    const loadResources = {
      connections: 'received',
    };
    const resourcesData = {
      connections: [{
        _id: 'conn_id',
        offline: false,
      }],
    };

    initDynaSelectResource({props, loadResources, resourcesData});
    expect(screen.getByText(/mocking dyna select/i)).toBeInTheDocument();
    expect(screen.getByText(
      /options = \[\{"items":\[\{"optionsearch":"conn_id","value":"conn_id","connInfo":\{\}\}\]\}\]/i
    )).toBeInTheDocument();
    expect(mockGetItemInfo).toHaveBeenCalled();
  });
  test('should test the dyna select options and it should render connection id when there are options with filters and no filters and when offline set to false and check permission has set to false and when there is no connection name', () => {
    jest.spyOn(Resource, 'generateNewId').mockReturnValue('mockNewId');
    jest.spyOn(MockUseIntegration, 'default').mockReturnValue('mockIntegrationFromURL');
    jest.spyOn(ApplicationList, 'applicationsList').mockReturnValue([{id: 'acumatica', assistant: 'acumatica', type: 'http'}]);
    const props = {
      disabled: true,
      id: 'test_id',
      onFieldChange: mockOnFieldChange,
      value: 'test_value',
      resourceType: 'connections',
      allowNew: true,
      allowEdit: false,
      filter: '',
      options: {
        filter: {_id: 'conn_id'},
      },
      statusExport: true,
      ignoreEnvironmentFilter: true,
      resourceContext: {
        resourceType: 'connections',
        resourceId: 'resource_id',
      },
      skipPingConnection: false,
      integrationId: 'integration_id',
      connectorId: 'connector_id',
      flowId: 'flow_id',
      addTitle: 'test_add_title',
      editTitle: 'test_edit_title',
      disabledTitle: 'test_disabled_title',
      getItemInfo: mockGetItemInfo,
    };
    const loadResources = {
      connections: 'received',
    };
    const resourcesData = {
      connections: [{
        _id: 'conn_id',
        offline: false,
      }],
    };

    initDynaSelectResource({props, loadResources, resourcesData});
    expect(screen.getByText(/mocking dyna select/i)).toBeInTheDocument();
    expect(screen.getByText(
      /options = \[\{"items":\[\{"optionsearch":"conn_id","value":"conn_id","connInfo":\{\}\}\]\}\]/i
    )).toBeInTheDocument();
    expect(mockGetItemInfo).toHaveBeenCalled();
  });
  test('should test the Dyna Select when there is no options and filters and when check permission has set to true', () => {
    jest.spyOn(Resource, 'generateNewId').mockReturnValue('mockNewId');
    jest.spyOn(MockUseIntegration, 'default').mockReturnValue('mockIntegrationFromURL');
    jest.spyOn(ApplicationList, 'applicationsList').mockReturnValue([{id: 'acumatica', assistant: 'acumatica', type: 'http'}]);
    const props = {
      disabled: true,
      id: 'test_id',
      onFieldChange: mockOnFieldChange,
      value: 'test_value',
      resourceType: 'connections',
      checkPermissions: true,
      allowNew: true,
      allowEdit: false,
      filter: '',
      statusExport: true,
      ignoreEnvironmentFilter: true,
      resourceContext: {
        resourceType: 'connections',
        resourceId: 'resource_id',
      },
      skipPingConnection: false,
      integrationId: 'integration_id',
      connectorId: 'connector_id',
      flowId: 'flow_id',
      addTitle: 'test_add_title',
      editTitle: 'test_edit_title',
      disabledTitle: 'test_disabled_title',
      getItemInfo: mockGetItemInfo,
    };
    const loadResources = {
      connections: 'received',
    };
    const resourcesData = {
      connections: [{
        _id: 'conn_id',
        offline: true,
        name: 'test connection',
      }],
    };

    initDynaSelectResource({props, loadResources, resourcesData});
    expect(screen.getByText(/mocking dyna select/i)).toBeInTheDocument();
    expect(screen.getByText(/options = \[\{"items":\[\{"optionsearch":"test connection - offline","value":"conn_id","connInfo":\{\}\}\]\}\]/i)).toBeInTheDocument();
    expect(mockGetItemInfo).toHaveBeenCalled();
  });
  test('should test the Dyna Multi Select when there are resource', () => {
    jest.spyOn(Resource, 'generateNewId').mockReturnValue('mockNewId');
    jest.spyOn(MockUseIntegration, 'default').mockReturnValue('mockIntegrationFromURL');
    jest.spyOn(ApplicationList, 'applicationsList').mockReturnValue([{id: 'acumatica', assistant: 'acumatica', type: 'http'}]);
    const props = {
      disabled: true,
      id: 'test_id',
      onFieldChange: mockOnFieldChange,
      multiselect: true,
      value: 'test_value',
      resourceType: 'connections',
      checkPermissions: true,
      allowNew: true,
      allowEdit: false,
      filter: '',
      statusExport: true,
      ignoreEnvironmentFilter: true,
      resourceContext: {
        resourceType: 'connections',
        resourceId: 'resource_id',
      },
      skipPingConnection: false,
      integrationId: 'integration_id',
      connectorId: 'connector_id',
      flowId: 'flow_id',
      addTitle: 'test_add_title',
      editTitle: 'test_edit_title',
      disabledTitle: 'test_disabled_title',
      getItemInfo: mockGetItemInfo,
    };
    const loadResources = {
      connections: 'received',
    };
    const resourcesData = {
      connections: [{
        _id: 'conn_id',
        offline: true,
        name: 'test connection',
      }],
    };

    initDynaSelectResource({props, loadResources, resourcesData});
    expect(screen.getByText(/mocking dyna multi select/i)).toBeInTheDocument();
    expect(screen.getByText(
      /options = \[\{"items":\[\{"label":"test connection - offline","value":"conn_id","connInfo":\{\}\}\]\}\]/i
    )).toBeInTheDocument();
  });
  test('should test the connection loading chip when the resourcetype is connection and when there is value and set skipPingConnection to false', () => {
    jest.spyOn(Resource, 'generateNewId').mockReturnValue('mockNewId');
    jest.spyOn(MockUseIntegration, 'default').mockReturnValue('mockIntegrationFromURL');
    jest.spyOn(ApplicationList, 'applicationsList').mockReturnValue([{id: 'acumatica', assistant: 'acumatica', type: 'http'}]);
    const props = {
      disabled: true,
      id: 'test_id',
      onFieldChange: mockOnFieldChange,
      multiselect: false,
      value: 'conn_id',
      resourceType: 'connections',
      checkPermissions: true,
      allowNew: true,
      allowEdit: false,
      filter: '',
      statusExport: true,
      ignoreEnvironmentFilter: true,
      resourceContext: {
        resourceType: 'connections',
        resourceId: 'resource_id',
      },
      skipPingConnection: false,
      integrationId: 'integration_id',
      connectorId: 'connector_id',
      flowId: 'flow_id',
      addTitle: 'test_add_title',
      editTitle: 'test_edit_title',
      disabledTitle: 'test_disabled_title',
      getItemInfo: mockGetItemInfo,
    };
    const loadResources = {
      connections: 'received',
    };
    const resourcesData = {
      connections: [{
        _id: 'conn_id',
        offline: true,
        name: 'test connection',
      }],
    };

    initDynaSelectResource({props, loadResources, resourcesData});
    expect(screen.getByText(/mocking onlinestatus/i)).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.connections.pingAndUpdate('conn_id', {flowId: 'flow_id', integrationId: 'integration_id', parentId: 'resource_id', parentType: 'connections'}));
  });
  test('should test the add new icon when allownew is set to true when the resource type is connection', async () => {
    jest.spyOn(Resource, 'generateNewId').mockReturnValue('mockNewId');
    jest.spyOn(MockUseIntegration, 'default').mockReturnValue('mockIntegrationFromURL');
    jest.spyOn(ApplicationList, 'applicationsList').mockReturnValue([{id: 'acumatica', assistant: 'acumatica', type: 'http'}]);
    const props = {
      disabled: true,
      id: 'test_id',
      onFieldChange: mockOnFieldChange,
      multiselect: false,
      value: 'conn_id',
      resourceType: 'connections',
      checkPermissions: true,
      allowNew: true,
      allowEdit: false,
      filter: '',
      statusExport: true,
      ignoreEnvironmentFilter: true,
      resourceContext: {
        resourceType: 'connections',
        resourceId: 'resource_id',
      },
      options: {filter: {$and: [{$or: [{'http.formType': 'rest'}, {type: 'rest'}]}, {_connectorId: {exists: false}}, {assistant: 'acumatica'}]}, appType: 'acumatica'},
      skipPingConnection: false,
      integrationId: 'integration_id',
      connectorId: 'connector_id',
      flowId: 'flow_id',
      addTitle: 'test_add_title',
      editTitle: 'test_edit_title',
      disabledTitle: 'test_disabled_title',
      getItemInfo: mockGetItemInfo,
    };
    const loadResources = {
      connections: 'received',
    };
    const resourcesData = {
      connections: [{
        _id: 'conn_id',
        offline: true,
        name: 'test connection',
      }],
    };

    initDynaSelectResource({props, loadResources, resourcesData});
    expect(screen.getByText(/mocking iconbuttonwithtooltip\(add\)/i)).toBeInTheDocument();
    expect(screen.getByText(/tooltipprops = \{"title":"test_add_title"\}/i)).toBeInTheDocument();
    expect(screen.getByText(/buttonsize = small/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking add icon/i)).toBeInTheDocument();
    const addButtonNode = screen.getByRole('button', {
      name: /iconbuttonwithtooltip/i,
    });

    expect(addButtonNode).toBeInTheDocument();
    await userEvent.click(addButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.patchStaged('mockNewId', [{ path: '/_connectionId', op: 'add', value: {} },
      { path: '/_connectorId', op: 'add', value: {} },
      { path: '/_httpConnectorId', op: 'add', value: {} },
      { path: '/adaptorType', op: 'add', value: {} },
      { path: '/application', op: 'add', value: {} },
      { path: '/assistant', op: 'add', value: {} },
      { path: '/integrationId', op: 'add', value: {} },
      { path: '/statusExport', op: 'add', value: {} },
      { path: '/type', op: 'add', value: {} },
      { op: 'replace', path: '/adaptorType', value: 'HTTPConnection' },
      { op: 'replace', path: '/type', value: 'http' },
      { op: 'replace', path: '/application', value: undefined },
      { op: 'replace', path: '/_httpConnectorId', value: undefined },
      { op: 'replace', path: '/assistant', value: 'acumatica' },
      { op: 'replace', path: '/_connectionId', value: undefined },
      { op: 'replace', path: '/integrationId', value: 'integration_id' },
      { op: 'replace', path: '/_connectorId', value: 'connector_id' },
      { op: 'replace', path: '/statusExport', value: true },
    ],
    ));
    expect(mockHistoryPush).toBeCalled();
  });
  test('should test the add new icon when allownew is set to true when the resource type is asyncHelper when statusExport is set to true', async () => {
    jest.spyOn(Resource, 'generateNewId').mockReturnValue('mockNewId');
    jest.spyOn(MockUseIntegration, 'default').mockReturnValue('mockIntegrationFromURL');
    jest.spyOn(ApplicationList, 'applicationsList').mockReturnValue([{id: 'acumatica', assistant: 'acumatica', type: 'http'}]);
    const props = {
      disabled: true,
      id: 'test_id',
      onFieldChange: mockOnFieldChange,
      multiselect: false,
      value: 'conn_id',
      resourceType: 'asyncHelpers',
      checkPermissions: true,
      allowNew: true,
      allowEdit: false,
      filter: '',
      statusExport: true,
      ignoreEnvironmentFilter: true,
      resourceContext: {
        resourceType: 'asyncHelpers',
        resourceId: 'resource_id',
      },
      options: {filter: {$and: [{$or: [{'http.formType': 'rest'}, {type: 'rest'}]}, {_connectorId: {exists: false}}, {assistant: 'acumatica'}]}, appType: 'acumatica'},
      skipPingConnection: false,
      integrationId: 'integration_id',
      connectorId: 'connector_id',
      flowId: 'flow_id',
      addTitle: 'test_add_title',
      editTitle: 'test_edit_title',
      disabledTitle: 'test_disabled_title',
      getItemInfo: mockGetItemInfo,
    };
    const loadResources = {
      connections: 'received',
    };
    const resourcesData = {
      connections: [{
        _id: 'conn_id',
        offline: true,
        name: 'test connection',
      }],
    };

    initDynaSelectResource({props, loadResources, resourcesData});
    expect(screen.getByText(/mocking iconbuttonwithtooltip\(add\)/i)).toBeInTheDocument();
    expect(screen.getByText(/tooltipprops = \{"title":"test_add_title"\}/i)).toBeInTheDocument();
    expect(screen.getByText(/buttonsize = small/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking add icon/i)).toBeInTheDocument();
    const addButtonNode = screen.getByRole('button', {
      name: /iconbuttonwithtooltip/i,
    });

    expect(addButtonNode).toBeInTheDocument();
    await userEvent.click(addButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.patchStaged('mockNewId', [
      { path: '/_connectionId', op: 'add', value: {} },
      { path: '/http', op: 'add', value: {} },
      { path: '/http/_asyncHelperId', op: 'add', value: {} },
      { path: '/name', op: 'add', value: {} },
      { path: '/statusExport', op: 'add', value: {} },
      { op: 'replace', path: '/name', value: undefined },
      { op: 'replace', path: '/_connectionId', value: undefined },
      { op: 'replace', path: '/http/_asyncHelperId', value: 'mockNewId' },
      { op: 'replace', path: '/statusExport', value: true },
    ],
    ));
    expect(mockHistoryPush).toBeCalled();
  });
  test('should test the add new icon when allownew is set to true when the resource type is asyncHelper when statusExport is set to false', async () => {
    jest.spyOn(Resource, 'generateNewId').mockReturnValue('mockNewId');
    jest.spyOn(MockUseIntegration, 'default').mockReturnValue('mockIntegrationFromURL');
    jest.spyOn(ApplicationList, 'applicationsList').mockReturnValue([{id: 'acumatica', assistant: 'acumatica', type: 'http'}]);
    const props = {
      disabled: true,
      id: 'test_id',
      onFieldChange: mockOnFieldChange,
      multiselect: false,
      value: 'conn_id',
      resourceType: 'asyncHelpers',
      checkPermissions: true,
      allowNew: true,
      allowEdit: false,
      filter: '',
      statusExport: false,
      ignoreEnvironmentFilter: true,
      resourceContext: {
        resourceType: 'asyncHelpers',
        resourceId: 'resource_id',
      },
      options: {filter: {$and: [{$or: [{'http.formType': 'rest'}, {type: 'rest'}]}, {_connectorId: {exists: false}}, {assistant: 'acumatica'}]}, appType: 'acumatica'},
      skipPingConnection: false,
      integrationId: 'integration_id',
      connectorId: 'connector_id',
      flowId: 'flow_id',
      addTitle: 'test_add_title',
      editTitle: 'test_edit_title',
      disabledTitle: 'test_disabled_title',
      getItemInfo: mockGetItemInfo,
    };
    const loadResources = {
      connections: 'received',
    };
    const resourcesData = {
      connections: [{
        _id: 'conn_id',
        offline: true,
        name: 'test connection',
      }],
    };

    initDynaSelectResource({props, loadResources, resourcesData});
    expect(screen.getByText(/mocking iconbuttonwithtooltip\(add\)/i)).toBeInTheDocument();
    expect(screen.getByText(/tooltipprops = \{"title":"test_add_title"\}/i)).toBeInTheDocument();
    expect(screen.getByText(/buttonsize = small/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking add icon/i)).toBeInTheDocument();
    const addButtonNode = screen.getByRole('button', {
      name: /iconbuttonwithtooltip/i,
    });

    expect(addButtonNode).toBeInTheDocument();
    await userEvent.click(addButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.patchStaged('mockNewId', [
      { path: '/_connectionId', op: 'add', value: {} },
      { path: '/http', op: 'add', value: {} },
      { path: '/http/_asyncHelperId', op: 'add', value: {} },
      { path: '/name', op: 'add', value: {} },
      { op: 'replace', path: '/name', value: undefined },
      { op: 'replace', path: '/_connectionId', value: undefined },
      { op: 'replace', path: '/http/_asyncHelperId', value: 'mockNewId' },
    ],
    ));
    expect(mockHistoryPush).toBeCalled();
  });
});
