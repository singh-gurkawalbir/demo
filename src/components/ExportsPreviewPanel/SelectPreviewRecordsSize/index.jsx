/* eslint-disable no-restricted-globals */
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_RECORD_SIZE, getRecordSizeOptions } from '../../../utils/exportPanel';
import DynaSelectWithInput from '../../DynaForm/fields/DynaSelectWithInput';
import actions from '../../../actions';
import { selectors } from '../../../reducers';

export default function SelectPreviewRecordsSize({ isValidRecordSize, setIsValidRecordSize, resourceId }) {
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
    const sizeLimitExceeds = size < 1 || size > 100;
    const isValid = isValidNumber && !sizeLimitExceeds;

    setRecordSize(value);
    setIsValidRecordSize(isValid);
    if (isValid) {
      setErrorMessage('');
      patchRecordSize(size);
    } else {
      setErrorMessage(sizeLimitExceeds ? "Value can't exceed 100." : 'Invalid size.');
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
      helpKey="previewPanelRecords"
      value={recordSize}
      options={recordSizeOptions}
      onFieldChange={onRecordChange}
      errorMessages={errorMessage}
      showAllSuggestions
/>
  );
}
