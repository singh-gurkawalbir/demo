import React, { useCallback, useEffect, useRef, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { FormControl, FormLabel, TextField, InputAdornment, Typography } from '@mui/material';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { ArrowPopper } from '@celigo/fuse-ui';
import ShowContentIcon from '../../icons/ShowContentIcon';
import isLoggableAttr from '../../../utils/isLoggableAttr';
import CheckmarkIcon from '../../icons/CheckmarkIcon';
import CloseIcon from '../../icons/CloseIcon';
import HideContentIcon from '../../icons/HideContentIcon';
import TooltipContent from '../../TooltipContent';
import FieldMessage from './FieldMessage';
// import { validateMockResponseField } from '../../../utils/flowDebugger';
import actions from '../../../actions';
import messageStore from '../../../utils/messageStore';

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
        letterSpacing: '0.5px',
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
}));

export default function DynaPassword(props) {
  const { id, label, isLoggable, placeholder, value, formKey, onFieldChange, hidePasswordIcon } = props;
  const classes = useStyles();
  const inputFieldRef = useRef();
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const open = !!anchorEl;
  const [showPassword, setShowPassword] = useState(false);
  const [containDigits, setContainDigits] = useState(false);
  const [containCapitalLetter, setContainCapitalLetter] = useState(false);
  const [validLength, setValidLength] = useState(false);
  const isMobile = useMediaQuery(useTheme().breakpoints.down('md'));
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const handleOnChangePassword = useCallback(e => {
    const password = e.target.value;

    onFieldChange(id, password);
    setContainCapitalLetter(/[A-Z]/.test(password));
    setContainDigits(/\d/.test(password));
    setValidLength(password.length > 9 && password.length < 256);
  }, [id, onFieldChange]);

  useEffect(() => {
    if (!value) {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: false, errorMessages: messageStore('USER_SIGN_IN.SIGNIN_REQUIRED', {label: 'Password'})}));
    } else {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));
    }
  }, [dispatch, formKey, id, value]);
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
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder || 'Enter new password*'}
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

      {!hidePasswordIcon && !isMobile && (
      <>
        <ArrowPopper
          id="pageInfo"
          open={open}
          anchorEl={anchorEl}
          placement="right"
          preventOverflow>
          <TooltipContent className={classes.infoText}>
            <Typography className={classes.passwordListItem}>To help protect your account, choose a password that you haven’t used before.</Typography>
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
          <Typography className={classes.passwordListItem}>To help protect your account, choose a password that you haven’t used before.</Typography>
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
      </>
      )}
    </FormControl>
  );
}
