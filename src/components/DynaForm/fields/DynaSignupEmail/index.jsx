import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import { EMAIL_REGEX } from '../../../../constants';
import messageStore, { message } from '../../../../utils/messageStore';
import DynaText from '../DynaText';

export default function DynaSignupEmail(props) {
  const dispatch = useDispatch();
  const { id, formKey, value } = props;
  const isValidEmail = EMAIL_REGEX.test(value);

  useEffect(() => {
    if (value) {
      if (isValidEmail) {
        dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));
      } else {
        dispatch(actions.form.forceFieldState(formKey)(id, {
          isValid: false,
          errorMessages: message.USER_SIGN_IN.INVALID_EMAIL,
        }));
      }

      return;
    }

    dispatch(actions.form.forceFieldState(formKey)(id, {
      isValid: false,
      errorMessages: messageStore('SIGNIN_REQUIRED', {label: 'Business email'}),
    }));
  }, [dispatch, formKey, id, isValidEmail, value]);

  // suspend force field state computation once the component turns invisible
  useEffect(() => () => {
    dispatch(actions.form.clearForceFieldState(formKey)(id));
  }, [dispatch, formKey, id]);

  return (
    <DynaText {...props} />
  );
}
