import { useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { isFormTouched } from '../forms/utils';
import actions from '../actions';

const useEnableButtonOnTouchedForm = ({
  onClick,
  fields,
  formIsValid,
  resourceId,
  resourceType,
  isIAForm,
  integrationId,
  flowId,
  sectionId,
  isFormTouchedForMeta,
}) => {
  const dispatch = useDispatch();
  const formTouched = useMemo(
    () =>
      isFormTouchedForMeta === undefined
        ? isFormTouched(fields)
        : isFormTouchedForMeta,
    [fields, isFormTouchedForMeta]
  );
  const onClickWhenValid = useCallback(
    value => {
      if (isIAForm)
        dispatch(
          actions.integrationApp.settings.showFormValidations(
            integrationId,
            flowId,
            sectionId
          )
        );
      else
        dispatch(
          actions.resourceForm.showFormValidations(resourceType, resourceId)
        );

      // Util user resolves form validation do we allow the onClick to take place ...
      if (formIsValid) onClick(value);
    },
    [
      isIAForm,
      dispatch,
      flowId,
      formIsValid,
      integrationId,
      onClick,
      resourceId,
      resourceType,
      sectionId,
    ]
  );

  return { formTouched, onClickWhenValid };
};

export default useEnableButtonOnTouchedForm;
