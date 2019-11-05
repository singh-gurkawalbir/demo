import DynaText from '../DynaText';

export default function DynaTextSetFieldValues(props) {
  const { onFieldChange, setFieldValue = '', setFieldIds = [] } = props;
  const setFormFields = () => {
    setFieldIds.forEach(fieldId => {
      onFieldChange(fieldId, setFieldValue);
    });
  };

  const handleFieldChange = (id, value) => {
    onFieldChange(id, value);
    setFormFields();
  };

  return <DynaText {...props} onFieldChange={handleFieldChange} />;
}
