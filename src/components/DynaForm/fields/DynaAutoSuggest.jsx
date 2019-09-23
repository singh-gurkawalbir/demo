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
  const { id, disabled, value, onFieldChange, onBlur, options = [] } = props;
  const suggestions = options.map(option => ({ label: option, value: option }));
  const [inputValue, setInputValue] = useState(value || '');
  const classes = useStyles();
  const handleChange = newVal => {
    setInputValue(newVal.value);

    if (onFieldChange) onFieldChange(id, newVal);
  };

  const handleBlur = () => {
    onBlur(id, inputValue);
  };

  const handleInputChange = newVal => {
    setInputValue(newVal);

    if (onFieldChange) onFieldChange(id, newVal);
  };

  return (
    <FormControl disabled={disabled} className={classes.root}>
      <Select
        inputValue={inputValue}
        isClearable
        noOptionsMessage={() => null}
        onInputChange={handleInputChange}
        onChange={handleChange}
        onBlur={handleBlur}
        options={suggestions}
      />
    </FormControl>
  );
}
