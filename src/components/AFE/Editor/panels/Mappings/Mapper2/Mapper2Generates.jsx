import React, { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, TextField, Tooltip, MenuItem } from '@material-ui/core';
import isLoggableAttr from '../../../../../../utils/isLoggableAttr';
import useOnClickOutside from '../../../../../../hooks/useClickOutSide';
import useKeyboardShortcut from '../../../../../../hooks/useKeyboardShortcut';
import CeligoSelect from '../../../../../CeligoSelect';
import { DATA_TYPES_OPTIONS } from '../../../../../../utils/mapping';

const useStyles = makeStyles(theme => ({
  customTextField: {
    padding: 0,
    display: 'flex',
    // marginBottom: 0,
    // '&>.MuiFormControl-root': {
    //   width: '100%',
    // },
    // '&>.MuiInputBase-root': {
    //   marginLeft: '-104px',
    // },
    '& > .MuiFilledInput-multiline': {
      minHeight: 38,
      padding: theme.spacing(1),
      '& >:nth-child(1)': {
        margin: 0,
        minWidth: 0,
        maxWidth: '85%',
        paddingTop: theme.spacing(0.5),
      },
      '& >:nth-child(2)': {
        minHeight: '16px !important',
        wordBreak: 'break-word',
      },
    },
    '& > div': {
      width: '100%',
    },
    '& > * .MuiFilledInput-input': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  //   textLabel: {
  //     background: theme.palette.background.paper,
  //     border: `1px solid ${theme.palette.secondary.lightest}`,
  //     borderRadius: 2,
  //   },
  mapField: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    // width: '40%',
    alignItems: 'center',
  },
  dataType: {
    border: 'none',
    backgroundColor: 'transparent',
    fontStyle: 'italic',
    color: theme.palette.primary.main,
    width: 100,
    marginLeft: theme.spacing(1),
    zIndex: theme.zIndex.drawer,
    '& .MuiSvgIcon-root': {
      display: 'none',
    },
    '& .MuiSelect-selectMenu': {
      paddingRight: 12,
    },
  },
})
);

export default function Mapper2Generates(props) {
  const {
    dataType: destDataType = 'string',
    id,
    disabled,
    isLoggable,
    value: propValue = '',
    onDataTypeChange,
    onBlur,
  } = props;
  const classes = useStyles();
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(propValue);
  const containerRef = useRef();

  const handleChange = event => {
    setInputValue(event.target.value);
  };

  const handleFocus = e => {
    e.stopPropagation();
    const { value } = e.target;

    e.target.setSelectionRange(value.length, value.length);
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur(inputValue);
  };

  useOnClickOutside(containerRef, isFocused && handleBlur);
  useKeyboardShortcut(['Escape'], handleBlur, {ignoreBlacklist: true});

  // todo ashu only show tooltip when length is big
  // eslint-disable-next-line no-nested-ternary
  const toolTipTitle = isFocused ? '' : (!inputValue ? 'Destination record field' : inputValue);

  return (
    <FormControl
      data-test={id}
      key={id}
      ref={containerRef}
      >
      <div
        className={classes.mapField}>
        <Tooltip disableFocusListener title={toolTipTitle} placement="bottom" >
          <TextField
            {...isLoggableAttr(isLoggable)}
            className={classes.customTextField}
            variant="filled"
            autoFocus={isFocused}
            value={inputValue}
            onChange={handleChange}
            onFocus={handleFocus}
            disabled={disabled}
            multiline={isFocused}
            placeholder="Destination record field"
   />
        </Tooltip >
        <CeligoSelect
          disabled={disabled}
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
      </div>
    </FormControl>
  );
}

