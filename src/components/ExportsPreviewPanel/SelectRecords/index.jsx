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
  }, [setRecordSize]);

  const recordSizeOptions = useMemo(() => Array.from(Array(10), (val, index) => {
    const stringifiedValue = `${(index + 1) * 10}`;

    return { label: stringifiedValue, value: stringifiedValue};
  }), []);

  useEffect(() => {
    const isValidNumber = /^[0-9]*$/.test(recordSize);
    const size = parseInt(recordSize, 10);
    const sizeLimitExceeds = size < 0 || size > 100;
    const isValid = isValidNumber && !sizeLimitExceeds;

    setIsValidRecordSize(isValid);
    if (isValid) {
      setErrorMessage('');
    } else {
      setErrorMessage(isValidNumber ? 'Invalid Size' : 'Max value is 100');
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
 * 1. Add Dropdown - done
 * 2. Add conditions where to show/hide it - done
 * 3. Add preview support for export/lookup - done
 * 4. update common util to support proper format both editors level and preview panel - done
 * 5. Tackle FTP related use cases to show proper format - done ( refactor required )
 * 6. Refactor sampledata saga and state to support recordSize properly
 */

/**
  * 5. FTP Solution
  * we need to store both parse and preview stages
  * 1. On user upload
  * - csv - verified
  * - xlsx - verified
  * - json - verified
  * - xml
  * - file definitions - revisit
  * 2. on saved sample data
  * - csv - verified
  * - xlsx
  * - json - verified
  * - xml
  * - file definitions
  */

/**
   * Add recordSize as part of sampleData state
   * move preview data logic for file adaptors inside state - validate
   */
