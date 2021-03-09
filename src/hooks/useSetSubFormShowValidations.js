import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../actions';
import useFormContext from '../components/Form/FormContext';

const useSetSubFormShowValidations = (
  parentFormKey,
  childFormKey) => {
  const dispatch = useDispatch();
  const parentShowFormValidation = useFormContext(parentFormKey)?.showValidationBeforeTouched;

  useEffect(() => {
    if (parentShowFormValidation) {
      dispatch(actions.form.showFormValidations(childFormKey));
    }
  }, [parentShowFormValidation, childFormKey, dispatch]);
};

export default useSetSubFormShowValidations;
