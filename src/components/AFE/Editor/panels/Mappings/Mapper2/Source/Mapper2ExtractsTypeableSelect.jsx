import React, { useState, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, TextField, InputAdornment, Typography, Tooltip, Divider } from '@material-ui/core';
import clsx from 'clsx';
import ArrowDownIcon from '../../../../../../icons/ArrowDownIcon';
import useKeyboardShortcut from '../../../../../../../hooks/useKeyboardShortcut';
import ExtractsTree from './ExtractsTree';
import { MAPPING_DATA_TYPES } from '../../../../../../../utils/mapping';
import messageStore from '../../../../../../../utils/messageStore';
import ArrowPopper from '../../../../../../ArrowPopper';
import useDebouncedValue from '../../../../../../../hooks/useDebouncedInput';
import actions from '../../../../../../../actions';
import SourceDataType from './SourceDataType';

const useStyles = makeStyles(theme => ({
  customTextField: {
    padding: 0,
    display: 'flex',
    marginBottom: 0,
    width: '100%',
    '& > .MuiFilledInput-multiline': {
      border: `1px solid ${theme.palette.secondary.lightest}`,
      paddingRight: 0,
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
    pointerEvents: 'none',
  },
  textFieldWithDataType: {
    '&> * .MuiFilledInput-input': {
      paddingRight: theme.spacing(10),
    },
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  extractListPopper: {
    width: theme.spacing(50),
    borderRadius: 0,
    top: '2px !important',
    border: 'none',
  },
  extractListPopperCompact: {
    width: theme.spacing(38),
    marginLeft: 0,
  },
  extractPopperArrow: {
    display: 'none',
  },
  extractPopperPaper: {
    boxShadow: 'none',
    borderRadius: 0,
    border: `1px solid ${theme.palette.secondary.lightest}`,
    '&:empty': {
      display: 'none',
    },
  },
  sourceDataTypeButton: {
    marginLeft: -theme.spacing(10),
    '&>.MuiDivider-root': {
      display: 'none',
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
}) => {
  const classes = useStyles();
  let title = '';
  let hideDropdownMsgKey = '';

  if (!isTruncated && !hideSourceDropdown) return fieldType;

  if (hideSourceDropdown) {
    if (isDynamicLookup) {
      hideDropdownMsgKey = 'DYNAMIC_LOOKUP_SOURCE_TOOLTIP';
    } else if (isHardCodedValue) {
      hideDropdownMsgKey = 'HARD_CODED_SOURCE_TOOLTIP';
    } else if (isHandlebarExp) {
      hideDropdownMsgKey = 'HANDLEBARS_SOURCE_TOOLTIP';
    }
  }

  if (isTruncated) {
    if (hideSourceDropdown) {
      title = inputValue;
    } else {
      title = `${fieldType}: ${inputValue}`;
    }
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
  editorLayout,
  className,
  popperClassName,
  sourceDataType,
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useDebouncedValue(propValue, value => {
    // do not dispatch action if the field is empty as there can be
    // multiple rows and it will unnecessarily dispatch actions slowing down the UI
    if (value === '' && value === propValue) return;
    dispatch(actions.mapping.v2.patchExtractsFilter(value, propValue));
  });
  const [isTruncated, setIsTruncated] = useState(false);
  const inputFieldRef = useRef();
  const [dataTypeSelector, selectDataType] = useState(false);

  const handleChange = useCallback(event => {
    setInputValue(event.target.value);
  }, [setInputValue]);

  const handleFocus = useCallback(e => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    const { value } = e.target;

    // this is required to get the input field offsets during handleMouseOver
    // to show the tooltip accordingly
    e.target.setSelectionRange(value.length, value.length);
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(event => {
    // handleBlur gets called by ClickAwayListener inside ArrowPopper to close the dropdown
    // if a click was made outside the dropdown.
    // But we should not consider the input textarea as "outside the dropdown" and dropdown should not be closed
    // when input field is clicked, hence below condition is added
    if (event?.target?.id === `${nodeKey}-mapper2SourceTextField`) return;

    setIsFocused(false);
    setAnchorEl(null);
    if (propValue !== inputValue) { onBlur(inputValue); }
  }, [nodeKey, propValue, inputValue, onBlur]);

  useKeyboardShortcut(['Escape'], handleBlur, {ignoreBlacklist: true});

  const handleMouseOver = useCallback(() => {
    setIsTruncated(inputFieldRef.current.offsetWidth < inputFieldRef.current.scrollWidth);
  }, []);

  const hideSourceDropdown = isDynamicLookup || isHardCodedValue || isHandlebarExp;

  return (
    <FormControl
      data-test={id}
      key={id}
      >
      <Tooltip
        disableFocusListener
        placement="bottom"
        title={(isFocused || (!inputValue && !isDynamicLookup)) ? '' : (
          <TooltipTitle
            isTruncated={isTruncated}
            inputValue={inputValue}
            hideSourceDropdown={hideSourceDropdown}
            isDynamicLookup={isDynamicLookup}
            isHardCodedValue={isHardCodedValue}
            isHandlebarExp={isHandlebarExp}
            fieldType="Source field"
        />
        )} >
        <TextField
          id={`${nodeKey}-mapper2SourceTextField`}
          isLoggable
          onMouseMove={handleMouseOver}
          className={clsx(classes.customTextField, {[classes.sourceCustomTextField]: hideSourceDropdown}, className)}
          variant="filled"
          autoFocus={isFocused}
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          disabled={disabled}
          multiline={isFocused}
          placeholder={disabled ? '' : 'Source field'}
          InputProps={{
            endAdornment: !hideSourceDropdown &&
              (
                <InputAdornment className={classes.autoSuggestDropdown} position="start">
                  <ArrowDownIcon />
                </InputAdornment>
              ),
            inputProps: {
              ref: inputFieldRef,
            },
          }}
           />
      </Tooltip >

      <SourceDataType
        anchorEl={dataTypeSelector}
        setAnchorEl={selectDataType}
        disabled={disabled || isHardCodedValue || isHandlebarExp}
        isHardCodedValue={isHardCodedValue}
        isHandlebarExp={isHandlebarExp}
        nodeKey={nodeKey}
        sourceDataTypes={sourceDataType}
        className={clsx({[classes.sourceDataTypeButton]: hideSourceDropdown})} />

      {/* only render tree component if field is focussed and not disabled.
      Here we are wrapping tree component with ArrowPopper to correctly handle the
      dropdown placement logic
      */}

      <ArrowPopper
        placement="bottom"
        id="extractPopper"
        open={isFocused}
        anchorEl={anchorEl}
        onClose={handleBlur}
        preventOverflow={false}
        offsetPopper="0,6"
        classes={{
          popper: clsx(classes.extractListPopper, {
            [classes.extractListPopperCompact]: editorLayout === 'compact2',
          }, popperClassName),
          arrow: classes.extractPopperArrow,
          paper: classes.extractPopperPaper,
        }}
        >
        {isFocused && !disabled && !hideSourceDropdown && (
          <ExtractsTree
            key={id}
            nodeKey={nodeKey}
            destDataType={destDataType}
            propValue={propValue}
            inputValue={inputValue}
            onBlur={onBlur}
            setInputValue={setInputValue}
            setIsFocused={setIsFocused}
          />
        )}
      </ArrowPopper>

    </FormControl>
  );
}
