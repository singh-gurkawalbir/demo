import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { FieldWrapper } from 'react-forms-processor/dist';

@withStyles(() => ({
  textField: {
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
    // minWidth: 120,
  },
}))
class DynaUploadFile extends React.Component {
  render() {
    const {
      options,
      classes,
      disabled,

      id,
      isValid,
      name,
      onFieldChange,
      placeholder,
      required,
      value,
      label,
    } = this.props;
    const handleFieldChange = event => {
      const { value } = event.target;

      onFieldChange(id, value);
    };

    let acceptFileType = '.txt';

    if (options) {
      acceptFileType = `.${options}`;
    }

    return (
      <TextField
        inputProps={{ accept: acceptFileType }}
        InputLabelProps={{ shrink: true }}
        input
        key={id}
        name={name}
        label={label}
        className={classes.textField}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        error={!isValid}
        value={value}
        onChange={handleFieldChange}
      />
    );
  }
}

const WrappedDynaUploadFile = props => (
  <FieldWrapper {...props}>
    <DynaUploadFile />
  </FieldWrapper>
);

export default WrappedDynaUploadFile;
