
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import SelectQueryType from './SelectQueryType';
import { runServer } from '../../../test/api/server';
import { renderWithProviders, reduxStore } from '../../../test/test-utils';

async function initSelectQueryType({
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
        rdbms: {
          queryType: [
            'UPDATE',
            'INSERT',
          ],
        },
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
        adaptorType: 'RDBMSImport',
        rdbms: {

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
        adaptorType: 'NOTdbImport',
      },
    ],
  };

  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: `/flows/queryBuilder/flow_id/${importId}`}]}
    >
      <Route path="/flows/queryBuilder/:flowId/:importId">
        <SelectQueryType {...props} />
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

describe('SelectQueryType_afe test cases', () => {
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
    await initSelectQueryType();

    expect(screen.queryByText(/INSERT/i)).toBeInTheDocument();
    expect(screen.queryByText(/UPDATE/i)).toBeInTheDocument();
  });

  test('should pass the initial render with RDBMS adaptorType without queryType', async () => {
    const { utils } = await initSelectQueryType({
      importId: 'import_id_2',
    });

    expect(mockRedirect).toBeCalledTimes(0);
    expect(utils.container.lastChild).toBeEmptyDOMElement();
  });

  test('should pass the initial render with DynamodbImport adaptorType & putItem method', async () => {
    const { utils } = await initSelectQueryType({
      importId: 'import_id_1',
    });

    expect(mockRedirect).toBeCalledWith('/flows/queryBuilder/flow_id/import_id_1/0/view');
    expect(utils.container).toBeEmptyDOMElement();
  });

  test('should pass the initial render with DynamodbImport adaptorType & insertMany method', async () => {
    const { utils } = await initSelectQueryType({
      importId: 'import_id_3',
    });

    expect(mockRedirect).toBeCalledWith('/flows/queryBuilder/flow_id/import_id_3/0/view');
    expect(utils.container).toBeEmptyDOMElement();
  });

  test('should pass the initial render without db adaptor', async () => {
    const { utils } = await initSelectQueryType({
      importId: 'import_id_4',
    });

    expect(mockRedirect).toBeCalledTimes(0);
    expect(utils.container.lastChild).toBeEmptyDOMElement();
  });

  test('should pass the initial render with invalid import id', async () => {
    const { utils } = await initSelectQueryType({
      importId: 'import_id_5',
    });

    expect(mockRedirect).toBeCalledTimes(0);
    expect(utils.container.lastChild).toBeEmptyDOMElement();
  });
});
