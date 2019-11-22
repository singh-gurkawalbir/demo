import DynaText from '../DynaText';

export default function DynaTextSetFieldValues(props) {
  const { onFieldChange, setFieldIds = [] } = props;
  const setFormFields = () => {
    setFieldIds.forEach(fieldId => {
      onFieldChange(fieldId, '');
    });
  };

  const handleFieldChange = (id, value) => {
    onFieldChange(id, value);
    setFormFields();
  };

  return <DynaText {...props} onFieldChange={handleFieldChange} />;
}
