import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import { FULL_NAME_WITH_TWO_WORDS } from '../../../../constants';
import messageStore, { message } from '../../../../utils/messageStore';
import DynaText from '../DynaText';

export default function DynaSignupName(props) {
  const dispatch = useDispatch();
  const { id, formKey, value } = props;
  const isValidName = FULL_NAME_WITH_TWO_WORDS.test(value);

  useEffect(() => {
    if (value) {
      if (isValidName) {
        dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));
      } else {
        dispatch(actions.form.forceFieldState(formKey)(id, {
          isValid: false,
          errorMessages: message.USER_SIGN_IN.INVALID_FIRST_LAST_NAME,
        }));
      }

      return;
    }

    dispatch(actions.form.forceFieldState(formKey)(id, {
      isValid: false,
      errorMessages: messageStore('USER_SIGN_IN.SIGNIN_REQUIRED', {label: 'Name'}),
    }));
  }, [dispatch, formKey, id, isValidName, value]);

  // suspend force field state computation once the component turns invisible
  useEffect(() => () => {
    dispatch(actions.form.clearForceFieldState(formKey)(id));
  }, [dispatch, formKey, id]);

  return (
    <DynaText {...props} />
  );
}
