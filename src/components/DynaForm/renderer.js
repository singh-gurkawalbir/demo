import { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import DyanTextFtpPort from './fields/CustomComponents/DynaTextFtpPort';
import DynaMultiSelect from './fields/DynaMultiSelect';
import DynaRadioGroup from './fields/DynaRadioGroup';
import DynaSelect from './fields/DynaSelect';
import DynaSelectResource from './fields/DynaSelectResource';
import DynaText from './fields/DynaText';
import DynaCheckbox from './fields/DynaCheckbox';
import DynaRelativeUri from './fields/DynaRelativeUri';
import DynaKeyValue from './fields/DynaKeyValue';
import DynaEditor from './fields/DynaEditor';
import DynaCsvParse from './fields/DynaCsvParse';
import Help from '../Help';

const inputs = {
  ftpport: DyanTextFtpPort,
  text: DynaText,
  editor: DynaEditor,
  textarea: DynaText,
  checkbox: DynaCheckbox,
  select: DynaSelect,
  selectresource: DynaSelectResource,
  multiselect: DynaMultiSelect,
  radiogroup: DynaRadioGroup,
  relativeuri: DynaRelativeUri,
  keyvalue: DynaKeyValue,
  csvparse: DynaCsvParse,
};
const HelpWrapper = withStyles({
  helpIcon: { float: 'right' },
})(props => {
  const { helpKey, helpText, classes } = props;

  // console.log('helpwrapper initialized');

  return (
    <Fragment>
      {(helpKey || helpText) && (
        <Help
          className={classes.helpIcon}
          helpKey={helpKey}
          helpText={helpText}
        />
      )}
      {props.children}
    </Fragment>
  );
});

function getRenderer() {
  return function renderer(field) {
    // (field, onChange, onFieldFocus, onFieldBlur) => {

    const { id, type, helpKey, helpText } = field;
    const DynaInput = inputs[type];

    if (!DynaInput) {
      return <div>No mapped field for type: [{type}]</div>;
    }

    return (
      <HelpWrapper key={id} helpKey={helpKey} helpText={helpText}>
        <DynaInput {...field} />
      </HelpWrapper>
    );
  };
}

export default getRenderer;
