import DynaRadioGroup from './DynaRadioGroup';

export default function DynaRadioGroupForResetFields(props) {
  const { fieldsToReset, onFieldChange } = props;
  const updatedOnFieldChange = (id, value) => {
    onFieldChange(id, value);
    fieldsToReset.forEach(field => {
      const { type, id } = field;

      if (type === 'checkbox') onFieldChange(id, false);
      else onFieldChange(id, '');
    });
  };

  return <DynaRadioGroup {...props} onFieldChange={updatedOnFieldChange} />;
}
