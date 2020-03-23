import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../actions';
import { registerFields } from '../../utils/form';
import { generateNewId } from '../../utils/resource';

export default function useForm({ formKey, formSpecificProps }) {
  let formKeyUsed = formKey;
  const dispatch = useDispatch();

  // generate a new formKey when none is provided
  if (!formKey) formKeyUsed = generateNewId();

  // form specific props could be

  // optionsHandler
  // validationHandler
  // parentContext
  // showValidationBeforeTouched
  // conditionalUpdate
  // disabled

  // this controls form behaviour
  useEffect(() => {
    const { fieldsMeta } = formSpecificProps;

    dispatch(actions.form.formInit(formKeyUsed, formSpecificProps));

    // no form Value for now
    registerFields(fieldsMeta).forEach(field =>
      dispatch(actions.form.field.registerField(formKey)(field))
    );

    return () => dispatch(actions.form.formClear(formKeyUsed));
  }, [dispatch, formKey, formKeyUsed, formSpecificProps]);

  return formKeyUsed;
}
