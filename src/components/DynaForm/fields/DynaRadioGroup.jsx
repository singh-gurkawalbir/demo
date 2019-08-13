import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
// import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { FieldWrapper } from 'react-forms-processor/dist';

function MaterialUiRadioGroup(props) {
  const {
    id,
    name,
    options = [],
    defaultValue,
    required,
    value,
    label,
    onFieldChange,
  } = props;
  const items = options.reduce(
    (itemsSoFar, option) =>
      itemsSoFar.concat(
        option.items.map(item => {
          if (typeof item === 'string') {
            return (
              <FormControlLabel
                key={item}
                value={item}
                control={<Radio />}
                label={item}
              />
            );
          }

          return (
            <FormControlLabel
              key={item.value}
              value={item.value}
              control={<Radio />}
              label={item.label || item.value}
            />
          );
        })
      ),
    []
  );

  return (
    <FormControl component="fieldset" required={required}>
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup
        aria-label={label}
        name={name}
        defaultValue={defaultValue}
        value={value}
        onChange={evt => {
          onFieldChange(id, evt.target.value);
        }}>
        {items}
      </RadioGroup>
    </FormControl>
  );
}

const DynaRadio = props => (
  <FieldWrapper {...props}>
    <MaterialUiRadioGroup />
  </FieldWrapper>
);

export default DynaRadio;
