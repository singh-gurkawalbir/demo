import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import { EMAIL_REGEX } from '../../../../constants';
import errorMessageStore from '../../../../utils/errorStore';
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
          errorMessages: 'Please enter a valid email address.',
        }));
      }

      return;
    }

    dispatch(actions.form.forceFieldState(formKey)(id, {
      isValid: false,
      errorMessages: errorMessageStore('SIGN_UP_EMAIL'),
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
