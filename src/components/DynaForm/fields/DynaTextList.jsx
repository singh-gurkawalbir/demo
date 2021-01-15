import React from 'react';
import TextFieldList from '../../TextFieldList';
import FieldMessage from './FieldMessage';

export default function DynaTextList({
  id,
  label,
  value,
  disabled,
  onFieldChange,
  description,
  errorMessages,
  isValid,
  helpKey,
}) {
  const handleChange = values => { onFieldChange(id, values); };

  return (
    <>
      <TextFieldList
        // key={value}
        label={label} value={value} disabled={disabled}
        helpKey={helpKey}
        dataTest={id}
        onChange={handleChange} />
      <FieldMessage description={description} errorMessages={errorMessages} isValid={isValid} />
    </>
  );
}

