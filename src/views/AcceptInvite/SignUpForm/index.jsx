import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useEffect, useMemo, useState} from 'react';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { emptyObject } from '../../../constants';
import getFieldMeta from './metadata';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../../components/DynaForm';
import DynaSubmit from '../../../components/DynaForm/DynaSubmit';
import LoginFormWrapper from '../../../components/LoginScreen/LoginFormWrapper';

const useStyles = makeStyles(theme => ({
  submit: {
    marginTop: theme.spacing(5),
  },
}));

const formKey = 'signupForm';
export default function SignUp() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [count, setCount] = useState(0);
  const {email, token, _csrf, skipPassword} = useSelector(state => selectors.acceptInviteData(state), shallowEqual) || emptyObject;

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
    </LoginFormWrapper>
  );
}

