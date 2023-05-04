import { TextField, InputAdornment, FormControl, FormLabel, makeStyles, Paper } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import isLoggableAttr from '../../../../utils/isLoggableAttr';
import AddIcon from '../../../icons/AddIcon';
import EditIcon from '../../../icons/EditIcon';
import SearchIcon from '../../../icons/SearchIcon';
import FieldHelp from '../../FieldHelp';
import FieldMessage from '../FieldMessage';
import TextButton from '../../../Buttons/TextButton';
import ActionButton from '../../../ActionButton';
import { OptionLabel } from '../DynaSelectConnection';

const useStyles = makeStyles(theme => ({
  connectionFieldWrapper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
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
    '& > * .MuiSvgIcon-root': {
      fontSize: 12,
    },
  },
  dropdownitemsConnection: {
    width: '100%',
    marginLeft: 1,
    marginTop: theme.spacing(5),
    '& ul': {
      '& li': {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px 15px',
        alignItems: 'center',
        '&:before': {
          content: 'unset',
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
  },
  optionEditIcon: {
    display: 'none',
    height: 20,
  },
}));

const DropdownContext = React.createContext({});

const Option = option => {
  const data = useContext(DropdownContext);

  const {onEditClick, classes} = data;

  return (
    <>
      <OptionLabel option={option} connInfo={option?.connInfo} />
      <span className={classes.optionEditIcon}>
        <ActionButton onClick={() => onEditClick(option.value)}><EditIcon /></ActionButton>
      </span>
    </>
  );
};

const PaperComponentCustom = options => {
  const classes = useStyles();
  const { containerProps, children } = options;
  const data = useContext(DropdownContext);
  const {onCreateClick} = data;

  return (
    <Paper className={classes.dropdownitemsConnection} {...containerProps}>
      {children}
      {(
        <TextButton
          onMouseDown={event => { event.preventDefault(); onCreateClick(); }}
          bold
          fullWidth
          className={classes.createConnectionBtn}
          startIcon={<AddIcon bold />}>
          Create connection
        </TextButton>
      )}
    </Paper>
  );
};

export default function DynaEditable(props) {
  const {options, id, onFieldChange, value, required, isValid, label, disabled, removeHelperText, onCreateClick, onEditClick} = props;
  const [isOptionHovered, setIsOptionHovered] = useState(false);
  const classes = useStyles({isOptionHovered});
  const selectedValue = options.find(option => option.value === value)?.label;
  const [inputValue, setInputValue] = useState(selectedValue);
  const [selectOptions] = useState(options);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownProps = {
    allOptions: options, onEditClick, onCreateClick, classes, setIsOptionHovered,
  };

  const handleInputChange = useCallback((evt, newVal) => {
    if (evt) { setInputValue(newVal); }
  }, []);

  useEffect(() => {
    if (inputValue !== selectedValue) {
      setInputValue(selectedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValue]);
  useEffect(() => {
    if (selectOptions.length !== options.length) {
      setInputValue(selectedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  const handleFocus = useCallback(() =>
    setIsMenuOpen(true), []);

  const handleClose = useCallback(() => setIsMenuOpen(false), []);

  const handleBlur = useCallback(() => {
    setIsMenuOpen(false);
    setInputValue(selectedValue);
  }, [selectedValue]);

  const filterOptions = useCallback(options => options?.filter(option => option?.label.includes(inputValue || '')), [inputValue]);

  const handleChange = useCallback((event, newValue) => {
    setIsMenuOpen(false);
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
        disabled={disabled}
        required={required}
        fullWidth>
        <DropdownContext.Provider value={dropdownProps}>
          <Autocomplete
            disablePortal
            id="connections-dropdown"
            options={options}
            getOptionLabel={option => option?.label}
            renderOption={Option}
            disableClearable
            forcePopupIcon={false}
            open={isMenuOpen}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            onFocus={handleFocus}
            onClose={handleClose}
            onBlur={handleBlur}
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
        {!removeHelperText && <FieldMessage {...props} />}
      </FormControl>
    </div>
  );
}
