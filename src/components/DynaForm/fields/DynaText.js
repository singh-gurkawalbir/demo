// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { FieldWrapper } from 'integrator-ui-forms/packages/core/dist';

@withStyles(() => ({
  textField: {
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
    // minWidth: 120,
  },
}))
class MaterialUiTextField extends React.Component {
  render() {
    const {
      options,
      inputType,
      classes,
      description,
      disabled,
      errorMessages,
      id,
      isValid,
      name,
      onFieldChange,
      placeholder,
      required,
      value,
      label,
      multiline,
      valueDelimiter,
      rowsMax,
    } = this.props;
    const handleFieldChange = event => {
      const { value } = event.target;

      if (!valueDelimiter) {
        return onFieldChange(id, value);
      }

      onFieldChange(id, value.split(valueDelimiter));
    };

    let acceptFileType = '.txt';

    if (options) {
      acceptFileType = `.${options[0]}`;
    }

    return (
      <TextField
        inputProps={{ accept: acceptFileType }}
        type={inputType}
        autoComplete="off"
        key={id}
        name={name}
        label={label}
        className={classes.textField}
        placeholder={placeholder}
        helperText={isValid ? description : errorMessages}
        disabled={disabled}
        multiline={multiline}
        rowsMax={rowsMax}
        required={required}
        error={!isValid}
        value={value}
        onChange={handleFieldChange}
      />
    );
  }
}

const DynaText = props => (
  <FieldWrapper {...props}>
    <MaterialUiTextField />
  </FieldWrapper>
);

export default DynaText;
