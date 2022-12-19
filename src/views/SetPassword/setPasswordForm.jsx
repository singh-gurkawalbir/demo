import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useCallback, useRef, useEffect} from 'react';
import { Typography, InputAdornment} from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import actions from '../../actions';
import { selectors } from '../../reducers';
import { AUTH_FAILURE_MESSAGE, PASSWORD_STRENGTH_ERROR } from '../../constants';
import Spinner from '../../components/Spinner';
import { FilledButton, TextButton } from '../../components/Buttons';
import ShowContentIcon from '../../components/icons/ShowContentIcon';
import HideContentIcon from '../../components/icons/HideContentIcon';
import getRoutePath from '../../utils/routePaths';
import RawHtml from '../../components/RawHtml';
import ArrowPopper from '../../components/ArrowPopper';
import TooltipContent from '../../components/TooltipContent';
import CloseIcon from '../../components/icons/CloseIcon';
import CheckMarkIcon from '../../components/icons/CheckmarkIcon';

const useStyles = makeStyles(theme => ({
  submit: {
    width: '100%',
    borderRadius: 4,
    height: 38,
    fontSize: theme.spacing(2),
    marginTop: 30,
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
    minWidth: '100%',
    marginBottom: theme.spacing(1),
    position: 'relative',
  },
  alertMsg: {
    fontSize: 12,
    textAlign: 'left',
    marginLeft: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2),
    lineHeight: `${theme.spacing(2)}px`,
    '& > svg': {
      fill: theme.palette.error.main,
      fontSize: theme.spacing(2),
      marginRight: 5,
    },
  },
  forgotPass: {
    color: theme.palette.warning.main,
    textAlign: 'right',
    marginBottom: theme.spacing(3),
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
  /* Just to work css */
  arrowPopperPassword: {
    position: 'absolute',
    left: '450px !important',
    top: '200px !important',
  },
  passwordListItem: {
    display: 'flex',
    marginBottom: theme.spacing(1),
  },
  passwordListItemText: {

  },
  passwordListItemTextError: {
    color: theme.palette.error.dark,
  },
}));

export default function SetPassword() {
  const {token} = useParams();
  const inputFieldRef = useRef();
  const dispatch = useDispatch();
  const history = useHistory();
  //  const showError = false;
  const classes = useStyles();
  const [showErr, setShowErr] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const handleResetPassword = useCallback(password => {
    dispatch(actions.auth.setPasswordRequest(password, token));
  }, [dispatch, token]);
  const isSetPasswordStatus = useSelector(state => selectors.requestSetPasswordStatus(state));
  const showErrMsg = isSetPasswordStatus === 'failed';

  useEffect(() => {
    if (isSetPasswordStatus === 'success') {
      history.replace(getRoutePath('/signin'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSetPasswordStatus]);
  const isAuthenticating = isSetPasswordStatus === 'loading';
  const error = useSelector(state => {
    const errorMessage = selectors.requestSetPasswordError(state);

    if (errorMessage === AUTH_FAILURE_MESSAGE) {
      return 'Sign in failed. Please try again.';
    }

    return errorMessage;
  });
  const handleOnChangePassword = useCallback(e => {
    // setPassword(e.target.value);
    const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const regexTest = regex.test(e.target.value);

    if (!regexTest) {
      setShowErr(true);
    } else {
      setShowErr(false);
    }
  }, []);

  const handleOnSubmit = useCallback(e => {
    e.preventDefault();
    const password = e?.target?.password?.value || e?.target?.elements?.password?.value;

    if (!showErr) {
      handleResetPassword(password);
    }
  }, [handleResetPassword, showErr]);

  return (
    <div className={classes.editableFields}>
      { showErrMsg && error && (
      <Typography
        data-private
        color="error"
        component="div"
        variant="h5"
        className={classes.alertMsg}>
        <RawHtml html={error} />
      </Typography>
      )}
      <form onSubmit={handleOnSubmit}>
        <TextField
          data-private
          data-test="password"
          id="password"
          variant="outlined"
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          onChange={handleOnChangePassword}
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

        {/* Styling is little off will work once developed */}
        <ArrowPopper
          id="pageInfo"
          open
          anchorEl
          placement="right"
          classes={{ popper: classes.arrowPopperPassword }}
          preventOverflow>
          <TooltipContent className={classes.infoText}>
            <Typography className={clsx(classes.passwordListItem, classes.redText)}>To help protect your account, choose a password that you haven’t used before.</Typography>
            <Typography className={classes.passwordListItem} >Make sure your password:</Typography>
            <div className={classes.passwordListItem}>
              <CloseIcon className={clsx(classes.icon, classes.errorIcon)} />
              <Typography className={clsx(classes.passwordListItemText, {[classes.passwordListItemTextError]: true})}>Contains at least one capital letter</Typography>
            </div>
            <div className={classes.passwordListItem}>
              <CheckMarkIcon className={clsx(classes.icon, classes.successIcon)} />
              <Typography className={clsx(classes.passwordListItemText, {[classes.passwordListItemTextError]: false})}>Contains at least one number</Typography>
            </div>
            <div className={classes.passwordListItem}>
              <CheckMarkIcon className={clsx(classes.icon, classes.successIcon)} />
              <Typography className={clsx(classes.passwordListItemText, {[classes.passwordListItemTextError]: false})}>Is at least 10 characters long and not greater than 256 characters.</Typography>
            </div>
          </TooltipContent>
        </ArrowPopper>

        { showErr && (
          <Typography
            data-private
            color="error"
            component="div"
            variant="h5"
            className={classes.alertMsg}>
            {PASSWORD_STRENGTH_ERROR}
          </Typography>
        )}
        { isAuthenticating ? <Spinner />
          : (
            <FilledButton
              data-test="submit"
              type="submit"
              className={classes.submit}
              value="Submit">
              Save and sign in
            </FilledButton>
          )}
        <TextButton
          href="/signin"
          data-test="cancel"
          type="cancel"
          color="primary"
          className={classes.submit}
          value="Cancel">
          Cancel
        </TextButton>
      </form>
    </div>
  );
}

