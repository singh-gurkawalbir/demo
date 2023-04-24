import React, { useRef, useCallback, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { FormControl, TextField, InputAdornment, Typography, Tooltip, Divider } from '@mui/material';
import clsx from 'clsx';
import ArrowDownIcon from '../../../../../../icons/ArrowDownIcon';
import useKeyboardShortcut from '../../../../../../../hooks/useKeyboardShortcut';
import ExtractsTree from './ExtractsTree';
import { DATA_TYPES_REPRESENTATION_LIST, MAPPING_DATA_TYPES } from '../../../../../../../utils/mapping';
import useDebouncedValue from '../../../../../../../hooks/useDebouncedInput';
import actions from '../../../../../../../actions';
import SourceDataType from './SourceDataType';
import reducer from './stateReducer';
import messageStore from '../../../../../../../utils/messageStore';
import ExtractMenu from './ExtractMenu';

const useStyles = makeStyles(theme => ({
  customTextField: {
    padding: 0,
    display: 'flex',
    marginBottom: 0,
    width: '100%',
    '& .MuiInputBase-multiline': {
      border: `1px solid ${theme.palette.secondary.lightest}`,
      minHeight: theme.spacing(5),
      padding: 0,
    },
    '& > div': {
      width: '100%',
    },
    '& > * .MuiFilledInput-input': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      height: theme.spacing(5),
      paddingRight: theme.spacing(14),
    },
  },
  sourceCustomTextField: {
    '& > * .MuiFilledInput-input': {
      paddingRight: theme.spacing(10),
    },
  },
  autoSuggestDropdown: {
    position: 'absolute',
    top: 4,
    right: 0,
    marginTop: '0px !important',
    color: theme.palette.secondary.light,
    cursor: 'pointer',
  },
  divider: {
    margin: theme.spacing(1, 0),
  },
  sourceDataTypeButton: {
    marginLeft: '-80px', // theme.spacing with negative value results in "NaN"
    '&>.MuiDivider-root': {
      display: 'none',
    },
  },
  sourceDataToolTip: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1),
    '&>div': {
      marginBottom: theme.spacing(1),
    },
  },
})
);

export const TooltipTitle = ({
  isTruncated,
  inputValue,
  hideSourceDropdown,
  isDynamicLookup,
  isHardCodedValue,
  isHandlebarExp,
  fieldType,
  sourceDataTypes,
  isSource,
}) => {
  const classes = useStyles();
  let title = '';
  let hideDropdownMsgKey = '';

  if (hideSourceDropdown) {
    if (isDynamicLookup) {
      hideDropdownMsgKey = 'MAPPER2.DYNAMIC_LOOKUP_SOURCE_TOOLTIP';
    } else if (isHardCodedValue) {
      hideDropdownMsgKey = 'MAPPER2.HARD_CODED_SOURCE_TOOLTIP';
    } else if (isHandlebarExp) {
      hideDropdownMsgKey = 'MAPPER2.HANDLEBARS_SOURCE_TOOLTIP';
    }
  }

  // Adding condition for length since we need to show the tooltip
  // if their are two source field since dataType is truncated
  const sourceInputs = inputValue?.split(',');

  if ((isTruncated || (sourceInputs.length > 1)) && isSource) {
    const selectedDataTypeLabels = [];

    sourceDataTypes?.forEach(datatype => {
      selectedDataTypeLabels.push(DATA_TYPES_REPRESENTATION_LIST[[datatype]]);
    });
    const inputValArr = sourceInputs;

    title = (
      <div className={classes.sourceDataToolTip}>
        <div>Source field / data type:</div>
        {// eslint-disable-next-line react/no-array-index-key
        inputValArr.map((input, i) => <span key={`${input}${i}`}> {input} / {selectedDataTypeLabels[i]} </span>)
        }
      </div>
    );
  } else if (!isTruncated && !hideSourceDropdown) {
    return fieldType;
  } else if (!isDynamicLookup) {
    title = `${fieldType}: ${inputValue}`;
  }

  if (!hideSourceDropdown) return title;

  return (
    <>
      <Typography variant="caption" color="inherit">{messageStore(hideDropdownMsgKey)}</Typography>
      {title && <Divider orientation="horizontal" className={classes.divider} />}
      <Typography variant="caption" color="inherit">{title}</Typography>
    </>
  );
};

