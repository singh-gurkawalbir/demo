import { TextField, InputAdornment, FormControl, FormLabel, makeStyles, Paper } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import isLoggableAttr from '../../../../utils/isLoggableAttr';
import AddIcon from '../../../icons/AddIcon';
import EditIcon from '../../../icons/EditIcon';
import SearchIcon from '../../../icons/SearchIcon';
import FieldHelp from '../../FieldHelp';
import FieldMessage from '../FieldMessage';
import TextButton from '../../../Buttons/TextButton';
import { OptionLabel } from '../DynaSelectConnection';
import { stringCompare } from '../../../../utils/sort';
import IconButtonWithTooltip from '../../../IconButtonWithTooltip';

const useStyles = makeStyles(theme => ({
  connectionFieldWrapper: {
    '& .MuiFilledInput-root': {
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      paddingRight: theme.spacing(1),
      height: '38px',
      '& .MuiFilledInput-input': {
        border: 'none',
        height: '38px',
        padding: '0px 15px',
      },
    },
  },
  connectionFieldFormControl: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    borderRadius: 2,
    '&:focus': {
      borderColor: theme.palette.primary.main,
    },
    '&:active': {
      borderColor: theme.palette.primary.main,
    },
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
  },
  searchIconConnection: {
    color: theme.palette.secondary.light,
  },
  textareaInput: {
    '& .MuiInputBase-input': {
      height: `${theme.spacing(4.5)}px !important`,
      lineHeight: 1,
    },
  },
  optionCreateConnection: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  createConnectionBtn: {
    padding: '15px 0px',
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    borderRadius: theme.spacing(0, 0, 0.5, 0.5),
    color: theme.palette.background.toggle,
    '& > * .MuiSvgIcon-root': {
      fontSize: 10,
    },
  },
  dropdownitemsConnection: {
    width: '100%',
    marginTop: 39,
    boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
    '& ul': {
      '& li': {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px 15px',
        alignItems: 'center',
        '&:before': {
          content: 'unset',
        },
        '& > .MuiTypography-root': {
          fontSize: '15px',
        },
        '&:hover': {
          '& $optionEditIcon': {
            display: 'flex',
          },
        },
      },
    },
    '& > .MuiAutocomplete-listbox': {
      maxHeight: '217px',
    },
    '& > .MuiAutocomplete-noOptions': {
      display: 'none',
    },
  },
  optionEditIcon: {
    display: 'none',
    height: 20,
  },
}));

const DropdownContext = React.createContext({});

const Option = option => {
  const data = useContext(DropdownContext);

  const {handleEditClick, classes, allowEdit} = data;

  return (
    <>
      <OptionLabel option={option} connInfo={option?.connInfo} />
      { allowEdit && (
      <span className={classes.optionEditIcon}>
        <IconButtonWithTooltip
          tooltipProps={{title: 'Edit connection'}}
          data-test="editResource"
          onClick={evt => handleEditClick(evt, option)}
          noPadding>
          <EditIcon />
        </IconButtonWithTooltip>
      </span>
      )}
    </>
  );
};

const PaperComponentCustom = options => {
  const classes = useStyles();
  const { containerProps, children } = options;
  const data = useContext(DropdownContext);
  const {handleCreateClick, allowNew} = data;

  return (
    <Paper className={classes.dropdownitemsConnection} {...containerProps}>
      {children}
      {allowNew && (
        <TextButton
          onMouseDown={handleCreateClick}
          bold
          fullWidth
          className={classes.createConnectionBtn}
          data-test="addNewResource"
          startIcon={<AddIcon bold />}>
          Create connection
        </TextButton>
      )}
    </Paper>
  );
};

export default function DynaEditable(props) {
  const {
    options,
    id,
    onFieldChange,
    value,
    required,
    isValid,
    label,
    disabled,
    removeHelperText,
    onCreateClick,
    onEditClick,
    allowEdit,
    allowNew,
  } = props;
  const classes = useStyles();
  const selectedValue = options.find(option => option.value === value)?.label;
  const [inputValue, setInputValue] = useState(selectedValue);
  const [selectOptions, setSelectedOptions] = useState(options);
  const inputRef = useRef(null);
  const sortedOptions = options => options.sort(stringCompare('label'));

  const handleInputChange = useCallback((evt, newVal) => {
    if (evt) { setInputValue(newVal); }
  }, []);

  const handleCreateClick = useCallback(event => {
    inputRef.current.blur();
    event.preventDefault();
    onCreateClick();
  }, [onCreateClick]);

  const handleEditClick = useCallback((evt, option) => {
    inputRef.current.blur();
    onEditClick(evt, option.value);
  }, [inputRef, onEditClick]);

  const dropdownProps = useMemo(() => (
    {
      handleEditClick,
      allowEdit,
      allowNew,
      handleCreateClick,
      classes,
      inputRef,
    }), [allowEdit, allowNew, classes, handleCreateClick, handleEditClick]);

  useEffect(() => {
    if (inputValue !== selectedValue) {
      setInputValue(selectedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValue]);
  useEffect(() => {
    if (selectOptions.length !== options.length) {
      setInputValue(selectedValue);
      setSelectedOptions(options);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  const handleBlur = useCallback(() => {
    setInputValue(selectedValue);
  }, [selectedValue]);

  const filterOptions = useCallback(options => options?.filter(option => option?.label.toLowerCase().includes(inputValue?.toLowerCase() || '')), [inputValue]);

  const handleChange = useCallback((event, newValue) => {
    setInputValue(newValue?.label);
    onFieldChange(id, newValue?.value);
  }, [id, onFieldChange]);

  return (
    <div>
      <div>
        <FormLabel htmlFor={id} required={required} error={!isValid}>
          {label}
        </FormLabel>
        <FieldHelp {...props} />
      </div>
      <FormControl
        key={id}
        required={required}
        className={classes.connectionFieldFormControl}
        fullWidth>
        <DropdownContext.Provider value={dropdownProps}>
          <Autocomplete
            disablePortal
            id="connections-dropdown"
            data-test="connection"
            options={sortedOptions(options)}
            getOptionLabel={option => option?.label}
            renderOption={Option}
            disableClearable
            forcePopupIcon={false}
            disabled={disabled}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            onBlur={handleBlur}
            blurOnSelect
            filterOptions={filterOptions}
            onChange={handleChange}
            className={classes.connectionFieldWrapper}
            PaperComponent={PaperComponentCustom}
            {...isLoggableAttr(true)}
            renderInput={params => {
              const updatedParams = {...params, inputProps: {...params.inputProps, value: inputValue || ''}};

              return (
                <TextField
                  {...updatedParams}
                  variant="filled"
                  className={classes.textareaInput}
                  inputRef={inputRef}
                  placeholder="Select or create connection"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon className={classes.searchIconConnection} />
                      </InputAdornment>
                    ),
                  }}
             />
              );
            }} />
        </DropdownContext.Provider>
      </FormControl>
      {!removeHelperText && <FieldMessage {...props} />}
    </div>
  );
}
