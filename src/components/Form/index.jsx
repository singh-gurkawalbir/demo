import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../actions';
import { registerFields } from '../../utils/form';
import { generateNewId } from '../../utils/resource';

export default function useForm({ formKey, ...formSpecificProps }) {
  const [formKeyUsed, setFormKeyUsed] = useState(formKey);
  const dispatch = useDispatch();

  // generate a new formKey when none is provided
  if (!formKeyUsed) {
    setFormKeyUsed(generateNewId());
  }

  // form specific props could be

  // optionsHandler
  // validationHandler
  // parentContext
  // showValidationBeforeTouched
  // conditionalUpdate
  // disabled

  // this controls form behaviour
  useEffect(() => {
    if (formKeyUsed) {
      const { fieldsMeta } = formSpecificProps;

      console.log('check here ', formSpecificProps);
      dispatch(actions.form.formInit(formKeyUsed, formSpecificProps));

      const fieldsUpdated = Object.values(fieldsMeta.fieldMap);

      // no form Value for now
      registerFields(fieldsUpdated).forEach(field =>
        dispatch(actions.form.field.registerField(formKeyUsed)(field))
      );
    }

    return () => dispatch(actions.form.formClear(formKeyUsed));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, formKeyUsed]);

  return formKeyUsed;
}
