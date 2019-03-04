import DynaMultiSelect from './fields/DynaMultiSelect';
import DynaRadioGroup from './fields/DynaRadioGroup';
import DynaSelect from './fields/DynaSelect';
import DynaText from './fields/DynaText';
import DynaCheckbox from './fields/DynaCheckbox';
import DynaRelativeUri from './fields/DynaRelativeUri';
import DynaKeyValue from './fields/DynaKeyValue';

function getRenderer() {
  return function renderer(field) {
    // (field, onChange, onFieldFocus, onFieldBlur) => {
    const { id, type /* , label, misc = {} */ } = field;

    switch (type) {
      case 'text':
        return <DynaText key={id} {...field} />;

      case 'textarea':
        return <DynaText key={id} {...field} />;

      case 'checkbox':
        return <DynaCheckbox key={id} {...field} />;

      case 'select':
        return <DynaSelect key={id} {...field} />;

      case 'multiselect':
        return <DynaMultiSelect key={id} {...field} />;

      case 'radiogroup':
        return <DynaRadioGroup key={id} {...field} />;

      case 'relativeuri':
        return <DynaRelativeUri key={id} {...field} />;

      case 'keyvalue':
        return <DynaKeyValue key={id} {...field} />;

      default:
        return <div>No mapped field</div>;
    }
  };
}

export default getRenderer;
