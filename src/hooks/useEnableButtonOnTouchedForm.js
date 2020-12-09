import { useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../actions';
import { isFormTouched } from '../forms/formFactory/utils';

const useEnableButtonOnTouchedForm = ({
  onClick,
  fields,
  formIsValid,
  isFormTouchedForMeta,
  ignoreFormTouchedCheck,
  formKey,
}) => {
  const dispatch = useDispatch();
  const formTouched = useMemo(() => {
    // when this value is true...we consider the form already touched
    if (ignoreFormTouchedCheck) return true;

    return isFormTouchedForMeta === undefined
      ? fields && isFormTouched(Object.values(fields))
      : isFormTouchedForMeta;
  }, [fields, ignoreFormTouchedCheck, isFormTouchedForMeta]);
  const onClickWhenValid = useCallback(
    value => {
      dispatch(actions.form.showFormValidations(formKey));

      // Util user resolves form validation do we allow the onClick to take place ...
      if (formIsValid) onClick(value);
    },
    [dispatch, formKey, formIsValid, onClick]
  );

  return { formTouched, onClickWhenValid };
};

export default useEnableButtonOnTouchedForm;
