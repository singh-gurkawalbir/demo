import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { mutateStore, renderWithProviders} from '../../test/test-utils';
import { getCreatedStore } from '../../store';
import FlowBuilder from './index';

jest.mock('../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../components/LoadResources'),
  default: props => {
    const content = `Loadresource integrationId: ${props.integrationId}`;

    return (<><div>{content}</div><div>{props.children}</div></>);
  },
}));
jest.mock('./FlowBuilderBody', () => ({
  __esModule: true,
  ...jest.requireActual('./FlowBuilderBody'),
  default: () => (<div>FlowBuilderBody</div>),
}));
jest.mock('./Redirection', () => ({
  __esModule: true,
  ...jest.requireActual('./Redirection'),
  default: props => (<><div>Redirection</div><div>{props.children}</div></>),
}));
jest.mock('../../components/drawer/Resource', () => ({
  __esModule: true,
  ...jest.requireActual('../../components/drawer/Resource'),
  default: props => {
    const content = `ResourceDrawer flowId: ${props.flowId} integrationId: ${props.integrationId}`;

    return (<div>{content}</div>);
  },
}));
jest.mock('../../components/drawer/ConfigConnectionDebugger', () => ({
  __esModule: true,
  ...jest.requireActual('../../components/drawer/ConfigConnectionDebugger'),
  default: () => {
    const content = 'ConfigConnectionDebugger';

    return (<div>{content}</div>);
  },
}));
jest.mock('./drawers/Hooks', () => ({
  __esModule: true,
  ...jest.requireActual('./drawers/Hooks'),
  default: props => {
    const content = `HooksDrawer flowId: ${props.flowId} integrationId: ${props.integrationId}`;

    return (<div>{content}</div>);
  },
}));
jest.mock('./drawers/Schedule', () => ({
  __esModule: true,
  ...jest.requireActual('./drawers/Schedule'),
  default: props => {
    const content = `ScheduleDrawer flowId: ${props.flowId}`;

    return (<div>{content}</div>);
  },
}));
jest.mock('./drawers/LineGraph', () => ({
  __esModule: true,
  ...jest.requireActual('./drawers/LineGraph'),
  default: props => {
    const content = `ChartsDrawer flowId: ${props.flowId}`;

    return (<div>{content}</div>);
  },
}));
jest.mock('../../components/JobDashboard/QueuedJobs/QueuedJobsDrawer', () => ({
  __esModule: true,
  ...jest.requireActual('../../components/JobDashboard/QueuedJobs/QueuedJobsDrawer'),
  default: props => {
    const content = `QueuedJobsDrawer integrationId: ${props.integrationId}`;

    return (<div>{content}</div>);
  },
}));
jest.mock('../../components/AFE/Drawer', () => ({
  __esModule: true,
  ...jest.requireActual('../../components/AFE/Drawer'),
  default: () => {
    const content = 'EditorDrawer';

    return (<div>{content}</div>);
  },
}));
jest.mock('./drawers/ErrorsDetails', () => ({
  __esModule: true,
  ...jest.requireActual('./drawers/ErrorsDetails'),
  default: props => {
    const content = `ErrorDetailsDrawer flowId: ${props.flowId}`;

    return (<div>{content}</div>);
  },
}));
jest.mock('./drawers/ReplaceConnection', () => ({
  __esModule: true,
  ...jest.requireActual('./drawers/ReplaceConnection'),
  default: props => {
    const content = `ReplaceConnectionDrawer flowId: ${props.flowId} integrationId: ${props.integrationId} childId: ${props.childId}`;

    return (<div>{content}</div>);
  },
}));
jest.mock('./drawers/BottomDrawer', () => ({
  __esModule: true,
  ...jest.requireActual('./drawers/BottomDrawer'),
  default: props => {
    const content = `BottomDrawer flowId: ${props.flowId} integrationId: ${props.integrationId} childId: ${props.childId}`;

    return (<div>{content}</div>);
  },
}));

const integrations = [
  {
    _id: '5ff579d745ceef7dcd797c15',
    lastModified: '2021-01-19T06:34:17.222Z',
    name: " AFE 2.0 refactoring for DB's",
    install: [],
    sandbox: false,
    _registeredConnectionIds: [
      '5cd51efd3607fe7d8eda9c97',
      '5ff57a8345ceef7dcd797c21',
    ],
    installSteps: [],
    uninstallSteps: [],
    flowGroupings: [],
    createdAt: '2021-01-06T08:50:31.935Z',
  },
  {
    _id: '5ff579d745ceef7dcd797c16',
    lastModified: '2021-01-19T06:34:17.222Z',
    name: " AFE 2.0 refactoring for DB's",
    install: [],
    sandbox: false,
    _registeredConnectionIds: [
      '5cd51efd3607fe7d8eda9c97',
      '5ff57a8345ceef7dcd797c21',
    ],
    installSteps: ['1'],
    uninstallSteps: [],
    flowGroupings: [],
    createdAt: '2021-01-06T08:50:31.935Z',
  },
];

