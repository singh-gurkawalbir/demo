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
    // lets get rid of conditional update

    conditionalUpdate,
    fieldsMeta,
    // deprecated Value
    // value,
  };

  if (!formApiProps.parentContext) formApiProps.parentContext = {};

  formApiProps.parentContext = { ...formApiProps.parentContext, ...rest };

  return formApiProps;
};

export const generateSimpleLayout = (fieldsMeta) => {
  if (!fieldsMeta) return null;
  const { fieldMap, layout } = fieldsMeta;

  if (!fieldMap) return null;

  // when no layout provided generate a simple one

  if (!layout) {
  // if no layout metadata accompanies the fieldMap,
  // then the order in which the fields are defined in the map are used as the layout.
    return {
      fieldMap,
      layout: { fields: Object.keys(fieldMap)}

    };
  }

  return fieldsMeta;
};

export default function useForm({
  formKey,
  metaValue,
  remount,
  ...formSpecificProps
}) {
  const [formKeyUsed, setFormKeyUsed] = useState();
  const {
    disabled,
    showValidationBeforeTouched,
    fieldsMeta,
  } = formSpecificProps;
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

    const finalFormKey = formKey || generateNewId();

    setFormKeyUsed(finalFormKey);

    const updatedFieldMeta = generateSimpleLayout(fieldsMeta);
    if (updatedFieldMeta) {
      dispatch(
        actions.form.init(finalFormKey, {
          ...normalizeAllPropsToFormApi({...formSpecificProps, fieldsMeta: updatedFieldMeta}),
        })
      );
    }

    return () => dispatch(actions.form.clear(finalFormKey));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, remount, formKey]);

  // this hook is sensitive to meta value changes...ideally this is where default value should go

  useEffect(() => {
    if (formKeyUsed && metaValue) {
      Object.keys(metaValue).forEach(fieldId => {
        fieldId &&
          dispatch(
            actions.form.fieldChange(formKeyUsed)(
              fieldId,
              metaValue[fieldId],
              true
            )
          );
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, formKeyUsed, metaValue]);
  useEffect(() => {
    if (formKeyUsed) {
      dispatch(
        actions.form.formUpdate(formKeyUsed, {
          disabled,
          showValidationBeforeTouched,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, disabled, showValidationBeforeTouched]);

  return formKeyUsed;
}
