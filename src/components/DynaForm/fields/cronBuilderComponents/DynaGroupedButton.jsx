import { ButtonGroup, Button } from '@material-ui/core';
import FormContext from 'react-forms-processor/dist/components/FormContext';
import { useEffect, useCallback } from 'react';

function GroupedButton(props) {
  const {
    id,
    value,
    onFieldChange,
    clearFields,
    fields,
    options,
    unit,
    setReset,
  } = props;
  const finalValues =
    value.includes('/') || value.includes('*') ? [] : value && value.split(',');
  const handleChange = useCallback(
    item => () => {
      let res;

      if (finalValues.includes(item.value)) {
        res = finalValues.filter(val => val !== item.value);
      } else {
        res = [...finalValues, item.value];
      }

      setReset && setReset(false);

      onFieldChange(id, !res.length ? '*' : res.sort().join(','));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [finalValues, id, onFieldChange, setReset]
  );

  useEffect(() => {
    clearFields.forEach(id => {
      fields.some(field => field.id === id) && onFieldChange(id, '');
    });

    if (!finalValues.length) {
      if (unit === 'minute') onFieldChange(id, options[0].items[0].value);
      else onFieldChange(id, '*');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <ButtonGroup color="primary">
      {options &&
        options[0] &&
        options[0].items.map(item => (
          <Button
            key={item.label}
            color="primary"
            onClick={handleChange(item)}
            variant={finalValues.includes(item.value) ? 'contained' : 'text'}>
            {item.label}
          </Button>
        ))}
    </ButtonGroup>
  );
}

export default function DynaGroupedButton(props) {
  return (
    <FormContext.Consumer>
      {form => <GroupedButton {...props} fields={form.fields} />}
    </FormContext.Consumer>
  );
}
