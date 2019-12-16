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
  } = props;
  const { data: fileData } = useSelector(state => {
    const rawData = selectors.getResourceSampleDataWithStatus(
      state,
      resourceId,
      'csv'
    );

    return { data: rawData && rawData.data && rawData.data.body };
  });
  const getFileHeaderOptions = (fileData = '') => {
    const headers = extractFieldsFromCsv(fileData) || [];

    return headers.map(header => ({ label: header.id, value: header.id }));
  };

  const options = [{ items: getFileHeaderOptions(fileData) }];

  return (
    <DynaMultiSelect
      disabled={disabled}
      id={id}
      value={value}
      isValid={isValid}
      name={name}
      options={options}
      required={required}
      label={label}
      onFieldChange={onFieldChange}
    />
  );
}
