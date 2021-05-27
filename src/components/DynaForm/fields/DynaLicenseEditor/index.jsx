import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import { emptyObject } from '../../../../utils/constants';
import DynaEditor from '../DynaEditor';

export default function DynaLicenseEditor(props) {
  const { formKey, id, onFieldChange } = props;
  const dispatch = useDispatch();

  const customHandleUpdate = useCallback(editorVal => {
    if (!editorVal) {
      onFieldChange(id, emptyObject);
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));

      return;
    }

    // try block is for all the string cases
    try {
      const val = JSON.parse(editorVal);

      if (typeof val === 'string') {
        dispatch(actions.form.forceFieldState(formKey)(id, {isValid: false, errorMessages: 'Invalid Json format'}));
      } else {
        dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));
      }
    } catch (e) {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: false, errorMessages: 'Invalid Json format'}));
    }
    onFieldChange(id, editorVal);
  }, [dispatch, formKey, id, onFieldChange]);

  // suspend force field state compuation once the component turns invisible
  useEffect(() => () => {
    dispatch(actions.form.clearForceFieldState(formKey)(id));
  }, [dispatch, formKey, id]);

  return (
    <DynaEditor
      {...props}
      skipJsonParse
      customHandleUpdate={customHandleUpdate}
    />
  );
}
