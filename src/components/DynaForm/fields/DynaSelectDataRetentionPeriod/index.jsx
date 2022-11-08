import { FormLabel, MenuItem } from '@material-ui/core';
import React, { useCallback, useMemo } from 'react';
import CeligoSelect from '../../../CeligoSelect';
import FieldHelp from '../../FieldHelp';

export default function DynaSelectDataRetentionPeriod(props) {
  const {id, label, value, onFieldChange, maxAllowedDataRetention} = props;
  const options = useMemo(() => ([
    {
      label: '30 days',
      value: 30,
      dataTest: 'thirtyDays',
    },
    {
      label: '60 days',
      value: 60,
      dataTest: 'sixtyDays',
    },
    {
      label: '90 days',
      value: 90,
      dataTest: 'nintyDays',
    },
    {
      label: '180 days',
      value: 180,
      dataTest: 'oneEightyDays',
    },
  ]), []);
  const isPeriodInValid = period => !(period <= maxAllowedDataRetention);

  const handlePeriodChange = useCallback(e => {
    onFieldChange(id, e.target.value);
  }, [id, onFieldChange]);

  return (
    <>
      <div>
        <FormLabel htmlFor={id}>
          {label}
        </FormLabel>
        <FieldHelp {...props} />
      </div>
      <CeligoSelect
        data-test={id}
        value={value}
        onChange={handlePeriodChange}
        inputProps={{ id: 'dataRetentionPeriod' }}>
        {options.map(opt => (
          <MenuItem key={opt.value} value={opt.value} data-test={opt.dataTest} disabled={isPeriodInValid(opt.value)}>
            {isPeriodInValid(opt.value) ? `${opt.label} - upgrade required` : opt.label}
          </MenuItem>
        ))}
      </CeligoSelect>
    </>
  );
}
