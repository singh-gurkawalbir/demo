import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { FieldWrapper } from 'react-forms-processor/dist';

class MaterialInverseCheckbox extends React.Component {
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
    const inverseValue = !value;

    return (
      <FormControlLabel
        control={
          <Checkbox
            key={id}
            name={name}
            disabled={disabled}
            // isInvalid={!isValid}
            value={typeof value === 'string' ? value : value.toString()}
            checked={inverseValue}
            onChange={evt => onFieldChange(id, !evt.target.checked)}
          />
        }
        label={label}
      />
    );
  }
}

const DynaInverseCheckbox = props => (
  <FieldWrapper {...props}>
    <MaterialInverseCheckbox />
  </FieldWrapper>
);

export default DynaInverseCheckbox;
