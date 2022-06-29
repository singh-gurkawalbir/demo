/* global describe, test, expect ,jest */
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
describe('HomeSearchInput testing', () => {
  test('onchange should be called', () => {
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

  test('onblur should be called', () => {
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
  test('onfocus should be called here', () => {
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

    screen.debug();
  });
  test('on clear should be called here', () => {
    const mockdispatch = jest.fn();
    const onchange = jest.fn();

    useReducer.mockReturnValueOnce([{
      isSearchFocused: true,
      isSearchIconHidden: false,
      isCloseIconHidden: true,
    }, mockdispatch]);

    renderWithProviders(<HomeSearchInput onChange={onchange} />);
    const clearButton = screen.getByRole('button');
    const input = screen.getByDisplayValue('');

    userEvent.click(clearButton);
    expect(input).toHaveFocus();

    expect(input).toHaveAttribute('placeholder', 'Search integrations & flows');

    screen.debug();
  });
});
