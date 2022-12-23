import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useCallback, useRef, useEffect} from 'react';
import { Typography, InputAdornment} from '@material-ui/core';
import { useParams, useHistory} from 'react-router-dom';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { AUTH_FAILURE_MESSAGE, PASSWORD_STRENGTH_ERROR } from '../../../constants';
import Spinner from '../../../components/Spinner';
import { FilledButton, TextButton } from '../../../components/Buttons';
import ShowContentIcon from '../../../components/icons/ShowContentIcon';
import HideContentIcon from '../../../components/icons/HideContentIcon';
import getRoutePath from '../../../utils/routePaths';

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
  forgotPass: {
    color: theme.palette.warning.main,
    textAlign: 'right',
    marginBottom: theme.spacing(3),
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

  const handleOnChangePassword = useCallback(e => {
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
      <form onSubmit={handleOnSubmit}>
        <TextField
          data-private
          data-test="password"
          id="password"
          variant="filled"
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
              Save
            </FilledButton>
          )}
        <TextButton
          href="/signin"
          data-test="cancel"
          type="cancel"
          className={classes.submit}
          value="Cancel">
          Cancel
        </TextButton>
      </form>
    </div>
  );
}

