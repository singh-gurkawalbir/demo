import DynaSelect from '../DynaSelect';

export default function DynaSelectSetFieldValues(props) {
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

  return <DynaSelect {...props} onFieldChange={handleFieldChange} />;
}
