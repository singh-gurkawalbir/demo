
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
  test('should return correct state when input field changes value is empty string', () => {
    const state = reducer(initialState, {type: 'onInputChange', value: ''});

    expect(state).toEqual(
      {isCloseIconHidden: true, isSearchFocused: false, isSearchIconHidden: true}
    );
  });
  test('should return correct state when search input is blurred', () => {
    const state = reducer(initialState, {type: 'onBlur'});

    expect(state).toEqual(
      {isCloseIconHidden: false, isSearchFocused: false, isSearchIconHidden: true}
    );
  });

  test('should return correct state when search input is blurred and value emoty string', () => {
    const state = reducer(initialState, {type: 'onBlur', value: ''});

    expect(state).toEqual(
      {isCloseIconHidden: true, isSearchFocused: false, isSearchIconHidden: false}
    );
  });
  test('should return correct state when search is focused', () => {
    const state = reducer(initialState, {type: 'onFocus'});

    expect(state).toEqual(
      {isCloseIconHidden: true, isSearchFocused: true, isSearchIconHidden: true}
    );
  });
  test('should do the checking if an unknow type is dispatched', () => {
    const state = reducer(initialState, {type: 'someRandomText'});

    expect(state).toEqual(
      {isCloseIconHidden: true, isSearchFocused: false, isSearchIconHidden: false}
    );
  });
});
