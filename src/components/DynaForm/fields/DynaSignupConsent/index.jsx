import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import errorMessageStore from '../../../../utils/errorStore';
import DynaCheckbox from '../checkbox/DynaCheckbox';

export default function DynaSignupConsent(props) {
  const dispatch = useDispatch();
  const { id, formKey, value } = props;
  const label = () => (
    <div>
      I agree to the&nbsp;
      <a
        href="https://www.celigo.com/terms-of-service/"
        target="_blank"
        rel="noreferrer"
      >
        Terms of Service,&nbsp;
      </a>
      <a
        href="https://www.celigo.com/privacy/"
        target="_blank"
        rel="noreferrer"
      >
        Privacy Policy
      </a>
      &nbsp;and the&nbsp;
      <a
        href="https://www.celigo.com/agreements/ssa-2019-03/"
        target="_blank"
        rel="noreferrer"
      >
        Service Subscription Agreement.
      </a>
    </div>
  );

  useEffect(() => {
    if (value) {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: value}));

      return;
    }

    dispatch(actions.form.forceFieldState(formKey)(id, {
      isValid: false,
      errorMessages: errorMessageStore('SIGN_UP_CONSENT'),
    }));
  }, [dispatch, formKey, id, value]);

  // suspend force field state computation once the component turns invisible
  useEffect(() => () => {
    dispatch(actions.form.clearForceFieldState(formKey)(id));
  }, [dispatch, formKey, id]);

  return (
    <DynaCheckbox
      {...props}
      label={label()} />
  );
}
