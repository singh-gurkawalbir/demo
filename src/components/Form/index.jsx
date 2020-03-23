import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../actions';
import { registerFields } from '../../utils/form';
import { generateNewId } from '../../utils/resource';

export default function useForm({ formKey, ...formSpecificProps }) {
  const [formKeyUsed, setFormKeyUsed] = useState();
  const dispatch = useDispatch();
  const onFieldChange = useCallback(
    formKey => (fieldId, value) =>
      dispatch(actions.form.field.onFieldChange(formKey)(fieldId, value)),
    [dispatch]
  );
  const onFieldBlur = useCallback(
    formKey => fieldId =>
      dispatch(actions.form.field.onFieldBlur(formKey)(fieldId)),
    [dispatch]
  );
  const onFieldFocus = useCallback(
    formKey => fieldId =>
      dispatch(actions.form.field.onFieldFocus(formKey)(fieldId)),
    [dispatch]
  );
  const registerField = useCallback(
    formKey => field =>
      dispatch(actions.form.field.registerField(formKey)(field)),
    [dispatch]
  );
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
    }

    if (formKeyUsedInUseEff) {
      const { fieldsMeta } = formSpecificProps;
      const formHooks = {
        onFieldFocus: onFieldFocus(formKeyUsedInUseEff),
        onFieldBlur: onFieldBlur(formKeyUsedInUseEff),
        onFieldChange: onFieldChange(formKeyUsedInUseEff),
        registerField: registerField(formKeyUsedInUseEff),
      };

      dispatch(
        actions.form.formInit(formKeyUsedInUseEff, {
          ...formSpecificProps,
          ...formHooks,
        })
      );

      const fieldsUpdated = Object.values(fieldsMeta.fieldMap);

      // no form Value for now
      registerFields(fieldsUpdated).forEach(field =>
        dispatch(actions.form.field.registerField(formKeyUsedInUseEff)(field))
      );
    }

    return () => dispatch(actions.form.formClear(formKeyUsedInUseEff));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    formKey,
    onFieldBlur,
    onFieldChange,
    onFieldFocus,
    registerField,
  ]);

  return formKeyUsed;
}
