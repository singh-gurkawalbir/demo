import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InstallBase from '.';
import { runServer } from '../../../test/api/server';
import actions from '../../../actions';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';

async function initMarketplace({
  props = {
    match: {
      params: {
        connectorId: 'connector_id',
      },
    },
  },
  keyword = '',
  connectorInstallBase = [],
  connectorLicenses = [],
} = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.resources = {
      connectors: [
        {
          name: 'Mock Connector 1',
          _id: 'connector_id_1',
          framework: 'twoDotZero',
        },
        {
          name: 'Mock Connector 2',
          _id: 'connector_id_2',
        },
      ],
      connectorInstallBase,
      connectorLicenses,
    };

    draft.session.filters = {
      connectorInstallBase: {
        keyword,
        take: 100,
      },
    };
  });

  const ui = (
    <MemoryRouter>
      <InstallBase {...props} />
    </MemoryRouter>
  );

  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

jest.mock('../../../components/CeligoTable', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/CeligoTable'),
  default: props => {
    const handleSelectChange = jest.fn(event => {
      props.onSelectChange({[event.target.name]: true});
    });
    const handleEmptySelectChange = jest.fn(() => {
      props.onSelectChange();
    });

    return (
      <>
        {props.data.map(eachData => (
          <button type="button" onClick={handleSelectChange} key={eachData._id} name={eachData._id}>Mock handleSelectChange {eachData.name}</button>
        ))}
        <button type="button" onClick={handleEmptySelectChange} >Mock handleSelectChange empty</button>
      </>
    );
  },
}));

describe('installBase test cases', () => {
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
  });

  test('should pass the initial render with default value/pass the wrong id', async () => {
    await initMarketplace();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('should pass the initial render with right id', async () => {
    await initMarketplace({
      props: {
        match: {
          params: {
            connectorId: 'connector_id_1',
          },
        },
      },
    });
    const updateButton = screen.getByRole('button', { name: 'Update'});

    expect(updateButton).toBeInTheDocument();
    expect(screen.queryByText(/You don't have any install base/)).toBeInTheDocument();
    await userEvent.click(updateButton);

    expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.connectors.installBase.update({
        _integrationIds: [],
        connectorId: 'connector_id_1',
      })
    );
    expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.resource.requestCollection(
        'connectors/connector_id_1/installBase'
      )
    );
  });

  test('should pass the initial render with a install base', async () => {
    await initMarketplace({
      props: {
        match: {
          params: {
            connectorId: 'connector_id_1',
          },
        },
      },
      connectorLicenses: [
        {
          _integrationId: 'integration_id_1',
          _id: 'license_id_1',
        },
        {
          _integrationId: 'integration_id_2',
          _id: 'license_id_2',
        },
      ],
      connectorInstallBase: [
        {
          email: 'license1@celigo.com',
          name: 'license 1',
          sandbox: true,
          _connectorId: 'connector_id_1',
          _integrationId: 'integration_id_1',
          _userId: 'user_id_1',
        },
        {
          email: 'license1@celigo.com',
          name: 'license 2',
          sandbox: true,
          _connectorId: 'connector_id_1',
          _integrationId: 'integration_id_2',
          _userId: 'user_id_1',
        },
      ],
    });
    const updateButton = screen.getByRole('button', { name: 'Update'});
    const license1Button = screen.getByRole('button', { name: 'Mock handleSelectChange license 1'});
    const emptyButton = screen.getByRole('button', { name: 'Mock handleSelectChange empty'});

    expect(updateButton).toBeInTheDocument();
    expect(license1Button).toBeInTheDocument();
    expect(emptyButton).toBeInTheDocument();
    await userEvent.click(emptyButton);
    await userEvent.click(license1Button);
    mockDispatchFn.mockClear();
    await userEvent.click(updateButton);

    expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.connectors.installBase.update({
        _integrationIds: ['integration_id_1'],
        connectorId: 'connector_id_1',
      })
    );
    expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.resource.requestCollection(
        'connectors/connector_id_1/installBase'
      )
    );
  });

  test('should pass the initial render with a search key', async () => {
    await initMarketplace({
      props: {
        match: {
          params: {
            connectorId: 'connector_id_1',
          },
        },
      },
      connectorLicenses: [
        {
          _integrationId: 'integration_id_1',
          _id: 'license_id_1',
        },
      ],
      connectorInstallBase: [
        {
          email: 'license1@celigo.com',
          name: 'license 1',
          sandbox: true,
          _connectorId: 'connector_id_1',
          _integrationId: 'integration_id_1',
          _userId: 'user_id_1',
        },
      ],
      keyword: 'mockvalue',
    });

    expect(screen.queryByText('Update')).toBeInTheDocument();
    expect(screen.queryByText(/Your search didn’t return any matching results. Try expanding your search criteria./)).toBeInTheDocument();
  });
});
