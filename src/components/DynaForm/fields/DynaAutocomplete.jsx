import { FormLabel, TextField } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import clsx from 'clsx';
import produce from 'immer';
import React, { useCallback, useReducer } from 'react';
import CeligoTruncate from '../../CeligoTruncate';
import FieldHelp from '../FieldHelp';
import FieldMessage from './FieldMessage';

const useStyles = makeStyles(theme => ({
  fieldWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  dynaSelectWrapper: {
    width: '100%',
  },
  focusVisibleMenuItem: {
    backgroundColor: theme.palette.secondary.lightest,
    transition: 'all .8s ease',
  },
  dynaSelectMenuItem: {
    wordBreak: 'break-word',
  },
}));

const Row = props => {
  const {value, label, disabled, style } = props;

  return (
    <div
      key={value}
      value={value}
      data-value={value}
      disabled={disabled}
      style={style}
        >
      <CeligoTruncate placement="left" lines={2}>
        {label}
      </CeligoTruncate>
    </div>
  );
};
const renderOption = option => <Row {...option} />;
const SELECT_OPTION = 'select-option';
const ON_INPUT = 'input';

const reducer = (state, action) => {
  const {type, value} = action;

  return produce(state, draft => {
    switch (type) {
      case SELECT_OPTION: {
        draft.eventOrigin = SELECT_OPTION;
        draft.inputTextValue = value;

        return;
      }
      case ON_INPUT:
        draft.eventOrigin = ON_INPUT;
        draft.inputTextValue = value;

        break;
      default:
    }
  });
};

const getOptionLabel = (options, option) => options.find(opt => opt.value === option)?.label;

const initializer = options => value => {
  const label = getOptionLabel(options, value);
  // if the value is part of the option it is a select else its input value

  if (label) {
    return {
      eventOrigin: SELECT_OPTION,
      inputTextValue: label,
    };
  }

  return {
    eventOrigin: ON_INPUT,
    inputTextValue: value,
  };
};
export default function DynaAutocomplete(props) {
  const {
    disabled,
    id,
    value,
    isValid = true,
    removeHelperText = false,
    name,
    required,
    rootClassName,
    label,
    onFieldChange,
    dataTest,
    options,
  } = props;

  const [inputTextState, setInputTextState] = useReducer(reducer, value, initializer(options));

  const {eventOrigin, inputTextValue} = inputTextState;

  console.log('see ', inputTextState);
  const classes = useStyles();
  const onChange = useCallback((evt, selectedOption) => {
    // whenever we change the input the text area needs to be updated with the label
    // also we have to update the external value state as well
    setInputTextState({type: SELECT_OPTION, value: selectedOption.label });
    onFieldChange(id, selectedOption.value);
  }, [id, onFieldChange]);

  const getOptionLabel = useCallback(option => {
    // if an event originates from the input then render the label
    if (eventOrigin === ON_INPUT) {
      return inputTextValue;
    }

    // if an event originates from the select then render the option.label
    return getOptionLabel(options, option);
  },
  [eventOrigin, inputTextValue, options]);

  const renderInput = useCallback(params => <TextField {...params} name={name} id={id} />, [id, name]);
  const filteredOptions = useCallback(options =>
    options.filter(option => option.label.includes(inputTextValue)), [inputTextValue]);

  const onInputChange = useCallback((event, val) => {
    // any update we make we drive an external input text field
    // we have to update the external value state to include hardcoded value
    setInputTextState({type: ON_INPUT, value: val});

    onFieldChange(id, val);
  }, [id, onFieldChange]);

  return (
    <div className={clsx(classes.dynaSelectWrapper, rootClassName)}>
      <div className={classes.fieldWrapper}>
        <FormLabel htmlFor={id} required={required} error={!isValid}>
          {label}
        </FormLabel>
        <FieldHelp {...props} />
      </div>
      <FormControl
        key={id}
        disabled={disabled}
        required={required}
        className={classes.dynaSelectWrapper}>
        <Autocomplete
          disableClearable
          freeSolo
          options={options}
          getOptionLabel={getOptionLabel}
          data-test={dataTest || id}
          value={value}
          filterOptions={filteredOptions}
          onInputChange={onInputChange}
          renderOption={renderOption}
          onChange={onChange}
          renderInput={renderInput}
        />
      </FormControl>

      {!removeHelperText && <FieldMessage {...props} />}
    </div>
  );
}
