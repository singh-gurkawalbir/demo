import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../actions';
import { generateNewId } from '../../utils/resource';

const normalizeAllPropsToFormApi = props => {
  const {
    optionsHandler,
    validationHandler,
    parentContext,
    disabled,
    showValidationBeforeTouched,
    conditionalUpdate,
    fieldsMeta,
    ...rest
  } = props;
  const formApiProps = {
    optionsHandler,
    validationHandler,
    parentContext,
    disabled,
    showValidationBeforeTouched,
    conditionalUpdate,
    fieldsMeta,
    // deprecated Value
    // value,
  };

  if (!formApiProps.parentContext) formApiProps.parentContext = {};

  formApiProps.parentContext = { ...formApiProps.parentContext, ...rest };

  return formApiProps;
};

export default function useForm({ formKey, ...formSpecificProps }) {
  const [formKeyUsed, setFormKeyUsed] = useState();
  const { disabled, showValidationBeforeTouched } = formSpecificProps;
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
          ...normalizeAllPropsToFormApi(formSpecificProps),
        })
      );
    }

    return () => dispatch(actions.form.formClear(formKeyUsedInUseEff));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, formKey, disabled, showValidationBeforeTouched]);

  return formKeyUsed;
}
