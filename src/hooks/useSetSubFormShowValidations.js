import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../actions';
import useFormContext from '../components/Form/FormContext';

const useSetSubFormShowValidations = (
  parentFormKey,
  childFormKey) => {
  const dispatch = useDispatch();
  const parentShowformValidation = useFormContext(parentFormKey)?.showValidationBeforeTouched;

  useEffect(() => {
    if (parentShowformValidation) {
      dispatch(actions.form.showFormValidations(childFormKey));
    }
  }, [parentShowformValidation, childFormKey, dispatch]);
};

export default useSetSubFormShowValidations;
