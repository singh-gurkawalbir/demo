import React, { useState, useRef, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, TextField, Tooltip, MenuItem } from '@material-ui/core';
import isLoggableAttr from '../../../../../../../utils/isLoggableAttr';
import useOnClickOutside from '../../../../../../../hooks/useClickOutSide';
import useKeyboardShortcut from '../../../../../../../hooks/useKeyboardShortcut';
import CeligoSelect from '../../../../../../CeligoSelect';
import { DATA_TYPES_OPTIONS } from '../../../../../../../utils/mapping';
import { TooltipTitle } from '../Source/Mapper2ExtractsTypeableSelect';

const useStyles = makeStyles(theme => ({
  customTextField: {
    padding: 0,
    display: 'flex',
    width: '100%',
    '& > * .MuiFilledInput-input': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    '& .MuiFilledInput-multiline': {
      border: 'none',
    },
  },
  mapField: {
    display: 'flex',
    position: 'relative',
    width: theme.spacing(34),
    alignItems: 'center',
    borderRadius: 2,
    border: `1px solid ${theme.palette.secondary.lightest}`,
    backgroundColor: theme.palette.background.paper,
    '& .MuiFilledInput-input': {
      border: 'none',
    },
    '&:hover': {
      border: `1px solid ${theme.palette.primary.main}`,
    },
  },
  dataType: {
    border: 'none',
    fontStyle: 'italic',
    color: theme.palette.primary.main,
    width: theme.spacing(12),
    padding: 0,
    '& .MuiSvgIcon-root': {
      display: 'none',
    },
    '& .MuiSelect-selectMenu': {
      padding: 0,
      margin: 0,
    },
  },
})
);

export default function Mapper2Generates(props) {
  const {
    dataType: destDataType = 'string',
    id,
    disabled,
    generateDisabled,
    isLoggable,
    value: propValue = '',
    onDataTypeChange,
    onBlur,
  } = props;
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

    e.target.setSelectionRange(value.length, value.length);
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (propValue !== inputValue) { onBlur(inputValue); }
  }, [propValue, inputValue, onBlur]);

  const handleMouseOver = useCallback(() => {
    setIsTruncated(inputFieldRef.current.offsetWidth < inputFieldRef.current.scrollWidth);
  }, []);

  useOnClickOutside(containerRef, isFocused && handleBlur);
  useKeyboardShortcut(['Escape'], handleBlur, {ignoreBlacklist: true});

  const isDisabled = generateDisabled || disabled;

  return (
    <FormControl
      data-test={id}
      key={id}
      ref={containerRef} >
      <div
        className={classes.mapField}>
        <Tooltip
          disableFocusListener
          placement="bottom"
          title={(isFocused || generateDisabled || (!isTruncated && inputValue)) ? '' : (
            <TooltipTitle
              isTruncated={isTruncated}
              inputValue={inputValue}
              fieldType="Destination record field"
              />
          )} >
          <TextField
            {...isLoggableAttr(isLoggable)}
            onMouseMove={handleMouseOver}
            inputProps={{
              ref: inputFieldRef,
            }}
            className={classes.customTextField}
            variant="filled"
            autoFocus={isFocused}
            value={inputValue}
            onChange={handleChange}
            onFocus={handleFocus}
            disabled={isDisabled}
            multiline={isFocused}
            placeholder={generateDisabled ? '' : 'Destination record field'} />
        </Tooltip >

        {/* todo ashu tooltip does not work for celigo select */}
        <Tooltip
          disableFocusListener
          title={`Data type:${destDataType} - Click to change`}
          placement="bottom" >
          <CeligoSelect
            disabled={isDisabled}
            className={classes.dataType}
            onChange={onDataTypeChange}
            displayEmpty
            value={destDataType} >
            {DATA_TYPES_OPTIONS.map(opt => (
              <MenuItem key={opt.id} value={opt.id}>
                {opt.label}
              </MenuItem>
            ))}
          </CeligoSelect>
        </Tooltip>
      </div>
    </FormControl>
  );
}

