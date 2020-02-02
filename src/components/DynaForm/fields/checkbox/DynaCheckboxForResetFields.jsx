import DynaCheckbox from './DynaCheckbox';

export default function DynaCheckboxForResetFields(props) {
  const { fieldsToReset, onFieldChange } = props;
  const updatedOnFieldChange = (id, value) => {
    fieldsToReset.forEach(field => {
      const { type, id: _id } = field;

      if (type === 'checkbox') onFieldChange(_id, false, true);
      else onFieldChange(_id, '', true);
    });
    onFieldChange(id, value);
  };

  return <DynaCheckbox {...props} onFieldChange={updatedOnFieldChange} />;
}
