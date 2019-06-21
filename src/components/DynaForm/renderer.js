import { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FormContext } from 'react-forms-processor/dist';
import Help from '../Help';
import EditFieldButton from './EditFieldButton';
import fields from './fields';

const fieldsToSkipHelpPopper = ['labeltitle'];
const FieldWrapper = withStyles({
  helpIcon: { float: 'right' },
  editIcon: { float: 'right' },
})(props => {
  const { field, editMode, helpKey, helpText, classes, onMetaChange } = props;
  const { type: fieldType } = field;

  return (
    <Fragment>
      {editMode && (
        <FormContext>
          {form => (
            <EditFieldButton
              onChange={onMetaChange}
              registerField={form.registerField}
              formFields={form.fields}
              field={field}
              className={classes.editIcon}
            />
          )}
        </FormContext>
      )}
      {(helpKey || helpText) && !fieldsToSkipHelpPopper.includes(fieldType) && (
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
    const DynaField = fields[type];
    const fid = id || fieldId;

    if (!DynaField) {
      return <div>No mapped field for type: [{type}]</div>;
    }

    return (
      <FieldWrapper
        key={fid}
        editMode={editMode}
        onMetaChange={onMetaChange}
        field={field}
        helpKey={helpKey}
        helpText={helpText}>
        <DynaField {...field} />
      </FieldWrapper>
    );
  };
}

export default getRenderer;
