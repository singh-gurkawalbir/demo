import produce from 'immer';
import { generateRow} from '..';
import actionTypes from '../actionTypes';

const isAllValuesEnteredForARow = rowValue => Object.values(rowValue).every(val => !!val);

export default function reducer(state, action) {
  const {
    type,
    value,
    index,
    field,
    onRowChange,
  } = action;

  return produce(state, draft => {
    const {tableStateValue} = draft;

    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.REMOVE_TABLE_ROW:
        tableStateValue.splice(index, 1);
        draft.touched = true;
        break;
      case actionTypes.UPDATE_TABLE_ROW:
        draft.touched = true;

        if (onRowChange) {
          // eslint-disable-next-line no-param-reassign
          tableStateValue[index].value = onRowChange(tableStateValue[index].value, field, value);
        } else {
          tableStateValue[index].value[field] = value;
        }

        // eslint-disable-next-line no-case-declarations
        const isAllValuesEntered = isAllValuesEnteredForARow(tableStateValue[index].value);
        // eslint-disable-next-line no-case-declarations
        const isLastRowEmpty = Object.values(tableStateValue[tableStateValue.length - 1].value).every(val => !val);

        if (isAllValuesEntered && !isLastRowEmpty) {
          const emptyRow = Object.keys(tableStateValue[0].value).reduce((acc, curr) => {
            acc[curr] = '';

            return acc;
          }, {});

          tableStateValue.push(generateRow(emptyRow));
        }

        break;
    }
  });
}

export const preSubmit = (stateValue = [], optionsMap) =>
  stateValue.map(val => val.value).filter((val, index) => {
    // we always remove the last row because we pre add one in the initial state
    if (index === stateValue.length - 1) return false;
    let allRequiredFieldsPresent = true;

    optionsMap.forEach(op => {
      if (op.required) allRequiredFieldsPresent = allRequiredFieldsPresent && !!val[op.id];
    });

    return allRequiredFieldsPresent;
  });
