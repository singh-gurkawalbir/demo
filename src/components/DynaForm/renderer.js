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
const FieldActions = withStyles(styles)(props => {
  const {
    field,
    editMode,
    helpKey,
    helpText,
    classes,
    formFieldsMeta,
    resourceContext,
    children,
  } = props;
  const { type: fieldType } = field;

  return (
    <Fragment>
      {editMode && (
        <EditFieldButton
          formFieldsMeta={formFieldsMeta}
          field={field}
          className={classes.editIcon}
          resourceContext={resourceContext}
        />
      )}
      {(helpKey || helpText) && !fieldsToSkipHelpPopper.includes(fieldType) && (
        <Help
          title={field.label || helpKey || 'Field Help'}
          className={classes.helpIcon}
          helpKey={helpKey}
          helpText={helpText}
        />
      )}
      {children}
    </Fragment>
  );
});

function getRenderer(
  editMode = false,
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
      <FieldActions
        key={fid}
        editMode={editMode}
        field={field}
        helpKey={helpKey}
        formFieldsMeta={formFieldsMeta}
        resourceContext={context}
        helpText={helpText}>
        <DynaField {...field} />
      </FieldActions>
    );
  };
}

export default getRenderer;
