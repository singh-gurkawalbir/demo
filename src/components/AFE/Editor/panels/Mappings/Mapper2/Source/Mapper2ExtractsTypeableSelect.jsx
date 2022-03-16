import React, { useState, useRef, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, TextField, InputAdornment, Typography, Tooltip, Divider } from '@material-ui/core';
import clsx from 'clsx';
import isLoggableAttr from '../../../../../../../utils/isLoggableAttr';
import ArrowDownIcon from '../../../../../../icons/ArrowDownIcon';
import useOnClickOutside from '../../../../../../../hooks/useClickOutSide';
import useKeyboardShortcut from '../../../../../../../hooks/useKeyboardShortcut';
import ExtractsTree from './ExtractsTree';

const useStyles = makeStyles(theme => ({
  customTextField: {
    padding: 0,
    display: 'flex',
    marginBottom: 0,
    width: theme.spacing(34),
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
  srcDataType: {
    fontStyle: 'italic',
    color: theme.palette.secondary.light,
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
})
);

export const TooltipTitle = ({
  isTruncated,
  inputValue,
  hideDropdown,
  isLookup,
  isHardCodedValue,
  isHandlebarExp,
  fieldType,
}) => {
  const classes = useStyles();
  let title = '';
  let hideDropdownMsg = '';

  if (isTruncated) {
    title = inputValue;
  }
  if (hideDropdown) {
    if (isLookup) {
      hideDropdownMsg = 'Lookups do not provide source record field list';
    } else if (isHardCodedValue) {
      hideDropdownMsg = 'Hard-coded values do not provide source record field list';
    } else if (isHandlebarExp) {
      hideDropdownMsg = 'Handlebars expression do not provide source record field list';
    }
  }

  if (!inputValue) return fieldType;
  if (!hideDropdown) return title;

  return (
    <>
      <Typography variant="caption" color="inherit">{hideDropdownMsg}</Typography>
      {title && <Divider orientation="horizontal" className={classes.divider} />}
      <Typography variant="caption" color="inherit">{title}</Typography>
    </>
  );
};

export default function Mapper2ExtractsTypeableSelect({
  dataType: destDataType = 'string',
  id,
  disabled,
  isLoggable,
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
  const [srcDataType, setSrcDataType] = useState();
  const containerRef = useRef();
  const inputFieldRef = useRef();
  const [isTruncated, setIsTruncated] = useState(false);

  const handleChange = useCallback(event => {
    setInputValue(event.target.value);
  }, []);

  const handleFocus = useCallback(e => {
    e.stopPropagation();
    const { value } = e.target;

    e.target.setSelectionRange(value.length, value.length);
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (propValue !== inputValue) { onBlur(inputValue); }
  }, [propValue, inputValue, onBlur]);

  useOnClickOutside(containerRef, isFocused && handleBlur);
  useKeyboardShortcut(['Escape'], handleBlur, {ignoreBlacklist: true});

  const hideDropdown = isLookup || isHardCodedValue || isHandlebarExp;

  const handleMouseOver = useCallback(() => {
    setIsTruncated(inputFieldRef.current.offsetWidth < inputFieldRef.current.scrollWidth);
  }, []);

  return (
    <FormControl
      data-test={id}
      key={id}
      ref={containerRef}
      >
      <Tooltip
        disableFocusListener
        placement="bottom"
        title={(isFocused || (!isTruncated && !hideDropdown && inputValue)) ? '' : (
          <TooltipTitle
            isTruncated={isTruncated}
            inputValue={inputValue}
            hideDropdown={hideDropdown}
            isLookup={isLookup}
            isHardCodedValue={isHardCodedValue}
            isHandlebarExp={isHandlebarExp}
            fieldType="Source record field"
        />
        )} >

        <TextField
          {...isLoggableAttr(isLoggable)}
          onMouseMove={handleMouseOver}
          className={clsx(classes.customTextField, {[classes.textFieldWithDataType]: srcDataType})}
          variant="filled"
          autoFocus={isFocused}
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          disabled={disabled}
          multiline={isFocused}
          placeholder="Source record field"
          InputProps={{
            endAdornment: hideDropdown
              ? (<Typography variant="caption" className={classes.srcDataType}>{srcDataType}</Typography>)
              : (
                <InputAdornment className={classes.autoSuggestDropdown} position="start">
                  <Typography variant="caption" className={classes.srcDataType}>{srcDataType}</Typography>
                  <ArrowDownIcon />
                </InputAdornment>
              ),
            inputProps: {
              ref: inputFieldRef,
            },
          }}
   />
      </Tooltip >

      {/* only render tree component if its focussed and not disabled */}
      {isFocused && !disabled && !hideDropdown && (
      <ExtractsTree
        key={id}
        id={id}
        destDataType={destDataType}
        propValue={propValue}
        inputValue={inputValue}
        onBlur={onBlur}
        setInputValue={setInputValue}
        setIsFocused={setIsFocused}
        flowId={flowId}
        resourceId={importId}
        setSrcDataType={setSrcDataType} />
      )}

    </FormControl>
  );
}

