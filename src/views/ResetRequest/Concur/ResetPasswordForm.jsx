import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useCallback, useEffect} from 'react';
import { useParams, useHistory, Link} from 'react-router-dom';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { AUTH_FAILURE_MESSAGE } from '../../../constants';
import Spinner from '../../../components/Spinner';
import { FilledButton, TextButton } from '../../../components/Buttons';
import getRoutePath from '../../../utils/routePaths';
import ShowErrorMessage from '../../../components/ShowErrorMessage';
import LoginFormWrapper from '../../../components/LoginScreen/LoginFormWrapper';
import DynaPassword from '../../../components/DynaForm/fields/DynaPassword';

const useStyles = makeStyles(theme => ({
  submit: {
    color: theme.palette.warning.main,
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
    marginRight: theme.spacing(1),
  },
}));

export default function ResetPassword() {
  const {token} = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const [showError, setShowError] = useState(false);
  const [passwordVal, setPasswordVal] = useState('');
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

  const handleOnSubmit = useCallback(() => {
    if (!passwordVal) {
      setShowError(true);
    } else if (!showError) {
      handleResetPassword(passwordVal);
    }
  }, [handleResetPassword, passwordVal, showError]);

  const onFieldChange = (id, password) => {
    setPasswordVal(password);
  };

  return (
    <LoginFormWrapper>
      { error && (
      <ShowErrorMessage error={error} />
      )}
      <form onSubmit={handleOnSubmit} className={classes.setPasswordForm}>
        <DynaPassword onFieldChange={onFieldChange} />
        { isAuthenticating ? <Spinner />
          : (
            <FilledButton
              data-test="submit"
              type="submit"
              className={classes.submit}
              submit
              value="Submit">
              Save
            </FilledButton>
          )}
        <TextButton
          data-test="cancelResetPassword"
          className={classes.submit}
          submit
          to={getRoutePath('/signin')}
          component={Link}
          role="link"
          value="Cancel">
          Cancel
        </TextButton>
      </form>
    </LoginFormWrapper>
  );
}

