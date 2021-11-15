export default function reducer(state, action) {
  const { type, value } = action;
  const draft = {...state};

  switch (type) {
    case 'onInputChange':
      draft.isSearchIconHidden = true;
      if (value === '') {
        draft.isCloseIconHidden = true;
      } else {
        draft.isCloseIconHidden = false;
      }

      break;

    case 'onBlur':
      draft.isSearchFocused = false;
      if (value !== '') {
        draft.isSearchIconHidden = true;
        draft.isCloseIconHidden = false;
      } else {
        draft.isSearchIconHidden = false;
      }

      break;

    case 'onFocus':
      draft.isSearchFocused = true;
      draft.isSearchIconHidden = true;

      break;
    default:
      break;
  }

  return draft;
}
