import DynaRadioGroup from './DynaRadioGroup';

export default function IgnoreFields(props) {
  const { fieldsToReset, onFieldChange } = props;
  const updatedOnFieldChange = (id, value) => {
    onFieldChange(id, value);
    fieldsToReset.forEach(id => {
      onFieldChange(id, '');
    });
  };

  return <DynaRadioGroup {...props} onFieldChange={updatedOnFieldChange} />;
}
