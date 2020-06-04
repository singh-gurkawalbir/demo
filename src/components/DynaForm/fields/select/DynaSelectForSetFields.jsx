import React from 'react';
import DynaSelect from '../DynaSelect';

export default function DynaSelectSetFieldValues(props) {
  const { onFieldChange, setFieldIds = [] } = props;
  const setFormFields = () => {
    setFieldIds.forEach(fieldId => {
      onFieldChange(fieldId, '', true);
    });
  };

  const handleFieldChange = (id, value) => {
    onFieldChange(id, value);
    setFormFields();
  };

  return <DynaSelect {...props} onFieldChange={handleFieldChange} />;
}
