import React, { useCallback, useEffect, useRef, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { FormControl, FormLabel, TextField, InputAdornment, Typography } from '@mui/material';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import ShowContentIcon from '../../icons/ShowContentIcon';
import isLoggableAttr from '../../../utils/isLoggableAttr';
import CheckmarkIcon from '../../icons/CheckmarkIcon';
import CloseIcon from '../../icons/CloseIcon';
import HideContentIcon from '../../icons/HideContentIcon';
import TooltipContent from '../../TooltipContent';
import ArrowPopper from '../../ArrowPopper';
import FieldMessage from './FieldMessage';
// import { validateMockResponseField } from '../../../utils/flowDebugger';
import actions from '../../../actions';

const useStyles = makeStyles(theme => ({
  formWrapper: {
    alignItems: 'flex-start',
    display: 'flex',
  },
  textField: {
    width: '100%',
    background: theme.palette.background.paper,
    border: `1px solid ${theme.palette.secondary.lightest}`,
    paddingRight: theme.spacing(1),
    '& > div': {
      '& >.MuiFilledInput-input': {
        border: 'none',
      },
    },
  },
  fieldWrapper: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
  },
  field: {
    width: '100%',
  },

  redText: {
    color: theme.palette.error.dark,
  },
  icon: {
    border: '1px solid',
    borderRadius: '50%',
    fontSize: 18,
    marginRight: theme.spacing(0.5),
  },
  successIcon: {
    color: theme.palette.success.main,
    borderColor: theme.palette.success.main,
  },
  errorIcon: {
    color: theme.palette.error.dark,
    borderColor: theme.palette.error.dark,
  },
  arrowPopperPassword: {
    position: 'absolute',
    left: '50px !important',
    top: '0px !important',
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  passwordStrongSteps: {
    marginTop: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  passwordListItem: {
    display: 'flex',
    marginBottom: theme.spacing(1),
  },
  setPasswordForm: {
    position: 'relative',
  },
  passwordListItemTextError: {
    color: theme.palette.error.dark,
  },
  iconPassword: {
    cursor: 'pointer',
  },
  forgotPass: {
    color: theme.palette.warning.main,
    textAlign: 'right',
    marginBottom: theme.spacing(3),
  },

}));

export default function DynaPassword(props) {
  const { id, label, isLoggable, placeholder, value, errorMessage, formKey, onFieldChange } = props;
  const classes = useStyles();
  const inputFieldRef = useRef();
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const open = !!anchorEl;
  const [showErr, setShowErr] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [containDigits, setContainDigits] = useState(false);
  const [containCapitalLetter, setContainCapitalLetter] = useState(false);
  const [validLength, setValidLength] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const handleOnChangePassword = useCallback(e => {
    const password = e.target.value;
    const isValid = /[A-Z]/.test(password) && /\d/.test(password) && password.length > 9 && password.length < 256;

    onFieldChange(id, password);
    setContainCapitalLetter(/[A-Z]/.test(password));
    setContainDigits(/\d/.test(password));
    setValidLength(password.length > 9 && password.length < 256);
    setShowErr(!isValid);
  }, [id, onFieldChange]);

  useEffect(() => {
    if (!value) {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: false, errorMessages: errorMessage}));
    } else {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));
    }
  }, [dispatch, errorMessage, formKey, id, value]);
  // const handleResetPassword = useCallback(password => {
  //   dispatch(actions.auth.resetPasswordRequest(password, token));
  // }, [dispatch, token]);

  const handleFocusIn = e => {
    setAnchorEl(e.currentTarget);
  };
  const handleFocusOut = () => {
    setAnchorEl(null);
  };

  return (
    <FormControl variant="standard" className={classes.field}>
      <div className={classes.formWrapper}>
        <FormLabel htmlFor={id}>{label}</FormLabel>
      </div>
      <div className={classes.fieldWrapper}>
        <TextField
          {...isLoggableAttr(isLoggable)}
          id={id}
          data-test="password"
          required
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          className={classes.textField}
          onChange={handleOnChangePassword}
          variant="filled"
          onFocus={handleFocusIn}
          onBlur={handleFocusOut}
          InputProps={{
            endAdornment: (true) &&
              (
                <InputAdornment position="end">
                    {showPassword ? (
                      <ShowContentIcon
                        onClick={handleClickShowPassword}
                        className={classes.iconPassword}
                        onMouseDown={handleMouseDownPassword} />
                    )
                      : (
                        <HideContentIcon
                          className={classes.iconPassword}
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword} />
                      )}

                </InputAdornment>
              ),
            ref: inputFieldRef,
          }} />
        <FieldMessage {...props} />

      </div>
      <ArrowPopper
        id="pageInfo"
        open={open}
        anchorEl={anchorEl}
        placement="right"
        classes={{ popper: classes.arrowPopperPassword }}
        preventOverflow>
        <TooltipContent className={classes.infoText}>
          <Typography className={clsx(classes.passwordListItem, {[classes.redText]: showErr})}>To help protect your account, choose a password that you haven’t used before.</Typography>
          <Typography className={classes.passwordListItem} >Make sure your password:</Typography>
          <div className={classes.passwordListItem}>
            {containCapitalLetter ? <CheckmarkIcon className={clsx(classes.icon, classes.successIcon)} />
              : <CloseIcon className={clsx(classes.icon, classes.errorIcon)} />}
            <Typography className={clsx(classes.passwordListItemText, {[classes.passwordListItemTextError]: !containCapitalLetter})}>Contains at least one capital letter</Typography>
          </div>
          <div className={classes.passwordListItem}>
            {containDigits ? <CheckmarkIcon className={clsx(classes.icon, classes.successIcon)} />
              : <CloseIcon className={clsx(classes.icon, classes.errorIcon)} />}
            <Typography className={clsx(classes.passwordListItemText, {[classes.passwordListItemTextError]: !containDigits})}>Contains at least one number</Typography>
          </div>
          <div className={classes.passwordListItem}>
            {validLength ? <CheckmarkIcon className={clsx(classes.icon, classes.successIcon)} />
              : <CloseIcon className={clsx(classes.icon, classes.errorIcon)} />}
            <Typography className={clsx(classes.passwordListItemText, {[classes.passwordListItemTextError]: !validLength})}>Is at least 10 characters long and not greater than 256 characters.</Typography>
          </div>
        </TooltipContent>
      </ArrowPopper>

      <div className={classes.passwordStrongSteps}>
        <Typography className={clsx(classes.passwordListItem, {[classes.redText]: showErr})}>To help protect your account, choose a password that you haven’t used before.</Typography>
        <Typography className={classes.passwordListItem} >Make sure your password:</Typography>
        <div className={classes.passwordListItem}>
          {containCapitalLetter ? <CheckmarkIcon className={clsx(classes.icon, classes.successIcon)} />
            : <CloseIcon className={clsx(classes.icon, classes.errorIcon)} />}
          <Typography className={clsx(classes.passwordListItemText, {[classes.passwordListItemTextError]: !containCapitalLetter})}>Contains at least one capital letter</Typography>
        </div>
        <div className={classes.passwordListItem}>
          {containDigits ? <CheckmarkIcon className={clsx(classes.icon, classes.successIcon)} />
            : <CloseIcon className={clsx(classes.icon, classes.errorIcon)} />}
          <Typography className={clsx(classes.passwordListItemText, {[classes.passwordListItemTextError]: !containDigits})}>Contains at least one number</Typography>
        </div>
        <div className={classes.passwordListItem}>
          {validLength ? <CheckmarkIcon className={clsx(classes.icon, classes.successIcon)} />
            : <CloseIcon className={clsx(classes.icon, classes.errorIcon)} />}
          <Typography className={clsx(classes.passwordListItemText, {[classes.passwordListItemTextError]: !validLength})}>Is at least 10 characters long and not greater than 256 characters.</Typography>
        </div>
      </div>
    </FormControl>
  );
}
