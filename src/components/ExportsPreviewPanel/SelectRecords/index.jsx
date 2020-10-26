/* eslint-disable no-restricted-globals */
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_RECORD_SIZE, getRecordSizeOptions } from '../../../utils/exportPanel';
import DynaSelectWithInput from '../../DynaForm/fields/DynaSelectWithInput';
import actions from '../../../actions';
import { selectors } from '../../../reducers';

export default function SelectRecords({ isValidRecordSize, setIsValidRecordSize, resourceId }) {
  const dispatch = useDispatch();
  const sampleDataRecordSize = useSelector(state =>
    selectors.sampleDataRecordSize(state, resourceId)
  );
  const [recordSize, setRecordSize] = useState(`${sampleDataRecordSize || DEFAULT_RECORD_SIZE}`);
  const [errorMessage, setErrorMessage] = useState();

  const patchRecordSize = useCallback(size => {
    dispatch(actions.sampleData.patch(resourceId, {
      recordSize: size,
    }));
  }, [dispatch, resourceId]);

  const onRecordChange = useCallback((_id, value) => {
    const isValidNumber = /^[0-9]*$/.test(value);
    const size = parseInt(value, 10);
    const sizeLimitExceeds = size < 0 || size > 100;
    const isValid = isValidNumber && !sizeLimitExceeds;

    setRecordSize(value);
    setIsValidRecordSize(isValid);
    if (isValid) {
      setErrorMessage('');
      patchRecordSize(size);
    } else {
      setErrorMessage(isValidNumber ? 'Invalid Size' : 'Max value is 100');
    }
  }, [setIsValidRecordSize, patchRecordSize]);

  const recordSizeOptions = useMemo(() => getRecordSizeOptions(), []);

  useEffect(() => {
    if (!sampleDataRecordSize) {
      dispatch(actions.sampleData.patch(resourceId, {
        recordSize: DEFAULT_RECORD_SIZE,
      }));
    }
  }, [sampleDataRecordSize, dispatch, resourceId]);

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
   * Add recordSize as part of sampleData state - done
   * Csv grouped data not working parse stage -  add conditions to diff file def preview and other preview responses
   */
