import DynaMultiSelect from './fields/DynaMultiSelect';
import DynaRadioGroup from './fields/DynaRadioGroup';
import DynaSelect from './fields/DynaSelect';
import DynaText from './fields/DynaText';
import DynaCheckbox from './fields/DynaCheckbox';

const renderer = field => {
  // (field, onChange, onFieldFocus, onFieldBlur) => {
  const { id, type /* , label, misc = {} */ } = field;

  switch (type) {
    case 'text':
      return <DynaText key={id} {...field} />;

    case 'textarea':
      return <DynaText key={id} multiline {...field} />;

    case 'checkbox':
      return <DynaCheckbox key={id} {...field} />;

    case 'select':
      return <DynaSelect key={id} {...field} />;

    case 'multiselect':
      return <DynaMultiSelect key={id} {...field} />;

    case 'radiogroup':
      return <DynaRadioGroup key={id} {...field} />;

    default:
      return <div>No mapped field</div>;
  }
};

export default renderer;
