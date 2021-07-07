import React from 'react';
import DynaSelect from './DynaSelect';
import useFormContext from '../../Form/FormContext';

export default function DynaSelectRequestMediaType(props) {
  const { formKey } = props;

  const formValues = useFormContext(formKey)?.value;

  const inputMode = formValues['/inputMode'];

  const options = inputMode === 'blob' ? [
    { label: 'Multipart / form-data', value: 'form-data' },
    { label: 'JSON', value: 'json' },
  ] : [
    { label: 'XML', value: 'xml' },
    { label: 'JSON', value: 'json' },
    { label: 'CSV', value: 'csv' },
    { label: 'URL encoded', value: 'urlencoded' },
    { label: 'Multipart / form-data', value: 'form-data' },
  ];

  return <DynaSelect {...props} options={[{ items: options}]} />;
}
