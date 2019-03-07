import { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import DynaMultiSelect from './fields/DynaMultiSelect';
import DynaRadioGroup from './fields/DynaRadioGroup';
import DynaSelect from './fields/DynaSelect';
import DynaSelectConnection from './fields/DynaSelectConnection';
import DynaText from './fields/DynaText';
import DynaCheckbox from './fields/DynaCheckbox';
import DynaRelativeUri from './fields/DynaRelativeUri';
import DynaKeyValue from './fields/DynaKeyValue';
import DynaEditor from './fields/DynaEditor';
import Help from '../Help';

const inputs = {
  text: DynaText,
  editor: DynaEditor,
  textarea: DynaText,
  checkbox: DynaCheckbox,
  select: DynaSelect,
  selectconnection: DynaSelectConnection,
  multiselect: DynaMultiSelect,
  radiogroup: DynaRadioGroup,
  relativeuri: DynaRelativeUri,
  keyvalue: DynaKeyValue,
};
const HelpWrapper = withStyles({
  helpIcon: { float: 'right' },
})(props => {
  const { helpKey, classes } = props;

  // console.log('helpwrapper initialized');

  return (
    <Fragment>
      {helpKey && <Help className={classes.helpIcon} helpKey={helpKey} />}
      {props.children}
    </Fragment>
  );
});

function getRenderer() {
  return function renderer(field) {
    // (field, onChange, onFieldFocus, onFieldBlur) => {

    const { id, type, helpKey } = field;
    const DynaInput = inputs[type];

    if (!DynaInput) {
      return <div>No mapped field for type: [{type}]</div>;
    }

    return (
      <HelpWrapper key={id} helpKey={helpKey}>
        <DynaInput {...field} />
      </HelpWrapper>
    );
  };
}

export default getRenderer;
