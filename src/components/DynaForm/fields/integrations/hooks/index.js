import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';

export const useResetWhenParentIntegrationChanges = (formKey, parentFieldId, onFieldChange, id) => {
  const selectedParentIntegrationTouched = useSelector(state => selectors.formState(state, formKey)?.fields?.[parentFieldId]?.touched);
  const selectedParentIntegrationValue = useSelector(state => selectors.formState(state, formKey)?.fields?.[parentFieldId]?.value);

  useEffect(() => {
    // reset selected child integrations when the user changes a parent integration
    if (selectedParentIntegrationValue && selectedParentIntegrationTouched) {
      onFieldChange(id, [], true);
    }
  }, [id, onFieldChange, selectedParentIntegrationValue, selectedParentIntegrationTouched]);
};
