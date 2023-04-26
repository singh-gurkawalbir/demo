import React from 'react';
import { fireEvent, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ErrorDetailsPanel from './index';
import { DrawerProvider } from '../../../drawer/Right/DrawerContext';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import { getCreatedStore } from '../../../../store';
import actions from '../../../../actions';

jest.mock('../../../CodeEditor', () => ({
  __esModule: true,
  ...jest.requireActual('../../../CodeEditor'),
  default: props => {
    let value;

    if (typeof props.value === 'string') {
      value = props.value;
    } else {
      value = JSON.stringify(props.value);
    }
    const handleChange = event => {
      props.onChange(event?.currentTarget?.value);
    };

    return (
      <textarea
        name="codeEditor"
        data-test="code-editor"
        value={value}
        onChange={handleChange}
        />
    );
  },
}));

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const mockHistoryGoBack = jest.fn();
const drawerProviderProps = {
  onClose: mockHistoryGoBack,
  height: 'short',
  fullPath: '/',
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockHistoryGoBack,
  }),
}));

const initialStore = getCreatedStore();

mutateStore(initialStore, draft => {
  draft.session.filters = {
    openErrors: {
      activeErrorId: '5556857034',
    },
  };
  draft.data.resources.flows = [
    {
      _id: '63234cd2514d5b0bf7b3c2f9',
      name: 'Flow 1',
    },
    {
      _id: '63234cd2514d5b0bf7cfvdfef',
      name: 'Flow 2',
      disabled: true,
    },
  ];
  draft.session.errorManagement = {
    openErrors: {
      '63234cd2514d5b0bf7b3c2f9': {
        status: 'received',
      },
      '63234cd2514d5b0bf7cfvdfef': {
        status: 'received',
      },
    },
    errorDetails: {
      '63234cd2514d5b0bf7b3c2f9': {
        '63234d05514d5b0bf7b3c315': {
          open: {
            status: 'received',
            errors: [
              {
                errorId: '5646501091',
                _flowJobId: '63ab70dfbc20f510012c6b9d',
                retryDataKey: 1,
                reqAndResKey: 'somereqandres1',
              },
              {
                errorId: '5556857034',
                _flowJobId: '63a0e6894c1d6d062af90b9c',
                retryDataKey: 2,
                reqAndResKey: 'somereqandres2',
              },
              {
                errorId: '5556824990',
                _flowJobId: '639f80023d732c393149668d',
                retryDataKey: 3,
                reqAndResKey: 'somereqandres3',
              },
            ],
          },
        },
      },
      '63234cd2514d5b0bf7cfvdfef': {
        '63234d05514d5b0bfxsfrgvddv': {
          open: {
            status: 'received',
            errors: [
              {
                errorId: '5646501091',
                _flowJobId: '63ab70dfbc20f510012c6b9d',
                retryDataKey: 1,
                reqAndResKey: 'somereqandres1',
                isResourceNetsuite: true,
              },
              {
                errorId: '5556857034',
                _flowJobId: '63a0e6894c1d6d062af90b9c',
                retryDataKey: 2,
                reqAndResKey: 'somereqandres2',
                isResourceNetsuite: true,
              },
              {
                errorId: '5556824990',
                _flowJobId: '639f80023d732c393149668d',
                retryDataKey: 3,
                reqAndResKey: 'somereqandres3',
                isResourceNetsuite: true,
              },
            ],
          },
        },
      },
    },
    retryData: {
      retryObjects: {
        2: {
          status: 'received',
          data: {
            data: {
              orderid: 1,
              customerid: 100,
            },
          },
        },
      },
    },
  };
});

