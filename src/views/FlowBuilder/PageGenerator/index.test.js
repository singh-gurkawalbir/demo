import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore} from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';
import actions from '../../../actions';
import { runServer } from '../../../test/api/server';
import PageGenerator from './index';

const mockDispatch = jest.fn();

const history = {
  push: jest.fn(),
  replace: jest.fn(),
};

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('../AppBlock', () => ({
  __esModule: true,
  ...jest.requireActual('../AppBlock'),
  default: props => {
    const blockType = `blockType: ${props.blockType}`;
    const actions = props.actions.map(a => <div key={a.name}>{`actionsname : ${a.name}`}</div>);
    const connectorType = `Connector Type: ${props.connectorType}`;

    return (
      <>
        <button type="button" onClick={props.onBlockClick}>
          mock onBlockClick
        </button>
        <button type="button" onClick={props.onDelete}>
          mock onDelete
        </button>
        <div>{blockType}</div>
        <div>{actions}</div>
        <div>{connectorType}</div>
      </>
    );
  },
}));

const exports = [
  {
    _id: '5e7068331c056a75e6df19b2',
    name: 'Export Name',
  },
];

const flows = [{
  _id: '5ea16c600e2fab71928a6152',
  lastModified: '2021-08-13T08:02:49.712Z',
  name: ' Bulk insert with harcode and mulfield mapping settings',
  disabled: true,
  _integrationId: '5e9bf6c9edd8fa3230149fbd',
  skipRetries: false,
  pageProcessors: [
    {
      responseMapping: {
        fields: [],
        lists: [],
      },
      type: 'import',
      _importId: '5ea16cd30e2fab71928a6166',
    },
  ],
  pageGenerators: [
    {
      _exportId: '5e7068331c056a75e6df19b2',
    },
  ],
  createdAt: '2020-04-23T10:22:24.290Z',
  lastExecutedAt: '2020-04-23T11:08:41.093Z',
  autoResolveMatchingTraceKeys: true,
}];

