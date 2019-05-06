import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { FieldWrapper } from 'react-forms-processor/dist';

class MaterialCheckbox extends React.Component {
  render() {
    const {
      disabled,
      id,
      // isValid,
      name,
      onFieldChange,
      value = '',
      label,
    } = this.props;

    return (
      <FormControlLabel
        control={
          <Checkbox
            key={id}
            name={name}
            disabled={disabled}
            // isInvalid={!isValid}
            value={typeof value === 'string' ? value : value.toString()}
            checked={value}
            onChange={evt => onFieldChange(id, evt.target.checked)}
          />
        }
        label={label}
      />
    );
  }
}

const DynaCheckbox = props => (
  <FieldWrapper {...props}>
    <MaterialCheckbox />
  </FieldWrapper>
);

export default DynaCheckbox;
