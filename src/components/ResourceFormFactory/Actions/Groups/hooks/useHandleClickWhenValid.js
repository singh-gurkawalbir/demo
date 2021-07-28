import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';

export default function useHandleClickWhenValid(formKey, onClick) {
  const dispatch = useDispatch();

  const formIsValid = useSelector(state => selectors.formState(state, formKey)?.isValid);
  const onClickWhenValid = useCallback(
    closeAfterSave => {
      dispatch(actions.form.showFormValidations(formKey));

      // Util user resolves form validation do we allow the onClick to take place ...
      if (formIsValid) onClick(closeAfterSave);
    },
    [dispatch, formKey, formIsValid, onClick]
  );

  return onClickWhenValid;
}