describe('PageGenerator UI tests', () => {
  runServer();
  beforeEach(() => {
    jest.resetAllMocks();
  });

  async function initStore(initialStore) {
    initialStore.dispatch(actions.resource.requestCollection('connections'));
    await waitFor(() => expect(initialStore?.getState()?.data?.resources?.connections).toBeDefined());
    initialStore.dispatch(actions.resource.requestCollection('exports'));
    await waitFor(() => expect(initialStore?.getState()?.data?.resources?.exports).toBeDefined());
  }

  function renderFunction(pg, history, initialStore) {
    renderWithProviders(
      <PageGenerator.WrappedComponent history={history} match={{url: 'someinitiaUrL'}} {...pg} />,
      {initialStore});
  }
  test('should test the case when connection is provided and no export', async () => {
    const pg = {
      id: 'somePGId',
      _connectionId: '5e7068331c056a75e6df19b2',
    };

    const initialStore = reduxStore;

    await initStore(initialStore);

    renderFunction(pg, history, initialStore);

    await userEvent.click(screen.getByText('mock onBlockClick'));
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'RESOURCE_STAGE_PATCH',
        patch: [
          { op: 'add', path: '/application', value: '3dcart' },
          {
            op: 'add',
            path: '/_connectionId',
            value: '5e7068331c056a75e6df19b2',
          },
          { op: 'add', path: '/rdbmsAppType', value: undefined },
        ],
        id: 'somePGId',
      }
    );

    expect(history.replace).toHaveBeenCalledWith('someinitiaUrL/add/pageGenerator/somePGId');

    expect(screen.getByText('Connector Type: rest')).toBeInTheDocument();
  });
  test('should test when webhookonly = true application type !== webhook', async () => {
    const pg = {
      id: 'somePGId',
      webhookOnly: true,
      _connectionId: '5e7068331c056a75e6df19b2',
    };

    const initialStore = reduxStore;

    await initStore(initialStore);

    renderFunction(pg, history, initialStore);

    await userEvent.click(screen.getByText('mock onBlockClick'));
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'RESOURCE_STAGE_PATCH',
        patch: [
          { op: 'add', path: '/application', value: '3dcart' },
          { op: 'add', path: '/type', value: 'webhook' },
          {
            op: 'add',
            path: '/_connectionId',
            value: '5e7068331c056a75e6df19b2',
          },
          { op: 'add', path: '/rdbmsAppType', value: undefined },
        ],
        id: 'somePGId',
      }
    );

    expect(history.replace).toHaveBeenCalledWith('someinitiaUrL/add/pageGenerator/somePGId');
    expect(screen.getByText('Connector Type: rest')).toBeInTheDocument();
  });
  test('should test the case when resource is FileAdaptor', async () => {
    const pg = {
      id: 'somePGId',
      webhookOnly: true,
      _connectionId: '5e3338331c056a75e6df19b2',
    };

    const initialStore = reduxStore;

    await initStore(initialStore);

    renderFunction(pg, history, initialStore);

    expect(screen.getByText('blockType: exportTransfer')).toBeInTheDocument();
    expect(screen.getByText('Connector Type: HTTPExport')).toBeInTheDocument();
  });
  test('should test when no export and no resource Id and only application is provided', () => {
    const pg = {
      id: 'somePGId',
      application: 'activecampaign',
    };

    const initialStore = reduxStore;

    renderFunction(pg, history, initialStore);

    expect(screen.getByText('blockType: newPG')).toBeInTheDocument();
    expect(screen.getByText('Connector Type: http')).toBeInTheDocument();
  });
  test('should test the case when resource is data loader', async () => {
    const pg = {
      id: 'somePGId',
      _connectionId: '5e7068331c056a75e6df19b2',
      application: 'dataLoader',
    };

    const initialStore = reduxStore;

    await initStore(initialStore);

    renderFunction(pg, history, initialStore);

    await userEvent.click(screen.getByText('mock onBlockClick'));
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'RESOURCE_STAGE_PATCH',
        patch: [
          { op: 'add', path: '/type', value: 'simple' },
          { op: 'add', path: '/name', value: 'Data loader' },
        ],
        id: 'somePGId',
      }
    );

    expect(history.replace).toHaveBeenCalledWith('someinitiaUrL/edit/exports/somePGId');
    expect(screen.getByText('blockType: dataLoader')).toBeInTheDocument();

    expect(screen.queryByText('actionsname : as2Routing')).not.toBeInTheDocument();
    expect(screen.queryByText('actionsname : exportTransformation')).not.toBeInTheDocument();
    expect(screen.queryByText('actionsname : exportFilter')).not.toBeInTheDocument();
    expect(screen.queryByText('actionsname : exportHooks')).not.toBeInTheDocument();

    expect(screen.queryByText('Connector Type: dataLoader')).toBeInTheDocument();
  });
  test('should test the case when export is provided', async () => {
    const pg = {
      id: 'somePGId',
      _exportId: '5e7068331c056a75e6df19b2',
    };

    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.resources.exports = exports;
    });

    renderFunction(pg, history, initialStore);

    await userEvent.click(screen.getByText('mock onBlockClick'));

    expect(mockDispatch).not.toHaveBeenCalled();

    expect(history.replace).toHaveBeenCalledWith('someinitiaUrL/edit/exports/5e7068331c056a75e6df19b2');
    expect(screen.getByText('blockType: export')).toBeInTheDocument();

    expect(screen.getByText('actionsname : exportTransformation')).toBeInTheDocument();
    expect(screen.getByText('actionsname : exportFilter')).toBeInTheDocument();
    expect(screen.getByText('actionsname : exportHooks')).toBeInTheDocument();
  });
  test('should test the case when block type is listener', async () => {
    const pg = {
      id: 'somePGId',
      _exportId: '5eddd8331c056a75e6df19b2',
    };

    const initialStore = reduxStore;

    await initStore(initialStore);

    renderFunction(pg, history, initialStore);

    await userEvent.click(screen.getByText('mock onBlockClick'));

    expect(mockDispatch).not.toHaveBeenCalled();

    expect(history.replace).toHaveBeenCalledWith('someinitiaUrL/edit/exports/5eddd8331c056a75e6df19b2');

    expect(screen.getByText('blockType: listener')).toBeInTheDocument();

    expect(screen.getByText('actionsname : exportTransformation')).toBeInTheDocument();
    expect(screen.getByText('actionsname : exportFilter')).toBeInTheDocument();
    expect(screen.getByText('actionsname : exportHooks')).toBeInTheDocument();

    expect(screen.getByText('Connector Type: distributed')).toBeInTheDocument();
  });

  test('should test the case when resource is of AS2', async () => {
    const pg = {
      id: 'somePGId',
      _exportId: '5e5558331c056a75e6df19b2',
    };

    const initialStore = reduxStore;

    await initStore(initialStore);

    renderFunction(pg, history, initialStore);

    await userEvent.click(screen.getByText('mock onBlockClick'));

    expect(mockDispatch).not.toHaveBeenCalled();

    expect(history.replace).toHaveBeenCalledWith('someinitiaUrL/edit/exports/5e5558331c056a75e6df19b2');
    expect(screen.getByText('blockType: export')).toBeInTheDocument();

    expect(screen.getByText('actionsname : as2Routing')).toBeInTheDocument();
    expect(screen.getByText('actionsname : exportTransformation')).toBeInTheDocument();
    expect(screen.getByText('actionsname : exportFilter')).toBeInTheDocument();
    expect(screen.getByText('actionsname : exportHooks')).toBeInTheDocument();
  });
  test('should test case when webhook export is given', async () => {
    const pg = {
      id: 'somePGId',
      _exportId: '5ebbb8331c056a75e6df19b2',
    };

    const initialStore = reduxStore;

    await initStore(initialStore);

    renderFunction(pg, history, initialStore);

    await userEvent.click(screen.getByText('mock onBlockClick'));

    expect(mockDispatch).not.toHaveBeenCalled();

    expect(history.replace).toHaveBeenCalledWith('someinitiaUrL/edit/exports/5ebbb8331c056a75e6df19b2');
    expect(screen.getByText('actionsname : exportTransformation')).toBeInTheDocument();
    expect(screen.getByText('actionsname : exportFilter')).toBeInTheDocument();
    expect(screen.getByText('actionsname : exportHooks')).toBeInTheDocument();

    expect(screen.getByText('Connector Type: someprovider')).toBeInTheDocument();
  });

  test('should test the case when allowschedule is true', async () => {
    const pg = {
      id: 'somePGId',
      _exportId: '5e7068331c056a75e6df19b2',
      flowId: '5ea16c600e2fab71928a6152',
    };

    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.resources.exports = exports;
      draft.data.resources.flows = flows;
    });

    renderFunction(pg, history, initialStore);

    await userEvent.click(screen.getByText('mock onBlockClick'));

    expect(mockDispatch).not.toHaveBeenCalled();

    expect(history.replace).toHaveBeenCalledWith('someinitiaUrL/edit/exports/5e7068331c056a75e6df19b2');

    expect(screen.getByText('actionsname : exportSchedule')).toBeInTheDocument();
    expect(screen.getByText('actionsname : exportTransformation')).toBeInTheDocument();
    expect(screen.getByText('actionsname : exportFilter')).toBeInTheDocument();
    expect(screen.getByText('actionsname : exportHooks')).toBeInTheDocument();
  });
  test('should test history.push call', async () => {
    const pg = {
      id: 'somePGId',
      _exportId: '5e7068331c056a75e6df19b2',
      flowId: '5ea16c600e2fab71928a6152',
    };

    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.resources.exports = exports;
      draft.data.resources.flows = flows;
    });

    renderWithProviders(
      <PageGenerator.WrappedComponent history={history} match={{url: 'someinitiaUrL', isExact: true}} {...pg} />,
      {initialStore});

    await userEvent.click(screen.getByText('mock onBlockClick'));

    expect(mockDispatch).not.toHaveBeenCalled();

    expect(history.push).toHaveBeenCalledWith('someinitiaUrL/edit/exports/5e7068331c056a75e6df19b2');
  });
  test('should test delete option', async () => {
    const onDelete = jest.fn();
    const pg = {
      id: 'somePGId',
      _connectionId: '5e7068331c056a75e6df19b2',
    };

    const initialStore = reduxStore;

    await initStore(initialStore);

    renderWithProviders(
      <PageGenerator.WrappedComponent history={history} match={{url: 'someinitiaUrL'}} {...pg} onDelete={onDelete} />,
      {initialStore});

    await userEvent.click(screen.getByText('mock onDelete'));
    expect(onDelete).toHaveBeenCalled();
  });
});
