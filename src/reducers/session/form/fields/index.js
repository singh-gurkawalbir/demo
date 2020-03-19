import produce from 'immer';
import actionTypes from '../../../../actions/types';

export default function fields(state = {}, action) {
  const { type, id, defaultValue, value, skipFieldTouched } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.FORM.FIELD.REGISTER:
        if (!draft[id]) draft[id] = {};
        else {
          // eslint-disable-next-line no-console
          console.warn('Field ID already in use', id);

          return;
        }

        draft[id] = {
          value: defaultValue,
          touched: false,
        };
        break;
      case actionTypes.FORM.FIELD.ON_FIELD_CHANGE:
        draft[id].value = value;

        if (!skipFieldTouched) draft[id].touched = true;

        break;

      case actionTypes.FORM.FIELD.ON_FIELD_BLUR:
        draft[id].touched = true;
        break;
      default:
    }
  });
}
