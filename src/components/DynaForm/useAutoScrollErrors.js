import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../reducers';
import { getFirstInvalidFieldId } from '../../utils/form';

export default function useAutoScrollErrors({ formKey, formRef }) {
  const formState = useSelector(state => selectors.formState(state, formKey));

  useEffect(() => {
    if (formState && !formState.isValid) {
      const invalidFieldId = getFirstInvalidFieldId(formState);
      const invalidFieldEle = formRef.current?.querySelector?.(`[id='${invalidFieldId}']`);

      if (invalidFieldEle && formState.validationOnSaveIdentifier) {
        invalidFieldEle.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formRef.current, formState?.validationOnSaveIdentifier]);
}
