import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../../actions';
import { emptyObject } from '../../../../constants';
import { selectors } from '../../../../reducers';
import { isNewId } from '../../../../utils/resource';
import DynaEditor from '../DynaEditor';

export default function DynaLicenseEditor(props) {
  const { formKey, id, onFieldChange, resourceId, resourceType } = props;
  const dispatch = useDispatch();
  const isChildLicense = useSelector(state => {
    const resource = selectors.resourceData(state, resourceType, resourceId)?.merged || emptyObject;

    return resource.type === 'integrationAppChild';
  });

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

  useEffect(() => {
    // For a new child license form, the submit buttons should be enabled
    if (isChildLicense && isNewId(resourceId)) {
      dispatch(actions.form.forceFieldState(formKey)(id, {touched: true}));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
