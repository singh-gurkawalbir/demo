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
      onFieldChange(id, newVal);
      // TODO: look for better way. I guess, once form refactor is done, this could be removed
      // keyColumn field is dependent on hasHeader Row, and also, it should reset on clearing hasHeader row.
      // The field could be reset inside inside DynaFileKeyColumn as well where it looks for change in useEffect and resets the value.
      setTimeout(() => {
        if (fieldToReset) onFieldChange(fieldToReset, fieldResetValue);
      }, 500);
    },
    [fieldResetValue, fieldToReset, id, onFieldChange]
  );

  return <DynaCheckbox {...props} onFieldChange={handleFieldChange} />;
}
