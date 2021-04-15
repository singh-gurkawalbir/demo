import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import { emptyObject } from '../../../../utils/constants';
import DynaEditor from '../DynaEditor';

export default function DynaLicenseEditor(props) {
  const { formKey, id, value, onFieldChange } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!value) {
      onFieldChange(id, emptyObject);
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));

      return;
    }
    if (typeof value === 'object') {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));

      return;
    }
    // try block is for all the string cases
    try {
      JSON.parse(value);

      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));
    } catch (e) {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: false, errorMessages: 'Invalid Json format'}));
    }
  }, [id, dispatch, formKey, value, onFieldChange]);

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
