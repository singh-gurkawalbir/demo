import DynaRadioGroup from './DynaRadioGroup';

export default function IgnoreFields(props) {
  const { fieldsToUnCheck, onFieldChange } = props;
  const updatedOnFieldChange = (id, value) => {
    onFieldChange(id, value);
    fieldsToUnCheck.forEach(id => {
      onFieldChange(id, '');
    });
  };

  return <DynaRadioGroup {...props} onFieldChange={updatedOnFieldChange} />;
}
