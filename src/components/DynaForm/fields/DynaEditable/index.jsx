import { TextField, InputAdornment, FormControl, FormLabel, makeStyles, Typography, Paper } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useContext, useState } from 'react';
import isLoggableAttr from '../../../../utils/isLoggableAttr';
import AddIcon from '../../../icons/AddIcon';
import EditIcon from '../../../icons/EditIcon';
import SearchIcon from '../../../icons/SearchIcon';
import FieldHelp from '../../FieldHelp';
import FieldMessage from '../FieldMessage';
import TextButton from '../../../Buttons/TextButton';
import ActionButton from '../../../ActionButton';

const useStyles = makeStyles(theme => ({
  connectionFieldWrapper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    '& .MuiFilledInput-root': {
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      paddingRight: theme.spacing(1),
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
    padding: theme.spacing(1.5, 0),
  },
  dropdownitemsConnection: {
    width: '100%',
    '& ul': {
      '& li': {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '11px 15px',
        '&:before': {
          content: 'unset',
        },
      },
    },
  },
}));

export const Label = ({ option, connInfo = {} }) => {
  const classes = useStyles();
  //   const { httpConnectorId, httpConnectorApiId, httpConnectorVersionId } = connInfo;
  //   const connectorData = useSelector(state => selectors.connectorData(state, httpConnectorId) || {});
  //   const { versions = [], apis = [] } = connectorData;
  const currApi = {};
  let currVersion = '1.0';

  //   currVersion = currVersion?.filter(ver => ver._id === httpConnectorVersionId)?.[0];
  currVersion = {name: '1.0'};

  //   if (!httpConnectorId) {
  //     return null;
  //   }

  return (
    <Typography>{option?.label || ''}
      <Typography component="div" variant="caption" className={classes.addClass}>
        {currApi?.name && <div><span><b>API type:</b></span> <span>{currApi.name}</span></div>}
        {currVersion?.name && <div><span><b>API version:</b> </span><span>{currVersion.name}</span></div>}
      </Typography>
    </Typography>
  );
};

const DropdownContext = React.createContext({});

const Option = option => {
  const data = useContext(DropdownContext);

  const {onEditClick} = data;

  return (
    <>
      <Label option={option} connInfo={option?.connInfo} />
      <ActionButton onClick={() => onEditClick(option.value)}><EditIcon /></ActionButton>
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
          startIcon={<AddIcon />}>
          Create connection
        </TextButton>
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
            className={classes.connectionFieldWrapper}
            PaperComponent={PaperComponentCustom}
            {...isLoggableAttr(true)}
            renderInput={params => (
              <TextField
                {...params}
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
            )} />
        </DropdownContext.Provider>
        {!removeHelperText && <FieldMessage {...props} />}
      </FormControl>
    </div>
  );
}
