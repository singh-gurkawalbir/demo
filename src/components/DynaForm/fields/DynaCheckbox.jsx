import { FormControl } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ErroredMessageComponent from './ErroredMessageComponent';

export default function DynaCheckbox(props) {
  const {
    disabled,
    id,
    name,
    onFieldChange,
    value = '',
    label,
    inverse,
    required,
    isValid,
  } = props;

  return (
    <FormControl error={!isValid} required={required} disabled={disabled}>
      <FormControlLabel
        control={
          <Checkbox
            key={id}
            name={name}
            color="primary"
            // isInvalid={!isValid}
            data-test={id}
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
      <ErroredMessageComponent {...props} />
    </FormControl>
  );
}
