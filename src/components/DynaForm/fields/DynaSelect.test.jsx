
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import DynaSelect from './DynaSelect';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';
import actions from '../../../actions';

const initialStore = reduxStore;
const mockOnFieldChange = jest.fn();

jest.mock('.../../../constants/applications', () => ({
  ...jest.requireActual('../../../constants/applications'),
  getHttpConnector: () => ({}),
}));

mutateStore(initialStore, draft => {
  draft.data.httpConnectors.httpConnector = {
    connectorId1: {
      versions: [{
        _id: 'versionId1',
        name: 'Version 1',
      }],
      apis: [],
    },
    connectorId2: {
      versions: [],
      apis: [{
        _id: 'apiId1',
        name: 'API 1',
        versions: [{
          _id: 'versionId2',
          name: 'Version 2',
        }],
      }],
    },
  };
});

function initDynaSelect(props = {}) {
  const ui = (
    <DynaSelect
      {...props}
      />
  );

  return renderWithProviders(ui, { initialStore });
}

jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
}));

describe('dynaSelect UI test cases', () => {
  let mockDispatchFn;

  beforeAll(() => {
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatchFn);
  });
  afterEach(() => {
    jest.clearAllMocks();
    mockDispatchFn.mockClear();
  });
  test('connection field is updated after selecting netsuite connection from the dropdown', async () => {
    const data =
    {
      disabled: false,
      id: '_connectionId',
      name: '/_connectionId',
      connectionId: '',
      options: [{
        items: [{
          label: 'Netsuite 616',
          optionSearch: 'Netsuite Connection',
          value: '62f7a541d07aa55c7643a023',
        }, {
          label: 'Amazon Connection',
          optionSearch: 'Amazon Connection',
          value: '34',
        }],
      }],
      required: true,
      label: 'Connection',
      onFieldChange: mockOnFieldChange,
      isLoggable: true,
      helpText: 'Choose an existing connection to this application, or click the + icon to create a new connection. You can always change your connection later',
      helpKey: 'pageProcessor.connection',
    };

    initDynaSelect(data);
    await userEvent.click(screen.getByText('Please select'));
    await userEvent.click(screen.getAllByRole('menuitem')[2]);
    expect(mockOnFieldChange).toHaveBeenCalledWith('_connectionId', '62f7a541d07aa55c7643a023');
  });
  test('connection field is updated after selecting please select from the dropdown', async () => {
    const data =
    {
      disabled: false,
      id: '_connectionId',
      name: '/_connectionId',
      value: '134',
      isLoggable: true,
      options: [{
        items: [{
          label: 'Netsuite 616',
          optionSearch: 'netsuite Connection',
          subHeader: 'Netsuite',
          value: '62f7a541d07aa55c7643a023',
        }, {
          label: 'Amazon Connection',
          optionSearch: 'amazon Connection',
          subHeader: 'Amazon',
          value: '34',
        },
        {
          label: 134,
          optionSearch: 'ftp Connection',
          subHeader: 'FTP',
          value: '134',
        },
        {
          label: 'Salesforce Connection',
          optionSearch: 'salesforce',
          subHeader: 'salesforce',
          value: '135',
        },
        {
          label: 'BigCommerce Connection',
          optionSearch: 'Bigcommerce',
          subHeader: 'bigcommerce',
          value: '136',
        },
        {
          label: 'Shopify Connection',
          optionSearch: 'Shopify',
          subHeader: 'shopify',
          value: '137',
        },
        {
          label: 'Snowflake Connection',
          optionSearch: 'Snowflake',
          subHeader: 'snowflake',
          value: '138',
        },
        ],
      }],
      required: true,
      label: 'Connection',
      onFieldChange: mockOnFieldChange,
      helpText: 'Choose an existing connection to this application, or click the + icon to create a new connection. You can always change your connection later',
      helpKey: 'pageProcessor.connection',
    };

    initDynaSelect(data);
    await userEvent.click(screen.getByText('ftp Connection'));
    await userEvent.click(screen.getByRole('menuitem', {name: 'Please select'}));
    expect(mockOnFieldChange).toHaveBeenCalledWith('_connectionId', '');
  });
  test('keyboard listener with keycode 40', async () => {
    const data =
    {
      disabled: false,
      id: '_connectionId',
      name: '/_connectionId',
      value: '138',
      connectionId: '138',
      options: [{
        items: [{
          label: 'Netsuite 616',
          optionSearch: 'netsuite Connection',
          value: '62f7a541d07aa55c7643a023',
        }, {
          label: 'Amazon Connection',
          optionSearch: 'amazon Connection',
          value: '34',
        },
        {
          label: 134,
          optionSearch: 'ftp Connection',
          value: '134',
        },
        {
          label: 'Salesforce Connection',
          optionSearch: 'salesforce',
          value: '135',
        },
        {
          label: 'BigCommerce Connection',
          optionSearch: 'Bigcommerce',
          value: '136',
        },
        {
          label: 'Shopify Connection',
          optionSearch: 'Shopify',
          value: '137',
        },
        {
          label: 'Snowflake Connection',
          optionSearch: 'Snowflake',
          value: '138',
        },
        ],
      }],
      required: true,
      label: 'Connection',
      onFieldChange: mockOnFieldChange,
      isLoggable: true,
      helpText: 'Choose an existing connection to this application, or click the + icon to create a new connection. You can always change your connection later',
      helpKey: 'pageProcessor.connection',
    };

    initDynaSelect(data);
    const button = screen.getByText('Snowflake');

    await userEvent.click(button);

    await fireEvent.keyDown(button, {key: 'ArrowDown', code: 'ArrowDown', keyCode: 40});
    await fireEvent.keyDown(button, {key: 'ArrowDown', code: 'ArrowDown', keyCode: 40});
    await fireEvent.keyDown(button, {key: 'ArrowDown', code: 'ArrowDown', keyCode: 40});
    await fireEvent.keyDown(button, {key: 'Enter', code: 'Enter', charCode: 13, keyCode: 13});
    expect(mockOnFieldChange).toHaveBeenCalledWith('_connectionId', '34');
  });

  test('keyboard listener with keycode 38', async () => {
    const data =
    {
      disabled: false,
      id: '_connectionId',
      name: '/_connectionId',
      value: '138',
      connectionId: '138',
      options: [{
        items: [{
          label: 'Netsuite 616',
          optionSearch: 'netsuite Connection',
          value: '62f7a541d07aa55c7643a023',
        }, {
          label: 'Amazon Connection',
          optionSearch: 'amazon Connection',
          value: '34',
        },
        {
          label: 134,
          optionSearch: 'ftp Connection',
          value: '134',
        },
        {
          label: 'Salesforce Connection',
          optionSearch: 'salesforce',
          value: '135',
        },
        {
          label: 'BigCommerce Connection',
          optionSearch: 'Bigcommerce',
          value: '136',
        },
        {
          label: 'Shopify Connection',
          optionSearch: 'Shopify',
          value: '137',
        },
        {
          label: 'Snowflake Connection',
          optionSearch: 'Snowflake',
          value: '138',
        },
        ],
      }],
      required: true,
      label: 'Connection',
      onFieldChange: mockOnFieldChange,
      isLoggable: true,
      helpText: 'Choose an existing connection to this application, or click the + icon to create a new connection. You can always change your connection later',
      helpKey: 'pageProcessor.connection',
    };

    initDynaSelect(data);
    const button = screen.getByRole('button', { name: /Snowflake/ });

    await userEvent.click(button);

    await fireEvent.keyDown(button, {key: 'ArrowDown', code: 'ArrowDown', keyCode: 40});
    await fireEvent.keyDown(button, {key: 'ArrowDown', code: 'ArrowDown', keyCode: 40});
    await fireEvent.keyDown(button, {key: 'ArrowDown', code: 'ArrowDown', keyCode: 40});

    await fireEvent.keyDown(button, {key: 'ArrowUp', code: 'ArrowUp', keyCode: 38});
    await fireEvent.keyDown(button, {key: 'Enter', code: 'Enter', charCode: 13, keyCode: 13});
    expect(mockOnFieldChange).toHaveBeenCalledWith('_connectionId', '134');
  });
  test('keyboard listener with keycode 13', async () => {
    const data =
    {
      disabled: false,
      id: '_connectionId',
      name: '/_connectionId',
      value: '138',
      connectionId: '138',
      options: [{
        items: [{
          label: 'Netsuite 616',
          optionSearch: 'netsuite Connection',
          value: '62f7a541d07aa55c7643a023',
        }, {
          label: 'Amazon Connection',
          optionSearch: 'amazon Connection',
          value: '34',
        },
        {
          label: 134,
          optionSearch: 'ftp Connection',
          value: '134',
        },
        {
          label: 'Salesforce Connection',
          optionSearch: 'salesforce',
          value: '135',
        },
        {
          label: 'BigCommerce Connection',
          optionSearch: 'Bigcommerce',
          value: '136',
        },
        {
          label: 'Shopify Connection',
          optionSearch: 'Shopify',
          value: '137',
        },
        {
          label: 'Snowflake Connection',
          optionSearch: 'Snowflake',
          value: '138',
        },
        ],
      }],
      required: true,
      label: 'Connection',
      onFieldChange: mockOnFieldChange,
      isLoggable: true,
      helpText: 'Choose an existing connection to this application, or click the + icon to create a new connection. You can always change your connection later',
      helpKey: 'pageProcessor.connection',
    };

    initDynaSelect(data);
    const button = screen.getByRole('button', { name: /Snowflake/ });

    await userEvent.click(button);

    await fireEvent.keyDown(button, {key: 'ArrowDown', code: 'ArrowDown', keyCode: 40});
    await fireEvent.keyDown(button, {key: 'ArrowDown', code: 'ArrowDown', keyCode: 40});
    await fireEvent.keyDown(button, {key: 'ArrowDown', code: 'ArrowDown', keyCode: 40});
    await fireEvent.keyDown(button, {key: 'ArrowUp', code: 'ArrowUp', keyCode: 38});
    await userEvent.keyboard('{enter}');
    await fireEvent.keyDown(button, {key: 'Enter', code: 'Enter', keyCode: 13});
    expect(mockOnFieldChange).toHaveBeenCalledWith('_connectionId', '134');
  });
  describe('connection dropdown', () => {
    test('the connection options should show api version and type if available', async () => {
      const data =
      {
        disabled: false,
        id: '_connectionId',
        name: '/_connectionId',
        connectionId: '',
        options: [{
          items: [{
            label: 'Test Connection 1',
            optionSearch: 'Test Connection 1',
            value: 'connectionId1',
            connInfo: {
              httpConnectorId: 'connectorId1',
              httpConnectorVersionId: 'versionId1',
              httpConnectorApiId: undefined,
            },
          }, {
            label: 'Test Connection 2',
            optionSearch: 'Test Connection 2',
            value: 'connectionId2',
            connInfo: {
              httpConnectorId: 'connectorId2',
              httpConnectorVersionId: 'versionId2',
              httpConnectorApiId: 'apiId1',
            },
          }],
        }],
        required: true,
        label: 'Connection',
        onFieldChange: mockOnFieldChange,
        isLoggable: true,
        helpText: 'help text',
        helpKey: 'pageProcessor.connection',
      };

      initDynaSelect(data);
      await userEvent.click(screen.getByText('Please select'));

      expect(screen.getByText('Version 1')).toBeInTheDocument();
      expect(screen.getByText('API 1')).toBeInTheDocument();
      expect(screen.getByText('Version 2')).toBeInTheDocument();
    });
    test('should dispatch requestConnector when connectorId in not found in the state', async () => {
      const data =
      {
        disabled: false,
        id: '_connectionId',
        name: '/_connectionId',
        connectionId: '',
        options: [{
          items: [{
            label: 'Test Connection 1',
            optionSearch: 'Test Connection 1',
            value: 'connectionId1',
            connInfo: {
              httpConnectorId: 'connectorId3',
              httpConnectorVersionId: 'versionId1',
              httpConnectorApiId: undefined,
            },
          }],
        }],
        required: true,
        label: 'Connection',
        onFieldChange: mockOnFieldChange,
        isLoggable: true,
        helpText: 'help text',
        helpKey: 'pageProcessor.connection',
      };

      initDynaSelect(data);
      await userEvent.click(screen.getByText('Please select'));

      expect(mockDispatchFn).toHaveBeenCalledWith(actions.httpConnectors.requestConnector({ httpConnectorId: 'connectorId3' }));
    });
  });
});
