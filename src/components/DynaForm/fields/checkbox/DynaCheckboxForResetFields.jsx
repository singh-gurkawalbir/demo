import React from 'react';
import DynaCheckbox from './DynaCheckbox';

export default function DynaCheckboxForResetFields(props) {
  const { fieldsToReset, onFieldChange } = props;
  const updatedOnFieldChange = (id, value) => {
    fieldsToReset.forEach(field => {
      const { type, id: _id, defaultValue } = field;

      if (type === 'checkbox') onFieldChange(_id, defaultValue || false, true);
      else onFieldChange(_id, defaultValue || '', true);
    });
    onFieldChange(id, value);
  };

  return <DynaCheckbox {...props} onFieldChange={updatedOnFieldChange} />;
}
