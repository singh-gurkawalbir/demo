import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { FieldWrapper } from 'react-forms-processor/dist';
import Help from '../Help';
import EditFieldButton from './EditFieldButton';
import fields from './fields';
import * as selectors from '../../reducers';

const useStyles = makeStyles(theme => ({
  iconButton: {
    marginLeft: 5,
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    height: 50,
    width: 50,
    borderRadius: 2,
    color: theme.palette.text.hint,
    '&:hover': {
      background: theme.palette.background.paper,
      '& > span': {
        color: theme.palette.primary.main,
      },
    },
  },
  root: { display: 'inline-block' },
}));
const wrapper = {
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: 6,
};
const fieldStyle = {
  flexGrow: '1',
  textAlign: 'left',
  width: '100%',
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
  } = props;
  const classes = useStyles();
  const { type: fieldType, hideFromUI } = field;
  const { developer } = useSelector(state => selectors.userProfile(state));

  if (hideFromUI) return null; // we don't want to showup help icon if 'hideFromUI' is true.

  return (
    <div className={classes.root}>
      {editMode && (
        <EditFieldButton
          key={`edit-${field.id}`}
          data-test={`edit-${field.id}`}
          formFieldsMeta={formFieldsMeta}
          field={field}
          className={classes.iconButton}
          resourceContext={resourceContext}
        />
      )}
      {(helpKey || helpText) && !fieldsToSkipHelpPopper.includes(fieldType) && (
        <Help
          key={`help-${field.id}`}
          data-test={`help-${field.id}`}
          title={field.label || 'Field Help'}
          className={classes.iconButton}
          caption={developer && helpKey}
          helpKey={helpKey}
          helpText={helpText}
          fieldId={field.id}
          resourceType={resourceContext && resourceContext.resourceType}
        />
      )}
    </div>
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

      <div key={fid} style={wrapper}>
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
