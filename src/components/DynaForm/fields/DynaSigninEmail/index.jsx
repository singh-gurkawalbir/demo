import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import { EMAIL_REGEX } from '../../../../constants';
import messageStore, { message } from '../../../../utils/messageStore';
import DynaText from '../DynaText';

export default function DynaSigninEmail(props) {
  const dispatch = useDispatch();
  const { id, formKey, value, errorMessage } = props;
  const isValidEmail = EMAIL_REGEX.test(value);

  useEffect(() => {
    if (value && isValidEmail) {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));
    }
    if (!value) {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: false, errorMessages: messageStore('USER_SIGN_IN.SIGNIN_REQUIRED', {label: 'Email'})}));
    }
    if (value && !isValidEmail) {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: false, errorMessages: message.USER_SIGN_IN.INVALID_EMAIL}));
    }
  }, [dispatch, errorMessage, formKey, id, isValidEmail, value]);

  // suspend force field state computation once the component turns invisible
  useEffect(() => () => {
    dispatch(actions.form.clearForceFieldState(formKey)(id));
  }, [dispatch, formKey, id]);

  return (
    <DynaText {...props} />
  );
}
