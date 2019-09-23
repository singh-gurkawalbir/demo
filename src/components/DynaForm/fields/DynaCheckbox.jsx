import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default function DynaCheckbox(props) {
  const {
    disabled,
    id,
    name,
    onFieldChange,
    value = '',
    label,
    inverse,
  } = props;

  return (
    <FormControlLabel
      control={
        <Checkbox
          key={id}
          name={name}
          color="primary"
          disabled={disabled}
          // isInvalid={!isValid}
          value={typeof value === 'string' ? value : value.toString()}
          checked={inverse ? !value : !!value}
          onChange={evt =>
            onFieldChange(
              id,
              inverse ? !evt.target.checked : evt.target.checked
            )
          }
        />
      }
      label={label}
    />
  );
}
