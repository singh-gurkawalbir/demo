/* eslint-disable jest/no-conditional-expect */

import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../test/test-utils';
import FormFragment from './FormFragment';
import { getCreatedStore } from '../../store';
import { FieldDefinitionException } from '../../utils/form';
import actions from '../../actions';

const mockDispatchFn = jest.fn();

jest.mock('../DynaForm/fields/DynaSelect', () => ({
  __esModule: true,
  ...jest.requireActual('../DynaForm/fields/DynaSelect'),
  default: ({label, onFieldChange, onFieldBlur, onFieldFocus, registerField, id}) => (
    <div>
      <span>{label}</span>
      <button type="button" onClick={() => onFieldChange(id, 'csv', true)}>fieldChange</button>
      <button type="button" onClick={() => onFieldBlur(id)}>fieldBlur</button>
      <button type="button" onClick={() => onFieldFocus(id)}>fieldFocus</button>
      <button type="button" onClick={() => registerField(id)}>fieldRegister</button>
    </div>
  ),
}));

jest.mock('../DynaForm/fields/DynaSQLQueryBuilder_afe', () => ({
  __esModule: true,
  ...jest.requireActual('../DynaForm/fields/DynaSQLQueryBuilder_afe'),
  default: ({label}) => <span>{label}</span>,
}));

jest.mock('../DynaForm/fields/DynaRelativeUri_afe', () => ({
  __esModule: true,
  ...jest.requireActual('../DynaForm/fields/DynaRelativeUri_afe'),
  default: () => { throw new Error('Error prone field'); },
}));

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatchFn,
}));

describe('test suite for Form Fragment', () => {
  test("should render a field corresponding to it's 'visible' property", async () => {
    const formKey = 'exports-123';
    const props = {
      formKey,
      defaultFields: [
        {
          key: 'type',
          resourceId: '123',
          resourceType: 'exports',
          id: 'type',
          type: 'select',
          label: 'Export type',
          defaultValue: 'test',
          required: true,
          options: [
            '{items: Array(4)}',
          ],
          name: '/type',
          helpKey: 'export.type',
        },
        {
          key: 'rdbms.once.query',
          resourceId: '123',
          resourceType: 'exports',
          isLoggable: true,
          type: 'sqlquerybuilder',
          label: 'SQL once query',
          required: true,
          fieldId: 'rdbms.once.query',
          id: 'rdbms.once.query',
          name: '/rdbms/once/query',
          defaultValue: '',
          helpKey: 'export.rdbms.once.query',
        },
      ],
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.form[props.formKey] = {
        fields: {
          type: {
            visible: true,
          },
          'rdbms.once.query': {
            visible: false,
          },
        },
      };
    });

    renderWithProviders(<FormFragment {...props} />, {initialStore});
    expect(screen.getByText('Export type')).toBeInTheDocument();
    expect(screen.queryByText('SQL once query')).not.toBeInTheDocument();

    //  should respond to field actions

    const fieldChangeBtn = screen.getByRole('button', {name: 'fieldChange'});
    const fieldBlurBtn = screen.getByRole('button', {name: 'fieldBlur'});
    const fieldFocusBtn = screen.getByRole('button', {name: 'fieldFocus'});
    const fieldRegisterBtn = screen.getByRole('button', {name: 'fieldRegister'});

    await userEvent.click(fieldChangeBtn);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.fieldChange(formKey)('type', 'csv', true));

    await userEvent.click(fieldBlurBtn);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.fieldBlur(formKey)('type'));

    await userEvent.click(fieldFocusBtn);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.fieldFocus(formKey)('type'));

    await userEvent.click(fieldRegisterBtn);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.registerField(formKey)('type'));
  });

  test('should render a message if field type is not available', () => {
    const props = {
      formKey: 'exports-123',
      defaultFields: [
        {
          key: 'type',
          resourceId: '123',
          resourceType: 'exports',
          id: 'type',
          type: 'manual',
          label: 'Export type',
          defaultValue: 'test',
          required: true,
          name: '/type',
          helpKey: 'export.type',
        },
      ],
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.form[props.formKey] = {
        fields: {
          type: {
            visible: true,
          },
        },
      };
    });

    renderWithProviders(<FormFragment {...props} />, {initialStore});
    const bodyEle = document.querySelector('body');

    expect(bodyEle).toHaveTextContent('No mapped field for type: [manual]');
  });

  test('should throw a FieldDefinitionException error if error rendering field', () => {
    const props = {
      formKey: 'exports-123',
      defaultFields: [
        {
          key: 'uri',
          resourceId: '123',
          resourceType: 'exports',
          id: 'uri',
          type: 'relativeuri',
          label: 'Relative URI',
          name: '/uri',
        },
      ],
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.form[props.formKey] = {
        fields: {
          uri: {
            visible: true,
          },
        },
      };
    });

    try {
      renderWithProviders(<FormFragment {...props} />, {initialStore});
      expect(true).toBeFalsy();
    } catch (err) {
      expect(err.constructor).toEqual(FieldDefinitionException);
      expect(err.message).toBe('Invalid field definition for field: uri');
    }
  });

  test('should not render in case of no default fields', () => {
    const props = {
      formKey: 'exports-123',
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.form[props.formKey] = {
        fields: { },
      };
    });

    renderWithProviders(<FormFragment {...props} />, {initialStore});
    expect(document.querySelector('body > div')).toBeEmptyDOMElement();
  });
});
