
import React from 'react';
import { screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import actions from '../../../../actions';
import {mutateStore, renderWithProviders} from '../../../../test/test-utils';
import DynaAssistantSearchParams from './DynaAssistantSearchParams';
import { getCreatedStore } from '../../../../store';

const initialStore = getCreatedStore();

function initDynaDate(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.form = {'new-formKey': {
      parentContext: {},
      disabled: false,
      showValidationBeforeTouched: false,
      conditionalUpdate: false,
      fieldMeta: {
        fieldMap: {
          role: {
            id: 'role',
            name: 'role',
            defaultValue: '',
            helpText: 'Role of an user',
            label: 'Role',
            required: false,
            type: 'select',
            readOnly: false,
            resourceId: '635107728eab567612a7db4e',
            resourceType: 'exports',
            options: [
              {
                items: [
                  {
                    label: 'end-user',
                    value: 'end-user',
                  },
                  {
                    label: 'agent',
                    value: 'agent',
                  },
                  {
                    label: 'admin',
                    value: 'admin',
                  },
                ],
              },
            ],
          },
          'role*_**__*': {
            id: 'role*_**__*',
            name: 'role*_**__*',
            defaultValue: '',
            helpText: 'Role filters to apply. eg: end-user, admin, agent',
            label: 'Multiple role selection',
            required: false,
            type: 'textwithflowsuggestion',
            readOnly: false,
            showLookup: false,
            resourceId: '635107728eab567612a7db4e',
            resourceType: 'exports',
          },
          permission_set: {
            id: 'permission_set',
            name: 'permission_set',
            defaultValue: '',
            helpText: 'Role_id of an user',
            label: 'Permission set',
            required: false,
            type: 'textwithflowsuggestion',
            readOnly: false,
            showLookup: false,
            resourceId: '635107728eab567612a7db4e',
            resourceType: 'exports',
          },
        },
        layout: {
          fields: [
            'role',
            'role*_**__*',
            'permission_set',
          ],
        },
      },
      formIsDisabled: false,
      resetTouchedState: false,
      fields: {
        role: {
          id: 'role',
          name: 'role',
          defaultValue: '',
          helpText: 'Role of an user',
          label: 'Role',
          required: false,
          type: 'select',
          readOnly: false,
          resourceId: '635107728eab567612a7db4e',
          resourceType: 'exports',
          options: [
            {
              items: [
                {
                  label: 'end-user',
                  value: 'end-user',
                },
                {
                  label: 'agent',
                  value: 'agent',
                },
                {
                  label: 'admin',
                  value: 'admin',
                },
              ],
            },
          ],
          defaultRequired: false,
          value: '',
          touched: false,
          visible: true,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
        'role*_**__*': {
          id: 'role*_**__*',
          name: 'role*_**__*',
          defaultValue: '',
          helpText: 'Role filters to apply. eg: end-user, admin, agent',
          label: 'Multiple role selection',
          required: false,
          type: 'textwithflowsuggestion',
          readOnly: false,
          showLookup: false,
          resourceId: '635107728eab567612a7db4e',
          resourceType: 'exports',
          defaultRequired: false,
          value: '',
          touched: false,
          visible: true,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
        permission_set: {
          id: 'permission_set',
          name: 'permission_set',
          defaultValue: '',
          helpText: 'Role_id of an user',
          label: 'Permission set',
          required: false,
          type: 'textwithflowsuggestion',
          readOnly: false,
          showLookup: false,
          resourceId: '635107728eab567612a7db4e',
          resourceType: 'exports',
          defaultRequired: false,
          value: '',
          touched: false,
          visible: true,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
      },
      value: {
        role: '',
        'role*_**__*': '',
        permission_set: '',
      },
      isValid: true,
    }};
  });

  return renderWithProviders(<DynaAssistantSearchParams {...props} />, {initialStore});
}
jest.mock('../../../../utils/assistant', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../utils/assistant'),
  convertToReactFormFields: () => ({fieldDetailsMap: {'role*_**__*': { id: 'role[]', type: 'array', inputType: 'editor' }, role1: { id: 'role', type: 'json', inputType: 'editor'}}}),
  updateFormValues: () => {},
}));

