
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import DynaMultiSelect from './DynaMultiSelect';

describe('test suite for DynaMultiSelect field', () => {
  test('should be able to change selected options', async () => {
    const onFieldChange = jest.fn();
    const props = {
      id: 'flows',
      helpKey: 'notifications.jobErrors',
      name: 'flows',
      type: 'multiselect',
      onFieldChange,
      valueDelimiter: ',',
      label: 'Notify user of flow error',
      defaultValue: [],
      options: [
        {
          items: [
            {
              value: 'integration-123',
              label: 'All flows',
            },
            {
              value: 'flow-123',
              label: 'Flow 1',
            },
            {
              value: 'flow-456',
              label: 'Flow 2',
              tag: 'OK',
            },
            {
              value: 'flow-789',
            },
            {
              value: 'flow-914',
              label: 'Flow 4',
            },
          ],
        },
      ],
      selectAllIdentifier: 'integration-123',
      formKey: 'manageusernotifications',
      isLoggable: false,
      value: [
        'flow-456',
        'flow-789',
      ],
      visible: true,
      disabled: false,
      isValid: true,
      resourceContext: {},
    };

    renderWithProviders(<DynaMultiSelect {...props} />);
    expect(document.querySelector('label')).toHaveTextContent(props.label);
    const selectedOptions = screen.getByRole('button', {name: 'Flow 2 OK flow-789'});
    const inputField = document.querySelector('input');

    expect(selectedOptions).toBeInTheDocument();
    expect(inputField).toHaveValue(props.value.join(','));

    await userEvent.click(selectedOptions);
    const options = screen.getAllByRole('option').map(ele => ele.textContent);

    expect(options).toEqual([
      'All flows',
      'Flow 1',
      'Flow 2OK',
      'flow-789',
      'Flow 4',
    ]);

    await userEvent.click(screen.getByRole('option', {name: 'Flow 1'}));
    expect(onFieldChange).toHaveBeenCalledWith(props.id, ['flow-456', 'flow-789', 'flow-123']);

    await userEvent.click(screen.getByRole('option', {name: 'flow-789'}));
    expect(onFieldChange).toHaveBeenCalledWith(props.id, ['flow-456']);

    await userEvent.click(screen.getByRole('button', {name: /done/i}));
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  test('should deselect all other options, if user selects selectAll option', async () => {
    const onFieldChange = jest.fn();
    const props = {
      id: 'flows',
      helpKey: 'notifications.jobErrors',
      name: 'flows',
      type: 'multiselect',
      onFieldChange,
      label: 'Notify user of flow error',
      defaultValue: [],
      options: [
        {
          items: [
            {
              value: 'integration-123',
              label: 'All flows',
            },
            {
              value: 'flow-123',
              label: 'Flow 1',
            },
            {
              value: 'flow-456',
              label: 'Flow 2',
            },
            {
              value: 'flow-789',
              label: 'Flow 3',
            },
            {
              value: 'flow-914',
              label: 'Flow 4',
            },
          ],
        },
      ],
      selectAllIdentifier: 'integration-123',
      formKey: 'manageusernotifications',
      isLoggable: false,
      value: 'flow-456|flow-789',
      valueDelimiter: '|',
      visible: true,
      disabled: false,
      isValid: true,
      resourceContext: {},
    };

    renderWithProviders(<DynaMultiSelect {...props} />);
    await userEvent.click(screen.getByRole('button', {name: 'Flow 2 Flow 3'}));
    expect(onFieldChange).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('option', {name: 'All flows'}));
    expect(onFieldChange).toHaveBeenCalledWith(props.id, ['integration-123']);
  });

  test('should deselect selectAll option if user selects other options', async () => {
    const onFieldChange = jest.fn();
    const props = {
      id: 'flows',
      helpKey: 'notifications.jobErrors',
      name: 'flows',
      type: 'multiselect',
      onFieldChange,
      label: 'Notify user of flow error',
      defaultValue: [],
      options: [
        {
          items: [
            {
              value: 'integration-123',
              label: 'All flows',
            },
            {
              value: 'flow-123',
              label: 'Flow 1',
            },
            {
              value: 'flow-456',
              label: 'Flow 2',
            },
            {
              value: 'flow-789',
              label: 'Flow 3',
            },
            {
              value: 'flow-914',
              label: 'Flow 4',
            },
          ],
        },
      ],
      selectAllIdentifier: 'integration-123',
      formKey: 'manageusernotifications',
      isLoggable: false,
      value: 'integration-123',
      visible: true,
      disabled: false,
      isValid: true,
      resourceContext: {},
    };

    renderWithProviders(<DynaMultiSelect {...props} />);
    await userEvent.click(screen.getByRole('button', {name: 'All flows'}));
    expect(onFieldChange).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('option', {name: 'Flow 1'}));
    expect(onFieldChange).toHaveBeenCalledWith(props.id, ['flow-123']);
    await userEvent.click(screen.getByRole('option', {name: 'Flow 2'}));
    expect(onFieldChange).toHaveBeenCalledWith(props.id, ['flow-456']);
  });

  test('should show fieldMessages if any', () => {
    const onFieldChange = jest.fn();
    const props = {
      id: 'flows',
      helpKey: 'notifications.jobErrors',
      name: 'flows',
      type: 'multiselect',
      onFieldChange,
      valueDelimiter: ',',
      label: 'Notify user of flow error',
      defaultValue: [],
      options: [
        {
          items: [
            {
              value: 'integration-123',
              label: 'All flows',
            },
            {
              value: 'flow-123',
              label: 'Flow 1',
            },
            {
              value: 'flow-456',
              label: 'Flow 2',
            },
            {
              value: 'flow-789',
              label: 'Flow 3',
            },
            {
              value: 'flow-914',
              label: 'Flow 4',
            },
          ],
        },
      ],
      selectAllIdentifier: 'integration-123',
      formKey: 'manageusernotifications',
      isLoggable: false,
      value: [
        'integration-123',
      ],
      visible: true,
      disabled: false,
      errorMessages: 'Invalid selection',
      resourceContext: {},
    };

    renderWithProviders(<DynaMultiSelect {...props} />);
    expect(screen.getByText('Invalid selection')).toBeInTheDocument();
  });
});
