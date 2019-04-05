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
import DynaTransformEditor from './fields/DynaTransformEditor';
import Help from '../Help';
import EditFieldButton from './EditFieldButton';

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
  transformeditor: DynaTransformEditor,
};
const InputWrapper = withStyles({
  helpIcon: { float: 'right' },
  editIcon: { float: 'right' },
})(props => {
  const { field, editMode, helpKey, helpText, classes, onMetaChange } = props;

  return (
    <Fragment>
      {editMode && (
        <EditFieldButton
          onChange={onMetaChange}
          field={field}
          className={classes.editIcon}
        />
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

function getRenderer(editMode = false, onMetaChange) {
  return function renderer(field) {
    // (field, onChange, onFieldFocus, onFieldBlur) => {

    const { id, fieldId, type, helpKey, helpText } = field;
    const DynaInput = inputs[type];
    const fid = id || fieldId;

    if (!DynaInput) {
      return <div>No mapped field for type: [{type}]</div>;
    }

    return (
      <InputWrapper
        key={fid}
        editMode={editMode}
        onMetaChange={onMetaChange}
        field={field}
        helpKey={helpKey}
        helpText={helpText}>
        <DynaInput {...field} />
      </InputWrapper>
    );
  };
}

export default getRenderer;
