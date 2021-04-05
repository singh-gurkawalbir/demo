import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import { emptyObject } from '../../../../utils/constants';
import DynaEditor from '../DynaEditor';

export default function DynaLicenseEditor(props) {
  const { formKey, id, value } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!value || typeof value === 'object') {
      dispatch(actions.form.fieldChange(formKey)(id, emptyObject));
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));

      return;
    }
    try {
      JSON.parse(value);

      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));
    } catch (e) {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: false, errorMessages: 'Invalid Json format'}));
    }
  }, [id, dispatch, formKey, value]);

  // suspend force field state compuation once the component turns invisible
  useEffect(() => () => {
    dispatch(actions.form.clearForceFieldState(formKey)(id));
  }, [dispatch, formKey, id]);

  return (
    <DynaEditor
      {...props}
      skipJsonParse
    />
  );
}
