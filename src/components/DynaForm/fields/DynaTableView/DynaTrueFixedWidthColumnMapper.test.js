
import React from 'react';
import {
  screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaTrueFixedWidthColmnMapper from './DynaTrueFixedWidthColumnMapper';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';

describe('dynaTrueFixedWidthColmnMapper UI tests', () => {
  const initialStore = reduxStore;
  const mockOnFieldChange = jest.fn();
  const props = {
    maxNumberOfColumns: 3,
    value: [
      {
        fieldName: 'Transaction Id',
        startPosition: '0',
        endPosition: '15',
        length: '15',
        regexExpression: '/trasactionid/i',
      },
      {
        fieldName: 'Transaction Id1',
        startPosition: '2',
        endPosition: '15',
        length: '13',
        regexExpression: '/trasactionid/i',
      },
      {
        fieldName: 'Transaction Id2',
        startPosition: '5',
        endPosition: '15',
        length: '10',
        regexExpression: '/trasactionid/i',
      },
      {
        fieldName: 'Transaction Id3',
        startPosition: '10',
        endPosition: '15',
        length: '5',
        regexExpression: '/trasactionid/i',
      },

    ],
    onFieldChange: mockOnFieldChange,
    id: 'testId',
    label: 'demo label',
    title: 'test title',
    isLoggable: true,
  };

  mutateStore(initialStore, draft => {
    draft.session.form[props.formKey] = {
      showValidationBeforeTouched: true,
    };
  });

  test('should pass the initial render', () => {
    renderWithProviders(<DynaTrueFixedWidthColmnMapper {...props} />, {initialStore});

    expect(screen.getByText('Field Description')).toBeInTheDocument();
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText('End')).toBeInTheDocument();
    expect(screen.getByText('Length')).toBeInTheDocument();
    expect(screen.getByText('Regex')).toBeInTheDocument();
    const textfields = screen.getAllByRole('combobox');

    expect(textfields).toHaveLength(10);
  });
  test('should call the onFieldChange function passed in props when a field is edited', async () => {
    const newval = [
      {
        fieldName: 'Transaction Ida',
        startPosition: 0,
        endPosition: 15,
        regexExpression: '/trasactionid/i',
      },
      {
        fieldName: 'Transaction Id1',
        startPosition: 2,
        endPosition: 15,
        regexExpression: '/trasactionid/i',
      },
      {
        fieldName: 'Transaction Id2',
        startPosition: 5,
        endPosition: 15,
        regexExpression: '/trasactionid/i',
      },
      {
        fieldName: 'Transaction Id3',
        startPosition: 10,
        endPosition: 15,
        regexExpression: '/trasactionid/i',
      },
    ];

    renderWithProviders(<DynaTrueFixedWidthColmnMapper {...props} />, {initialStore});
    const fields = screen.getAllByRole('combobox');

    await userEvent.type(fields[0], 'a');
    await waitFor(() => expect(mockOnFieldChange).toHaveBeenCalledWith('testId', newval));
  });
});

