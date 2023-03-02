/* eslint-disable jest/no-conditional-expect */

import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders, reduxStore, mutateStore } from '../../test/test-utils';
import DynaForm from '.';

jest.mock('./fields/DynaMode', () => ({
  __esModule: true,
  ...jest.requireActual('../DynaForm/fields/DynaMode'),
  default: () => { throw new Error('Error prone field'); },
}));

const fields = {
  a: {
    id: 'a',
    name: 'a',
    type: 'mode',
    visible: true,
  },
  b: {
    id: 'b',
    name: 'b',
    type: 'text',
    visible: true,
    isValid: false,
  },
};

function initDynaSubmit(props = {}, lfields = [], fieldMap) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.form = {
      _formKey: {
        fields,
        fieldMeta: {
          layout: {
            type: 'collapse',
            containers: [
              {
                collapsed: true,
                fields: ['a', 'b'],
              },
            ],
            fields: lfields,
          },
          fieldMap,
        },
      },
    };
  });

  return renderWithProviders(<DynaForm {...props} />, { initialStore });
}
describe('dynaForm UI test cases', () => {
  test('should validate DynaForm error boundary with error thrown', () => {
    try {
      initDynaSubmit({ formKey: '_formKey' }, fields, {});
    } catch (err) {
      expect(screen.getByText('Some unknown error')).toBeInTheDocument();
    }
  });
  test('should validate DynaForm error boundary with FieldDefinitionException error', () => {
    try {
      initDynaSubmit({ formKey: '_formKey' }, ['a'], fields);
    } catch (err) {
      expect(screen.getByText('Invalid field definition for field: a')).toBeInTheDocument();
    }
  });
  test('should validate DynaForm invalid fieldMap', () => {
    initDynaSubmit({ formKey: '_formKey' }, [], undefined);
    expect(screen.queryAllByText('No mapped field for type: [mode]')).toHaveLength(0);
  });
});
