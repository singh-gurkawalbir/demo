import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Typography} from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo, useState} from 'react';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { emptyObject } from '../../../constants';
import getFieldMeta from './metadata';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../../components/DynaForm';
import DynaSubmit from '../../../components/DynaForm/DynaSubmit';
import getRoutePath from '../../../utils/routePaths';
import { OutlinedButton } from '../../../components/Buttons';
import LoginFormWrapper from '../../../components/LoginScreen/LoginFormWrapper';
import { isGoogleSignInAllowed } from '../../../utils/resource';

const useStyles = makeStyles(theme => ({
  submit: {
    marginTop: theme.spacing(5),
  },
  or: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    margin: theme.spacing(2, 0),
    '&:before': {
      content: '""',
      width: '40%',
      borderTop: '1px solid',
      borderColor: theme.palette.secondary.lightest,
    },
    '&:after': {
      content: '""',
      width: '40%',
      borderTop: '1px solid',
      borderColor: theme.palette.secondary.lightest,
    },
  },
}));

const formKey = 'signupForm';
export default function SignUp() {
  const dispatch = useDispatch();
  const location = useLocation();
  const classes = useStyles();
  const [count, setCount] = useState(0);
  const {email, token, _csrf, skipPassword} = useSelector(state => selectors.acceptInviteData(state), shallowEqual) || emptyObject;
  const attemptedRoute = location.state?.attemptedRoute;

  const handleSignUpWithGoogle = useCallback(e => {
    e.preventDefault();
    dispatch(actions.auth.signUpWithGoogle(e?.target?.attemptedRoute?.value || e?.target?.elements?.attemptedRoute?.value), {});
  }, [dispatch]);

  const handleOnSubmit = useCallback(values => {
    dispatch(actions.auth.acceptInvite.submit(values));
  }, [dispatch]);

  const fieldMeta = useMemo(() => getFieldMeta({email, token, _csrf, skipPassword}), [email, token, _csrf, skipPassword]);

  useEffect(() => {
    setCount(count => count + 1);
  }, [email, token, _csrf]);

  useFormInitWithPermissions({formKey, fieldMeta, remount: count});

  return (
    <LoginFormWrapper>
      <DynaForm formKey={formKey} />
      <DynaSubmit
        className={classes.submit}
        submit
        formKey={formKey}
        fullWidth
        onClick={handleOnSubmit}
        ignoreFormTouchedCheck>
        Sign up
      </DynaSubmit>
      {
        isGoogleSignInAllowed() && (
          <form onSubmit={handleSignUpWithGoogle}>
            <TextField
              data-private
              type="hidden"
              id="attemptedRoute"
              name="attemptedRoute"
              value={attemptedRoute || getRoutePath('/')}
                />
            <div className={classes.or}>
              <Typography variant="body1">or</Typography>
            </div>
            <OutlinedButton
              type="submit"
              color="secondary"
              googleBtn>
              Sign up with Google
            </OutlinedButton>
          </form>

        )
}
    </LoginFormWrapper>
  );
}

