import React, { useEffect, useState } from 'react';
import useFormContext from '../../../Form/FormContext';
import DynaRadioGroupForResetFields from './DynaRadioGroupForResetFields';

const emptyObj = {};
export default function DynaQueryRadioGroup(props) {
  const { onFieldChange, value, formKey, touched } = props;
  const [latestInsertField, setLatestInsertField] = useState();
  const [latestUpdateField, setLatestUpdateField] = useState();

  const {value: formValues = emptyObj, lastFieldUpdated } = useFormContext(formKey);

  useEffect(() => {
    // we want to keep track of the recently modified insert/update fields
    // and then use the latest field during onFieldChange below
    if (lastFieldUpdated === 'rdbms.query1') {
      setLatestInsertField('/rdbms/query1');
    } else if (lastFieldUpdated === 'rdbms.queryInsert') {
      setLatestInsertField('/rdbms/queryInsert');
    } else if (lastFieldUpdated === 'rdbms.query2') {
      setLatestUpdateField('/rdbms/query2');
    } else if (lastFieldUpdated === 'rdbms.queryUpdate') {
      setLatestUpdateField('/rdbms/queryUpdate');
    }
  }, [lastFieldUpdated]);

  useEffect(() => {
    if (touched) {
      if (value === 'INSERT') {
      // read from last modified insert field and do onFieldChange for rdbms.query1
        onFieldChange('rdbms.query1', formValues[latestInsertField || '/rdbms/queryInsert'], true);
      } else if (value === 'UPDATE') {
      // read from last modified update field and do onFieldChange for rdbms.query2
        onFieldChange('rdbms.query2', formValues[latestUpdateField || '/rdbms/queryUpdate'], true);
      } else if (value === 'COMPOSITE') {
      // read from last modified insert and update fields and do onFieldChange for rdbms.queryInsert and rdbms.queryInsert
        onFieldChange('rdbms.queryInsert', formValues[latestInsertField || '/rdbms/query1'], true);
        onFieldChange('rdbms.queryUpdate', formValues[latestUpdateField || '/rdbms/query2'], true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <DynaRadioGroupForResetFields {...props} />;
}
