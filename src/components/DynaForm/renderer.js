import { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
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
import EditFieldButton from './EditFieldButton';

const inputs = {
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
const InputWrapper = withStyles({
  helpIcon: { float: 'right' },
  editIcon: { float: 'right' },
})(props => {
  const { field, editMode, helpKey, helpText, classes } = props;

  // console.log('helpwrapper initialized');

  return (
    <Fragment>
      {editMode && (
        <EditFieldButton field={field} className={classes.editIcon} />
      )}
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

function getRenderer(editMode = false) {
  return function renderer(field) {
    // (field, onChange, onFieldFocus, onFieldBlur) => {

    const { id, type, helpKey, helpText } = field;
    const DynaInput = inputs[type];

    if (!DynaInput) {
      return <div>No mapped field for type: [{type}]</div>;
    }

    return (
      <InputWrapper
        key={id}
        editMode={editMode}
        field={field}
        helpKey={helpKey}
        helpText={helpText}>
        <DynaInput {...field} />
      </InputWrapper>
    );
  };
}

export default getRenderer;
