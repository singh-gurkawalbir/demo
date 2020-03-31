import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../actions';
import { generateNewId } from '../../utils/resource';

export default function useForm({ formKey, ...formSpecificProps }) {
  const [formKeyUsed, setFormKeyUsed] = useState();
  const dispatch = useDispatch();
  // form specific props could be

  // optionsHandler
  // validationHandler
  // parentContext
  // showValidationBeforeTouched
  // conditionalUpdate
  // disabled

  // this controls form behaviour
  useEffect(() => {
    // generate a new formKey when none is provided
    let formKeyUsedInUseEff = formKey;

    if (!formKey) {
      formKeyUsedInUseEff = generateNewId();
      setFormKeyUsed(formKeyUsedInUseEff);
    } else {
      setFormKeyUsed(formKeyUsedInUseEff);
    }

    if (formKeyUsedInUseEff) {
      dispatch(
        actions.form.formInit(formKeyUsedInUseEff, {
          ...formSpecificProps,
        })
      );
    }

    return () => dispatch(actions.form.formClear(formKeyUsedInUseEff));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, formKey]);
  console.log('check here formkey', formKeyUsed, formKey);

  return formKeyUsed;
}
