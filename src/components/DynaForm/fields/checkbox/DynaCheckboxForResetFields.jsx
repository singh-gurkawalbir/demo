import React from 'react';
import DynaCheckbox from './DynaCheckbox';

export default function DynaCheckboxForResetFields(props) {
  const { fieldsToReset, onFieldChange, id, value } = props;

  const updatedOnFieldChange = (id, value) => {
    fieldsToReset.forEach(field => {
      const { type, id: _id, value } = field;

      const defValue = type === 'checkbox' ? false : '';
      const resetValue = 'value' in field ? value : defValue;

      onFieldChange(_id, resetValue, true);
    });
    onFieldChange(id, value);
  };

  if (['rowsPerRecord', 'file.xlsx.rowsPerRecord'].includes(id) && !value) {
    return null;
  }

  return <DynaCheckbox {...props} onFieldChange={updatedOnFieldChange} />;
}
