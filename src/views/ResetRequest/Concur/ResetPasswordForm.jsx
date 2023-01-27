import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useCallback, useRef, useEffect} from 'react';
import { Typography, InputAdornment} from '@material-ui/core';
import { useParams, useHistory, Link} from 'react-router-dom';
import clsx from 'clsx';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { AUTH_FAILURE_MESSAGE } from '../../../constants';
import Spinner from '../../../components/Spinner';
import { FilledButton, TextButton } from '../../../components/Buttons';
import ShowContentIcon from '../../../components/icons/ShowContentIcon';
import HideContentIcon from '../../../components/icons/HideContentIcon';
import getRoutePath from '../../../utils/routePaths';
import ArrowPopper from '../../../components/ArrowPopper';
import TooltipContent from '../../../components/TooltipContent';
import CheckmarkIcon from '../../../components/icons/CheckmarkIcon';
import CloseIcon from '../../../components/icons/CloseIcon';

const useStyles = makeStyles(theme => ({
  submit: {
    width: '100%',
    borderRadius: 4,
    height: 38,
    fontSize: theme.spacing(2),
    marginTop: theme.spacing(1),
    color: theme.palette.warning.main,
  },
  editableFields: {
    textAlign: 'center',
    width: '100%',
    maxWidth: 500,
    marginBottom: 112,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
    },
  },
  textField: {
    width: '100%',
    background: theme.palette.background.paper,
    marginBottom: 10,
  },
  alertMsg: {
    fontSize: 12,
    textAlign: 'left',
    marginLeft: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: theme.spacing(0),
    marginBottom: 0,
    lineHeight: `${theme.spacing(2)}px`,
    '& > svg': {
      fill: theme.palette.error.main,
      fontSize: theme.spacing(2),
      marginRight: 5,
    },
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
  forgotPass: {
    color: theme.palette.warning.main,
    textAlign: 'right',
    marginBottom: theme.spacing(3),
  },
  setPasswordForm: {
    position: 'relative',
  },
  arrowPopperPassword: {
    position: 'absolute',
    left: '50px !important',
    top: '0px !important',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  passwordStrongSteps: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  passwordListItem: {
    display: 'flex',
    marginBottom: theme.spacing(1),
  },
  passwordListItemTextError: {
    color: theme.palette.error.dark,
  },
  iconPassword: {
    cursor: 'pointer',
  },
}));

export default function ResetPassword() {
  const {token} = useParams();
  const inputFieldRef = useRef();
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const [showErr, setShowErr] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [containDigits, setContainDigits] = useState(false);
  const [containCapitalLetter, setContainCapitalLetter] = useState(false);
  const [validLength, setValidLength] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = !!anchorEl;
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const handleResetPassword = useCallback(password => {
    dispatch(actions.auth.resetPasswordRequest(password, token));
  }, [dispatch, token]);
  const isSetPasswordCompleted = useSelector(state => selectors.requestResetPasswordStatus(state) === 'success');

  useEffect(() => {
    if (isSetPasswordCompleted) {
      history.replace(getRoutePath('/signin'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSetPasswordCompleted]);
  const isAuthenticating = useSelector(state => selectors.isAuthenticating(state));
  const error = useSelector(state => {
    const errorMessage = selectors.requestResetPasswordError(state);

    if (errorMessage === AUTH_FAILURE_MESSAGE) {
      return 'Sign in failed. Please try again.';
    }
    if (window.signInError) {
      return window.signInError;
    }

    return errorMessage;
  });

  const handleFocusIn = e => {
    setAnchorEl(e.currentTarget);
  };
  const handleFocusOut = () => {
    setAnchorEl(null);
  };

  const handleOnChangePassword = useCallback(e => {
    const password = e.target.value;
    const isValid = /[A-Z]/.test(password) && /\d/.test(password) && password.length > 9 && password.length < 256;

    setContainCapitalLetter(/[A-Z]/.test(password));
    setContainDigits(/\d/.test(password));
    setValidLength(password.length > 9 && password.length < 256);
    setShowErr(!isValid);
  }, []);

  const handleOnSubmit = useCallback(e => {
    e.preventDefault();
    const password = e?.target?.password?.value || e?.target?.elements?.password?.value;

    handleResetPassword(password);
  }, [handleResetPassword]);

  return (
    <div className={classes.editableFields}>
      { error && (
      <Typography
        data-private
        color="error"
        component="div"
        variant="h5"
        className={classes.alertMsg}>
        {error}
      </Typography>
      )}
      <form onSubmit={handleOnSubmit} className={classes.setPasswordForm}>
        <TextField
          data-private
          data-test="password"
          id="password"
          variant="filled"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter new password*"
          onChange={handleOnChangePassword}
          onFocus={handleFocusIn}
          onBlur={handleFocusOut}
          className={classes.textField}
          InputProps={{
            endAdornment: (true) &&
              (
                <InputAdornment position="end">
                    {showPassword ? (
                      <ShowContentIcon
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword} />
                    )
                      : (
                        <HideContentIcon
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword} />
                      )}

                </InputAdornment>
              ),
            ref: inputFieldRef,
          }}
            />
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
        { isAuthenticating ? <Spinner />
          : (
            <FilledButton
              data-test="submit"
              type="submit"
              className={classes.submit}
              value="Submit">
              Save
            </FilledButton>
          )}
        <TextButton
          data-test="cancelResetPassword"
          className={classes.submit}
          to={getRoutePath('/signin')}
          component={Link}
          role="link"
          value="Cancel">
          Cancel
        </TextButton>
      </form>
    </div>
  );
}

