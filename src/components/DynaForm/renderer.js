import { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Help from '../Help';
import EditFieldButton from './EditFieldButton';
import fields from './fields';

const styles = {
  helpIcon: { float: 'right' },
  editIcon: { float: 'right' },
};
const fieldsToSkipHelpPopper = ['labeltitle'];
const FieldWrapper = withStyles(styles)(props => {
  const {
    field,
    editMode,
    helpKey,
    helpText,
    classes,
    onMetaChange,
    formFieldsMeta,
    resourceContext,
  } = props;
  const { type: fieldType } = field;

  return (
    <Fragment>
      {editMode && (
        <EditFieldButton
          onChange={onMetaChange}
          formFieldsMeta={formFieldsMeta}
          field={field}
          className={classes.editIcon}
          resourceContext={resourceContext}
        />
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

function getRenderer(
  editMode = false,
  onMetaChange,
  formFieldsMeta,
  resourceId,
  resourceType
) {
  return function renderer(field) {
    // (field, onChange, onFieldFocus, onFieldBlur) => {

    const { id, fieldId, type, helpKey, helpText } = field;
    const DynaField = fields[type];
    const fid = id || fieldId;
    const context = { resourceId, resourceType };

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
        formFieldsMeta={formFieldsMeta}
        resourceContext={context}
        helpText={helpText}>
        <DynaField {...field} />
      </FieldWrapper>
    );
  };
}

export default getRenderer;
