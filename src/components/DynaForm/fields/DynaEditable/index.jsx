import { TextField, makeStyles, FormControl, FormLabel, Typography, IconButton, Paper, MenuList, Grid, MenuItem } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import clsx from 'clsx';
import React, { useContext, useEffect, useState } from 'react';
import { setValue } from '../../../../utils/form';
import isLoggableAttr from '../../../../utils/isLoggableAttr';
import TextButton from '../../../Buttons/TextButton';
import AddIcon from '../../../icons/AddIcon';
import EditIcon from '../../../icons/EditIcon';
import SearchIcon from '../../../icons/SearchIcon';
import FieldHelp from '../../FieldHelp';

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

  const {classes, onEditClick} = data;

  return (<><Typography>{option?.label}</Typography><IconButton onClick={() => onEditClick(option.value)}><EditIcon /></IconButton></>);
};

const Component = props => {
  const {classes} = props;

  return (
    <><MenuList {...props} />
      <TextButton
        startIcon={<AddIcon />}
        className={classes?.createButton}>
        Create connection
      </TextButton>
    </>
  );
};

export default function DynaEditable(props) {
  const {options, id, onFieldChange, value, onEditClick} = props;
  const classes = useStyles();
  const selectedValue = options.find(option => option.value === value)?.label;
  const [inputValue, setInputValue] = useState(selectedValue);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleEditClick = () => alert('clicked');
  const handleChange = newVal => { console.log({newVal}); };
  const dropdownProps = {
    allOptions: options, onEditClick, classes,
  };

  console.log({value});
  console.log({inputValue});
  console.log({selectedValue});
  const mismatch = selectedValue !== inputValue;

  console.log({mismatch});

  //   useEffect(() => {
  //     setInputValue(selectedValue);
  //     console.log({selectedValue});
  //     console.log({inputValue});
  //   }, [mismatch, selectedValue, value]);

  const handleInputChange = newVal => setInputValue(newVal);

  return (
    <div>
      <DropdownContext.Provider value={dropdownProps}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={options}
          getOptionLabel={option => option?.label}
          renderOption={Option}
        //   value={value}
          popupIcon={<SearchIcon />}
          open={isMenuOpen}
        //   inputValue={inputValue}
          onInputChange={handleInputChange}
          onFocus={() => setIsMenuOpen(true)}
          onClose={() => setIsMenuOpen(false)}
          onChange={(event, newValue) => { setIsMenuOpen(false); onFieldChange(id, newValue?.value); }}
          className={classes.inputTextField}
          PaperComponent={Component}
          {...isLoggableAttr(true)}
          renderInput={params => <TextField {...params} variant="filled" className={classes.textareaInput} />} />
      </DropdownContext.Provider>
    </div>
  );
}
