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

export default function DynaAutoSuggest(props) {
  const {
    id,
    disabled,
    value,
    placeholder,
    onFieldChange,
    onBlur,
    options = [],
  } = props;
  const suggestions = options.map(option => ({ label: option, value: option }));
  const [inputValue, setInputValue] = useState(value || '');
  const classes = useStyles();
  const handleChange = newObj => {
    const newVal = newObj.value;

    setInputValue(newVal);

    if (onFieldChange) onFieldChange(id, newVal);

    if (onBlur) onBlur(id, newVal);
  };

  const handleBlur = () => {
    if (onBlur) onBlur(id, inputValue);
  };

  const handleInputChange = newVal => {
    setInputValue(newVal);

    if (onFieldChange) onFieldChange(id, newVal);
  };

  return (
    <FormControl disabled={disabled} className={classes.root}>
      <Select
        inputValue={inputValue}
        noOptionsMessage={() => null}
        placeholder={placeholder || ''}
        onInputChange={handleInputChange}
        onChange={handleChange}
        onBlur={handleBlur}
        options={suggestions}
      />
    </FormControl>
  );
}
