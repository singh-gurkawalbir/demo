import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select, { components } from 'react-select';
import { FieldWrapper } from 'react-forms-processor/dist';
import applications from '../../../../constants/applications';
import ApplicationImg from '../../../icons/ApplicationImg';

const styles = () => ({
  formControl: {
    // margin: theme.spacing.unit,
    minWidth: 200,
    // maxWidth: 300,
  },
  optionRoot: {
    display: 'flex',
  },
});

export const SelectApplication = withStyles(styles)(props => {
  const {
    description,
    disabled,
    id,
    name,
    value = '',
    placeholder,
    onFieldChange,
    classes,
  } = props;
  // TODO: refactor to use this component:
  // https://react-select.com/components#replacing-components
  const options = applications.map(app => ({
    value: app.id,
    type: app.type,
    icon: app.icon || app.assistant,
    label: app.name,
  }));
  const Option = props => {
    const { type, icon } = props.data;

    return (
      <div className={classes.optionRoot}>
        <ApplicationImg type={type} assistant={icon} />
        <components.Option {...props} />
      </div>
    );
  };

  return (
    <FormControl key={id} disabled={disabled} className={classes.formControl}>
      <Select
        name={name}
        placeholder={placeholder}
        closeMenuOnSelect
        components={{ Option }}
        defaultValue={value}
        options={options}
        onChange={e => {
          onFieldChange && onFieldChange(id, e.value);
        }}
      />
      {description && <FormHelperText>{description}</FormHelperText>}
    </FormControl>
  );
});

const DynaSelectApplication = props => (
  <FieldWrapper {...props}>
    <SelectApplication />
  </FieldWrapper>
);

export default DynaSelectApplication;
