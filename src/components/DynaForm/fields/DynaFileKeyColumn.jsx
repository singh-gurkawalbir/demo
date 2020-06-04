import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../../../reducers';
import DynaMultiSelect from './DynaMultiSelect';

const getFileHeaderOptions = (fileData = {}) => {
  const headers = typeof fileData === 'object' ? Object.keys(fileData) : [];

  return headers.map(name => ({ label: name, value: name }));
};

export default function DynaFileKeyColumn(props) {
  const {
    disabled,
    id,
    name,
    onFieldChange,
    value = [],
    label,
    required,
    resourceId,
    isValid,
    helpText,
    helpKey,
  } = props;
  const [sampleData, setSampleData] = useState(props.sampleData || '');
  const { data: csvData } = useSelector(state => {
    const rawData = selectors.getResourceSampleDataWithStatus(
      state,
      resourceId,
      'csv'
    );

    return { data: rawData && rawData.data && rawData.data.body };
  });
  const { data: parsedData } = useSelector(state =>
    selectors.getResourceSampleDataWithStatus(state, resourceId, 'parse')
  );

  useEffect(() => {
    if (csvData && csvData !== sampleData) {
      setSampleData(csvData);

      onFieldChange(id, []);
    }
  }, [csvData, id, onFieldChange, sampleData]);

  const multiSelectOptions = useMemo(() => {
    const options = getFileHeaderOptions(parsedData || sampleData);

    if (Array.isArray(value)) {
      value.forEach(val => {
        if (!options.find(opt => opt.value === val)) {
          options.push({ label: val, value: val });
        }
      });
    }

    return [{ items: options }];
  }, [parsedData, sampleData, value]);

  return (
    <DynaMultiSelect
      disabled={disabled}
      id={id}
      label={label}
      value={value}
      helpText={helpText}
      helpKey={helpKey}
      isValid={isValid}
      name={name}
      options={multiSelectOptions}
      required={required}
      onFieldChange={onFieldChange}
    />
  );
}
