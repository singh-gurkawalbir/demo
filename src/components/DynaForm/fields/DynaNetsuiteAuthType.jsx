import React, { useMemo, useEffect } from 'react';
import useFormContext from '../../Form/FormContext';
import DynaSelect from './DynaSelect';

export default function DynaNetsuiteAuthType(props) {
  const { formKey, onFieldChange, value, id } = props;
  const formValues = useFormContext(formKey)?.value;

  const wsdlVersion = formValues['/netsuite/wsdlVersion'];
  const isNetsuiteJdbc = formValues['/application'] === 'NetSuite JDBC';

  useEffect(() => {
    if (value === 'basic' && wsdlVersion === '2020.2') {
      onFieldChange(id, '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsdlVersion]);

  const availableAuthOptions = useMemo(() => {
    const items = [
      { label: 'Token Based Auth (Automatic)', value: 'token-auto' },
      { label: 'Token Based Auth (Manual)', value: 'token' },
      ...(wsdlVersion !== '2020.2' && !isNetsuiteJdbc ? [{ label: 'Basic (To be deprecated - Do not use)', value: 'basic' }] : []),
    ];

    return [{ items }];
  }, [wsdlVersion, isNetsuiteJdbc]);

  return (
    <DynaSelect {...props} options={availableAuthOptions} />
  );
}
