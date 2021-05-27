import { FormLabel, TextField } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import clsx from 'clsx';
import produce from 'immer';
import React, { useCallback, useReducer, useState } from 'react';
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
  const {type, value, label} = action;

  return produce(state, draft => {
    switch (type) {
      case SELECT_OPTION: {
        draft.eventOrigin = SELECT_OPTION;
        draft.inputTextValue = label;

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

  useReducer(reducer, {});
  const classes = useStyles();
  const onChange = useCallback((evt, selectedOption) => {
    // evt comes from the text field and selectedOption comes from the select drop down values
    // they are both mutually exclusive. evt is for a selectedOption which does not belong to the options
    // selectedOption comes from the options
    onFieldChange(id, selectedOption?.value || evt.target.value);
  }, [id, onFieldChange]);
  const onBlur = useCallback(evt => {
    // in onChange updates are made either through
    // 1. entering a text and hitting enter
    // 2. navigating through the options and hitting enter
    // On blur is also required when the user enters some text and moves to another field
    const textFieldValue = evt.target.value;

    if (textFieldValue !== value) {
      onFieldChange(id, evt.target.value);
    }
  }, [id, onFieldChange, value]);

  const getOptionLabel = useCallback(option => {
    const label = option?.label ||
    options.find(opt => opt.value === option)?.label || value;

    return label;
  },

  [options, value]);

  const renderInput = useCallback(params => <TextField {...params} name={name} id={id} />, [id, name]);
  const [inputValue, setInputValue] = useState('');

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
          includeInputInList
          getOptionLabel={getOptionLabel}
          data-test={dataTest || id}
          value={value}
          filterOptions={(options, state) => {
            console.log('check here', options, state);

            return options;
          }}
          onBlur={onBlur}
          inputValue={inputValue}
          onInputChange={(event, val) => {
            setInputValue(val);
          }}
          renderOption={renderOption}
          onChange={onChange}
          renderInput={renderInput}
        />
      </FormControl>

      {!removeHelperText && <FieldMessage {...props} />}
    </div>
  );
}
