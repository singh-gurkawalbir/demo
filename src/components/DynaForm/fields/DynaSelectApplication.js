import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { FieldWrapper } from 'react-forms-processor/dist';
import applications from '../../../constants/applications';
import ApplicationImg from '../../icons/ApplicationImg';

const styles = () => ({
  /* no styles yet */
});

function DynaSelectApplication(props) {
  const {
    description,
    disabled,
    id,
    name,
    value = '',
    label,
    onFieldChange,
  } = props;

  // TODO: refactor to use this component:
  // https://react-select.com/components#replacing-components
  return (
    <FormControl key={id} disabled={disabled}>
      <InputLabel shrink={!!value} htmlFor={id}>
        {label}
      </InputLabel>
      <Select
        value={value}
        onChange={e => {
          onFieldChange(id, e.target.value);
        }}
        input={<Input name={name} id={id} />}>
        {applications.map(app => (
          <MenuItem key={app.id} value={app.id}>
            <ApplicationImg
              type={app.type}
              assistant={app.icon || app.assistant}
            />
            {app.name}
          </MenuItem>
        ))}
      </Select>
      {description && <FormHelperText>{description}</FormHelperText>}
    </FormControl>
  );
}

const SelectAppWithStyles = withStyles(styles)(DynaSelectApplication);
const FieldWrappedDynaSelectApplication = props => (
  <FieldWrapper {...props}>
    <SelectAppWithStyles />
  </FieldWrapper>
);

export default FieldWrappedDynaSelectApplication;
