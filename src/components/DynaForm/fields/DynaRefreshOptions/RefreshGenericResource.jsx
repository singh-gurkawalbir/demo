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
    const { onFetchResource, options } = this.props;

    // When it has data don't refetch again...if the user
    // specifically wants to do it...user can use refresh icon
    if (!options || options.length === 0) onFetchResource();
  }
  render() {
    const {
      description,
      disabled,
      id,
      name,
      defaultValue = '',
      // options = [],
      value,
      label,
      onFieldChange,
      options,
      onFetchResource,
      isLoading,
      placeholder,
      classes,
    } = this.props;

    if (!options) return <Spinner />;

    let optionsMenuItems = options.map(option => {
      const { label, value } = option;

      return (
        <MenuItem key={value} value={value}>
          {label}
        </MenuItem>
      );
    });
    const placeHolderMenuItem = (
      <MenuItem key="" value="" disabled>
        {placeholder}
      </MenuItem>
    );

    optionsMenuItems = [placeHolderMenuItem, ...optionsMenuItems];

    // the input label shrinks irrespective of the value
    // because there will always be some value
    // TODO: should this be the same behavior for other dropdown
    return (
      <div>
        <FormControl
          key={id}
          disabled={disabled}
          className={classes.inlineElements}>
          <InputLabel shrink htmlFor={id}>
            {label}
          </InputLabel>
          <Select
            className={classes.selectElement}
            displayEmpty
            value={value || defaultValue}
            onChange={evt => {
              onFieldChange(id, evt.target.value);
            }}
            input={<Input name={name} id={id} />}>
            {optionsMenuItems}
          </Select>
          {!isLoading && <RefreshIcon onClick={onFetchResource} />}
          {options && isLoading && <Spinner />}
          {description && <FormHelperText>{description}</FormHelperText>}
        </FormControl>
      </div>
    );
  }
}

export default RefreshGenericResource;