describe('FlowBuilder UI tests', () => {
  test('should test when integration is not loaded', () => {
    const {utils} = renderWithProviders(<MemoryRouter><FlowBuilder /></MemoryRouter>);

    expect(utils.container.textContent).toContain('Loadresource integrationId: undefined');
  });
  test('should test when integration is of version 1', async () => {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.resources.integrations = integrations;
    });

    renderWithProviders(
      <MemoryRouter initialEntries={['/5ff579d745ceef7dcd797c15/childID/flowId']}>
        <Route path="/:integrationId/:childId/:flowId">
          <FlowBuilder />
        </Route>
      </MemoryRouter>, {initialStore});

    expect(screen.getAllByText('Loadresource integrationId: 5ff579d745ceef7dcd797c15')[0]).toBeInTheDocument();

    await waitFor(() => expect(screen.queryByText('Redirection')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('FlowBuilderBody')).toBeInTheDocument());
    expect(screen.getByText('ResourceDrawer flowId: flowId integrationId: 5ff579d745ceef7dcd797c15')).toBeInTheDocument();
    expect(screen.getByText('ConfigConnectionDebugger')).toBeInTheDocument();
    expect(screen.getByText('HooksDrawer flowId: flowId integrationId: 5ff579d745ceef7dcd797c15')).toBeInTheDocument();
    expect(screen.getByText('ScheduleDrawer flowId: flowId')).toBeInTheDocument();
    expect(screen.getByText('ChartsDrawer flowId: flowId')).toBeInTheDocument();
    expect(screen.getByText('QueuedJobsDrawer integrationId: 5ff579d745ceef7dcd797c15')).toBeInTheDocument();
    expect(screen.getByText('EditorDrawer')).toBeInTheDocument();
    expect(screen.getByText('ErrorDetailsDrawer flowId: flowId')).toBeInTheDocument();
    expect(screen.getByText('ReplaceConnectionDrawer flowId: flowId integrationId: 5ff579d745ceef7dcd797c15 childId: childID')).toBeInTheDocument();
    expect(screen.getByText('BottomDrawer flowId: flowId integrationId: 5ff579d745ceef7dcd797c15 childId: undefined')).toBeInTheDocument();
  });
  test('should test when integration is of version 2', async () => {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.resources.integrations = integrations;
    });

    renderWithProviders(
      <MemoryRouter initialEntries={['/5ff579d745ceef7dcd797c16/childID/flowId']}>
        <Route path="/:integrationId/:childId/:flowId">
          <FlowBuilder />
        </Route>
      </MemoryRouter>, {initialStore});

    await waitFor(() => expect(screen.queryByText('Redirection')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('FlowBuilderBody')).toBeInTheDocument());
    expect(screen.getByText('ResourceDrawer flowId: flowId integrationId: 5ff579d745ceef7dcd797c16')).toBeInTheDocument();
    expect(screen.getByText('ConfigConnectionDebugger')).toBeInTheDocument();
    expect(screen.getByText('HooksDrawer flowId: flowId integrationId: 5ff579d745ceef7dcd797c16')).toBeInTheDocument();
    expect(screen.getByText('ScheduleDrawer flowId: flowId')).toBeInTheDocument();
    expect(screen.getByText('ChartsDrawer flowId: flowId')).toBeInTheDocument();
    expect(screen.getByText('QueuedJobsDrawer integrationId: 5ff579d745ceef7dcd797c16')).toBeInTheDocument();
    expect(screen.getByText('EditorDrawer')).toBeInTheDocument();
    expect(screen.getByText('ErrorDetailsDrawer flowId: flowId')).toBeInTheDocument();
    expect(screen.getByText('ReplaceConnectionDrawer flowId: flowId integrationId: 5ff579d745ceef7dcd797c16 childId: childID')).toBeInTheDocument();
    expect(screen.getByText('BottomDrawer flowId: flowId integrationId: 5ff579d745ceef7dcd797c16 childId: undefined')).toBeInTheDocument();
  });
  test('should test when no child is provided integration is of version 2', async () => {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.resources.integrations = integrations;
    });

    renderWithProviders(
      <MemoryRouter initialEntries={['/5ff579d745ceef7dcd797c16/flowId']}>
        <Route path="/:integrationId/:flowId">
          <FlowBuilder />
        </Route>
      </MemoryRouter>, {initialStore});

    await waitFor(() => expect(screen.queryByText('Redirection')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('FlowBuilderBody')).toBeInTheDocument());
    expect(screen.getByText('ResourceDrawer flowId: flowId integrationId: 5ff579d745ceef7dcd797c16')).toBeInTheDocument();
    expect(screen.getByText('ConfigConnectionDebugger')).toBeInTheDocument();
    expect(screen.getByText('HooksDrawer flowId: flowId integrationId: 5ff579d745ceef7dcd797c16')).toBeInTheDocument();
    expect(screen.getByText('ScheduleDrawer flowId: flowId')).toBeInTheDocument();
    expect(screen.getByText('ChartsDrawer flowId: flowId')).toBeInTheDocument();
    expect(screen.getByText('QueuedJobsDrawer integrationId: 5ff579d745ceef7dcd797c16')).toBeInTheDocument();
    expect(screen.getByText('EditorDrawer')).toBeInTheDocument();
    expect(screen.getByText('ErrorDetailsDrawer flowId: flowId')).toBeInTheDocument();
    expect(screen.getByText('ReplaceConnectionDrawer flowId: flowId integrationId: 5ff579d745ceef7dcd797c16 childId: undefined')).toBeInTheDocument();
    expect(screen.getByText('BottomDrawer flowId: flowId integrationId: 5ff579d745ceef7dcd797c16 childId: undefined')).toBeInTheDocument();
  });
});

