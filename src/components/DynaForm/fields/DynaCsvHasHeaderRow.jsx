import React, { useCallback } from 'react';
import DynaCheckbox from './checkbox/DynaCheckbox';

export default function DynaCsvHasHeaderRow({
  onFieldChange,
  fieldResetValue,
  fieldToReset,
  ...props
}) {
  const { id } = props;
  const handleFieldChange = useCallback(
    (_id, newVal) => {
      if (fieldToReset) onFieldChange(fieldToReset, fieldResetValue);
      onFieldChange(id, newVal);
    },
    [fieldResetValue, fieldToReset, id, onFieldChange]
  );

  return <DynaCheckbox {...props} onFieldChange={handleFieldChange} />;
}
