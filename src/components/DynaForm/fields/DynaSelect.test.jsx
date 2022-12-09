/* global describe, test, expect, jest, afterEach */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, screen } from '@testing-library/react';
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

describe('DynaSelect UI test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('Connection field is updated after selecting netsuite connection from the dropdown', () => {
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
    userEvent.click(screen.getByText('Please select'));
    userEvent.click(screen.getAllByRole('menuitem')[2]);
    expect(mockOnFieldChange).toHaveBeenCalledWith('_connectionId', '62f7a541d07aa55c7643a023');
  });
  test('Connection field is updated after selecting please select from the dropdown', () => {
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
    userEvent.click(screen.getByText('ftp Connection'));
    userEvent.click(screen.getByRole('menuitem'));
    expect(mockOnFieldChange).toHaveBeenCalledWith('_connectionId', '');
  });
  test('Keyboard listener with keycode 40', () => {
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

    userEvent.click(button);

    userEvent.keyboard('{arrowdown}');
    userEvent.keyboard('{arrowdown}');
    userEvent.keyboard('{arrowdown}');
    fireEvent.keyDown(button, {key: 'Enter', code: 'Enter', charCode: 13, keyCode: 13});
    expect(mockOnFieldChange).toBeCalledWith('_connectionId', '34');
  });

  test('Keyboard listener with keycode 38', () => {
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

    userEvent.click(button);

    userEvent.keyboard('{arrowdown}');
    userEvent.keyboard('{arrowdown}');
    userEvent.keyboard('{arrowdown}');

    userEvent.keyboard('{arrowup}');
    fireEvent.keyDown(button, {key: 'Enter', code: 'Enter', charCode: 13, keyCode: 13});
    expect(mockOnFieldChange).toBeCalledWith('_connectionId', '134');
  });
  test('Keyboard listener with keycode 13', () => {
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

    userEvent.click(button);

    userEvent.keyboard('{arrowdown}');
    userEvent.keyboard('{arrowdown}');
    userEvent.keyboard('{arrowdown}');

    userEvent.keyboard('{arrowup}');
    userEvent.keyboard('{enter}');
    fireEvent.keyDown(button, {key: 'Enter', code: 'Enter', keyCode: 13});
    expect(mockOnFieldChange).toBeCalledWith('_connectionId', '134');
  });
});
