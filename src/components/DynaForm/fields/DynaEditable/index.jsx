import { TextField, makeStyles, Typography, IconButton, Paper } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useContext, useState } from 'react';
import isLoggableAttr from '../../../../utils/isLoggableAttr';
import TextButton from '../../../Buttons/TextButton';
import AddIcon from '../../../icons/AddIcon';
import EditIcon from '../../../icons/EditIcon';
import SearchIcon from '../../../icons/SearchIcon';

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

const Component = props => {
  const {classes} = props;
  const data = useContext(DropdownContext);
  const {onCreateClick} = data;

  return (
    <Paper>
      {props.children}
      <TextButton
        startIcon={<AddIcon />}
        className={classes?.createButton}
        onClick={onCreateClick}>
        Create connection
      </TextButton>
    </Paper>
  );
};

export default function DynaEditable(props) {
  const {options, id, onFieldChange, value, onCreateClick, onEditClick} = props;
  const classes = useStyles();
  const selectedValue = options.find(option => option.value === value)?.label;
  const [inputValue, setInputValue] = useState(selectedValue);
  const [renderValue, setRenderValue] = useState(selectedValue);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownProps = {
    allOptions: options, onEditClick, onCreateClick, classes,
  };

  const handleInputChange = (evt, newVal) => setInputValue(newVal);

  return (
    <div>
      <DropdownContext.Provider value={dropdownProps}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={options}
          getOptionLabel={option => option?.label}
          renderOption={Option}
          value={renderValue}
          popupIcon={<SearchIcon />}
          open={isMenuOpen}
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onFocus={() => setIsMenuOpen(true)}
          onClose={() => setIsMenuOpen(false)}
          onBlur={() => { setIsMenuOpen(false); setInputValue(selectedValue); }}
          onChange={(event, newValue) => { setIsMenuOpen(false); setRenderValue(newValue?.label); onFieldChange(id, newValue?.value); }}
          className={classes.inputTextField}
          PaperComponent={Component}
          {...isLoggableAttr(true)}
          renderInput={params => <TextField {...params} variant="filled" className={classes.textareaInput} />} />
      </DropdownContext.Provider>
    </div>
  );
}
