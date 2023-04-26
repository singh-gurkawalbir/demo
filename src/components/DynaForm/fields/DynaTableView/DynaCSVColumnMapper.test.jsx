
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {screen} from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import DynaCSVColumnMapper from './DynaCSVColumnMapper';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';

const initialStore = reduxStore;
const mockOnFieldChange = jest.fn();

function initDynaCSVColumnMapper(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.form[props.formKey] = {
      showValidationBeforeTouched: true,
    };
  });
  const ui = (
    <DynaCSVColumnMapper
      {...props}
    />
  );

  return renderWithProviders(ui, {initialStore});
}

describe('dynaCSVColumnMapper UI test cases', () => {
  test('should verify content and create a new row', async () => {
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
      formKey: 'form_key',
    };

    initDynaCSVColumnMapper(genralProps);
    await userEvent.click(screen.getByText('Please select'));
    const menuItemsOptionNode = screen.getAllByRole('menuitem');

    await userEvent.click(menuItemsOptionNode[3]);
    await userEvent.click(screen.getByText('Please enter a value'));
    const input = screen.getAllByRole('combobox');

    await userEvent.type(input[6], 'Payment Amount');
    await userEvent.type(input[7], 'CHECK AMOUNT');
    await userEvent.type(input[8], '/checkamount/i');
    expect(screen.getByText('Payment Amount')).toBeInTheDocument();
    expect(screen.getByText('CHECK AMOUNT')).toBeInTheDocument();
    expect(screen.getByText('/checkamount/i')).toBeInTheDocument();
  });
  test('should verify table content when maxNumberOfColumns is not provided', () => {
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
      formKey: 'form_key',
    };

    initDynaCSVColumnMapper(genralProps);
    expect(screen.getByText('TRANSIT ROUTING #')).toBeInTheDocument();
    expect(screen.getByText('CHECK NUMBER')).toBeInTheDocument();
    expect(screen.getByText('/checknumber/i')).toBeInTheDocument();
  });
});
