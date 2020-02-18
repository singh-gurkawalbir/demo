import DynaSelect from '../DynaSelect';

export default function DynaSelectSetFieldValues(props) {
  const { onFieldChange, setFieldIds = [], hideFromUI } = props;
  const setFormFields = () => {
    setFieldIds.forEach(fieldId => {
      onFieldChange(fieldId, '', true);
    });
  };

  const handleFieldChange = (id, value) => {
    onFieldChange(id, value);
    setFormFields();
  };

  // 'hideFromUI' used to hide the field from ui.
  return hideFromUI ? null : (
    <DynaSelect {...props} onFieldChange={handleFieldChange} />
  );
}
