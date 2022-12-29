
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import DatabaseMapping from '.';
import { runServer } from '../../../test/api/server';
import { renderWithProviders, reduxStore } from '../../../test/test-utils';

async function initDatabaseMapping({
  props = {
    resourceType: 'exports',
  },
  importId = 'import_id',
} = {}) {
  const initialStore = reduxStore;

  initialStore.getState().data.resources = {
    imports: [
      {
        _id: 'import_id',
        adaptorType: 'RDBMSImport',
      },
      {
        _id: 'import_id_1',
        adaptorType: 'DynamodbImport',
        dynamodb: {
          method: 'putItem',
        },
      },
      {
        _id: 'import_id_2',
        adaptorType: 'DynamodbImport',
        dynamodb: {
          method: 'postItem',
        },
      },
      {
        _id: 'import_id_3',
        adaptorType: 'MongodbImport',
        mongodb: {
          method: 'insertMany',
        },
      },
      {
        _id: 'import_id_4',
        adaptorType: 'MongodbImport',
        mongodb: {
          method: 'insertOne',
        },
      },
    ],
  };

  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: `/flows/queryBuilder/flow_id/${importId}/0`}]}
    >
      <Route path="/flows/queryBuilder/:flowId/:importId/:index">
        <DatabaseMapping {...props} />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

const mockRedirect = jest.fn(() => (<></>));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Redirect: props => mockRedirect(props.to),
}));

describe('DatabaseMapping_afe test cases', () => {
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
    mockRedirect.mockClear();
  });

  test('should pass the initial render with default value/ RDBMS import', async () => {
    const { utils } = await initDatabaseMapping();

    expect(mockRedirect).toBeCalledWith('/flows/queryBuilder/flow_id/import_id/0/editor/rdbmsquery');
    expect(utils.container).toBeEmptyDOMElement();
  });

  test('should pass the initial render with DynamodbImport adaptorType & putItem method', async () => {
    const { utils } = await initDatabaseMapping({
      importId: 'import_id_1',
    });

    expect(mockRedirect).toBeCalledWith('/flows/queryBuilder/flow_id/import_id_1/0/editor/dynamodbitemDocument');
    expect(utils.container).toBeEmptyDOMElement();
  });

  test('should pass the initial render with DynamodbImport adaptorType & postItem method', async () => {
    const { utils } = await initDatabaseMapping({
      importId: 'import_id_2',
    });

    expect(mockRedirect).toBeCalledWith('/flows/queryBuilder/flow_id/import_id_2/0/editor/false');
    expect(utils.container).toBeEmptyDOMElement();
  });

  test('should pass the initial render with DynamodbImport adaptorType & insertMany method', async () => {
    const { utils } = await initDatabaseMapping({
      importId: 'import_id_3',
    });

    expect(mockRedirect).toBeCalledWith('/flows/queryBuilder/flow_id/import_id_3/0/editor/mongodbdocument');
    expect(utils.container).toBeEmptyDOMElement();
  });

  test('should pass the initial render with DynamodbImport adaptorType & insertOne method', async () => {
    const { utils } = await initDatabaseMapping({
      importId: 'import_id_4',
    });

    expect(mockRedirect).toBeCalledWith('/flows/queryBuilder/flow_id/import_id_4/0/editor/mongodbupdate');
    expect(utils.container).toBeEmptyDOMElement();
  });

  test('should pass the initial render with invalid import id', async () => {
    const { utils } = await initDatabaseMapping({
      importId: 'import_id_5',
    });

    expect(mockRedirect).toBeCalledTimes(0);
    expect(utils.container).toBeEmptyDOMElement();
  });
});
