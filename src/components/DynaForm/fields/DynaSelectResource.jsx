import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { FieldWrapper } from 'react-forms-processor/dist';
import * as selectors from '../../../reducers';

const useStyles = makeStyles({
  root: {
    display: 'flex !important',
    flexWrap: 'nowrap',
  },
});

function DynaSelectResource(props) {
  const {
    description,
    disabled,
    id,
    name,
    value = '',
    label,
    placeholder,
    onFieldChange,
    resourceType,
  } = props;
  const classes = useStyles(props);
  const { resources = [] } = useSelector(state =>
    selectors.resourceList(state, { type: resourceType })
  );
  const filteredResources = () => {
    const { resourceType, filter, excludeFilter, options } = props;

    if (!resourceType) return [];

    const finalFilter = options && options.filter ? options.filter : filter;

    return resources.filter(r => {
      if (finalFilter) {
        const keys = Object.keys(finalFilter);

        for (let i = 0; i < keys.length; i += 1) {
          const key = keys[i];

          if (r[key] !== finalFilter[key]) return false;
        }
      }

      if (excludeFilter) {
        const keys = Object.keys(excludeFilter);

        for (let i = 0; i < keys.length; i += 1) {
          const key = keys[i];

          if (r[key] === excludeFilter[key]) return false;
        }
      }

      return true;
    });
  };

  let resourceItems = filteredResources().map(conn => {
    const label = conn.name;
    const value = conn._id;

    return (
      <MenuItem key={value} value={value}>
        {label}
      </MenuItem>
    );
  });
  const tempPlaceHolder = placeholder || 'Please Select';
  const defaultItem = (
    <MenuItem key={tempPlaceHolder} value="">
      {tempPlaceHolder}
    </MenuItem>
  );

  resourceItems = [defaultItem, ...resourceItems];

  return (
    <FormControl key={id} disabled={disabled} className={classes.root}>
      <InputLabel shrink={!!value} htmlFor={id}>
        {label}
      </InputLabel>
      <Select
        value={value}
        onChange={evt => {
          onFieldChange(id, evt.target.value);
        }}
        input={<Input name={name} id={id} />}>
        {resourceItems}
      </Select>
      {<FormHelperText>{description}</FormHelperText>}
    </FormControl>
  );
}

const FieldWrappedDynaSelectResource = props => (
  <FieldWrapper {...props}>
    <DynaSelectResource />
  </FieldWrapper>
);

export default FieldWrappedDynaSelectResource;
