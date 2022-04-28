import React, { useState, useRef, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, TextField, InputAdornment, Typography, Tooltip, Divider } from '@material-ui/core';
import ArrowDownIcon from '../../../../../../icons/ArrowDownIcon';
import useOnClickOutside from '../../../../../../../hooks/useClickOutSide';
import useKeyboardShortcut from '../../../../../../../hooks/useKeyboardShortcut';
import ExtractsTree from './ExtractsTree';
import { MAPPING_DATA_TYPES } from '../../../../../../../utils/mapping';
import messageStore from '../../../../../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  customTextField: {
    padding: 0,
    display: 'flex',
    marginBottom: 0,
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
  // srcDataType: {
  //   fontStyle: 'italic',
  //   color: theme.palette.secondary.light,
  // },
  textFieldWithDataType: {
    '&> * .MuiFilledInput-input': {
      paddingRight: theme.spacing(10),
    },
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
})
);

export const TooltipTitle = ({
  isTruncated,
  inputValue,
  hideSourceDropdown,
  isLookup,
  isHardCodedValue,
  isHandlebarExp,
  fieldType,
}) => {
  const classes = useStyles();
  let title = '';
  let hideDropdownMsgKey = '';

  if (isTruncated) {
    title = inputValue;
  }
  if (hideSourceDropdown) {
    if (isLookup) {
      hideDropdownMsgKey = 'LOOKUP_SOURCE_TOOLTIP';
    } else if (isHardCodedValue) {
      hideDropdownMsgKey = 'HARD_CODED_SOURCE_TOOLTIP';
    } else if (isHandlebarExp) {
      hideDropdownMsgKey = 'HANDLEBARS_SOURCE_TOOLTIP';
    }
  }

  // dynamic lookup and hard-coded value will/can have empty input value, so need to show tooltip in that case
  if (!inputValue && !isLookup && !isHardCodedValue) return fieldType;
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
  dataType: destDataType = MAPPING_DATA_TYPES.STRING,
  id,
  disabled,
  value: propValue = '',
  importId,
  flowId,
  onBlur,
  isLookup,
  isHardCodedValue,
  isHandlebarExp,
}) {
  const classes = useStyles();
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(propValue);
  const [isTruncated, setIsTruncated] = useState(false);
  const containerRef = useRef();
  const inputFieldRef = useRef();

  const handleChange = useCallback(event => {
    setInputValue(event.target.value);
  }, []);

  const handleFocus = useCallback(e => {
    e.stopPropagation();
    const { value } = e.target;

    // this is required to get the input field offsets during handleMouseOver
    // to show the tooltip accordingly
    e.target.setSelectionRange(value.length, value.length);
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (propValue !== inputValue) { onBlur(inputValue); }
  }, [propValue, inputValue, onBlur]);

  useOnClickOutside(containerRef, isFocused && handleBlur);
  useKeyboardShortcut(['Escape'], handleBlur, {ignoreBlacklist: true});

  const handleMouseOver = useCallback(() => {
    setIsTruncated(inputFieldRef.current.offsetWidth < inputFieldRef.current.scrollWidth);
  }, []);

  const hideSourceDropdown = isLookup || isHardCodedValue || isHandlebarExp;
  // tooltip is only visible when not in focus and for truncated values
  // and/or source dropdown is hidden
  const hideTooltip = isFocused || (inputValue && !isTruncated && !hideSourceDropdown);

  return (
    <FormControl
      data-test={id}
      key={id}
      ref={containerRef}
      >
      <Tooltip
        disableFocusListener
        placement="bottom"
        title={hideTooltip ? '' : (
          <TooltipTitle
            isTruncated={isTruncated}
            inputValue={inputValue}
            hideSourceDropdown={hideSourceDropdown}
            isLookup={isLookup}
            isHardCodedValue={isHardCodedValue}
            isHandlebarExp={isHandlebarExp}
            fieldType="Source record field"
        />
        )} >

        <TextField
          isLoggable
          onMouseMove={handleMouseOver}
          // className={clsx(classes.customTextField, {[classes.textFieldWithDataType]: srcDataType})}
          className={classes.customTextField}
          variant="filled"
          autoFocus={isFocused}
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          disabled={disabled}
          multiline={isFocused}
          placeholder="Source record field"
          // InputProps={{
          //   endAdornment: hideSourceDropdown
          //     ? (<Typography variant="caption" className={classes.srcDataType}>{srcDataType}</Typography>)
          //     : (
          //       <InputAdornment className={classes.autoSuggestDropdown} position="start">
          //         <Typography variant="caption" className={classes.srcDataType}>{srcDataType}</Typography>
          //         <ArrowDownIcon />
          //       </InputAdornment>
          //     ),
          //   inputProps: {
          //     ref: inputFieldRef,
          //   },
          // }}
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
          }} />
      </Tooltip >

      {/* only render tree component if field is focussed and not disabled */}
      {isFocused && !disabled && !hideSourceDropdown && (
      <ExtractsTree
        key={id}
        destDataType={destDataType}
        propValue={propValue}
        inputValue={inputValue}
        onBlur={onBlur}
        setInputValue={setInputValue}
        setIsFocused={setIsFocused}
        flowId={flowId}
        resourceId={importId}
        />
      )}

    </FormControl>
  );
}

