import { useEffect, useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import RefreshIcon from '@material-ui/icons/RefreshOutlined';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import Spinner from '../../../Spinner';

const useStyles = makeStyles(theme => ({
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
    margin: theme.spacing(0.25),
  },
}));

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
    fieldData,
    fieldStatus,
    handleFetchResource,
    handleRefreshResource,
    placeholder,
    fieldError,
  } = props;
  const classes = useStyles(props);
  const defaultValue = props.defaultValue || (multiselect ? [] : '');
  // component is in loading state in both request and refresh cases
  const isLoading =
    !fieldStatus || fieldStatus === 'requested' || fieldStatus === 'refreshed';
  // Boolean state to minimize calls on useEffect
  const [isDefaultValueChanged, setIsDefaultValueChanged] = useState(false);

  // Resets field's value to value provided as argument
  // TODO - Add onFieldChange as a dependency
  useEffect(() => {
    if (isDefaultValueChanged) {
      if (resetValue) {
        onFieldChange(id, multiselect ? [] : '');
      } else {
        onFieldChange(id, defaultValue);
      }

      setIsDefaultValueChanged(false);
    }
  }, [
    id,
    resetValue,
    multiselect,
    defaultValue,
    isDefaultValueChanged,
    onFieldChange,
    setIsDefaultValueChanged,
  ]);
  useEffect(() => {
    if (!fieldData) {
      handleFetchResource();
    }
  }, [fieldData, handleFetchResource]);

  useEffect(() => {
    // Reset selected values on change of resourceToFetch
    if (resourceToFetch) {
      setIsDefaultValueChanged(true);
    }
  }, [resourceToFetch, setIsDefaultValueChanged]);

  if (!fieldData) return <Spinner />;

  let optionMenuItems = fieldData.map(options => {
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
    const fieldOption = fieldData.find(option => option.value === value);

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
        {!isLoading && <RefreshIcon onClick={handleRefreshResource} />}
        {fieldData && isLoading && <Spinner />}
        {description && <FormHelperText>{description}</FormHelperText>}
        {fieldError && (
          <FormHelperText error="true">{fieldError}</FormHelperText>
        )}
      </FormControl>
    </div>
  );
}

export default RefreshGenericResource;
