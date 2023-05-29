import { TextField, InputAdornment, FormControl, FormLabel, Paper, Autocomplete, MenuItem } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { VariableSizeList } from 'react-window';
import isLoggableAttr from '../../../../utils/isLoggableAttr';
import AddIcon from '../../../icons/AddIcon';
import EditIcon from '../../../icons/EditIcon';
import SearchIcon from '../../../icons/SearchIcon';
import FieldHelp from '../../FieldHelp';
import FieldMessage from '../FieldMessage';
import TextButton from '../../../Buttons/TextButton';
import { OptionLabel } from '../DynaSelectConnection';
import { stringCompare } from '../../../../utils/sort';
import ActionButton from '../../../ActionButton';

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
    boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
    borderRadius: theme.spacing(0, 0, 0.5, 0.5),
    '& .MuiAutocomplete-listbox': {
      padding: 0,
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

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);

  return <div ref={ref} {...props} {...outerProps} />;
});

const Row = ({ data, index, style }) => React.cloneElement(data[index], {
  style: {
    ...style,
  },
});

const Option = (props, option) => {
  const data = useContext(DropdownContext);

  const {handleEditClick, handleChange, classes, allowEdit} = data;

  return (
    <MenuItem {...props}>
      <OptionLabel handleClick={handleChange} option={option} connInfo={option?.connInfo} />
      { allowEdit && (
        <span className={classes.optionEditIcon}>
          <ActionButton
            tooltip="Edit connection"
            placement="bottom"
            data-test="editResource"
            onClick={evt => handleEditClick(evt, option)}
            noPadding>
            <EditIcon />
          </ActionButton>
        </span>
      )}
    </MenuItem>
  );
};

const NO_OF_OPTIONS = 4.5;
const ITEM_SIZE = 48;
const ITEM_SIZE_WITH_1_OPTION = 60;
const ITEM_SIZE_WITH_2_OPTIONS = 80;

const ListboxComponent = props => {
  const {children, ...rest} = props;
  const classes = useStyles();
  const listRef = React.useRef();
  const data = useContext(DropdownContext);
  const {items} = data;

  const itemData = React.Children.toArray(children);

  const itemCount = itemData?.length;

  const getItemSize = index => {
    const { connInfo } = items[index];

    if (connInfo?.httpConnectorApiId && connInfo?.httpConnectorVersionId) return ITEM_SIZE_WITH_2_OPTIONS;
    if (connInfo?.httpConnectorApiId || connInfo?.httpConnectorVersionId) return ITEM_SIZE_WITH_1_OPTION;

    return ITEM_SIZE;
  };

  const listHeight = items.reduce((acc, curr, index) => acc + getItemSize(index), 0);

  const maxHeightOfSelect = useMemo(() => items.length > NO_OF_OPTIONS
    ? ITEM_SIZE * 4.5
    : listHeight, [items.length, listHeight]);

  return (
    <OuterElementContext.Provider value={rest}>
      <VariableSizeList
        {...isLoggableAttr()}
        ref={listRef}
        itemData={itemData}
        itemCount={itemCount}
        itemSize={getItemSize}
        className={classes.dropdownitemsConnection}
        outerElementType={OuterElementType}
        height={maxHeightOfSelect}>
        {Row}
      </VariableSizeList>
    </OuterElementContext.Provider>
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

  const handleChange = useCallback((event, newValue) => {
    setInputValue(newValue?.label);
    onFieldChange(id, newValue?.value);
  }, [id, onFieldChange]);

  const filterOptions = useCallback(options => options?.filter(option => option?.label.toLowerCase().includes(inputValue?.toLowerCase() || '')), [inputValue]);

  const dropdownProps = useMemo(() => (
    {
      handleEditClick,
      allowEdit,
      allowNew,
      handleCreateClick,
      classes,
      handleChange,
      inputRef,
      items: filterOptions(options),
    }), [allowEdit, allowNew, classes, filterOptions, handleChange, handleCreateClick, handleEditClick, options]);

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
            ListboxComponent={ListboxComponent}
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
