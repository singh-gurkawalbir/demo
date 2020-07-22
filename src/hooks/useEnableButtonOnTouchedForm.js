import { useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { isFormTouched } from '../forms/utils';
import actions from '../actions';

const useEnableButtonOnTouchedForm = ({
  onClick,
  fields,
  formIsValid,
  isFormTouchedForMeta,
  ignoreFormTouchedCheck,
  formKey,
  integrationId,
  flowId,
  sectionId,
  isIAForm,
  isFormTouchedForMeta,
  ignoreFormTouchedCheck,
  showCustomFormValidations,
  ssLinkedConnectionId,
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
      if (ssLinkedConnectionId) {
        dispatch(
          actions.suiteScript.resourceForm.showFormValidations(
            resourceType,
            resourceId,
            ssLinkedConnectionId
          )
        );

        // Util user resolves form validation do we allow the onClick to take place ...
        if (formIsValid) onClick(value);

        return;
      }
      if (showCustomFormValidations) {
        showCustomFormValidations();
      } else if (isIAForm) {
        dispatch(
          actions.integrationApp.settings.showFormValidations(
            integrationId,
            flowId,
            sectionId
          )
        );
      }e else dispatch(actions.form.showFormValidations(formKey));

      // Util user resolves form validation do we allow the onClick to take place ...
      if (formIsValid) onClick(value);
    },
    [
      ssLinkedConnectionId,
      showCustomFormValidations,
      isIAForm,
      dispatch,
      integrationId,
      flowId,
      sectionId,
      formKey,
      formIsValid,
      onClick,
    ]
  );

  return { formTouched, onClickWhenValid };
};

export default useEnableButtonOnTouchedForm;
