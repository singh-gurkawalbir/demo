import React, { useCallback } from 'react';
import DynaText from '../DynaText';

export default function DynaTextSetFieldValues(props) {
  const { onFieldChange, setFieldIds = [] } = props;
  const setFormFields = useCallback(() => {
    setFieldIds.forEach(fieldId => {
      onFieldChange(fieldId, '', true);
    });
  }, [onFieldChange, setFieldIds]);

  const handleFieldChange = useCallback((id, value) => {
    onFieldChange(id, value);
    setFormFields();
  }, [onFieldChange, setFormFields]);

  return <DynaText {...props} onFieldChange={handleFieldChange} />;
}
