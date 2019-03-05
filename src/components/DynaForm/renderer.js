import { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import DynaMultiSelect from './fields/DynaMultiSelect';
import DynaRadioGroup from './fields/DynaRadioGroup';
import DynaSelect from './fields/DynaSelect';
import DynaText from './fields/DynaText';
import DynaCheckbox from './fields/DynaCheckbox';
import DynaRelativeUri from './fields/DynaRelativeUri';
import DynaKeyValue from './fields/DynaKeyValue';
import Help from '../Help';

const inputs = {
  text: DynaText,
  textarea: DynaText,
  checkbox: DynaCheckbox,
  select: DynaSelect,
  multiselect: DynaMultiSelect,
  radiogroup: DynaRadioGroup,
  relativeuri: DynaRelativeUri,
  keyvalue: DynaKeyValue,
};

function getRenderer() {
  return function renderer(field) {
    // (field, onChange, onFieldFocus, onFieldBlur) => {

    const { id, type, helpKey } = field;
    const DynaInput = inputs[type];

    if (!DynaInput) {
      return <div>No mapped field for type: [{type}]</div>;
    }

    const HelpWrapper = withStyles({
      helpIcon: { float: 'right' },
    })(props => (
      <Fragment>
        {helpKey && (
          <Help className={props.classes.helpIcon} helpKey={helpKey} />
        )}
        {props.children}
      </Fragment>
    ));

    return (
      <HelpWrapper>
        <DynaInput key={id} {...field} />
      </HelpWrapper>
    );
  };
}

export default getRenderer;
