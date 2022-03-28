import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../../actions';
import { useSelectorMemo } from '../../../../hooks';
import { selectors } from '../../../../reducers';
import { FORM_SAVE_STATUS } from '../../../../utils/constants';
import { validateAliasId } from '../../../../utils/resource';
import DynaText from '../DynaText';

export default function DynaAliasId(props) {
  const { aliasContextResourceId, aliasContextResourceType, aliasData, formKey, id, value, required } = props;
  const dispatch = useDispatch();
  const status = useSelector(state => selectors.asyncTaskStatus(state, formKey));
  const resourceAliases = useSelectorMemo(selectors.makeOwnAliases, aliasContextResourceType, aliasContextResourceId);

  const { isValid, message } = validateAliasId(value, aliasData?.alias, resourceAliases);

  useEffect(() => {
    if (!required || status === FORM_SAVE_STATUS.LOADING) return;

    if (isValid) {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid}));

      return;
    }

    dispatch(actions.form.forceFieldState(formKey)(id, {
      isValid: false,
      errorMessages: message,
    }));
  }, [dispatch, formKey, id, isValid, message, required, value, status]);

  // suspend force field state computation once the component turns invisible
  useEffect(() => () => {
    dispatch(actions.form.clearForceFieldState(formKey)(id));
  }, [dispatch, formKey, id]);

  return (
    <DynaText {...props} />
  );
}
