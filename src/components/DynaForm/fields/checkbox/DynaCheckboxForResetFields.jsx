import React from 'react';
import DynaCheckbox from './DynaCheckbox';

export default function DynaCheckboxForResetFields(props) {
  const { fieldsToReset, onFieldChange } = props;
  const updatedOnFieldChange = (id, value) => {
    fieldsToReset.forEach(field => {
      const { type, id: _id, value } = field;

      const defValue = type === 'checkbox' ? false : '';
      const resetValue = 'value' in field ? value : defValue;

      onFieldChange(_id, resetValue, true);
    });
    onFieldChange(id, value);
  };

  return <DynaCheckbox {...props} onFieldChange={updatedOnFieldChange} />;
}
