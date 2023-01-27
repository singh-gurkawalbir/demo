import produce from 'immer';

export default function reducer(state, action) {
  const { type, value } = action;

  return produce(state, draft => {
    switch (type) {
      case 'onCursorChange':
        draft.cursorPosition = value;
        break;
      case 'onTruncate':
        draft.isTruncated = value;
        break;
      case 'setAnchorEL':
        draft.anchorEl = value;
        break;
      case 'onFocused':
        draft.isFocused = value;
        break;
      case 'onDataTypeSelector':
        draft.dataTypeSelector = value;
        break;
      default:
        break;
    }
  });
}
