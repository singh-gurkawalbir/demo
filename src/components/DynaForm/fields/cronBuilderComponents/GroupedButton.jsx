import { ButtonGroup, Button } from '@material-ui/core';

export default function GroupedButton(props) {
  const { id, value, onFieldChange, index, options } = props;
  const indvValues = value && value.split(' ');
  const finalValues =
    (indvValues.length && indvValues[index] && indvValues[index].split(',')) ||
    [];

  <ButtonGroup color="primary" aria-label="outlined primary button group">
    {options &&
      options[0] &&
      options[0].items.map(item => (
        <Button
          key={item.label}
          onClick={() => {
            let res;

            if (finalValues.find(item.value)) {
              res = finalValues.filter(it => it.value !== item.value);
            } else {
              res = [...finalValues, item.value];
            }

            onFieldChange(id, res.sort().join(','));
          }}
          variant={
            item.value === finalValues.includes(item.value) ? 'raised' : 'text'
          }>
          {item.label}
        </Button>
      ))}
  </ButtonGroup>;
}
