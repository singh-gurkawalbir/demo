import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { FieldWrapper } from 'react-forms-processor/dist';
import Help from '../Help';
import EditFieldButton from './EditFieldButton';
import fields from './fields';
import * as selectors from '../../reducers';

const useStyles = makeStyles({
  iconButton: {
    marginLeft: 5,
  },
});
const wrapper = {
  display: 'flex',
  alignItems: 'center',
};
const fieldStyle = {
  flexGrow: '1',
};
const fieldsToSkipHelpPopper = ['labeltitle'];
const FieldActions = props => {
  const {
    field,
    editMode,
    helpKey,
    helpText,
    formFieldsMeta,
    resourceContext,
    children,
  } = props;
  const classes = useStyles();
  const { type: fieldType } = field;
  const { developer } = useSelector(state => selectors.userProfile(state));

  return (
    <Fragment>
      {editMode && (
        <EditFieldButton
          key={`edit-${field.id}`}
          formFieldsMeta={formFieldsMeta}
          field={field}
          className={classes.iconButton}
          resourceContext={resourceContext}
        />
      )}
      {(helpKey || helpText) && !fieldsToSkipHelpPopper.includes(fieldType) && (
        <Help
          key={`help-${field.id}`}
          title={field.label || 'Field Help'}
          className={classes.iconButton}
          caption={developer && helpKey}
          helpKey={helpKey}
          helpText={helpText}
        />
      )}
      {children}
    </Fragment>
  );
};

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
      /* TODO: Dave. refactor to allow useClasses...
         Unable to add class in the makestyle because it is throwing and error that this 
         function is not a react function neither hook so added inline. */

      <div style={wrapper}>
        <div style={fieldStyle}>
          <FieldWrapper {...field}>
            <DynaField resourceContext={context} />
          </FieldWrapper>
        </div>
        <FieldActions
          key={fid}
          editMode={editMode}
          field={field}
          helpKey={helpKey}
          formFieldsMeta={formFieldsMeta}
          resourceContext={context}
          helpText={helpText}
        />
      </div>
    );
  };
}

export default getRenderer;
