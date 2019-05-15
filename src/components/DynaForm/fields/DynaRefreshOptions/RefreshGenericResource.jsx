import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import RefreshIcon from '@material-ui/icons/RefreshOutlined';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Spinner from '../../../Spinner';

@withStyles(() => ({
  inlineElements: {
    display: 'inline',
  },
  selectElement: {
    width: '80%',
  },
}))
class RefreshGenericResource extends React.Component {
  componentDidMount() {
    const { onFetchResource, computedOptions } = this.props;

    // When it has data don't refetch again...if the user
    // specifically wants to do it...user can use refresh icon
    if (!computedOptions || computedOptions.length === 0) onFetchResource();
  }
  render() {
    const {
      description,
      disabled,
      id,
      name,
      // options = [],
      value = '',
      label,
      onFieldChange,
      computedOptions,
      onFetchResource,
      resourceIsLoading,
      classes,
    } = this.props;

    if (!computedOptions) return <Spinner />;

    const availableResourceOptions = computedOptions.map(option => {
      const { label, value } = option;

      return (
        <MenuItem key={value} value={value}>
          {label}
        </MenuItem>
      );
    });

    return (
      <div>
        <FormControl
          key={id}
          disabled={disabled}
          className={classes.inlineElements}>
          <InputLabel shrink={!!value} htmlFor={id}>
            {label}
          </InputLabel>
          <Select
            className={classes.selectElement}
            value={value}
            onChange={evt => {
              onFieldChange(id, evt.target.value);
            }}
            input={<Input name={name} id={id} />}>
            {availableResourceOptions}
          </Select>
          {!resourceIsLoading && <RefreshIcon onClick={onFetchResource} />}
          {computedOptions && resourceIsLoading && <Spinner />}
          {description && <FormHelperText>{description}</FormHelperText>}
        </FormControl>
      </div>
    );
  }
}

export default RefreshGenericResource;
