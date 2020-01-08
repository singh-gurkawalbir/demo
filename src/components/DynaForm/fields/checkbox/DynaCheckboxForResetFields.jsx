import DynaCheckbox from './DynaCheckbox';

export default function DynaCheckboxForResetFields(props) {
  const { fieldsToReset, onFieldChange } = props;
  const updatedOnFieldChange = (id, value) => {
    onFieldChange(id, value);
    fieldsToReset.forEach(id => {
      onFieldChange(id, '');
    });
  };

  return <DynaCheckbox {...props} onFieldChange={updatedOnFieldChange} />;
}
