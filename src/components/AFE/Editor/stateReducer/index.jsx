import produce from 'immer';

export default function reducer(state, action) {
  const {type, payload} = action;

  return produce(state, draft => {
    switch (type) {
      case 'dragStart':
        draft.isDragging = true;
        draft.dragBarGridArea = payload.gridArea;
        if (payload.orientation === 'v') {
          draft.dragOrientation = payload.orientation;
        }
        if (payload.orientation === 'h') {
          draft.dragOrientation = payload.orientation;
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
