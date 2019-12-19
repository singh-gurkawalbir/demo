import produce from 'immer';
import DynaTableView from './DynaTable';

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

export default function DynaTrueFixedWidthColmnMapper({
  value,
  onFieldChange,
  id,
  label,
  title,
}) {
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

  const onRowChange = (state, field, newValue) =>
    produce(state, draft => {
      draft[field] = newValue;

      if (['startPosition', 'endPosition'].includes(field)) {
        draft.length = draft.endPosition - draft.startPosition + 1;
      }
    });
  const fieldChangeHandler = (id, val = []) => {
    if (val && Array.isArray(val)) {
      onFieldChange(
        id,
        val.map(({ fieldName, startPosition, endPosition, regex }) => ({
          fieldName,
          startPosition,
          endPosition,
          regex,
        }))
      );
    }
  };

  return (
    <DynaTableView
      id={id}
      label={label}
      title={title}
      optionsMap={optionsMap}
      value={newValue}
      onRowChange={onRowChange}
      onFieldChange={fieldChangeHandler}
    />
  );
}
