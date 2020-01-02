import { useState } from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../../../reducers';
import DynaMultiSelect from './DynaMultiSelect';
import { extractFieldsFromCsv } from '../../../utils/file';

export default function DynaFileKeyColumn(props) {
  const {
    disabled,
    id,
    name,
    onFieldChange,
    value = '',
    label,
    required,
    resourceId,
    isValid,
    options = {},
  } = props;
  const [sampleData, setSampleData] = useState(props.sampleData || '');
  const { data: fileData } = useSelector(state => {
    const rawData = selectors.getResourceSampleDataWithStatus(
      state,
      resourceId,
      'csv'
    );

    return { data: rawData && rawData.data && rawData.data.body };
  });

  // fileData is updated when user uploads new file
  if (fileData && fileData !== sampleData) {
    setSampleData(fileData);

    onFieldChange(id, []);
  }

  const getFileHeaderOptions = (fileData = '') => {
    const headers = extractFieldsFromCsv(fileData, options) || [];

    return headers.map(header => ({ label: header.id, value: header.id }));
  };

  const multiSelectOptions = [
    { items: getFileHeaderOptions(fileData || sampleData) },
  ];

  return (
    <DynaMultiSelect
      disabled={disabled}
      id={id}
      value={value}
      isValid={isValid}
      name={name}
      options={multiSelectOptions}
      required={required}
      label={label}
      onFieldChange={onFieldChange}
    />
  );
}
