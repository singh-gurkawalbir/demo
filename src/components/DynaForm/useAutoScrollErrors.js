import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../reducers';
import { getFirstErroredFieldId } from '../../utils/form';

export default function useAutoScrollErrors({ formKey, formRef }) {
  const formState = useSelector(state => selectors.formState(state, formKey));

  useEffect(() => {
    if (formState && !formState.isValid) {
      const erroredFieldId = getFirstErroredFieldId(formState);
      const erroredFieldEle = formRef.current?.querySelector?.(`[id='${erroredFieldId}']`);

      if (erroredFieldEle && formState.validationOnSaveIdentifier) {
        erroredFieldEle.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formRef.current, formState?.validationOnSaveIdentifier]);
}