jest.mock('../../../../hooks/useFormInitWithPermissions', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../hooks/useFormInitWithPermissions'),
  default: props => {
    props.validationHandler({id: 'role*_**__*', value: 'value1'});
    props.validationHandler({id: 'role1', value: 'value1'});

    return 'new-formKey';
  },
}));

describe('dynaAssistantSearchParams UI tests', () => {
  const mockOnFieldChangeFn = jest.fn();
  const props = {
    assistantFieldType: 'operation',
    id: 'formId',
    formKey: 'imports-5bf18b09294767270c62fad9',
    paramMeta: {
      paramLocation: 'query',
      fields: [
        {
          id: 'role',
          name: 'Role',
          description: 'Role of an user',
          fieldType: 'select',
          options: [
            'end-user',
            'agent',
            'admin',
          ],
        },
        {
          id: 'role[]',
          name: 'Multiple role selection',
          description: 'Role filters to apply. eg: end-user, admin, agent',
          type: 'array',
        },
        {
          id: 'permission_set',
          name: 'Permission set',
          description: 'Role_id of an user',
        },
      ],
      isDeltaExport: false,
      defaultValuesForDeltaExport: {},
    },
    resourceContext: {
      resourceId: '5bf18b09294767270c62fad9',
      resourceType: 'exports',
    },
    label: 'demo label',
    onFieldChange: mockOnFieldChangeFn,
  };

  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('should pass the initial render', () => {
    initDynaDate(props);
    expect(screen.getByText('demo label')).toBeInTheDocument();
    expect(screen.getByText('Please enter required parameters')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Launch'})).toBeInTheDocument();
  });
  test('should render the SearchParameters form when clicked on Launch Button', async () => {
    props.paramMeta.paramLocation = 'body';
    initDynaDate(props);
    const LaunchButton = screen.getByRole('button', {name: 'Launch'});

    await userEvent.click(LaunchButton);
    expect(screen.getByText('Search parameters')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Multiple role selection')).toBeInTheDocument();
    expect(screen.getByText('Permission set')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
  test('should display the dropdown for "role" field when clicked on the dropdown', async () => {
    initDynaDate(props);
    const LaunchButton = screen.getByRole('button', {name: 'Launch'});

    await userEvent.click(LaunchButton);
    await userEvent.click(screen.getByRole('button', {name: 'Please select'}));
    const options = screen.getAllByRole('menuitem').map(ele => ele.getAttribute('data-value'));

    expect(options).toEqual([
      '',
      'admin',
      'agent',
      'end-user',
    ]);
  });
  test('should make a dispatch call whenever the form is saved with changed values', async () => {
    initDynaDate(props);
    const LaunchButton = screen.getByRole('button', {name: 'Launch'});

    await userEvent.click(LaunchButton);
    expect(screen.getByText('Please select')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Please select'));
    waitFor(async () => {
      expect(screen.getByText('admin')).toBeInTheDocument();
      await userEvent.click(screen.getByText('admin'));
    });
    waitFor(async () => {
      expect(screen.getByText('Save')).toBeInTheDocument();
      await userEvent.click(screen.getByText('Save'));
    });
    waitFor(() => {
      expect(mockDispatchFn).toHaveBeenCalled();
    });
  });
  test('should make a dispatch call when required prop is true', async () => {
    const param = {
      paramLocation: 'body',
      fields: [
        {
          id: 'role',
          name: 'Role',
          description: 'Role of an user',
          fieldType: 'select',
          options: [
            'end-user',
            'agent',
            'admin',
          ],
        },
        {
          id: 'role[]',
          name: 'Multiple role selection',
          description: 'Role filters to apply. eg: end-user, admin, agent',
          type: 'multiselect',
        },
        {
          id: 'permission_set',
          name: 'Permission set',
          description: 'Role_id of an user',
        },
      ],
      isDeltaExport: false,
      defaultValuesForDeltaExport: {},
    };

    initDynaDate({...props, paramMeta: param, required: true });
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('imports-5bf18b09294767270c62fad9')('formId', {isValid: true})));
  });
});
