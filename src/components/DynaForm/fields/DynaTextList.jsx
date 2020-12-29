import React from 'react';
import TextFieldList from '../../TextFieldList';
import ErroredMessageComponent from './ErroredMessageComponent';

export default function DynaTextList({
  id,
  label,
  value,
  disabled,
  onFieldChange,
  description,
  errorMessages,
  isValid }) {
  const handleChange = values => { onFieldChange(id, values); };

  return (
    <>
      <TextFieldList
        label={label} value={value} disabled={disabled} dataTest={id}
        onChange={handleChange} />
      <ErroredMessageComponent description={description} errorMessages={errorMessages} isValid={isValid} />
    </>
  );
}

