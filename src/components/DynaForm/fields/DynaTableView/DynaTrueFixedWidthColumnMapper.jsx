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
      onFieldChange={fieldChangeHandler}
    />
  );
}
