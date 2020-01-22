import DynaRadioGroup from './DynaRadioGroup';

export default function DynaRadioGroupForResetFields(props) {
  const { fieldsToReset, onFieldChange } = props;
  const updatedOnFieldChange = (id, value) => {
    fieldsToReset.forEach(field => {
      const { type, id: _id } = field;

      if (type === 'checkbox') onFieldChange(_id, false);
      else onFieldChange(_id, '');
    });
    onFieldChange(id, value);
  };

  return <DynaRadioGroup {...props} onFieldChange={updatedOnFieldChange} />;
}
