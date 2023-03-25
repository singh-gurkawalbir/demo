import produce from 'immer';
import { generateRow} from '..';
import actionTypes from '../actionTypes';

const isAllValuesEnteredForARow = (rowValue, optionsMap) => {
  const hasRequiredOptions = optionsMap.some(op => op.required);

  if (hasRequiredOptions) {
    return optionsMap.every(op => {
      if (op.required) return !!rowValue[op.id];

      return true;
    });
  }
  const firstColumnId = optionsMap?.[0].id;

  return !!rowValue[firstColumnId];
};

export default function reducer(state, action) {
  const {
    type,
    value,
    rowIndex,
    field,
    optionsMap,
    onRowChange,
    invalidateParentFieldOnError,
    setIsValid,
  } = action;

  return produce(state, draft => {
    const { tableStateValue, ignoreEmptyRow } = draft;
    // const required = optionsMap.some(obj => obj.required);

    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.REMOVE_TABLE_ROW:
        tableStateValue.splice(rowIndex, 1);
        /*
          The below condition will checks when the table has left with 1 row in deletion process and sets the isValid
          to false when there are required properties within option map orelse it will set the isValid to true so that
          user can save the form.
        */
        if (invalidateParentFieldOnError && tableStateValue === 1 && optionsMap.some(obj => obj.required)) {
          draft.isValid = false;
        } else {
          draft.isValid = true;
        }
        draft.touched = true;
        break;
      case actionTypes.UPDATE_TABLE_ROW:
        draft.touched = true;
        if (onRowChange) {
          // eslint-disable-next-line no-param-reassign
          tableStateValue[rowIndex].value = onRowChange(tableStateValue[rowIndex].value, field, value);
        } else {
          tableStateValue[rowIndex].value[field] = value;
        }

        // eslint-disable-next-line no-case-declarations
        const isAllValuesEntered = isAllValuesEnteredForARow(tableStateValue[rowIndex].value, optionsMap);
        // eslint-disable-next-line no-case-declarations
        const isLastRowEmpty = Object.values(tableStateValue[tableStateValue.length - 1].value).every(val => !val);

        /*
          The below if condition will calculate whether the all required fields are having the values
          and checking whether the last row is empty and setting the isValid property based on it.
        */
        if (invalidateParentFieldOnError) {
          if (isAllValuesEntered && isLastRowEmpty) {
            draft.isValid = true;
            setIsValid(true);
          } else {
            draft.isValid = false;
            setIsValid(false);
          }
        }

        if (isAllValuesEntered && !isLastRowEmpty) {
          const emptyRow = Object.keys(tableStateValue[0].value).reduce((acc, curr) => {
            acc[curr] = '';

            return acc;
          }, {});

          if (!ignoreEmptyRow) {
            tableStateValue.push(generateRow(emptyRow));
          }
        }

        break;
    }
  });
}
export const preSubmit = (stateValue = [], optionsMap, ignoreEmptyRow) =>
  stateValue.map(val => val.value).filter((val, index) => {
    if (ignoreEmptyRow) {
      return true;
    }
    // we always remove the last row because we pre add one in the initial state
    if (index === stateValue.length - 1) return false;
    let allRequiredFieldsPresent = true;

    optionsMap.forEach(op => {
      if (op.required) allRequiredFieldsPresent = allRequiredFieldsPresent && !!val[op.id];
    });

    return allRequiredFieldsPresent;
  });
