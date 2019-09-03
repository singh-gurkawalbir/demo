import { useSelector } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { FieldWrapper } from 'react-forms-processor/dist';
import Help from '../Help';
import EditFieldButton from './EditFieldButton';
import fields from './fields';
import * as selectors from '../../reducers';

const styles = {
  helpIcon: { float: 'right' },
  editIcon: { float: 'right' },
  inlineElements: { display: 'inline-block' },
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
  const { developer } = useSelector(state => selectors.userProfile(state));

  return (
    <div className={classes.inlineElements}>
      {editMode && (
        <EditFieldButton
          key={`edit-${field.id}`}
          formFieldsMeta={formFieldsMeta}
          field={field}
          className={classes.editIcon}
          resourceContext={resourceContext}
        />
      )}
      {(helpKey || helpText) && !fieldsToSkipHelpPopper.includes(fieldType) && (
        <Help
          key={`help-${field.id}`}
          title={field.label || 'Field Help'}
          className={classes.helpIcon}
          caption={developer && helpKey}
          helpKey={helpKey}
          helpText={helpText}
        />
      )}
      {children}
    </div>
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
        <FieldWrapper {...field}>
          <DynaField />
        </FieldWrapper>
      </FieldActions>
    );
  };
}

export default getRenderer;
