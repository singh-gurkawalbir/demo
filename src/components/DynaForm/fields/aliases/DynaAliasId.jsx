import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../../actions';
import { useSelectorMemo } from '../../../../hooks';
import { selectors } from '../../../../reducers';
import { FORM_SAVE_STATUS } from '../../../../utils/constants';
import DynaText from '../DynaText';

export default function DynaAliasId(props) {
  const { resourceId, resourceType, alias, formKey, id, value, required } = props;
  const dispatch = useDispatch();
  const status = useSelector(state => selectors.asyncTaskStatus(state, formKey));
  const resourceAliases = useSelectorMemo(selectors.makeOwnAliases, resourceType, resourceId);

  const isValidName = value ? (value === alias?.alias) || (!resourceAliases.some(ra => ra.alias === value)) : false;

  useEffect(() => {
    if (!required || status === FORM_SAVE_STATUS.LOADING) return;

    if (isValidName) {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));

      return;
    }
    let errorMessages;

    if (value) {
      errorMessages = 'Use a different alias ID. You already have an alias ID registered with the same name.';
    } else {
      errorMessages = 'A value must be provided';
    }

    dispatch(actions.form.forceFieldState(formKey)(id, {
      isValid: false,
      errorMessages,
    }));
  }, [dispatch, formKey, id, isValidName, required, value, status]);

  // suspend force field state computation once the component turns invisible
  useEffect(() => () => {
    dispatch(actions.form.clearForceFieldState(formKey)(id));
  }, [dispatch, formKey, id]);

  return (
    <>
      <DynaText {...props} />
    </>
  );
}
