
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PageProcessor from '.';
import actions from '../../../actions';
import { runServer } from '../../../test/api/server';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';

const mockHistoryPush = jest.fn();
const mockHistoryReplace = jest.fn();

async function initPageProcessor({
  props = {
    match: {},
    history: {
      push: mockHistoryPush,
      replace: mockHistoryReplace,
    },
    flowId: 'flow_id',
    isLast: true,
    _connectionId: 'connection_id',
    type: 'connection',
    id: 'id_1',
  },
} = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.resources = {
      imports: [
        {
          _id: 'import_id',
          type: 'type',
          adaptorType: 'NetSuiteExport',
        },
      ],
      exports: [
        {
          _id: 'export_id_1',
          type: 'type',
          adaptorType: 'NetSuiteExport',
        },
      ],
      connections: [
        {
          _id: 'connection_id',
          type: 'type',
          adaptorType: 'NetSuiteExport',
        },
      ],
      flows: [
        {
          _id: 'flow_id',
          _connectorId: 'connector_id_1',
        },
      ],
    };
  });

  const ui = (
    <MemoryRouter>
      <PageProcessor.WrappedComponent {...props} />
    </MemoryRouter>
  );

  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

jest.mock('../AppBlock', () => ({
  __esModule: true,
  ...jest.requireActual('../AppBlock'),
  default: props => (
    <>
      <button type="button" onClick={props.onBlockClick}>
        mock onBlockClick
      </button>
      <button type="button" onClick={props.onDelete}>
        mock onDelete
      </button>
    </>
  ),
}));

describe('PageProcessor test cases', () => {
  runServer();
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
    mockDispatchFn.mockClear();
    mockHistoryPush.mockClear();
    mockHistoryReplace.mockClear();
  });

  test('should pass the initial render with default value', async () => {
    await initPageProcessor();
    const onBlockClick = screen.getByRole('button', { name: 'mock onBlockClick'});

    expect(onBlockClick).toBeInTheDocument();
    await userEvent.click(onBlockClick);
    expect(mockDispatchFn).toBeCalledWith(actions.resource.patchStaged('id_1', [{
      op: 'add',
      path: '/application',
      value: 'netsuite',
    }, {
      op: 'add',
      path: '/resourceType',
      value: 'imports',
    }, {
      op: 'add',
      path: '/_connectionId',
      value: 'connection_id',
    }, {
      op: 'add',
      path: '/rdbmsAppType',
      value: undefined,
    },
    ]));
    expect(mockHistoryReplace).toBeCalledWith('/add/pageProcessor/id_1');
  });

  test('should pass the initial render with pending true', async () => {
    await initPageProcessor({
      props: {
        setupInProgress: true,
        match: {},
        history: {
          push: mockHistoryPush,
          replace: mockHistoryReplace,
        },
        flowId: 'flow_id',
        isLast: false,
        _importId: 'import_id',
        type: 'import',
        id: 'id_1',
      },
    });
    const onBlockClick = screen.getByRole('button', { name: 'mock onBlockClick'});

    expect(onBlockClick).toBeInTheDocument();
    await userEvent.click(onBlockClick);
    expect(mockDispatchFn).toBeCalledWith(actions.resource.patchStaged('id_1', [{
      op: 'add',
      path: '/application',
      value: undefined,
    }, {
      op: 'add',
      path: '/resourceType',
      value: 'imports',
    }, {
      op: 'add',
      path: '/_connectionId',
      value: undefined,
    }, {
      op: 'add',
      path: '/rdbmsAppType',
      value: undefined,
    },
    ]));
    expect(mockHistoryReplace).toBeCalledWith('/add/pageProcessor/id_1');
  });

  test('should pass the initial render with pending false/export resource', async () => {
    await initPageProcessor({
      props: {
        match: {},
        history: {
          push: mockHistoryPush,
          replace: mockHistoryReplace,
        },
        flowId: 'flow_id_1',
        isLast: false,
        _importId: 'export_id_1',
        type: 'export',
        id: 'id_1',
      },
    });
    const onBlockClick = screen.getByRole('button', { name: 'mock onBlockClick'});

    expect(onBlockClick).toBeInTheDocument();
    await userEvent.click(onBlockClick);

    expect(mockHistoryReplace).toBeCalledWith('/edit/exports/export_id_1');
  });

  test('should pass the initial render with pending false/import resource', async () => {
    await initPageProcessor({
      props: {
        match: {
          isExact: true,
        },
        history: {
          push: mockHistoryPush,
          replace: mockHistoryReplace,
        },
        flowId: 'flow_id',
        isLast: true,
        _importId: 'import_id',
        type: 'import',
        id: 'id_1',
      },
    });
    const onBlockClick = screen.getByRole('button', { name: 'mock onBlockClick'});

    expect(onBlockClick).toBeInTheDocument();
    await userEvent.click(onBlockClick);

    expect(mockHistoryPush).toBeCalledWith('/edit/imports/import_id');
  });
});
