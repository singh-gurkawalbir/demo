import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../../../reducers';
import DynaSelect from './DynaSelect';

const isOnceNotSupported = (recordTypes, recordType) => {
  if (!recordTypes) {
    return;
  }

  const recordTypeObj = recordTypes.find(r => r.value === recordType);

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
  const { recordType, commMetaPath } = options;
  const recordTypes = useSelector(
    state =>
      selectors.metadataOptionsAndResources({
        state,
        connectionId,
        commMetaPath,
        filterKey,
      }).data
  );
  const optionsSupported = useMemo(() => {
    if (isOnceNotSupported(recordTypes, recordType)) {
      return selectOptions.filter(item => item.value !== 'once');
    }

    return selectOptions;
  }, [recordType, recordTypes, selectOptions]);

  useEffect(() => {
    // Export type is pre-set to once and User selects record type not supporting create or update
    if (value === 'once' && isOnceNotSupported(recordTypes, recordType)) {
      onFieldChange(id, defaultValue);
    }
  }, [defaultValue, id, onFieldChange, recordType, recordTypes, value]);

  return <DynaSelect {...props} options={[{ items: optionsSupported }]} />;
}
