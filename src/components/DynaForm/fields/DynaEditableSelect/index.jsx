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
import { stringCompare } from '../../../../utils/sort';

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
    '& > * .MuiSvgIcon-root': {
      fontSize: 12,
    },
  },
  dropdownitemsConnection: {
    width: '100%',
    marginTop: 39,
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

  const {onEditClick, classes, allowEdit} = data;

  return (
    <>
      <OptionLabel option={option} connInfo={option?.connInfo} />
      { allowEdit && (
      <span className={classes.optionEditIcon}>
        <ActionButton
          data-test="editResource"
          onClick={evt => onEditClick(evt, option.value)}>
          <EditIcon />
        </ActionButton>
      </span>
      )}
    </>
  );
};

const PaperComponentCustom = options => {
  const classes = useStyles();
  const { containerProps, children } = options;
  const data = useContext(DropdownContext);
  const {onCreateClick, allowNew} = data;

  return (
    <Paper className={classes.dropdownitemsConnection} {...containerProps}>
      {children}
      {allowNew && (
        <TextButton
          onMouseDown={event => { event.preventDefault(); onCreateClick(); }}
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
  const [isOptionHovered, setIsOptionHovered] = useState(false);
  const classes = useStyles({isOptionHovered});
  const selectedValue = options.find(option => option.value === value)?.label;
  const [inputValue, setInputValue] = useState(selectedValue);
  const [selectOptions, setSelectedOptions] = useState(options);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sortedOptions = options => options.sort(stringCompare('label'));
  const dropdownProps = {
    allOptions: sortedOptions(options), onEditClick, allowEdit, allowNew, onCreateClick, classes, setIsOptionHovered,
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
      setSelectedOptions(options);
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
        required={required}
        className={classes.connectionFieldFormControl}
        fullWidth>
        <DropdownContext.Provider value={dropdownProps}>
          <Autocomplete
            disablePortal
            id="connections-dropdown"
            data-test="connection"
            options={options}
            getOptionLabel={option => option?.label}
            renderOption={Option}
            disableClearable
            forcePopupIcon={false}
            open={isMenuOpen}
            disabled={disabled}
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
