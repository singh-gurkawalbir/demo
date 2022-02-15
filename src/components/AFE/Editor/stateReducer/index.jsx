import produce from 'immer';

export default function reducer(state, action) {
  const {type, payload} = action;

  return produce(state, draft => {
    switch (type) {
      case 'dragStart':
        draft.isDragging = true;
        draft.dragBarGridArea = payload;
        if (payload === 'v') {
          draft.dragOrientation = payload;
        }
        if (payload === 'h') {
          draft.dragOrientation = payload;
        }
        break;
      case 'resize':
        draft.requireResize = false;
        break;
      case 'dragEnd':
        draft.isDragging = false;
        draft.requireResize = true;
        break;
      default:
        break;
    }

    return draft;
  });
}
