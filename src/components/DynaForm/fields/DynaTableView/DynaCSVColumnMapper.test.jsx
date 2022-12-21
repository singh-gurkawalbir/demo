/* global describe, test, jest, expect, */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {screen} from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import DynaCSVColumnMapper from './DynaCSVColumnMapper';
import { renderWithProviders } from '../../../../test/test-utils';

const mockOnFieldChange = jest.fn();

function initDynaCSVColumnMapper(props = {}) {
  const ui = (
    <DynaCSVColumnMapper
      {...props}
    />
  );

  return renderWithProviders(ui);
}

describe('DynaCSVColumnMapper UI test cases', () => {
  test('should verify content and create a new row', () => {
    const genralProps = {
      maxNumberOfColumns: 3,
      value: [
        {
          fieldName: 'Transaction Id',
          column: '1',
          columnName: 'TRANSIT ROUTING #',
          regexExpression: '/trasactionid/i',
        },
        {
          fieldName: 'Check Number',
          column: '2',
          columnName: 'CHECK NUMBER',
          regexExpression: '/checknumber/i',
        },
      ],
      onFieldChange: mockOnFieldChange,
    };

    initDynaCSVColumnMapper(genralProps);
    userEvent.click(screen.getByText('Please select'));
    const menuItemsOptionNode = screen.getAllByRole('menuitem');

    userEvent.click(menuItemsOptionNode[3]);
    userEvent.click(screen.getByText('Please enter a value'));
    const input = screen.getAllByRole('textbox');

    userEvent.type(input[6], 'Payment Amount');
    userEvent.type(input[7], 'CHECK AMOUNT');
    userEvent.type(input[8], '/checkamount/i');
    expect(screen.getByText('Payment Amount')).toBeInTheDocument();
    expect(screen.getByText('CHECK AMOUNT')).toBeInTheDocument();
    expect(screen.getByText('/checkamount/i')).toBeInTheDocument();
  });
  test('Should verify table content when maxNumberOfColumns is not provided', () => {
    const genralProps = {
      value: [
        {
          fieldName: 'Transaction Id',
          column: '1',
          columnName: 'TRANSIT ROUTING #',
          regexExpression: '/trasactionid/i',
        },
        {
          fieldName: 'Check Number',
          column: '2',
          columnName: 'CHECK NUMBER',
          regexExpression: '/checknumber/i',
        },
        {
          fieldName: 'Check Amount',
        },
      ],
    };

    initDynaCSVColumnMapper(genralProps);
    expect(screen.getByText('TRANSIT ROUTING #')).toBeInTheDocument();
    expect(screen.getByText('CHECK NUMBER')).toBeInTheDocument();
    expect(screen.getByText('/checknumber/i')).toBeInTheDocument();
  });
});
