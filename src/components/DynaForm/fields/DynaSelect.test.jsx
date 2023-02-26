
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import DynaSelect from './DynaSelect';
import { renderWithProviders } from '../../../test/test-utils';

function initDynaSelect(props = {}) {
  const ui = (
    <DynaSelect
      {...props}
      />
  );

  return renderWithProviders(ui);
}
const mockOnFieldChange = jest.fn();

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
  afterEach(() => {
    jest.clearAllMocks();
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
    await userEvent.click(screen.getByRole('menuitem'));
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

    await userEvent.keyboard('{arrowdown}');
    await userEvent.keyboard('{arrowdown}');
    await userEvent.keyboard('{arrowdown}');
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

    await userEvent.keyboard('{arrowdown}');
    await userEvent.keyboard('{arrowdown}');
    await userEvent.keyboard('{arrowdown}');

    await userEvent.keyboard('{arrowup}');
    await waitFor(async () => {
      await fireEvent.keyDown(button, {key: 'Enter', code: 'Enter', charCode: 13, keyCode: 13});
      expect(mockOnFieldChange).toHaveBeenCalledWith('_connectionId', '134');
    });
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

    await userEvent.keyboard('{arrowdown}');
    await userEvent.keyboard('{arrowdown}');
    await userEvent.keyboard('{arrowdown}');

    await userEvent.keyboard('{arrowup}');
    await userEvent.keyboard('{enter}');
    await fireEvent.keyDown(button, {key: 'Enter', code: 'Enter', keyCode: 13});
    expect(mockOnFieldChange).toHaveBeenCalledWith('_connectionId', '134');
  });
});
