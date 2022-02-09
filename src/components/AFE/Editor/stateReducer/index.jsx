export const actionTypes = {
  isDragging: 'isDragging',
};
export default function reducer(state, action) {
  const { type, value } = action;

  const currentState = {...state};

  switch (type) {
    case actionTypes.isDragging:
      currentState.isDragging = value;
      break;
    default:
      break;
  }

  return currentState;
}

