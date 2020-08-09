import React, { useEffect, useMemo } from 'react';
import { selectors } from '../../../reducers';
import DynaSelect from './DynaSelect';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';

const isOnceNotSupported = (recordTypes, recordTypeVal) => {
  if (!recordTypes) {
    return;
  }

  const recordTypeObj = recordTypes.find(r => r.value === recordTypeVal);

  return (
    recordTypeObj &&
    (recordTypeObj.doesNotSupportUpdate || recordTypeObj.doesNotSupportCreate)
  );
};

export default function DynaNetsuiteExportType(props) {
  const {
    id,
    connectionId,
    defaultValue,
    onFieldChange,
    value,
    filterKey,
    options = {},
    selectOptions,
  } = props;
  const { recordType: selectedRecordType, commMetaPath } = options;

  const recordTypes = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId,
    commMetaPath,
    filterKey)?.data;

  const optionsSupported = useMemo(() => {
    if (isOnceNotSupported(recordTypes, selectedRecordType)) {
      return selectOptions.filter(item => item.value !== 'once');
    }

    return selectOptions;
  }, [recordTypes, selectOptions, selectedRecordType]);

  useEffect(() => {
    // Export type is pre-set to once and User selects record type not supporting create or update
    if (
      value === 'once' &&
      isOnceNotSupported(recordTypes, selectedRecordType)
    ) {
      onFieldChange(id, defaultValue);
    }
  }, [defaultValue, id, onFieldChange, recordTypes, selectedRecordType, value]);

  return <DynaSelect {...props} options={[{ items: optionsSupported }]} />;
}
