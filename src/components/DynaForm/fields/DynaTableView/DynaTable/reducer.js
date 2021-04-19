import produce from 'immer';
import { generateRow} from '.';

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
      case 'remove':
        tableStateValue.splice(index, 1);
        draft.touched = true;
        break;
      case 'updateField':
        draft.touched = true;

        if (onRowChange) {
          // eslint-disable-next-line no-param-reassign
          tableStateValue[index].value = onRowChange(tableStateValue[index].value, field, value);
        } else {
          tableStateValue[index].value[field] = value;
        }

        // eslint-disable-next-line no-case-declarations
        const isAllValuesEntered = Object.values(tableStateValue[index].value).every(val => !!val);
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
  stateValue.map(val => val.value).filter(val => {
    let allRequiredFieldsPresent = true;

    optionsMap.forEach(op => {
      if (op.required) allRequiredFieldsPresent = allRequiredFieldsPresent && !!val[op.id];
    });

    return allRequiredFieldsPresent;
  });
