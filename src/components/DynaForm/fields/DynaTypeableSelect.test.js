import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import DynaTypeableSelect from './DynaTypeableSelect';
import * as DynaText from './DynaText';
import { renderWithProviders } from '../../../test/test-utils';

const mockOnBlur = jest.fn();
const mockOnTouch = jest.fn();

function initDynaTypeableSelect({props}) {
  const ui = (
    <DynaTypeableSelect {...props} />
  );

  renderWithProviders(ui);
}

describe('Testsuite for DynaTypeableSelect', () => {
  afterEach(() => {
    mockOnBlur.mockClear();
    mockOnTouch.mockClear();
  });
  test('should test the focus in and focus out when focused on a textarea', async () => {
    jest.spyOn(DynaText, 'default').mockImplementation(props => (
      <div>
        <div>id = {props.id}</div>
        <div>isLoggable = {props.isLoggable}</div>
        <div>value = {props.value}</div>
        <div>diabled = {props.disabled}</div>
        <div>multiline = {props.multiline}</div>
        <div>readOnly = {props.readOnly}</div>
        <div>placeholder = {props.placeholder}</div>
        <textarea data-testid="someinput" onChange={() => props.onFieldChange('123', 'test_on_changeValue')} />
        <div>endAdornment = {props.endAdornment}</div>
      </div>
    ));
    const props = {
      id: '123',
      disabled: true,
      isLoggable: true,
      value: 'test value',
      placeholder: 'test_placeholder',
      endAdornment: 'test endAdornment',
      onBlur: mockOnBlur,
      labelName: 'Test_Label_Name',
      removeHelperText: 'false',
      valueName: 'Test_Value_Name',
      options: [
        {
          Test_Label_Name: 'Options_label_Name',
          Test_Value_Name: 'Options_Value_Name',
        },
      ],
      isValid: true,
      TextComponent: false,
      onTouch: mockOnTouch,
    };

    initDynaTypeableSelect({props});
    await fireEvent.focusIn(screen.getByTestId('someinput'));
    expect(mockOnTouch).toHaveBeenCalledWith('123');
    await waitFor(() => { expect(screen.getByDisplayValue('test value')).toBeInTheDocument(); });
    await fireEvent.focusOut(document.querySelector('input[id="react-select-2-input"]'));
    expect(screen.queryByText('test value')).not.toBeInTheDocument();
    expect(document.querySelector('input[id="react-select-2-input"]')).not.toBeInTheDocument();
  });
  test('should test the focus in when we focused on a input and it should result to not call mockOnTouch', async () => {
    jest.spyOn(DynaText, 'default').mockImplementationOnce(props => (
      <div>
        <div>id = {props.id}</div>
        <div>isLoggable = {props.isLoggable}</div>
        <div>value = {props.value}</div>
        <div>diabled = {props.disabled}</div>
        <div>multiline = {props.multiline}</div>
        <div>readOnly = {props.readOnly}</div>
        <div>placeholder = {props.placeholder}</div>
        <input data-testid="someinput" onChange={() => props.onFieldChange('123', 'test_on_changeValue')} />
        <div>endAdornment = {props.endAdornment}</div>
      </div>
    ));
    const props = {
      id: '123',
      disabled: true,
      isLoggable: true,
      value: 'test value',
      placeholder: 'test_placeholder',
      endAdornment: 'test endAdornment',
      onBlur: mockOnBlur,
      labelName: 'Test_Label_Name',
      removeHelperText: 'false',
      valueName: 'Test_Value_Name',
      options: [
        {
          Test_Label_Name: 'Options_label_Name',
          Test_Value_Name: 'Options_Value_Name',
        },
      ],
      isValid: true,
      TextComponent: false,
      onTouch: mockOnTouch,
    };

    initDynaTypeableSelect({props});
    await fireEvent.focusIn(screen.getByTestId('someinput'));
    expect(mockOnTouch).not.toHaveBeenCalledWith('123');
  });
  test('should test the focus in when focused on a textarea and should test the value', async () => {
    jest.spyOn(DynaText, 'default').mockImplementation(props => (
      <div>
        <div>id = {props.id}</div>
        <div>isLoggable = {props.isLoggable}</div>
        <div>value = {props.value}</div>
        <div>diabled = {props.disabled}</div>
        <div>multiline = {props.multiline}</div>
        <div>readOnly = {props.readOnly}</div>
        <div>placeholder = {props.placeholder}</div>
        <textarea data-testid="someinput" onChange={() => props.onFieldChange('123', 'test_on_changeValue')} />
        <div>endAdornment = {props.endAdornment}</div>
      </div>
    ));
    const props = {
      id: '123',
      disabled: false,
      isLoggable: true,
      value: 'value',
      placeholder: 'test_placeholder',
      endAdornment: 'test endAdornment',
      onBlur: mockOnBlur,
      labelName: 'Test_Label_Name',
      removeHelperText: 'false',
      valueName: 'Test_Value_Name',
      options: [
        {
          Test_Label_Name: 'label_Name',
          Test_Value_Name: 'value',
          type: 'text',
        },
        {
          Test_Label_Name: 'label_Name_1',
          Test_Value_Name: 'value 1',
          type: 'text',
        },
      ],
      isValid: true,
      TextComponent: false,
      onTouch: mockOnTouch,
    };

    initDynaTypeableSelect({props});
    expect(screen.getByText(/value = label_name/i)).toBeInTheDocument();
    await fireEvent.focusIn(screen.getByTestId('someinput'));
    let textBoxNode;

    waitFor(async () => {
      textBoxNode = screen.getByRole('textbox');

      expect(textBoxNode).toBeInTheDocument();
      expect(textBoxNode).toHaveValue('label_Name');
      await userEvent.clear(textBoxNode);
      expect(textBoxNode).not.toHaveValue('label_Name');
      await userEvent.type(textBoxNode, 'label_Name_1');
    });
    await userEvent.click(document.querySelector('div[tabindex="-1"]'));
    waitFor(() => { expect(mockOnBlur).toHaveBeenCalledWith('123', 'value 1'); });
    expect(screen.queryByText('value = label_name')).not.toBeInTheDocument();
    waitFor(() => { expect(screen.queryByText(/value = label_name_1/i)).toBeInTheDocument(); });
  });
});
