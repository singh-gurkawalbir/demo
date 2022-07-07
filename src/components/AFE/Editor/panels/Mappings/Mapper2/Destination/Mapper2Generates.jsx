import React, { useState, useRef, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, TextField, Tooltip } from '@material-ui/core';
import clsx from 'clsx';
import useOnClickOutside from '../../../../../../../hooks/useClickOutSide';
import useKeyboardShortcut from '../../../../../../../hooks/useKeyboardShortcut';
import { MAPPING_DATA_TYPES } from '../../../../../../../utils/mapping';
import { TooltipTitle } from '../Source/Mapper2ExtractsTypeableSelect';
import DestinationDataType from './DestinationDataType';
import LockIcon from '../../../../../../icons/LockIcon';

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
    alignItems: 'center',
    borderRadius: 2,
    border: `1px solid ${theme.palette.secondary.lightest}`,
    backgroundColor: theme.palette.background.paper,
    '& .MuiFilledInput-input': {
      border: 'none',
      paddingRight: 0,
    },
    '&:hover': {
      border: `1px solid ${theme.palette.primary.main}`,
    },
  },
  lockIcon: {
    position: 'absolute',
    right: theme.spacing(1),
    top: '50%',
    transform: 'translateY(-50%)',
    color: theme.palette.text.hint,
    height: theme.spacing(3),
  },
  fieldDataTypeLocked: {
    '& .MuiButtonBase-root': {
      width: theme.spacing(12),
      justifyContent: 'end',
      paddingRight: theme.spacing(4.5),
      color: theme.palette.text.hint,
    },
  },
}));

export default function Mapper2Generates(props) {
  const {
    dataType = MAPPING_DATA_TYPES.STRING,
    id,
    disabled,
    value: propValue = '',
    onBlur,
    nodeKey,
    isRequired,
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

    // this is required to get the input field offsets during handleMouseOver
    // to show the tooltip accordingly
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
          title={(isFocused || !inputValue) ? '' : (
            <TooltipTitle
              isTruncated={isTruncated}
              inputValue={inputValue}
              fieldType="Destination field"
              />
          )} >
          <TextField
            isLoggable
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
            disabled={disabled}
            multiline={isFocused}
            placeholder={disabled ? '' : 'Destination field'} />
        </Tooltip >

        <DestinationDataType
          dataType={dataType}
          disabled={disabled}
          nodeKey={nodeKey}
          className={clsx({[classes.fieldDataTypeLocked]: isRequired})}
        />

        {isRequired && (
          <Tooltip
            title="This field is required by the application you are importing into"
            placement="bottom">
            <span className={classes.lockIcon}>
              <LockIcon />
            </span>
          </Tooltip>
        )}

      </div>
    </FormControl>
  );
}

