/* eslint-disable no-restricted-globals */
import React, { useCallback, useMemo, useState, useEffect } from 'react';

import DynaSelectWithInput from '../../DynaForm/fields/DynaSelectWithInput';

export default function SelectRecords(props) {
  const {
    recordSize,
    isValidRecordSize,
    setIsValidRecordSize,
    setRecordSize,
  } = props;
  const [errorMessage, setErrorMessage] = useState();

  const onRecordChange = useCallback((_id, value) => {
    setRecordSize(value);
  });

  const recordSizeOptions = useMemo(() => Array.from(Array(10), (val, index) => {
    const stringifiedValue = `${(index + 1) * 10}`;

    return { label: stringifiedValue, value: stringifiedValue};
  }), []);

  useEffect(() => {
    const size = parseInt(recordSize, 10);
    const sizeLimitExceeds = size < 0 || size > 100;
    const isValid = !isNaN(size) && !sizeLimitExceeds;

    setIsValidRecordSize(isValid);
    if (isValid) {
      setErrorMessage('');
    } else {
      setErrorMessage(!isNaN(size) ? 'Invalid Size' : 'Max value is 100');
    }
  }, [recordSize, setIsValidRecordSize]);

  return (
    <DynaSelectWithInput
      isValid={isValidRecordSize}
      id="record-size"
      label="Number of records"
      value={recordSize}
      options={recordSizeOptions}
      onFieldChange={onRecordChange}
      errorMessages={errorMessage}
/>
  );
}

/**
 * 1. Add Dropdown
 * 2. Add conditions where to show/hide it ( Hide FTP for now )
 * 3. Add preview support for export/lookup
 * 4. update common util to support proper format both editors level and preview panel
 * 5. Tackle FTP related use cases to show proper format
 */
