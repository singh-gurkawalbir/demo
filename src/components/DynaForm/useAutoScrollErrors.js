import { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { selectors } from '../../reducers';
import { getFirstErroredFieldId } from '../../utils/form';

export default function useAutoScrollErrors({ formKey, formRef }) {
  const { isValid,
    validationOnSaveIdentifier,
    erroredFieldId } = useSelector(state => {
    const formState = selectors.formState(state, formKey);

    const erroredFieldId = getFirstErroredFieldId(formState);

    if (!formState) {
      return {isValid: true};
    }
    const {isValid, validationOnSaveIdentifier} = formState;

    return {
      isValid,
      validationOnSaveIdentifier,
      erroredFieldId,
    };
  }, shallowEqual);

  useEffect(() => {
    if (!isValid) {
      const erroredFieldEle = formRef.current?.querySelector?.(`[id='${erroredFieldId}']`);

      if (erroredFieldEle && validationOnSaveIdentifier) {
        erroredFieldEle.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formRef.current, validationOnSaveIdentifier]);
}
