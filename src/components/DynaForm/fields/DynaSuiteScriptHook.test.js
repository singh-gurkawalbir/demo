
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import DynaSuiteScriptHook from './DynaSuiteScriptHook';

describe('test suite for Suite Script Hook', () => {
  test('should respond to change in values', async () => {
    const onFieldChange = jest.fn();
    const props = {
      id: 'preSend.suiteScript',
      name: 'suiteScript-preSend',
      placeholder: 'Enter suite script details',
      label: 'SuiteScript Hooks (NetSuite Exports Only)',
      onFieldChange,
    };

    renderWithProviders(<DynaSuiteScriptHook {...props} />);
    const inputFields = screen.getAllByRole('textbox');

    expect(inputFields).toHaveLength(2);
    inputFields.forEach(inputField => {
      expect(inputField).toHaveAttribute('placeholder', props.placeholder);
      expect(inputField).not.toBeRequired();
    });

    const labels = Array.from(document.querySelectorAll('label')).map(ele => ele.textContent);

    expect(labels).toEqual([
      props.label,
      'Function',
      'File Internal ID',
    ]);

    const [functionInput, internalIdInput] = inputFields;

    await userEvent.type(functionInput, 'fun');
    'fun'.split('').forEach(char => {
      expect(onFieldChange).toHaveBeenCalledWith(props.id, { function: char });
    });

    await userEvent.type(internalIdInput, 'value');
    'value'.split('').forEach(char => {
      expect(onFieldChange).toHaveBeenCalledWith(props.id, { fileInternalId: char });
    });

    //  should not show error in field validation if both field are empty
    expect(document.querySelector('.Mui-error')).not.toBeInTheDocument();
  });

  test('should show validation error if only Function field is entered', () => {
    const props = {
      id: 'preSend.suiteScript',
      name: 'suiteScript-preSend',
      placeholder: 'Enter suite script details',
      label: 'SuiteScript Hooks (NetSuite Exports Only)',
      required: true,
      value: { function: 'fun' },
    };

    renderWithProviders(<DynaSuiteScriptHook {...props} />);
    const [functionInput, internalIdInput] = screen.getAllByRole('textbox');

    expect(functionInput).toHaveValue(props.value.function);
    expect(internalIdInput).not.toHaveValue();

    const internalIdLabel = Array.from(document.querySelectorAll('label')).find(e => e.textContent.includes('File Internal ID'));

    expect(internalIdLabel).toHaveClass('Mui-error');
  });
  test('should show validation error if only File Internal ID field is entered', () => {
    const props = {
      id: 'preSend.suiteScript',
      name: 'suiteScript-preSend',
      placeholder: 'Enter suite script details',
      label: 'SuiteScript Hooks (NetSuite Exports Only)',
      required: true,
      value: { fileInternalId: 'val' },
    };

    renderWithProviders(<DynaSuiteScriptHook {...props} />);
    const [functionInput, internalIdInput] = screen.getAllByRole('textbox');

    expect(internalIdInput).toHaveValue(props.value.function);
    expect(functionInput).not.toHaveValue();

    const functionLabel = Array.from(document.querySelectorAll('label')).find(e => e.textContent.includes('Function'));

    expect(functionLabel).toHaveClass('Mui-error');
  });

  test('should not show validation error if both fields are entered', () => {
    const props = {
      id: 'preSend.suiteScript',
      name: 'suiteScript-preSend',
      placeholder: 'Enter suite script details',
      label: 'SuiteScript Hooks (NetSuite Exports Only)',
      required: true,
      value: {
        function: 'fun',
        fileInternalId: 'val',
      },
    };

    renderWithProviders(<DynaSuiteScriptHook {...props} />);
    expect(document.querySelector('.Mui-error')).not.toBeInTheDocument();
  });

  test('should not be able to modify fields if disabled', () => {
    const onFieldChange = jest.fn();
    const props = {
      id: 'preSend.suiteScript',
      name: 'suiteScript-preSend',
      placeholder: 'Enter suite script details',
      label: 'SuiteScript Hooks (NetSuite Exports Only)',
      value: {
        function: 'fun',
        fileInternalId: 'val',
      },
      disabled: true,
      onFieldChange,
    };

    renderWithProviders(<DynaSuiteScriptHook {...props} />);
    const [functionInput, internalIdInput] = screen.getAllByRole('textbox');

    [functionInput, internalIdInput].forEach(inputField =>
      expect(inputField).toBeDisabled()
    );

    //  should populate the saved values
    expect(functionInput).toHaveValue(props.value.function);
    expect(internalIdInput).toHaveValue(props.value.internalIdInput);
  });
});
