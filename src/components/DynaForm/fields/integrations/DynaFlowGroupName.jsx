import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import { useSelectorMemo } from '../../../../hooks';
import { selectors } from '../../../../reducers';
import DynaText from '../DynaText';

export default function TextFieldWithDeleteSupport(props) {
  const { integrationId, formKey, id, value, required } = props;
  const dispatch = useDispatch();
  const { flowGroupings } = useSelectorMemo(selectors.makeResourceSelector, 'integrations', integrationId) || {};
  const isValidName = !flowGroupings.find(flowGroup => flowGroup.name === value);

  useEffect(() => {
    if (required) {
      if (isValidName) {
        dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));

        return;
      }
      dispatch(actions.form.forceFieldState(formKey)(id, {
        isValid: false,
        errorMessages: value ? 'There is already a flow group with the given name' : 'A value must be provided',
      }));
    }
  }, [dispatch, flowGroupings, formKey, id, isValidName, required, value]);

  // suspend force field state compuation once the component turns invisible
  useEffect(() => () => {
    dispatch(actions.form.clearForceFieldState(formKey)(id));
  }, [dispatch, formKey, id]);

  return (
    <DynaText {...props} />
  );
}
