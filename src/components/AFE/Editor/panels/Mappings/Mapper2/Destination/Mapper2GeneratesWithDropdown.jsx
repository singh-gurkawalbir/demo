import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Divider, FormControl, InputAdornment, TextField, Tooltip } from '@material-ui/core';
import clsx from 'clsx';
import useKeyboardShortcut from '../../../../../../../hooks/useKeyboardShortcut';
import { MAPPING_DATA_TYPES } from '../../../../../../../utils/mapping';
import { TooltipTitle } from '../Source/Mapper2ExtractsTypeableSelect';
import DestinationDataType from './DestinationDataType';
import LockIcon from '../../../../../../icons/LockIcon';
import { selectors } from '../../../../../../../reducers';
import actions from '../../../../../../../actions';
import useScrollIntoView from '../../../../../../../hooks/useScrollIntoView';
import ArrowDownIcon from '../../../../../../icons/ArrowDownIcon';
import ArrowPopper from '../../../../../../ArrowPopper';
import DestinationTree from './DestinationTree';
import useDebouncedValue from '../../../../../../../hooks/useDebouncedInput';

const useStyles = makeStyles(theme => ({
  customTextField: {
    padding: 0,
    display: 'flex',
    width: '100%',
    '& > * .MuiFilledInput-input': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      paddingRight: theme.spacing(15),
    },
    '& .MuiFilledInput-multiline': {
      border: 'none',
    },
    '& .Mui-disabled': {
      '& .MuiFilledInput-input': {
        paddingRight: theme.spacing(16),
      },
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
  fieldDataType: {
    display: 'flex',
    alignItems: 'center',
    width: theme.spacing(9),
    marginLeft: theme.spacing(-13),
    justifyContent: 'end',
    zIndex: 1,
  },
  fieldDataTypeLocked: {
    marginLeft: theme.spacing(-17),
    '& .MuiButtonBase-root': {
      width: theme.spacing(12),
      justifyContent: 'end',
      color: theme.palette.text.hint,
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
    height: theme.spacing(3),
    margin: theme.spacing(0, 0.5),
  },
  extractPopperPaper: {
    boxShadow: 'none',
    borderRadius: 0,
    border: `1px solid ${theme.palette.secondary.lightest}`,
    '&:empty': {
      display: 'none',
    },
  },
  extractPopperArrow: {
    display: 'none',
  },
  extractListPopper: {
    width: theme.spacing(55),
    borderRadius: 0,
    top: '2px !important',
    border: 'none',
    marginLeft: theme.spacing(-2),
  },
  extractListPopperCompact: {
    width: theme.spacing(38),
    marginLeft: theme.spacing(-2),
  },
  arrowWithLockIcon: {
    right: theme.spacing(4),
    color: theme.palette.text.hint,
  },
}));

export default function Mapper2GeneratesWithDropdown(props) {
  const {
    dataType = MAPPING_DATA_TYPES.STRING,
    id,
    disabled,
    value: propValue = '',
    onBlur,
    nodeKey,
    isRequired,
    popperClassName,
    editorLayout,
  } = props;
  const dispatch = useDispatch();
  const newRowKey = useSelector(state => selectors.newRowKey(state));
  const classes = useStyles();
  const [isFocused, setIsFocused] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElDataType, setAnchorElDataType] = useState(null);
  const containerRef = useRef();
  const inputFieldRef = useRef();
  const [inputValue, setInputValue] = useDebouncedValue(propValue, value => {
    // do not dispatch action if the field is not clicked yet as there can be
    // multiple rows and it will unnecessarily dispatch actions slowing down the UI
    if (!isFocused) return;
    dispatch(actions.mapping.v2.patchDestinationFilter(value, propValue));
  });

  // run only at mount to bring focus in the new row
  useEffect(() => {
    if (newRowKey && id.includes(newRowKey)) {
      setIsFocused(true);
      dispatch(actions.mapping.v2.deleteNewRowKey());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isFocused) return;
    dispatch(actions.mapping.v2.makeFinalDestinationTree(nodeKey));
  }, [dispatch, isFocused, nodeKey]);

  useScrollIntoView(containerRef, nodeKey === newRowKey);

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

  const patchField = useCallback((propValue, newValue) => {
    // on blur, patch the destination tree with empty input so all values in the
    // dropdown will be visible
    // dispatch(actions.mapping.v2.patchDestinationFilter('', ''));
    if (propValue !== newValue) { onBlur(newValue); }
  }, [onBlur]);

  const handleBlur = useCallback(event => {
    // handleBlur gets called by ClickAwayListener inside ArrowPopper to close the dropdown
    // if a click was made outside the dropdown.
    // But we should not consider the input textarea as "outside the dropdown" and dropdown should not be closed
    // when input field is clicked, hence below condition is added
    if (event?.target?.id === `${nodeKey}-mapper2DestinationTextField`) return;

    setIsFocused(false);
    setAnchorEl(null);
    patchField(propValue, inputValue);
  }, [nodeKey, patchField, propValue, inputValue]);

  const handleMouseOver = useCallback(() => {
    setIsTruncated(inputFieldRef.current.offsetWidth < inputFieldRef.current.scrollWidth);
  }, []);

  // adding the anchorEl dependency becuase if data type is clicked,
  // we want to handle the blur function after the data type has been updated
  // Ref: IO-26909
  // useOnClickOutside(containerRef, !anchorEl && isFocused && handleBlur);
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
            id={`${nodeKey}-mapper2DestinationTextField`}
            isLoggable
            onMouseMove={handleMouseOver}
            className={classes.customTextField}
            variant="filled"
            autoFocus={isFocused}
            value={inputValue}
            onChange={handleChange}
            onFocus={handleFocus}
            disabled={disabled}
            multiline={isFocused}
            placeholder={disabled ? '' : 'Destination field'}
            InputProps={{
              endAdornment: (
                <InputAdornment className={clsx(classes.autoSuggestDropdown, {[classes.arrowWithLockIcon]: isRequired})} position="start" onClick={() => { setIsFocused(true); }}>
                  <ArrowDownIcon />
                </InputAdornment>
              ),
              inputProps: {
                ref: inputFieldRef,
              },
            }}
          />
        </Tooltip >
        <div className={clsx(classes.fieldDataType, {[classes.fieldDataTypeLocked]: isRequired})}>
          <DestinationDataType
            anchorEl={anchorElDataType}
            setAnchorEl={setAnchorElDataType}
            handleBlur={handleBlur}
            dataType={dataType}
            disabled={disabled}
            nodeKey={nodeKey} />
          <Divider className={classes.divider} orientation="vertical" />
        </div>
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
      {/* only render tree component if field is focussed and not disabled.
      Here we are wrapping tree component with ArrowPopper to correctly handle the
      dropdown placement logic
      */}

      <ArrowPopper
        placement="bottom-start"
        id="destiationPopper"
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
        {isFocused && !disabled && (
          <DestinationTree
            nodeKey={nodeKey}
            destDataType={dataType}
            propValue={propValue}
            setIsFocused={setIsFocused}
          />
        )}
      </ArrowPopper>
    </FormControl>
  );
}

