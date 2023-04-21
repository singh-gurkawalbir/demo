
import React, {useReducer} from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomeSearchInput from '.';
import {renderWithProviders} from '../../../test/test-utils';

jest.mock('react', () => {
  const originReact = jest.requireActual('react');
  const mUseReducer = jest.fn();

  return {
    ...originReact,
    useReducer: mUseReducer,
  };
});
describe('homeSearchInput UI tests', () => {
  test('should call the onChange and dispatch function when input is changed', () => {
    const mockdispatch = jest.fn();
    const onchange = jest.fn();

    useReducer.mockReturnValueOnce([{
      isSearchFocused: true,
      isSearchIconHidden: false,
      isCloseIconHidden: true,
    }, mockdispatch]);

    renderWithProviders(<HomeSearchInput onChange={onchange} />);
    const input = screen.getByDisplayValue('');

    userEvent.type(input, 'sometext');
    expect(mockdispatch).toHaveBeenCalledWith({type: 'onInputChange', value: 'sometext'});
    expect(onchange).toHaveBeenCalled();
  });

  test('should call dispatch action with "blur" as type when the text field is set to blur', () => {
    const mockdispatch = jest.fn();
    const onchange = jest.fn();

    useReducer.mockReturnValueOnce([{
      isSearchFocused: true,
      isSearchIconHidden: false,
      isCloseIconHidden: true,
    }, mockdispatch]);

    renderWithProviders(<HomeSearchInput onChange={onchange} />);
    const input = screen.getByDisplayValue('');

    userEvent.type(input, 'sometext');
    expect(mockdispatch).toHaveBeenCalledWith({type: 'onInputChange', value: 'sometext'});
    expect(onchange).toHaveBeenCalled();

    input.blur();
    expect(mockdispatch).toHaveBeenNthCalledWith(10, {type: 'onBlur', value: 'sometext'});
  });
  test('should call dispatch with focus as type when text field is set to focus', () => {
    const mockdispatch = jest.fn();
    const onchange = jest.fn();

    useReducer.mockReturnValueOnce([{
      isSearchFocused: true,
      isSearchIconHidden: false,
      isCloseIconHidden: true,
    }, mockdispatch]);

    renderWithProviders(<HomeSearchInput onChange={onchange} />);
    const input = screen.getByDisplayValue('');

    userEvent.type(input, 'sometext');
    expect(mockdispatch).toHaveBeenCalledWith({type: 'onInputChange', value: 'sometext'});
    expect(onchange).toHaveBeenCalled();

    input.blur();
    input.focus();
    expect(mockdispatch).toHaveBeenNthCalledWith(11, {type: 'onFocus'});
  });
  test('should clear the test field and placeholder text should appear', () => {
    const mockdispatch = jest.fn();
    const onchange = jest.fn();

    useReducer.mockReturnValueOnce([{
      isSearchFocused: true,
      isSearchIconHidden: false,
      isCloseIconHidden: true,
    }, mockdispatch]);

    renderWithProviders(<HomeSearchInput onChange={onchange} placeHolder="Search integrations & flows" />);
    const clearButton = screen.getByRole('button');
    const input = screen.getByDisplayValue('');

    userEvent.click(clearButton);
    expect(input).toHaveFocus();

    expect(input).toHaveAttribute('placeholder', 'Search integrations & flows');
  });
});
