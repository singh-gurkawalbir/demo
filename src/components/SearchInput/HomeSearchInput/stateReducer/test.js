/* global describe,test,expect */
import reducer from '.';

describe('home search input reducer', () => {
  const initialState = {
    isSearchFocused: false,
    isSearchIconHidden: false,
    isCloseIconHidden: true,
  };

  test('should return correct state when input field changes', () => {
    const state = reducer(initialState, {type: 'onInputChange'});

    expect(state).toEqual(
      {isCloseIconHidden: false, isSearchFocused: false, isSearchIconHidden: true}
    );
  });
  test('should return correct state when search input is blurred', () => {
    const state = reducer(initialState, {type: 'onBlur'});

    expect(state).toEqual(
      {isCloseIconHidden: false, isSearchFocused: false, isSearchIconHidden: true}
    );
  });
  test('should return correct state when search is focused', () => {
    const state = reducer(initialState, {type: 'onFocus'});

    expect(state).toEqual(
      {isCloseIconHidden: true, isSearchFocused: true, isSearchIconHidden: true}
    );
  });
});
