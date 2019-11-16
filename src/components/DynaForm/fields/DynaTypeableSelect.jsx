import { useState } from 'react';
import Select from 'react-select';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex !important',
    flexWrap: 'nowrap',
  },
}));

export default function DynaTypeableSelect(props) {
  const {
    id,
    disabled,
    value,
    placeholder,
    onBlur,
    labelName,
    hideOptions,
    valueName,
    options = [],
  } = props;
  const suggestions = options.map(option => ({
    label: option[labelName],
    value: option[valueName],
  }));
  const [inputState, setInputState] = useState({
    inputValue: value || '',
    isFocus: false,
  });
  const { inputValue, isFocus } = inputState;
  const classes = useStyles();
  const handleChange = newObj => {
    const newVal = newObj.value;

    setInputState({ ...inputState, inputValue: newVal });

    if (onBlur) onBlur(id, newVal);
  };

  const handleBlur = () => {
    if (onBlur) onBlur(id, inputValue);
    setInputState({ ...inputState, isFocus: false });
  };

  const handleInputChange = newVal => {
    setInputState({ isFocus: true, inputValue: newVal });
  };

  const selectedValue =
    !isFocus && suggestions.find(o => o.value === inputValue);
  const inputVal =
    (!isFocus && selectedValue && selectedValue.label) || inputValue;

  return (
    <FormControl disabled={disabled} className={classes.root}>
      <Select
        key={id}
        data-test={id}
        inputValue={inputVal}
        isDisabled={disabled}
        value={selectedValue}
        noOptionsMessage={() => null}
        placeholder={placeholder || ''}
        onInputChange={handleInputChange}
        onChange={handleChange}
        onBlur={handleBlur}
        components={
          hideOptions && {
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
          }
        }
        options={suggestions}
      />
    </FormControl>
  );
}
