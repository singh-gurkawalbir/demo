import { useEffect } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import RefreshIcon from '@material-ui/icons/RefreshOutlined';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';
import Spinner from '../../../Spinner';

const styles = theme => ({
  inlineElements: {
    display: 'inline',
  },
  selectElement: {
    width: '80%',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
});

function RefreshGenericResource(props) {
  const {
    description,
    disabled,
    id,
    name,
    value,
    label,
    resourceToFetch,
    resetValue,
    multiselect,
    onFieldChange,
    fieldOptions,
    onFetchResource,
    isLoading,
    classes,
    placeholder,
  } = props;
  const defaultValue = props.defaultValue || (multiselect ? [] : '');

  useEffect(() => {
    if (!fieldOptions) {
      onFetchResource();
    }
  }, [fieldOptions]);

  useEffect(() => {
    // Reset selected values on change of resourceToFetch
    if (resourceToFetch) {
      if (resetValue) {
        onFieldChange(id, multiselect ? [] : '');
      } else {
        onFieldChange(id, defaultValue);
      }
    }
  }, [resourceToFetch, id, defaultValue, resetValue]);

  if (!fieldOptions) return <Spinner />;
  let optionMenuItems = fieldOptions.map(options => {
    const { label, value } = options;

    return (
      <MenuItem key={value} value={value}>
        {label}
      </MenuItem>
    );
  });
  const placeHolderMenu = (
    <MenuItem key="" value="" disabled>
      {placeholder}
    </MenuItem>
  );
  const createChip = value => {
    const fieldOption = fieldOptions.find(option => option.value === value);

    return fieldOption ? (
      <Chip
        key={value}
        label={fieldOption.label || value}
        className={classes.chip}
      />
    ) : null;
  };

  optionMenuItems = multiselect
    ? optionMenuItems
    : [placeHolderMenu, ...optionMenuItems];

  return (
    <div>
      <FormControl
        key={id}
        disabled={disabled}
        className={classes.inlineElements}>
        <InputLabel shrink htmlFor={id}>
          {label}
        </InputLabel>
        {multiselect ? (
          <Select
            multiple
            value={value || defaultValue}
            onChange={evt => {
              onFieldChange(id, evt.target.value);
            }}
            input={<Input name={name} id={id} />}
            className={classes.selectElement}
            renderValue={selected => (
              <div className={classes.chips}>
                {selected &&
                  typeof selected.map === 'function' &&
                  selected.map(createChip)}
              </div>
            )}>
            {optionMenuItems}
          </Select>
        ) : (
          <Select
            displayEmpty
            value={value || defaultValue}
            onChange={evt => {
              onFieldChange(id, evt.target.value);
            }}
            input={<Input id={id} name={name} />}
            className={classes.selectElement}>
            {optionMenuItems}
          </Select>
        )}
        {!isLoading && <RefreshIcon onClick={onFetchResource} />}
        {fieldOptions && isLoading && <Spinner />}
        {description && <FormHelperText>{description}</FormHelperText>}
      </FormControl>
    </div>
  );
}

export default withStyles(styles)(RefreshGenericResource);
