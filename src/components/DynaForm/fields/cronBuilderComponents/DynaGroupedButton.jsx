import { ButtonGroup, Button } from '@material-ui/core';

export default function DynaGroupedButton(props) {
  const { id, value, onFieldChange, clearFields, options } = props;
  const finalValues = value.includes('*') ? [] : value && value.split(',');

  return (
    <ButtonGroup color="primary">
      {options &&
        options[0] &&
        options[0].items.map(item => (
          <Button
            key={item.label}
            color="primary"
            onClick={() => {
              let res;

              if (finalValues.includes(item.value)) {
                res = finalValues.filter(it => it.value !== item.value);
              } else {
                res = [...finalValues, item.value];
              }

              clearFields.forEach(id => {
                onFieldChange(id, '');
              });
              onFieldChange(id, res.sort().join(','));
            }}
            variant={finalValues.includes(item.value) ? 'contained' : 'text'}>
            {item.label}
          </Button>
        ))}
    </ButtonGroup>
  );
}
