import DynaTableView from './DynaTable';

export default function DynaCSVColumnMapper(props) {
  const { value, onFieldChange } = props;
  let newValue;

  if (value) {
    newValue = value.map(el => {
      let length = 0;

      if (el.startPosition && el.endPosition) {
        length = el.endPosition - el.startPosition + 1;
      }

      return { ...el, length };
    });
  }

  const rowChangeListener = (state, row, field, newValue) => {
    if (state[row]) {
      if (['startPosition', 'endPosition'].includes(field)) {
        const newRow = Object.assign({}, state[row], { [field]: newValue });

        return [
          ...state.slice(0, row),
          Object.assign({}, newRow, {
            length: state[row].endPosition - state[row].startPosition,
          }),
          ...state.slice(row + 1, state.length),
        ];
      }

      return [
        ...state.slice(0, row),
        Object.assign({}, state[row], { [field]: newValue }),
        ...state.slice(row + 1, state.length),
      ];
    }

    return [...state];
  };

  const fieldChangeHandler = (id, val) => {
    if (val && Array.isArray(val)) {
      onFieldChange(
        id,
        val.map(({ fieldName, startPosition, endPosition, regex }) => ({
          ...{},
          fieldName,
          startPosition,
          endPosition,
          regex,
        }))
      );
    }
  };

  const optionsMap = [
    {
      id: 'fieldName',
      label: 'Field Description',
      type: 'input',
      required: true,
      space: 4,
    },
    {
      id: 'startPosition',
      label: 'Start Position',
      required: true,
      type: 'number',
      space: 1,
    },
    {
      id: 'endPosition',
      label: 'End Position',
      required: true,
      type: 'number',
      space: 1,
    },
    {
      id: 'length',
      label: 'Length',
      required: false,
      type: 'number',
      readOnly: true,
      space: 1,
    },
    {
      id: 'regex',
      label: 'Regex',
      required: false,
      type: 'input',
      space: 4,
    },
  ];

  return (
    <DynaTableView
      {...props}
      optionsMap={optionsMap}
      value={newValue}
      rowChangeListener={rowChangeListener}
      onFieldChange={fieldChangeHandler}
    />
  );
}
