import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useDispatch } from 'react-redux';
import actions from '../../actions';
import DynaForm from '../../components/DynaForm';
import DynaSubmit from '../../components/DynaForm/DynaSubmit';
import applications from '../../constants/applications';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../constants/resource';

const styles = theme => ({
  actions: {
    textAlign: 'right',
    padding: theme.spacing.unit / 2,
  },
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
});

function Add(props) {
  const { classes, match } = props;
  const { id, resourceType } = match.params;
  const dispatch = useDispatch();

  function handleSave(formValues) {
    const patchSet = formValues;

    dispatch(actions.resource.patchStaged(id, patchSet));
  }

  const visibleWhen = [
    {
      id: 'hasApp',
      field: 'application',
      isNot: [''],
    },
  ];
  const application = {
    id: 'application',
    name: 'application',
    type: 'selectapplication',
    label: 'Application',
    defaultValue: '',
    required: true,
  };
  const name = {
    // TODO: Create a custom "DynaField" called "DynaResourceName" that
    // will check the options (set by the options handler below) to pre-set
    // the resource name on app changes... alternatively use the DynaText
    // and modify it to support "options" for the value...
    id: 'name',
    name: 'name',
    type: 'text',
    label: 'Name',
    defaultValue: '',
    required: true,
    refreshOptionsOnChangesTo: ['application'],
    visibleWhen,
  };
  const description = {
    id: 'description',
    name: 'description',
    type: 'text',
    label: 'Description',
    defaultValue: '',
    visibleWhen,
  };
  const connection = {
    id: 'connection',
    name: 'connectionId',
    type: 'selectresource',
    resourceType: 'connections',
    label: 'Connection',
    defaultValue: '',
    required: true,
    refreshOptionsOnChangesTo: ['application'],
    visibleWhen,
  };
  const fields =
    resourceType === 'connections'
      ? [application, name]
      : [application, connection, name, description];
  const optionsHandler = (fieldId, fields) => {
    const appField = fields.find(field => field.id === 'application');
    const app = applications.find(a => a.id === appField.value) || {};

    if (fieldId === 'name') {
      return `New ${app.name} ${RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType]}`;
    }

    if (fieldId === 'connection') {
      const filter = { type: app.type };

      if (app.assistant) {
        filter.assistant = app.assistant;
      }

      return { filter };
    }

    return null;
  };

  return (
    <div key={id}>
      <Typography variant="h5">
        New {`${RESOURCE_TYPE_PLURAL_TO_SINGULAR(resourceType)}`}
      </Typography>

      <DynaForm fieldMeta={{ fields }} optionsHandler={optionsHandler}>
        <div className={classes.actions}>
          <Button
            // onClick={onCancelClick}
            className={classes.actionButton}
            size="small"
            variant="contained">
            Cancel
          </Button>
          <DynaSubmit className={classes.actionButton} onClick={handleSave}>
            Save
          </DynaSubmit>
        </div>
      </DynaForm>
    </div>
  );
}

export default withStyles(styles)(Add);