export default function Mapper2ExtractsTypeableSelect({
  nodeKey,
  dataType: destDataType = MAPPING_DATA_TYPES.STRING,
  id,
  disabled,
  value: propValue = '',
  onBlur,
  isDynamicLookup,
  isHardCodedValue,
  isHandlebarExp,
  className,
  sourceDataType,
  displaySourceDataType,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [mapper2ExtractsState, dispatchLocalAction] = useReducer(reducer, {
    cursorPosition: '',
    isTruncated: false,
    anchorEl: null,
    isFocused: false,
    dataTypeSelector: false,
  });

  const {cursorPosition, isTruncated, isFocused, dataTypeSelector} = mapper2ExtractsState;

  const setIsFocused = value => dispatchLocalAction({type: 'onFocused', value});

  const selectDataType = value => dispatchLocalAction({type: 'onDataTypeSelector', value});

  const [inputValue, setInputValue] = useDebouncedValue(propValue, value => {
    // do not dispatch action if the field is not clicked yet as there can be
    // multiple rows and it will unnecessarily dispatch actions slowing down the UI
    if (!isFocused) return;
    dispatch(actions.mapping.v2.patchExtractsFilter(value, propValue));
  });
  const inputFieldRef = useRef();
  const textFieldRef = useRef();
  const handleChange = useCallback(event => {
    setInputValue(event.target.value);
  }, [setInputValue]);

  const handleFocus = useCallback(e => {
    e.stopPropagation();
    dispatchLocalAction({type: 'setAnchorEL', value: e.currentTarget});
    const { value } = e.target;

    // this is required to get the input field offsets during handleMouseOver
    // to show the tooltip accordingly
    e.target.setSelectionRange(value.length, value.length);
    setIsFocused(true);
  }, []);

  const patchField = useCallback((propValue, newValue, jsonPath) => {
    // on blur, patch the extracts tree with empty input so all values in the
    // dropdown will be visible
    dispatch(actions.mapping.v2.patchExtractsFilter('', ''));
    if (propValue !== newValue) { onBlur(newValue, jsonPath); }
  }, [dispatch, onBlur]);

  const handleBlur = useCallback(event => {
    // handleBlur gets called by ClickAwayListener inside ArrowPopper to close the dropdown
    // if a click was made outside the dropdown.
    // But we should not consider the input textarea as "outside the dropdown" and dropdown should not be closed
    // when input field is clicked, hence below condition is added
    if (event?.target?.id === `${nodeKey}-mapper2SourceTextField`) return;

    setIsFocused(false);
    dispatchLocalAction({type: 'setAnchorEL', value: null});
    patchField(propValue, inputValue);
  }, [nodeKey, propValue, inputValue, patchField]);

  useKeyboardShortcut(['Escape'], handleBlur, {ignoreBlacklist: true});

  const handleMouseOver = useCallback(() => {
    dispatchLocalAction({type: 'onTruncate', value: inputFieldRef.current.offsetWidth < inputFieldRef.current.scrollWidth});
  }, []);

  const handleOnClick = useCallback(event => {
    dispatchLocalAction({type: 'onCursorChange', value: event.target.selectionStart});
  }, []);
  const handleKeyDown = useCallback(evt => {
    if (evt.key === 'Home') {
      evt.preventDefault();
      // eslint-disable-next-line no-param-reassign
      if (evt.shiftKey) evt.target.selectionStart = 0;
      else evt.target.setSelectionRange(0, 0);
    }
    if (evt.key === 'End') {
      evt.preventDefault();
      const len = evt.target.value.length;

      // eslint-disable-next-line no-param-reassign
      if (evt.shiftKey) evt.target.selectionEnd = len;
      else evt.target.setSelectionRange(len, len);
    }
  }, [],
  );
  const hideSourceDropdown = isDynamicLookup || isHardCodedValue || isHandlebarExp;
  const menuOpen = isFocused && !disabled && !hideSourceDropdown;

  return (
    <FormControl variant="standard" data-test={id} key={id}>
      <Tooltip
        disableFocusListener
        placement="bottom"
        title={
            isFocused || (!inputValue && !isDynamicLookup) ? (
              ''
            ) : (
              <TooltipTitle
                isTruncated={isTruncated}
                inputValue={inputValue}
                hideSourceDropdown={hideSourceDropdown}
                isDynamicLookup={isDynamicLookup}
                isHardCodedValue={isHardCodedValue}
                isHandlebarExp={isHandlebarExp}
                isSource
                fieldType="Source field"
                sourceDataTypes={sourceDataType}
              />
            )
          }
        >
        <TextField
          ref={textFieldRef}
          id={`${nodeKey}-mapper2SourceTextField`}
          isLoggable
          onMouseMove={handleMouseOver}
          className={clsx(
            classes.customTextField,
            { [classes.sourceCustomTextField]: hideSourceDropdown },
            className
          )}
          variant="filled"
          autoFocus={isFocused}
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          disabled={disabled}
          multiline={isFocused}
          placeholder={disabled ? '' : 'Source field'}
          onClick={handleOnClick}
          onKeyDown={handleKeyDown}
          InputProps={{
            endAdornment: !hideSourceDropdown && (
            <InputAdornment
              className={classes.autoSuggestDropdown}
              position="start"
              onClick={() => {
                setIsFocused(true);
              }}
                >
              <ArrowDownIcon />
            </InputAdornment>
            ),
            inputProps: {
              ref: inputFieldRef,
            },
          }}
          />
      </Tooltip>

      {displaySourceDataType && (
      <SourceDataType
        anchorEl={dataTypeSelector}
        setAnchorEl={selectDataType}
        disabled={disabled || isHardCodedValue || isHandlebarExp}
        isHardCodedValue={isHardCodedValue}
        isHandlebarExp={isHandlebarExp}
        isDynamicLookup={isDynamicLookup}
        nodeKey={nodeKey}
        sourceDataTypes={sourceDataType}
        className={clsx({
          [classes.sourceDataTypeButton]: hideSourceDropdown,
        })}
        isFocused={isFocused}
          />
      )}

      <ExtractMenu open={menuOpen} onClickAway={handleBlur} anchorRef={textFieldRef}>
        <ExtractsTree
          key={id}
          nodeKey={nodeKey}
          destDataType={destDataType}
          propValue={propValue}
          inputValue={inputValue}
          patchField={patchField}
          setInputValue={setInputValue}
          setIsFocused={setIsFocused}
          cursorPosition={cursorPosition}
        />
      </ExtractMenu>
    </FormControl>
  );
}
