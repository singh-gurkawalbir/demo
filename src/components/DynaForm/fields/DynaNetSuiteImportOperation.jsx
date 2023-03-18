import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../reducers';
import DynaRadioGroupForResetFields from './radiogroup/DynaRadioGroupForResetFields';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';

export default function DynaNetSuiteImportOperation(props) {
  const {
    connectionId,
    filterKey,
    formKey,
    recordTypeFieldId = 'netsuite_da.recordType',
    selectOptions,
  } = props;

  const recordTypeField = useSelector(state => selectors.formState(state, formKey)?.fields?.[recordTypeFieldId]);
  const commMetaPath = recordTypeField ? `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes` : '';

  const recordTypes = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId,
    commMetaPath,
    filterKey).data;

  const recordTypeObj = recordTypes?.find(r => r.value === recordTypeField?.value);

  const optionsList = selectOptions[0].items;

  const filteredOptions = useMemo(() => {
    const operationsNotSupported = [];

    if (!recordTypeObj) {
      return optionsList;
    }
    if (recordTypeObj.doesNotSupportCreate) {
      operationsNotSupported.push('add');
    }
    if (recordTypeObj.doesNotSupportSearch || recordTypeObj.doesNotSupportUpdate) {
      operationsNotSupported.push('update');
    }
    if (recordTypeObj.doesNotSupportSearch || recordTypeObj.doesNotSupportUpdate || recordTypeObj.doesNotSupportCreate) {
      operationsNotSupported.push('addupdate');
    }
    if (recordTypeObj.doesNotSupportDelete) {
      operationsNotSupported.push('delete');
    }

    return optionsList.filter(item => !operationsNotSupported.includes(item.value));
  }, [optionsList, recordTypeObj]);

  return <DynaRadioGroupForResetFields {...props} options={[{ items: filteredOptions}]} />;
}
