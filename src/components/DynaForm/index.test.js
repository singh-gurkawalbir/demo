/* global describe, test, expect */
import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders, reduxStore } from '../../test/test-utils';
import DynaForm from '.';

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

  initialStore.getState().session.form = {
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

  return renderWithProviders(<DynaForm {...props} />, { initialStore });
}
describe('DynaForm UI test cases', () => {
  test('Should validate DynaForm error boundary with error thrown', () => {
    try {
      initDynaSubmit({ formKey: '_formKey' }, fields, {});
    } catch (err) {
      expect(screen.getByText('Some unknown error')).toBeInTheDocument();
    }
  });
  test('Should validate DynaForm error boundary with FieldDefinitionException error', () => {
    try {
      initDynaSubmit({ formKey: '_formKey' }, ['a'], { ...fields, a: { visible: true, id: 'a' } }, {});
    } catch (err) {
      expect(screen.getByText('Some unknown error')).toBeInTheDocument();
    }
  });
  test('Should validate DynaForm non empty fieldMap', () => {
    initDynaSubmit({ formKey: '_formKey' }, ['a', 'b'], fields);
    expect(screen.getAllByRole('textbox')).toHaveLength(2);
  });
  test('Should validate DynaForm invalid fieldMap', () => {
    initDynaSubmit({ formKey: '_formKey' }, [], undefined);
    expect(screen.queryAllByText('No mapped field for type: [mode]')).toHaveLength(0);
  });
});
