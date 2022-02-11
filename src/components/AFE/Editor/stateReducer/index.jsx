export const actionTypes = {
  isDragging: 'isDragging',
  isRequireResize: 'isRequireResize',
  dragBarGridArea: 'dragBarGridArea',
  dragOrientation: 'dragOrientation',
};

export default function reducer(state, action) {
  const { type, value } = action;
  const currentState = {...state};

  switch (type) {
    case actionTypes.isDragging:
      currentState.isDragging = value;
      break;
    case actionTypes.isRequireResize:
      currentState.requireResize = value;
      break;
    case actionTypes.dragBarGridArea:
      currentState.dragBarGridArea = value;
      break;
    case actionTypes.dragOrientation:
      if (value === 'v') {
        currentState.dragOrientation = value;
      }
      if (value === 'h') {
        currentState.dragOrientation = value;
      }
      break;
    default:
      break;
  }

  return currentState;
}

