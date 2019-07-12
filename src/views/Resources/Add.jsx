// import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
// import Button from '@material-ui/core/Button';
import actions from '../../actions';
import * as selectors from '../../reducers';
import DynaForm from '../../components/DynaForm';
import DynaSubmit from '../../components/DynaForm/DynaSubmit';
import applications from '../../constants/applications';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../constants/resource';
import { defaultPatchSetConverter } from '../../forms/utils';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';

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
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const createdId = useSelector(state =>
    selectors.createdResourceId(state, id)
  );

  // useEffect(() => {
  //   if (createdId) {
  //     enqueueSnackbar({ message: 'Resource Created' });
  //   }
  // }, [createdId, enqueueSnackbar]);

  if (createdId) {
    enqueueSnackbar({ message: 'Resource Created' });

    return (
      <Redirect
        to={{
          pathname: `/pg/resources/${resourceType}/edit/${createdId}`,
        }}
      />
    );
  }

  function handleSave({ application, ...rest }) {
    const app = applications.find(a => a.id === application) || {};
    const adaptorType =
      app.type.toUpperCase() +
      resourceType[0].toUpperCase() +
      RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType].slice(1);
    const newValues = { ...rest, '/adaptorType': adaptorType };

    if (app.assistant) {
      newValues['/assistant'] = app.assistant;
    }

    const patchSet = defaultPatchSetConverter(newValues);

    // console.log(newValues, patchSet);

    dispatch(actions.resource.patchStaged(id, patchSet));
    dispatch(actions.resource.commitStaged(resourceType, id));
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
    id: 'name',
    name: '/name',
    type: 'text',
    label: 'Name',
    defaultValue: '',
    required: true,
    refreshOptionsOnChangesTo: ['application'],
    visibleWhen,
  };
  const description = {
    id: 'description',
    name: '/description',
    type: 'text',
    multiline: true,
    maxRows: 5,
    label: 'Description',
    defaultValue: '',
    visibleWhen,
  };
  const connection = {
    id: 'connection',
    name: '/_connectionId',
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
        New {`${RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType]}`}
      </Typography>

      <DynaForm fieldMeta={{ fields }} optionsHandler={optionsHandler}>
        <div className={classes.actions}>
          <DynaSubmit className={classes.actionButton} onClick={handleSave}>
            Save
          </DynaSubmit>
        </div>
      </DynaForm>
    </div>
  );
}

export default withStyles(styles)(Add);
