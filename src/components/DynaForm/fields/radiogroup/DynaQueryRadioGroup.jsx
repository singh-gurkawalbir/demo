import React, { useEffect } from 'react';
import useFormContext from '../../../Form/FormContext';
import { isFormTouched } from '../../../../forms/formFactory/utils';
import DynaRadioGroupForResetFields from './DynaRadioGroupForResetFields';

export default function DynaQueryRadioGroup(props) {
  const { onFieldChange, value, formKey } = props;
  const {fields: formFields, value: formValues } = useFormContext(formKey);
  const isTouched = (formFields && isFormTouched(Object.values(formFields))) || false;

  useEffect(() => {
    if (isTouched) {
      const queryValue1 = formValues['/rdbms/query1'];
      const queryValue2 = formValues['/rdbms/query2'];
      const insertQueryValue = formValues['/rdbms/queryInsert'];
      const updateQueryValue = formValues['/rdbms/queryUpdate'];

      if (value === 'INSERT') {
      // read from /rdbms/queryInsert and do onFieldChange for rdbms.query1
        onFieldChange('rdbms.query1', insertQueryValue, !insertQueryValue);
      } else if (value === 'UPDATE') {
      // read from /rdbms/queryUpdate and do onFieldChange for rdbms.query2
        onFieldChange('rdbms.query2', updateQueryValue, !updateQueryValue);
      } else if (value === 'COMPOSITE') {
      // read from /rdbms/query1, query2 and do onFieldChange for rdbms.queryInsert and rdbms.queryInsert
        onFieldChange('rdbms.queryInsert', queryValue1, !queryValue1);
        onFieldChange('rdbms.queryUpdate', queryValue2, !queryValue2);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <DynaRadioGroupForResetFields {...props} />;
}