describe('ErrorDetailsPanel UI test cases', () => {
  test('should make a dispatch call on changing retry data', async () => {
    const props = {
      errorsInCurrPage: [
        { errorId: '5646501091' },
        { errorId: '5556857034' },
        { errorId: '5556824990' },
        { errorId: '5666371243' },
      ],
      flowId: '63234cd2514d5b0bf7b3c2f9',
      isResolved: false,
      resourceId: '63234d05514d5b0bf7b3c315',
    };

    await renderWithProviders(
      <MemoryRouter>
        <DrawerProvider {...drawerProviderProps}>
          <ErrorDetailsPanel {...props} />
        </DrawerProvider>
      </MemoryRouter>,
      { initialStore }
    );

    const tabList = screen.getByRole('tablist');
    const { getByRole, getAllByRole } = within(tabList);

    expect(getAllByRole('tab')).toHaveLength(4);
    expect(getByRole('tab', { name: 'Edit retry data' })).toBeInTheDocument();
    expect(getByRole('tab', { name: 'HTTP request' })).toBeInTheDocument();
    expect(getByRole('tab', { name: 'HTTP response' })).toBeInTheDocument();
    expect(getByRole('tab', { name: 'Error fields' })).toBeInTheDocument();
    const textBoxNode = screen
      .getAllByRole('textbox')
      .find(
        eachOption => eachOption.getAttribute('data-test') === 'code-editor'
      );

    expect(textBoxNode).toBeInTheDocument();
    expect(
      document.querySelector('textarea[data-test="code-editor"]')
    ).toHaveValue(JSON.stringify({ orderid: 1, customerid: 100 }));
    fireEvent.change(textBoxNode, {
      target: { value: '{"result":true, "count":42}' },
    });
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.errorManager.retryData.updateUserRetryData({
        retryData: { count: 42, result: true },
        retryId: 2,
      })
    );
    await userEvent.click(
      screen.getByRole('checkbox', { name: 'Selected errors are added to a batch, on which you can perform bulk retry and resolve actions.' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'Retry & next' }));
    expect(
      document.querySelector(
        'span[class$="MuiTouchRipple-ripple MuiTouchRipple-ripple MuiTouchRipple-rippleVisible"]'
      )
    ).toBeInTheDocument();
  });
  test('should push http response and request tabs when reqAndResKey is provided and adatptor type for resource is not netsuite', async () => {
    const props = {
      errorsInCurrPage: [
        { errorId: '5646501091' },
        { errorId: '5556857034' },
        { errorId: '5556824990' },
        { errorId: '5666371243' },
      ],
      flowId: '63234cd2514d5b0bf7cfvdfef',
      isResolved: false,
      resourceId: '63234d05514d5b0bfxsfrgvddv',
    };

    await renderWithProviders(
      <MemoryRouter>
        <DrawerProvider {...drawerProviderProps}>
          <ErrorDetailsPanel {...props} />
        </DrawerProvider>
      </MemoryRouter>,
      { initialStore }
    );
    const tabList = screen.getByRole('tablist');
    const { getByRole, getAllByRole } = within(tabList);

    expect(getAllByRole('tab')).toHaveLength(4);
    expect(getByRole('tab', { name: 'Retry data' })).toBeInTheDocument();
    expect(getByRole('tab', { name: 'HTTP request' })).toBeInTheDocument();
    expect(getByRole('tab', { name: 'HTTP response' })).toBeInTheDocument();
    expect(getByRole('tab', { name: 'Error fields' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('tab', { name: 'Retry data' }));
    expect(
      document.querySelector(
        'span[class$="MuiTouchRipple-ripple MuiTouchRipple-ripple MuiTouchRipple-rippleVisible"]'
      )
    ).toBeInTheDocument();
  });
  test('should push view response and view request tabs when reqAndResKey is provided and adatptor type for resource is netsuite', async () => {
    mutateStore(initialStore, draft => {
      draft.data.resources.exports = [
        {
          _id: '63234d05514d5b0bfxsfrgvddv',
          name: 'SF Export',
          _connectionId: 'connectionId',
          adaptorType: 'NetSuiteExport',
          salesforce: { sObjectType: 'Opportunity' },
        },
      ];
    });
    const props = {
      errorsInCurrPage: [
        { errorId: '5646501091' },
        { errorId: '5556857034' },
        { errorId: '5556824990' },
        { errorId: '5666371243' },
      ],
      flowId: '63234cd2514d5b0bf7cfvdfef',
      isResolved: false,
      resourceId: '63234d05514d5b0bfxsfrgvddv',
    };

    renderWithProviders(
      <MemoryRouter>
        <DrawerProvider {...drawerProviderProps}>
          <ErrorDetailsPanel {...props} />
        </DrawerProvider>
      </MemoryRouter>,
      { initialStore }
    );

    const tabList = screen.getByRole('tablist');
    const { getByRole, getAllByRole } = within(tabList);

    expect(getAllByRole('tab')).toHaveLength(4);
    expect(getByRole('tab', { name: 'Retry data' })).toBeInTheDocument();
    expect(getByRole('tab', { name: 'View request' })).toBeInTheDocument();
    expect(getByRole('tab', { name: 'View response' })).toBeInTheDocument();
    expect(getByRole('tab', { name: 'Error fields' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('tab', { name: 'Retry data' }));

    expect(
      document.querySelector(
        'span[class$="MuiTouchRipple-ripple MuiTouchRipple-ripple MuiTouchRipple-rippleVisible"]'
      )
    ).toBeInTheDocument();
    screen.debug(undefined, Infinity);
    await userEvent.click(
      screen.getByRole('checkbox', { name: 'Selected errors are added to a batch, on which you can perform bulk retry and resolve actions.' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'Resolve & next' }));
    expect(
      document.querySelector(
        'span[class$="MuiTouchRipple-ripple MuiTouchRipple-ripple MuiTouchRipple-rippleVisible"]'
      )
    ).toBeInTheDocument();
  });
  test('should return empty error details when active error id is not provided', async () => {
    mutateStore(initialStore, draft => {
      draft.session.filters = {
        openErrors: {},
      };
      draft.data.resources.exports = [
        {
          _id: '63234d05514d5b0bfxsfrgvddv',
          name: 'SF Export',
          _connectionId: 'connectionId',
          adaptorType: 'NetSuiteExport',
          salesforce: { sObjectType: 'Opportunity' },
        },
      ];
    });
    const props = {
      errorsInCurrPage: [
        { errorId: '5646501091' },
        { errorId: '5556857034' },
        { errorId: '5556824990' },
        { errorId: '5666371243' },
      ],
      flowId: '63234cd2514d5b0bf7cfvdfef',
      isResolved: false,
      resourceId: '63234d05514d5b0bfxsfrgvddv',
    };

    await renderWithProviders(
      <MemoryRouter>
        <DrawerProvider {...drawerProviderProps}>
          <ErrorDetailsPanel {...props} />
        </DrawerProvider>
      </MemoryRouter>,
      { initialStore }
    );
    expect(
      screen.queryByText(/Click an error row to view its details/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/or select the checkboxes for batch actions./i)
    ).toBeInTheDocument();
  });
});
