import { TextField, InputAdornment, Button, FormControl, FormLabel, makeStyles, Typography, IconButton, Paper } from '@material-ui/core';
// import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useContext, useState } from 'react';
import isLoggableAttr from '../../../../utils/isLoggableAttr';
import AddIcon from '../../../icons/AddIcon';
import EditIcon from '../../../icons/EditIcon';
import SearchIcon from '../../../icons/SearchIcon';
import FieldHelp from '../../FieldHelp';
import FieldMessage from '../FieldMessage';

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
  inputTextField: {
    '& div': {
      padding: '0px !important',
    },
  },
  textareaInput: {
    '& .MuiInputBase-input': {
      height: `${theme.spacing(4.5)}px !important`,
      lineHeight: 1,
    },
  },
  editButton: {
    marginLeft: 400,
  },
  createButton: {
    pl: 2,
  },
}));

const DropdownContext = React.createContext({});

const Option = option => {
  const data = useContext(DropdownContext);

  const {onEditClick} = data;

  return (<><Typography>{option?.label}</Typography><IconButton onClick={() => onEditClick(option.value)}><EditIcon /></IconButton></>);
};

const PaperComponentCustom = options => {
  const classes = useStyles();
  const { containerProps, children } = options;
  const data = useContext(DropdownContext);
  const {onCreateClick} = data;

  return (
    <Paper className={classes.paper} {...containerProps}>
      {children}
      {(
        <Button
          fullWidth
          color="primary"
          className={classes.buttonBackground}
          onMouseDown={event => { event.preventDefault(); onCreateClick(); }}
        >
          <AddIcon />
          <Typography >Create connection</Typography>
        </Button>
      )}
    </Paper>
  );
};

export default function DynaEditable(props) {
  const {options, id, onFieldChange, value, required, isValid, label, disabled, removeHelperText, onCreateClick, onEditClick} = props;
  const classes = useStyles();
  const selectedValue = options.find(option => option.value === value)?.label;
  const [inputValue, setInputValue] = useState(selectedValue);
  const [renderValue, setRenderValue] = useState(selectedValue);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownProps = {
    allOptions: options, onEditClick, onCreateClick, classes,
  };

  const handleInputChange = (evt, newVal) => { setIsMenuOpen('true'); setInputValue(newVal); };

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
            id="combo-box-demo"
            options={options}
            getOptionLabel={option => option?.label}
            renderOption={Option}
            value={renderValue}
            disableClearable
            forcePopupIcon={false}
            open={isMenuOpen}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            onFocus={() => setIsMenuOpen(true)}
            onClose={() => setIsMenuOpen(false)}
            onBlur={() => { setIsMenuOpen(false); setInputValue(selectedValue); }}
            onChange={(event, newValue) => { setIsMenuOpen(false); setRenderValue(newValue?.label); onFieldChange(id, newValue?.value); }}
            className={classes.inputTextField}
            PaperComponent={PaperComponentCustom}
            {...isLoggableAttr(true)}
            renderInput={params => (
              <TextField
                {...params}
                variant="filled"
                className={classes.textareaInput}
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
             />
            )} />
        </DropdownContext.Provider>
        {!removeHelperText && <FieldMessage {...props} />}
      </FormControl>
    </div>
  );
}
